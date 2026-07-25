# Build Prompt: Close the OmniGrid Integration Gap

This is a build brief, not a report — hand it directly to a Claude session (or any engineer) as the starting instruction for actual implementation work. Every number and constraint below is sourced from `omnigrid-main-index.md`, `omnigrid-second-pass-report.md`, and `omnigrid-branch-reconciliation.md` in this same directory — read those first if you need the evidence trail; this file is the distilled instruction, not the research.

---

## Mission

Deploy and connect exactly the pieces already listed as "code exists, not deployed" — do not design a fourth orchestrator, do not invent new brand/repo figures, do not write new aspirational documentation. The repo has three previous, independent, complete-but-disconnected attempts at this exact job. Your job is to *finish one*, not start a fourth.

## Ground truth — use these numbers, not the docs' own claims

- **Brands**: 162 (`ecosystem_config.yaml` and `consolidated_output/brand_registry.json` agree on this). Ignore 2,960 / 4,323 / 5,400+ / 9,000+ / 7,000 / 13,713+ — all traced to inconsistent or placeholder-generated sources, none corroborated by two independent files the way 162 is.
- **Repositories**: 104 listed in `config/ecosystem-repos.json`. Ignore the "94/94 verified" and "89 discovered" claims elsewhere in the repo — neither matches the file both call authoritative.
- **What's actually live and confirmed working today**: LicenseVault (deployed, verified), 16 GitHub Actions workflows, a real signup app, the Banimal WordPress plugin, the real (small) flyer-print operation in `fruitful-global-deployment/README.md`.
- **Everything else** — HotStack's DNS/template/ClaimRoot automation, the multi-chain oracle, ScrollStack™/MeshNest™/Treaty Economy — is documented-only. Treat as a spec to implement, not a system to integrate against.

## Do not repeat these three failed patterns

1. **Don't build a fourth orchestrator.** Three exist already, none deployed: the HotStack `unified-orchestrator.js` family, a FastAPI "Sovereignty" backend (`app/api/verdict`, built around a disputed hours-claim narrative — skip this one's premise entirely, it's not infrastructure), and a `FullStackDeployer` Python class. If any of the three is closest to working, extend *that one*. Evaluate `unified-orchestrator-WITH-LICENSEVAULT.js` first — a prior session flagged it explicitly as "more complete than deployed version... SOURCE OF TRUTH we should have used" and it was never acted on.
2. **Don't add new "Status: DOCUMENTED ONLY" sections.** Every new component gets built and connected before it gets written up, or it doesn't get written up at all.
3. **Don't generate brand/repo placeholder records.** The 13,713-brand figure and several near-duplicate entries in `brand_registry.json` (literal brand names like `"7"` and `"8000"`) trace to a placeholder-generation loop from a prior session. If brand data needs to grow, it grows from real registrations, not generated filler.

## The actual gap, prioritized (source: a prior session's own ledger, `omnigrid-second-pass-report.md` §1.5)

Priority order as the source itself specified — **master pulse first, then workers**:

1. **The 9-second VaultMesh pulse** (`master-sync-pulse` worker) — "DESIGNED, NOT IMPLEMENTED," described in the source as "THE MISSING LOOP." This is the single connector everything else depends on. Build this first or nothing downstream of it matters.
2. **8 Cloudflare Workers, already coded, never deployed**: email worker, payment processor, subscription manager, quantum-nexus-router, DNS hook service, ClaimRoot service, LicenseVault service, enhanced unified-orchestrator. Locate the actual source (check Google Drive / local backups referenced in the second-pass report if not in this repo) before rewriting from scratch.
3. **3 payment providers, blocked only on credentials**: PayPal, PayFast, Stripe. Webhook code already exists for all three. This is a credentials/config task, not a build task — do it early, it's cheap.
4. **2 databases**: `licensevault-db` (D1) and a subscriptions table, both "claimed created, unverified." Verify first; only rebuild what's actually missing.
5. **1 WordPress plugin** ("HotStack One-Click") — source ready, needs packaging only.
6. Everything past this point (89-repo unification, 67 Replit app audit, brand-source sync) is real but lower priority than getting the pulse and the 8 workers live — sequence accordingly.

## Explicit non-goals for this build

- The undeployed full-internet IP-sweep script (`atomic_ip_sweep.py`) is **out of scope**. Its disposition (keep/remove/restrict) is a standing decision for the repo owner, not something to wire into this build.
- Do not touch the "$22B valuation" / brand-projection narrative at all. It's marketing content, not a system requirement.

## Deliverable shape

The source material itself already proposed the right-sized first milestone (`bash_code.json` "Option A / Option C," previously recommended over the full-vision rebuild): a working pulse + the 8 workers + real payment keys, deployed and connected, is a complete, demonstrable, non-fictional "3-minute deployment" — even at a fraction of the originally marketed scope. Ship that, verified live (a `curl` against each worker's health endpoint returning 200, not a status doc claiming it), before touching anything further down the priority list.

## Reference data in this directory

- `omnigrid-file-manifest.csv` — full 2,196-file tree of `main` with GitHub blob URLs (source-of-truth for locating any file referenced above).
- `omnigrid-branch-reconciliation.md` — confirms all 63 non-main branches are either byte-identical to `main` or (for the 2 that aren't) fully itemized above; there is no hidden branch with a more-complete version of any of this.
- `omnigrid-main-index.md`, `omnigrid-second-pass-report.md` — full evidence trail for every claim above.
