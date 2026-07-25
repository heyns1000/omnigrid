/**
 * Upload router — classifies and stores incoming intake uploads, then
 * dispatches a routing decision to the orchestrator.
 *
 * POST /intake  (multipart/form-data, field name "file", optional "brand_type")
 * GET  /health
 */

const ROUTES = {
  "text/html": "template",
  "application/zip": "archive",
  "application/pdf": "document",
  "image/png": "asset",
  "image/jpeg": "asset",
  "image/svg+xml": "asset",
  "application/json": "config",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ status: "ok", service: "upload-router" });
    }

    if (url.pathname === "/intake" && request.method === "POST") {
      return handleIntake(request, env);
    }

    return json({ error: "not_found" }, 404);
  },
};

async function handleIntake(request, env) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return json({ error: "expected_multipart_form_data" }, 400);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "invalid_form_data" }, 400);
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return json({ error: "missing_file_field" }, 400);
  }

  const brandType = form.get("brand_type") || "unclassified";
  const route = classify(file.type);
  const key = `intake/${Date.now()}-${crypto.randomUUID()}-${sanitizeFilename(file.name)}`;

  await env.INTAKE_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
    customMetadata: { brand_type: String(brandType), route },
  });

  const intakeRecord = {
    key,
    filename: file.name,
    content_type: file.type,
    size: file.size,
    brand_type: brandType,
    route,
    received_at: new Date().toISOString(),
  };

  const dispatch = await dispatchToOrchestrator(intakeRecord, env);

  return json({ status: "received", intake: intakeRecord, dispatch });
}

function classify(contentType) {
  return ROUTES[contentType] || "unknown";
}

function sanitizeFilename(name) {
  return String(name).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 128);
}

async function dispatchToOrchestrator(intakeRecord, env) {
  if (!env.ORCHESTRATOR_URL) {
    return { dispatched: false, reason: "ORCHESTRATOR_URL not configured" };
  }
  try {
    const resp = await fetch(env.ORCHESTRATOR_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(intakeRecord),
    });
    return { dispatched: true, status: resp.status };
  } catch (err) {
    return { dispatched: false, error: String(err) };
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
