# OmniGrid App Build + Deploy Runbook

## App location

`fullstack-app-extracted/Hello-there-What-kind-of-software-project-are-you-looking`

## Local setup

```bash
cd fullstack-app-extracted/Hello-there-What-kind-of-software-project-are-you-looking
cp .env.example .env
# Edit .env and fill in DATABASE_URL, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET
npm ci
```

Required environment variables:

- `DATABASE_URL` — PostgreSQL connection string
- `PAYPAL_CLIENT_ID` — PayPal REST API client ID
- `PAYPAL_CLIENT_SECRET` — PayPal REST API secret

Optional:

- `PORT` (defaults to `5000`)
- `NODE_ENV` (`production` for live deploys)
- `VITE_MARKETPLACE_API_URL` — remote marketplace API base URL; leave blank to use the built-in fallback provider

## Build and run

```bash
npm run lint
npm run test
npm run build
npm run start
```

## Deployment assumptions

- App build artifacts are generated in `dist/public`.
- Server bundle is generated at `dist/index.js`.
- If PayPal env vars are missing, PayPal endpoints return `503` with a clear configuration message instead of crashing app startup.
- Static repository deploys (Netlify workflow) skip deployment gracefully when Netlify secrets are not configured.
- Marketplace page uses a `FallbackMarketplaceProvider` automatically when `VITE_MARKETPLACE_API_URL` is unset.

## Operational checks

1. `npm ci` succeeds.
2. `npm run build` succeeds.
3. Open `/`, `/dashboard`, `/vaultmesh`, and `/admin`.
4. Confirm page title changes per route (`<Section> | OmniGrid™`).
5. Confirm header/landing visual palette aligns with `public/omnigrid.html` reference tokens.
6. Open `/marketplace` — verify items load, detail card updates, and fallback badge appears when the remote API is unavailable.
7. Open `/sectors-portal`, `/baobab`, `/vaultmesh-portal`, `/treaty` — confirm pages render.
8. `GET /api/health` → `{"status":"healthy"}`.
9. `GET /api/marketplace/items` → JSON array.
10. `GET /api/pulse` → JSON with `status`, `pulse`, `metrics`.

---

## Go-live checklist

Before promoting to production, verify every item below:

- [ ] `npm ci`, `npm run lint`, `npm run test`, and `npm run build` pass locally and in CI (`omnigrid-app-ci.yml`)
- [ ] `DATABASE_URL` points to the production PostgreSQL instance
- [ ] `PAYPAL_CLIENT_ID` + `PAYPAL_CLIENT_SECRET` are set (or PayPal routes intentionally disabled)
- [ ] `NODE_ENV=production` is set in the deployment environment
- [ ] All four fruitful-integrated routes respond with 200: `/sectors-portal`, `/baobab`, `/vaultmesh-portal`, `/treaty`
- [ ] `/marketplace` loads items (remote or fallback)
- [ ] `/api/health` returns `{"status":"healthy"}`
- [ ] `/api/pulse` returns valid JSON
- [ ] Error boundaries tested: visit an invalid route, confirm `404 Not Found` page renders (not a blank screen)
- [ ] OG/Twitter metadata verified with a social card preview tool (e.g. opengraph.xyz)
- [ ] CI workflow (`omnigrid-app-ci.yml`) green on the release branch

---

## Rollback instructions

### One-switch rollback (recommended)

The fruitful integration is self-contained in these files/routes:
- `client/src/pages/sectors-portal.tsx`, `baobab.tsx`, `vaultmesh-portal.tsx`, `treaty.tsx`
- `client/src/services/marketplace.ts`
- `client/src/lib/initServices.ts`
- `client/src/components/ErrorBoundary.tsx`
- `client/src/App.tsx` (new route entries)
- `client/src/components/GlobalHeader.tsx` (new nav entries)
- `server/routes.ts` (new `/api/marketplace/*` + `/api/pulse` blocks)

**To roll back in one step, revert the integration PR:**

```bash
git revert --no-commit <merge-sha>
git commit -m "revert: roll back fruitful integration"
git push
```

This removes all integrated pages and API additions while preserving all pre-existing OmniGrid functionality.

### Partial rollback — disable specific routes

To disable only the new routes without reverting the full PR, remove the corresponding `<Route>` entries from `client/src/App.tsx` and the `navItems` entries from `client/src/components/GlobalHeader.tsx`.

### Marketplace-only rollback

If the marketplace adapter causes issues, set `VITE_MARKETPLACE_API_URL=` (empty) in your environment.  The `FallbackMarketplaceProvider` will take over automatically without a code change or redeploy.
