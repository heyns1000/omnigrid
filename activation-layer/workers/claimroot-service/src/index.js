/**
 * ClaimRoot / LicenseVault service — generates an ownership/license record
 * per deployed brand.
 *
 * ⚠️ UNVERIFIED INTEGRATION CONTRACT ⚠️
 * This was supposed to be checked against the live LicenseVault API
 * (https://license-vault-sepia.vercel.app) before writing this integration.
 * That check was attempted and failed: the sandbox this was built in got
 * HTTP 403 from the web-fetch tool and a hard network failure from curl —
 * neither confirms nor denies what the real API looks like. The request/
 * response shapes below (POST /licenses, GET /licenses/:id) are a
 * reasonable guess based on the endpoint *names* found elsewhere in this
 * project's docs (/api/stats/count, /api/health), not a verified contract.
 * CONFIRM THE REAL SHAPE AGAINST THE LIVE SERVICE BEFORE DEPLOYING THIS.
 *
 * POST /register  { brand_name, owner_email, deployment_url }
 * GET  /verify/:license_id
 * GET  /health
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);

    if (url.pathname === "/health") {
      return json({ status: "ok", service: "claimroot-service" });
    }

    if (url.pathname === "/register" && request.method === "POST") {
      return registerBrand(request, env);
    }

    if (parts[0] === "verify" && parts[1] && request.method === "GET") {
      return verifyLicense(parts[1], env);
    }

    return json({ error: "not_found" }, 404);
  },
};

async function registerBrand(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const { brand_name, owner_email, deployment_url } = body;
  if (!brand_name || !owner_email) {
    return json({ error: "missing_required_fields", required: ["brand_name", "owner_email"] }, 400);
  }

  const headers = { "content-type": "application/json" };
  if (env.LICENSEVAULT_API_KEY) {
    headers["Authorization"] = `Bearer ${env.LICENSEVAULT_API_KEY}`;
  }

  let resp;
  try {
    resp = await fetch(`${env.LICENSEVAULT_API_BASE}/licenses`, {
      method: "POST",
      headers,
      body: JSON.stringify({ brand_name, owner_email, deployment_url }),
    });
  } catch (err) {
    return json({ error: "licensevault_unreachable", detail: String(err) }, 502);
  }

  if (!resp.ok) {
    const detail = await resp.text().catch(() => "");
    return json({ error: "licensevault_rejected", status: resp.status, detail }, 502);
  }

  const result = await resp.json().catch(() => null);
  if (!result) {
    return json({ error: "licensevault_returned_non_json_response" }, 502);
  }

  return json({ status: "registered", licensevault_response: result }, 201);
}

async function verifyLicense(licenseId, env) {
  const headers = {};
  if (env.LICENSEVAULT_API_KEY) {
    headers["Authorization"] = `Bearer ${env.LICENSEVAULT_API_KEY}`;
  }

  let resp;
  try {
    resp = await fetch(`${env.LICENSEVAULT_API_BASE}/licenses/${encodeURIComponent(licenseId)}`, { headers });
  } catch (err) {
    return json({ error: "licensevault_unreachable", detail: String(err) }, 502);
  }

  if (resp.status === 404) {
    return json({ error: "not_found" }, 404);
  }
  if (!resp.ok) {
    return json({ error: "licensevault_error", status: resp.status }, 502);
  }

  const result = await resp.json().catch(() => null);
  return json({ status: "verified", licensevault_response: result });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
