/**
 * Orchestrator — ties the other 7 workers together behind one intake flow:
 *   upload -> verify -> template -> DNS -> deploy -> register
 *
 * Calls the other workers via Cloudflare service bindings (see
 * wrangler.toml), not public URLs — this only works once every named
 * service below is deployed under the same Cloudflare account.
 *
 * POST /intake  { key, filename, content_type, brand_type, owner_email? }
 *   -> runs the full flow, returns per-step results
 * GET  /health  -> aggregates health checks across all bound services
 */

const SERVICE_BINDINGS = [
  ["claimroot", "CLAIMROOT"],
  ["dns_hook", "DNS_HOOK"],
  ["email", "EMAIL"],
  ["payments", "PAYMENTS"],
  ["subscriptions", "SUBSCRIPTIONS"],
  ["upload_router", "UPLOAD_ROUTER"],
  ["master_sync", "MASTER_SYNC"],
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return aggregateHealth(env);
    }

    if (url.pathname === "/intake" && request.method === "POST") {
      return runIntakeFlow(request, env);
    }

    return json({ error: "not_found" }, 404);
  },
};

async function aggregateHealth(env) {
  const results = await Promise.all(
    SERVICE_BINDINGS.map(async ([name, binding]) => {
      const service = env[binding];
      if (!service) return [name, { ok: false, error: "service_binding_not_configured" }];
      try {
        const resp = await service.fetch(new Request("https://internal/health"));
        const body = await resp.json().catch(() => null);
        return [name, { ok: resp.ok, status: resp.status, body }];
      } catch (err) {
        return [name, { ok: false, error: String(err) }];
      }
    })
  );

  const services = Object.fromEntries(results);
  const allOk = Object.values(services).every((s) => s.ok);

  return json(
    { status: allOk ? "ok" : "degraded", service: "orchestrator", services },
    allOk ? 200 : 503
  );
}

async function runIntakeFlow(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const { key, filename, brand_type, owner_email } = body;
  if (!key || !filename) {
    return json({ error: "missing_required_fields", required: ["key", "filename"] }, 400);
  }

  const steps = {};

  // 1. Verify — register ownership with LicenseVault via claimroot-service.
  steps.verify = await callService(env.CLAIMROOT, "/register", "POST", {
    brand_name: brand_type || filename,
    owner_email: owner_email || "unclaimed@faa.zone",
    deployment_url: null,
  });

  // 2. Template — intentionally not implemented. The source material's
  //    17,000+ template library was never located anywhere in this
  //    project's accessible files (confirmed during research, see
  //    research-index/omnigrid-second-pass-report.md). Rather than fake
  //    a template-application step, this is left as an explicit no-op so
  //    the response is honest about what actually happened.
  steps.template = { applied: false, reason: "no template source integrated — see comment above" };

  // 3. DNS — provision a subdomain for this brand.
  steps.dns = await callService(env.DNS_HOOK, "/provision", "POST", {
    brand_name: brand_type || filename,
  });

  // 4. Deploy — there is no generic "deploy anywhere" primitive available
  //    from inside a Worker; actual deployment of the uploaded asset to
  //    the newly-provisioned domain is out of scope for this orchestrator
  //    and has to happen via whatever hosting target the DNS record points
  //    at (see dns-hook-service's TARGET_CNAME). Reported honestly, not
  //    silently skipped.
  steps.deploy = { deployed: false, reason: "no deployment target wired up — DNS record points at TARGET_CNAME only" };

  // 5. Register — record the subscription tier for this brand.
  steps.register = await callService(env.SUBSCRIPTIONS, "/subscriptions", "POST", {
    customer_id: owner_email || key,
    tier: "starter",
  });

  const allSucceeded = ["verify", "dns", "register"].every(
    (s) => steps[s].ok !== false && !steps[s].error
  );

  return json({
    status: allSucceeded ? "flow_completed" : "flow_partial",
    intake_key: key,
    steps,
  }, allSucceeded ? 200 : 207);
}

async function callService(service, path, method, payload) {
  if (!service) {
    return { ok: false, error: "service_binding_not_configured" };
  }
  try {
    const resp = await service.fetch(
      new Request(`https://internal${path}`, {
        method,
        headers: { "content-type": "application/json" },
        body: payload ? JSON.stringify(payload) : undefined,
      })
    );
    const responseBody = await resp.json().catch(() => null);
    return { ok: resp.ok, status: resp.status, body: responseBody };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
