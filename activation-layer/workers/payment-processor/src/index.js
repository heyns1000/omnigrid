/**
 * Payment processor — unified webhook intake for PayPal, PayFast, and Stripe.
 *
 * Each provider signs webhooks differently. The three verification schemes
 * implemented below follow each provider's documented mechanism as of this
 * writing — re-check against current provider docs before relying on this
 * in production, since payment providers do occasionally revise their
 * webhook signing details and getting this wrong is a real security bug,
 * not a cosmetic one.
 *
 * POST /api/payments/paypal/webhook
 * POST /api/payments/payfast/webhook
 * POST /api/payments/stripe/webhook
 * GET  /health
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ status: "ok", service: "payment-processor" });
    }

    if (request.method !== "POST") {
      return json({ error: "not_found" }, 404);
    }

    if (url.pathname === "/api/payments/paypal/webhook") {
      return handlePayPal(request, env);
    }
    if (url.pathname === "/api/payments/payfast/webhook") {
      return handlePayFast(request, env);
    }
    if (url.pathname === "/api/payments/stripe/webhook") {
      return handleStripe(request, env);
    }

    return json({ error: "not_found" }, 404);
  },
};

// ─────────────────────────────────────────────────────────────────────────
// PayPal
//
// PayPal signs webhooks with a certificate, not a shared secret, so
// verification is done by calling PayPal's own verify-webhook-signature
// API rather than computing a local HMAC.
// https://developer.paypal.com/api/rest/webhooks/rest/#verify-webhook-signature
// ─────────────────────────────────────────────────────────────────────────

async function handlePayPal(request, env) {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_SECRET || !env.PAYPAL_WEBHOOK_ID) {
    return json({ error: "paypal_not_configured" }, 500);
  }

  const rawBody = await request.text();
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const verified = await verifyPayPalSignature(request, rawBody, env);
  if (!verified) {
    return json({ error: "signature_verification_failed" }, 400);
  }

  return json({ status: "accepted", event_type: event.event_type, resource_id: event.resource?.id });
}

async function verifyPayPalSignature(request, rawBody, env) {
  const accessToken = await getPayPalAccessToken(env);
  if (!accessToken) return false;

  const verifyBody = {
    transmission_id: request.headers.get("paypal-transmission-id"),
    transmission_time: request.headers.get("paypal-transmission-time"),
    cert_url: request.headers.get("paypal-cert-url"),
    auth_algo: request.headers.get("paypal-auth-algo"),
    transmission_sig: request.headers.get("paypal-transmission-sig"),
    webhook_id: env.PAYPAL_WEBHOOK_ID,
    webhook_event: JSON.parse(rawBody),
  };

  const resp = await fetch(`${env.PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(verifyBody),
  });

  if (!resp.ok) return false;
  const result = await resp.json();
  return result.verification_status === "SUCCESS";
}

async function getPayPalAccessToken(env) {
  const creds = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`);
  const resp = await fetch(`${env.PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  return data.access_token ?? null;
}

// ─────────────────────────────────────────────────────────────────────────
// PayFast
//
// PayFast's ITN (Instant Transaction Notification) signature is an MD5
// hash of the posted fields (in the order PayFast sent them, signature
// field excluded), with the merchant passphrase appended, all
// URL-encoded per PayFast's encoding rules.
// https://developers.payfast.co.za/docs#step_3_confirm_payment
// ─────────────────────────────────────────────────────────────────────────

async function handlePayFast(request, env) {
  if (!env.PAYFAST_MERCHANT_ID || !env.PAYFAST_MERCHANT_KEY) {
    return json({ error: "payfast_not_configured" }, 500);
  }

  const rawBody = await request.text();
  const params = new URLSearchParams(rawBody);
  const receivedSignature = params.get("signature");
  params.delete("signature");

  const computed = await md5PayFastSignature(params, env.PAYFAST_PASSPHRASE);
  if (!receivedSignature || computed !== receivedSignature) {
    return json({ error: "signature_verification_failed" }, 400);
  }

  const paymentStatus = params.get("payment_status");
  const pfPaymentId = params.get("pf_payment_id");
  return json({ status: "accepted", payment_status: paymentStatus, pf_payment_id: pfPaymentId });
}

async function md5PayFastSignature(params, passphrase) {
  let pairs = [];
  for (const [key, value] of params.entries()) {
    pairs.push(`${key}=${encodeURIComponent(value.trim()).replace(/%20/g, "+")}`);
  }
  let signatureString = pairs.join("&");
  if (passphrase) {
    signatureString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`;
  }
  return md5Hex(signatureString);
}

// Workers' crypto.subtle.digest doesn't include MD5 (only SHA family), and
// PayFast's ITN spec requires MD5 specifically — so it's implemented here
// directly rather than via crypto.subtle.
async function md5Hex(input) {
  const bytes = new TextEncoder().encode(input);
  return md5(bytes);
}

function md5(bytes) {
  function rotl(x, c) { return (x << c) | (x >>> (32 - c)); }
  function toHex(num) {
    let s = "";
    for (let i = 0; i < 4; i++) {
      s += ((num >> (i * 8)) & 0xff).toString(16).padStart(2, "0");
    }
    return s;
  }

  const s = [
    7,12,17,22, 7,12,17,22, 7,12,17,22, 7,12,17,22,
    5, 9,14,20, 5, 9,14,20, 5, 9,14,20, 5, 9,14,20,
    4,11,16,23, 4,11,16,23, 4,11,16,23, 4,11,16,23,
    6,10,15,21, 6,10,15,21, 6,10,15,21, 6,10,15,21,
  ];
  const K = new Int32Array(64);
  for (let i = 0; i < 64; i++) K[i] = (Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32)) | 0;

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  const msgLen = bytes.length;
  const withOne = new Uint8Array(((msgLen + 8) >> 6 << 6) + 64);
  withOne.set(bytes);
  withOne[msgLen] = 0x80;
  const bitLen = BigInt(msgLen) * 8n;
  const view = new DataView(withOne.buffer);
  view.setUint32(withOne.length - 8, Number(bitLen & 0xffffffffn), true);
  view.setUint32(withOne.length - 4, Number((bitLen >> 32n) & 0xffffffffn), true);

  for (let chunkStart = 0; chunkStart < withOne.length; chunkStart += 64) {
    const M = new Int32Array(16);
    for (let i = 0; i < 16; i++) {
      M[i] = view.getInt32(chunkStart + i * 4, true);
    }
    let [A, B, C, D] = [a0, b0, c0, d0];
    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + M[g]) | 0;
      A = D; D = C; C = B;
      B = (B + rotl(F, s[i])) | 0;
    }
    a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
  }

  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

// ─────────────────────────────────────────────────────────────────────────
// Stripe
//
// Stripe signs webhooks with HMAC-SHA256 over "{timestamp}.{raw_body}",
// using the webhook signing secret. Verified natively with crypto.subtle.
// https://stripe.com/docs/webhooks/signatures
// ─────────────────────────────────────────────────────────────────────────

async function handleStripe(request, env) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return json({ error: "stripe_not_configured" }, 500);
  }

  const rawBody = await request.text();
  const sigHeader = request.headers.get("stripe-signature");
  if (!sigHeader) {
    return json({ error: "missing_signature_header" }, 400);
  }

  const verified = await verifyStripeSignature(rawBody, sigHeader, env.STRIPE_WEBHOOK_SECRET);
  if (!verified) {
    return json({ error: "signature_verification_failed" }, 400);
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  return json({ status: "accepted", event_type: event.type, id: event.id });
}

async function verifyStripeSignature(rawBody, sigHeader, secret) {
  const parts = Object.fromEntries(
    sigHeader.split(",").map((kv) => {
      const [k, v] = kv.split("=");
      return [k, v];
    })
  );
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const signedPayload = `${timestamp}.${rawBody}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  const computed = [...new Uint8Array(sigBuffer)].map((b) => b.toString(16).padStart(2, "0")).join("");

  return timingSafeEqual(computed, signature);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
