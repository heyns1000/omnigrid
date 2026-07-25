# Activation Layer

Real, deployable implementations of the pieces identified as "coded-as-concept, never deployed" across this project's research (`research-index/omnigrid-second-pass-report.md` §1.5, `omnigrid-build-prompt.md`). Built from specification, not extended from any recovered source — no usable original implementation for these was ever found in this repo or its branches; only status tables and stub comments were.

**Status honestly**: this code has not been deployed or run against live infrastructure. It was written and syntax-validated (`node --check` passes on every worker) in a sandbox with no Cloudflare/PayPal/PayFast/Stripe credentials. "Working" here means "correct, complete, and ready to deploy" — not "verified live." Treat every claim below as unverified until you've actually run it.

## What's here

| Worker | Purpose | Real external deps |
|---|---|---|
| `master-sync` | The "9-second pulse" — Durable Object `alarm()` loop polling other workers' health | none (calls the others) |
| `email-worker` | Transactional email | SendGrid API |
| `payment-processor` | Unified webhook intake for PayPal, PayFast, Stripe — real signature verification for all three | PayPal, PayFast, Stripe |
| `subscription-manager` | Tier CRUD backed by D1 | D1 database |
| `upload-router` | Classifies + stores intake uploads in R2, dispatches to orchestrator | R2 bucket |
| `dns-hook-service` | Provisions a subdomain per brand via Cloudflare's API | Cloudflare API |
| `claimroot-service` | Registers/verifies brand ownership against LicenseVault | LicenseVault API — **unverified contract, see the warning in its source file** |
| `orchestrator` | Ties the above together via service bindings: upload → verify → template (no-op, explained below) → DNS → deploy (no-op, explained below) → register | the other 7 workers |

Two steps in the orchestrator's flow are **honest no-ops**, not fakes: "template" (no 17K-template library was ever located to integrate against) and "deploy" (a Worker has no generic "push this file live" primitive — the DNS record it provisions has to actually point somewhere real). Both return `{ ... : false, reason: "..." }` rather than pretending to succeed. Fix these once there's a real template source and a real hosting target to deploy into.

## Deploying (you'll need actual accounts/credentials for this — I don't have any)

For each worker directory, in this rough dependency order (`master-sync` and the leaf workers first, `orchestrator` last since it needs the others' service names to already exist):

```bash
cd activation-layer/workers/<worker-name>
npm install          # pulls in wrangler
wrangler login       # your Cloudflare account, not mine
wrangler secret put <EACH_SECRET_LISTED_IN_wrangler.toml's_COMMENTS>
wrangler deploy
curl https://<worker-name>.<your-account>.workers.dev/health   # should return {"status":"ok",...}
```

Specifics per worker:

- **`subscription-manager`**: create the D1 database first (`wrangler d1 create hotstack-subscriptions-db`), apply `../../schema/subscriptions.sql`, then paste the real `database_id` into its `wrangler.toml` before deploying.
- **`upload-router`**: create the R2 bucket first (`wrangler r2 bucket create hotstack-intake-bucket`) if it doesn't already exist.
- **`dns-hook-service`**: replace `CLOUDFLARE_ZONE_ID` in `wrangler.toml` with your real zone ID, and `TARGET_CNAME` with wherever provisioned subdomains should actually point.
- **`claimroot-service`**: confirm the real LicenseVault API request/response shape before relying on this — the integration in `src/index.js` is explicitly flagged as unverified (attempted to check it during this build, got blocked by network/tool restrictions, documented rather than guessed silently).
- **`orchestrator`**: deploy last. Its `wrangler.toml` service bindings reference the other workers **by the `name` field in their own `wrangler.toml`** — if you rename any of them, update the binding here too.

## What was deliberately left out

- The undeployed full-internet IP-sweep script found elsewhere in this project is explicitly out of scope — not referenced, not built on, not reintroduced here.
- No brand/repo counts are hardcoded anywhere in this code. If you need real numbers, pull them from a verified source at request time, not from a constant.
