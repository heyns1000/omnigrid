/**
 * Master sync worker — "the missing loop".
 *
 * Cloudflare Cron Triggers have a 1-minute minimum granularity, so a literal
 * 9-second interval can't be built on cron. This uses a Durable Object's
 * alarm() instead, which accepts any future timestamp (including seconds
 * from now) and re-arms itself on every tick.
 */

export class SyncPulse {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/start") {
      const current = await this.state.storage.getAlarm();
      if (current === null) {
        await this.scheduleNext();
        return json({ status: "started", interval_ms: intervalMs(this.env) });
      }
      return json({ status: "already_running", next_alarm_at: new Date(current).toISOString() });
    }

    if (url.pathname === "/stop") {
      await this.state.storage.deleteAlarm();
      return json({ status: "stopped" });
    }

    if (url.pathname === "/status") {
      const nextAlarm = await this.state.storage.getAlarm();
      const lastRun = await this.state.storage.get("last_run");
      const lastResult = await this.state.storage.get("last_result");
      return json({
        running: nextAlarm !== null,
        next_alarm_at: nextAlarm ? new Date(nextAlarm).toISOString() : null,
        last_run_at: lastRun ?? null,
        last_result: lastResult ?? null,
      });
    }

    return json({ error: "not_found" }, 404);
  }

  async scheduleNext() {
    const delay = intervalMs(this.env);
    await this.state.storage.setAlarm(Date.now() + delay);
  }

  async alarm() {
    const result = await this.runPulse();
    await this.state.storage.put("last_run", new Date().toISOString());
    await this.state.storage.put("last_result", result);
    // Re-arm for the next tick — this is what makes the loop continuous.
    await this.scheduleNext();
  }

  async runPulse() {
    const targets = watchedWorkerUrls(this.env);
    const checks = await Promise.all(
      targets.map(async (target) => {
        try {
          const resp = await fetch(target, { method: "GET" });
          return { target, ok: resp.ok, status: resp.status };
        } catch (err) {
          return { target, ok: false, error: String(err) };
        }
      })
    );
    const healthy = checks.filter((c) => c.ok).length;
    return {
      checked: checks.length,
      healthy,
      unhealthy: checks.length - healthy,
      details: checks,
    };
  }
}

function intervalMs(env) {
  const raw = Number(env.PULSE_INTERVAL_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : 9000;
}

function watchedWorkerUrls(env) {
  return (env.WATCHED_WORKER_URLS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ status: "ok", service: "master-sync" });
    }

    // Route everything else to the singleton Durable Object instance so
    // there's exactly one pulse loop running per deployment.
    const id = env.SYNC_PULSE.idFromName("singleton");
    const stub = env.SYNC_PULSE.get(id);
    return stub.fetch(request);
  },
};
