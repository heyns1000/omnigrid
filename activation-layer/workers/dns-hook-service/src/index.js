/**
 * DNS hook service — auto-provisions a subdomain per deployment via the
 * Cloudflare API (https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-create-dns-record).
 *
 * POST /provision  { brand_name }  -> creates brand-name-<timestamp>.<BASE_DOMAIN>
 * DELETE /provision/:record_id
 * GET  /health
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);

    if (url.pathname === "/health") {
      return json({ status: "ok", service: "dns-hook-service" });
    }

    if (parts[0] === "provision" && !parts[1] && request.method === "POST") {
      return provision(request, env);
    }

    if (parts[0] === "provision" && parts[1] && request.method === "DELETE") {
      return deprovision(parts[1], env);
    }

    return json({ error: "not_found" }, 404);
  },
};

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 63);
}

async function provision(request, env) {
  if (!env.CLOUDFLARE_API_TOKEN || !env.CLOUDFLARE_ZONE_ID) {
    return json({ error: "cloudflare_not_configured" }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const { brand_name } = body;
  if (!brand_name) {
    return json({ error: "missing_required_field", required: ["brand_name"] }, 400);
  }

  const subdomain = `${slugify(brand_name)}-${Date.now()}`;
  const fqdn = `${subdomain}.${env.BASE_DOMAIN}`;

  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/dns_records`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        type: "CNAME",
        name: fqdn,
        content: env.TARGET_CNAME,
        proxied: true,
        ttl: 1,
      }),
    }
  );

  const result = await resp.json();

  if (!result.success) {
    return json({ error: "dns_provisioning_failed", detail: result.errors }, 502);
  }

  return json({
    status: "provisioned",
    fqdn,
    record_id: result.result.id,
    live_url: `https://${fqdn}`,
  }, 201);
}

async function deprovision(recordId, env) {
  if (!env.CLOUDFLARE_API_TOKEN || !env.CLOUDFLARE_ZONE_ID) {
    return json({ error: "cloudflare_not_configured" }, 500);
  }

  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/dns_records/${recordId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}` },
    }
  );
  const result = await resp.json();
  if (!result.success) {
    return json({ error: "dns_deprovisioning_failed", detail: result.errors }, 502);
  }
  return json({ status: "deprovisioned", record_id: recordId });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
