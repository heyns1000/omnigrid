/**
 * Email worker — transactional email via SendGrid's v3 API.
 *
 * POST /send  { to, subject, text, html? }
 * GET  /health
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ status: "ok", service: "email-worker" });
    }

    if (url.pathname === "/send" && request.method === "POST") {
      return handleSend(request, env);
    }

    return json({ error: "not_found" }, 404);
  },
};

async function handleSend(request, env) {
  if (!env.SENDGRID_API_KEY) {
    return json({ error: "SENDGRID_API_KEY not configured" }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const { to, subject, text, html } = body;
  if (!to || !subject || !(text || html)) {
    return json({ error: "missing_required_fields", required: ["to", "subject", "text|html"] }, 400);
  }

  const payload = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: env.FROM_EMAIL, name: env.FROM_NAME },
    subject,
    content: [
      html
        ? { type: "text/html", value: html }
        : { type: "text/plain", value: text },
    ],
  };

  const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (resp.status === 202) {
    return json({ status: "queued" });
  }

  const errBody = await resp.text();
  return json({ error: "sendgrid_error", status: resp.status, detail: errBody }, 502);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
