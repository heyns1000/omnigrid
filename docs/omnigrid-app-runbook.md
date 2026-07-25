# OmniGrid App Build + Deploy Runbook

## App location

`/home/runner/work/omnigrid/omnigrid/fullstack-app-extracted/Hello-there-What-kind-of-software-project-are-you-looking`

## Local setup

```bash
cd /home/runner/work/omnigrid/omnigrid/fullstack-app-extracted/Hello-there-What-kind-of-software-project-are-you-looking
cp .env.example .env
npm ci
```

Required environment variables:

- `DATABASE_URL`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`

Optional:

- `PORT` (defaults to `5000`)
- `NODE_ENV` (`production` for live deploys)

## Build and run

```bash
npm run build
npm run start
```

## Deployment assumptions

- App build artifacts are generated in `dist/public`.
- Server bundle is generated at `dist/index.js`.
- If PayPal env vars are missing, PayPal endpoints now return `503` with a clear configuration message instead of crashing app startup.
- Static repository deploys (Netlify workflow) skip deployment gracefully when Netlify secrets are not configured.

## Operational checks

1. `npm ci` succeeds.
2. `npm run build` succeeds.
3. Open `/`, `/dashboard`, `/vaultmesh`, and `/admin`.
4. Confirm page title changes per route (`<Section> | OmniGrid™`).
5. Confirm header/landing visual palette aligns with `public/omnigrid.html` reference tokens.
