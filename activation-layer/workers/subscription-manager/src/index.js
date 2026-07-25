/**
 * Subscription manager — tier management backed by D1.
 * Schema: ../../schema/subscriptions.sql
 *
 * POST   /subscriptions              { customer_id, tier }         -> create
 * GET    /subscriptions/:id                                        -> read
 * PATCH  /subscriptions/:id          { tier?, status? }             -> update
 * DELETE /subscriptions/:id                                         -> cancel
 * GET    /health
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);

    if (url.pathname === "/health") {
      return json({ status: "ok", service: "subscription-manager" });
    }

    if (parts[0] !== "subscriptions") {
      return json({ error: "not_found" }, 404);
    }

    const id = parts[1];

    if (!id && request.method === "POST") return createSubscription(request, env);
    if (id && request.method === "GET") return getSubscription(id, env);
    if (id && request.method === "PATCH") return updateSubscription(id, request, env);
    if (id && request.method === "DELETE") return cancelSubscription(id, env);

    return json({ error: "not_found" }, 404);
  },
};

function validTiers(env) {
  return (env.VALID_TIERS || "starter,pro,enterprise").split(",").map((s) => s.trim());
}

async function createSubscription(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const { customer_id, tier } = body;
  if (!customer_id || !tier) {
    return json({ error: "missing_required_fields", required: ["customer_id", "tier"] }, 400);
  }
  if (!validTiers(env).includes(tier)) {
    return json({ error: "invalid_tier", valid: validTiers(env) }, 400);
  }

  const id = crypto.randomUUID();
  const renewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await env.DB.prepare(
    `INSERT INTO subscriptions (id, customer_id, tier, status, renewal_date) VALUES (?, ?, ?, 'trialing', ?)`
  )
    .bind(id, customer_id, tier, renewalDate)
    .run();

  return json({ id, customer_id, tier, status: "trialing", renewal_date: renewalDate }, 201);
}

async function getSubscription(id, env) {
  const row = await env.DB.prepare(`SELECT * FROM subscriptions WHERE id = ?`).bind(id).first();
  if (!row) return json({ error: "not_found" }, 404);
  return json(row);
}

async function updateSubscription(id, request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const existing = await env.DB.prepare(`SELECT * FROM subscriptions WHERE id = ?`).bind(id).first();
  if (!existing) return json({ error: "not_found" }, 404);

  const tier = body.tier ?? existing.tier;
  const status = body.status ?? existing.status;

  if (body.tier && !validTiers(env).includes(body.tier)) {
    return json({ error: "invalid_tier", valid: validTiers(env) }, 400);
  }

  await env.DB.prepare(`UPDATE subscriptions SET tier = ?, status = ? WHERE id = ?`)
    .bind(tier, status, id)
    .run();

  return json({ id, tier, status });
}

async function cancelSubscription(id, env) {
  const existing = await env.DB.prepare(`SELECT * FROM subscriptions WHERE id = ?`).bind(id).first();
  if (!existing) return json({ error: "not_found" }, 404);

  await env.DB.prepare(
    `UPDATE subscriptions SET status = 'canceled', canceled_at = datetime('now') WHERE id = ?`
  )
    .bind(id)
    .run();

  return json({ id, status: "canceled" });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
