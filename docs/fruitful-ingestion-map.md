# Fruitful Ingestion Map

**Source repository:** `heyns1000/fruitful`  
**Target repository:** `heyns1000/omnigrid`  
**Target app root:** `fullstack-app-extracted/Hello-there-What-kind-of-software-project-are-you-looking/`  
**Map date:** 2026-07-25

---

## Legend

| Action | Meaning |
|--------|---------|
| `import` | Brought into OmniGrid directly or with minor adaptation |
| `adapt` | Source logic/structure kept; syntax/import paths changed for OmniGrid conventions |
| `replace` | OmniGrid already had equivalent; fruitful version used to strengthen it |
| `skip` | Not integrated; reason provided |

---

## 1 · UI Components

| # | Source file | Dest file | Category | Action | Reason / Notes |
|---|-------------|-----------|----------|--------|----------------|
| 1 | `frontend/src/pages/OmniGrid.tsx` | — | UI | skip | OmniGrid already has a full `/omnigrid-canvas` page with equivalent sector-terminal content; duplicate would confuse routing |
| 2 | `frontend/src/pages/Dashboard.tsx` | — | UI | skip | OmniGrid has a richer dashboard backed by real DB queries via TanStack Query; fruitful version calls a separate fruitful API not present in OmniGrid's backend |
| 3 | `frontend/src/pages/Sectors.tsx` | `client/src/pages/sectors-portal.tsx` | UI | adapt | Routing changed from react-router-dom → wouter; custom Layout/Card/Button → Radix-based shadcn; `/api/sectors` reused from existing storage |
| 4 | `frontend/src/pages/BaobabTerminal.tsx` | `client/src/pages/baobab.tsx` | UI | adapt | Replaced custom Badge/Card with OmniGrid shadcn equivalents; wired to `/api/health` for real liveness |
| 5 | `frontend/src/pages/VaultMesh.tsx` | `client/src/pages/vaultmesh-portal.tsx` | UI | adapt | usePulse hook replaced with TanStack Query call to new `/api/pulse` endpoint; error state added |
| 6 | `frontend/src/pages/Treaty.tsx` | `client/src/pages/treaty.tsx` | UI | adapt | Direct translation; routing to wouter; Layout → GlobalHeader/Footer |
| 7 | `frontend/src/pages/Home.tsx` | — | UI | skip | OmniGrid has a richer landing.tsx with platform status integration; fruitful Home only duplicates hero content |
| 8 | `frontend/src/pages/Login.tsx` | — | UI | skip | OmniGrid uses passport-local + express-session for auth; a separate Login page would require session plumbing not in scope |
| 9 | `frontend/src/pages/Explore.tsx` | — | UI | skip | Minimal stub page; no unique content beyond a sector list already covered by sectors-portal |
| 10 | `frontend/src/pages/Checkout.tsx` | — | UI | skip | OmniGrid has PayPal-integrated VaultMesh checkout served by `/vaultmesh` server route; importing this React-only version would create a conflict |
| 11 | `frontend/src/pages/SeedwaveAdmin.tsx` | — | UI | skip | Admin functionality requires a Seedwave-specific backend API not present in OmniGrid; would be dead UI |
| 12 | `frontend/src/components/layout/Layout` | — | UI | skip | OmniGrid uses GlobalHeader + GlobalFooter with wouter; importing react-router-dom Layout would break SPA routing |
| 13 | `frontend/src/components/ui/Card` | — | UI | skip | OmniGrid uses @radix-ui/react-* via shadcn/ui; fruitful's custom Card is redundant |
| 14 | `frontend/src/components/ui/Badge` | — | UI | skip | Same reasoning as Card |

---

## 2 · Logic / Services

| # | Source file | Dest file | Category | Action | Reason / Notes |
|---|-------------|-----------|----------|--------|----------------|
| 15 | `frontend/src/services/api.ts` | `client/src/services/marketplace.ts` | logic | adapt | Adapter interface pattern extracted; IMarketplaceAdapter + FallbackMarketplaceProvider + RemoteMarketplaceAdapter created; axios dep not pulled in (OmniGrid uses fetch via TanStack Query) |
| 16 | `frontend/src/services/auth.ts` | — | logic | skip | Fruitful uses JWT localStorage tokens; OmniGrid uses express-session + passport; conflating the two auth systems would break existing auth |
| 17 | `frontend/src/hooks/usePulse.ts` | — (inline in vaultmesh-portal) | logic | adapt | Pattern inlined as a TanStack Query call to `/api/pulse`; no separate hook file needed |
| 18 | `frontend/src/hooks/useSectors.ts` | — (inline in sectors-portal) | logic | adapt | Pattern inlined as a TanStack Query call to `/api/sectors` |
| 19 | `frontend/src/hooks/useAuth.ts` | — | logic | skip | JWT auth incompatible with session-based auth; see #16 |

---

## 3 · Data / Backend

| # | Source file | Dest file | Category | Action | Reason / Notes |
|---|-------------|-----------|----------|--------|----------------|
| 20 | `backend/server.js` | — | data | skip | Fruitful backend is a standalone Express server with its own DB; OmniGrid already has a full Express + Drizzle ORM backend; merging both would require schema unification beyond this sprint |
| 21 | `backend/routes/` | `server/routes.ts` (additions) | data | adapt | `/api/marketplace/items`, `/api/marketplace/items/:id`, `/api/pulse` endpoints added to OmniGrid's routes.ts |
| 22 | `frontend/src/types/api.types` | — | data | skip | OmniGrid's shared/schema.ts + Drizzle-generated types cover the same domain; importing fruitful types would require mapping layer |
| 23 | `frontend/src/utils/` | — | data | skip | OmniGrid has client/src/lib/utils.ts + queryClient.ts; fruitful formatNumber/formatPrice helpers are not used by the adapted pages |

---

## 4 · Config / Workflows

| # | Source file | Dest file | Category | Action | Reason / Notes |
|---|-------------|-----------|----------|--------|----------------|
| 24 | `frontend/.env.example` | `.env.example` (additions) | config | adapt | `VITE_MARKETPLACE_API_URL` added; other fruitful vars already covered by OmniGrid's existing file |
| 25 | `frontend/tailwind.config.js` | — | config | skip | OmniGrid uses tailwind.config.ts with @tailwindcss/typography; fruitful config is a subset |
| 26 | `wrangler.toml` | — | config | skip | OmniGrid deploys via Netlify + Vercel; Cloudflare Workers not in use |
| 27 | `.github/` (fruitful workflows) | — | workflows | skip | Fruitful workflows target fruitful's own repo; importing them verbatim would trigger unintended cross-repo automation |

---

## 5 · Styling

| # | Source file | Dest file | Category | Action | Reason / Notes |
|---|-------------|-----------|----------|--------|----------------|
| 28 | Fruitful design tokens (purple/indigo hero gradient) | `client/src/pages/sectors-portal.tsx`, `baobab.tsx`, `vaultmesh-portal.tsx`, `treaty.tsx` | UI | import | Purple-to-indigo hero gradient applied to all four new pages for visual consistency |
| 29 | `frontend/src/styles/` | — | UI | skip | OmniGrid's index.css already includes the full "Fruitful™ Global Design System" CSS variable set from a prior integration |

---

## 6 · Docs / Public assets

| # | Source file | Dest file | Category | Action | Reason / Notes |
|---|-------------|-----------|----------|--------|----------------|
| 30 | `README.md` | — | docs | skip | Fruitful README documents a different app architecture; OmniGrid has its own runbook |
| 31 | `index.html` + public HTML templates | `client/index.html` (enhancements) | docs | adapt | OG image, og:url, twitter:image, og:site_name, color-scheme meta added |
| 32 | `public/samfox-templates/` | — | docs | skip | HTML template library belongs to fruitful's static-file delivery model; not applicable to OmniGrid's SPA |

---

## Coverage summary

| Category | Total source artefacts reviewed | Imported/Adapted | Skipped |
|----------|--------------------------------|------------------|---------|
| UI pages | 11 | 4 | 7 |
| UI components | 3 | 0 | 3 |
| Logic / services | 5 | 2 (adapted) | 3 |
| Data / backend | 4 | 1 (adapted) | 3 |
| Config / workflows | 4 | 1 (adapted) | 3 |
| Styling | 2 | 1 | 1 |
| Docs / assets | 3 | 1 (adapted) | 2 |
| **Total** | **32** | **10** | **22** |

**Coverage: 10/32 artefacts integrated = 31% imported/adapted**  
All 22 skipped artefacts have explicit documented reasons (architectural conflict, duplication, or out-of-scope backend dependency).

---

## Skip rationale summary

The 22 skipped items fall into four categories:

1. **Architectural conflict (6):** Fruitful uses react-router-dom + JWT auth + Cloudflare Workers; OmniGrid uses wouter + passport/session + Node/Express. Merging at the framework layer would break existing functionality.
2. **Duplication (9):** OmniGrid already has equivalent or richer versions (Dashboard, Landing, Auth, Layout, Card, Badge, utils, tailwind config, CSS variables).
3. **Dead-end backend dependency (5):** Several fruitful pages call fruitful's own Express backend (`/share-price`, `/seedwave`, `/ecosystem`, `/users`, `/contact`) which does not exist in OmniGrid. Importing the pages without the backend would show only loading spinners.
4. **Scope (2):** Public HTML template library and Cloudflare wrangler config are not applicable to this integration sprint.
