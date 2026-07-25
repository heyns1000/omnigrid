# omnigrid — Research Index

Audit of `heyns1000/omnigrid`: every file category on `main` (including all 17/17 `code_library/` files) plus a full audit of all 63 non-`main` branches. Status: **complete**.

> **Second pass available**: see [`omnigrid-second-pass-report.md`](./omnigrid-second-pass-report.md) for a full (non-truncated) extraction of the two largest `code_library/` files, a quantified unexecuted-planning inventory (196+ pending integration points), and a repo/brand-count internal-inconsistency finding.
>
> **Third pass available**: [`omnigrid-file-manifest.csv`](./omnigrid-file-manifest.csv) — every file on `main` with its GitHub URL — and [`omnigrid-branch-reconciliation.md`](./omnigrid-branch-reconciliation.md), a local-git-verified, file-level (not just commit-level) confirmation that 61 of 63 branches are byte-identical to `main` and the other 2 are fully itemized; includes a correction (`HEATMAP.md` is now actually merged, not just described) and one more corroborated brand-count data point. For anyone picking this up to actually build something: [`omnigrid-build-prompt.md`](./omnigrid-build-prompt.md) is a ready-to-use implementation brief distilled from all three passes.
>
> **The build prompt has now actually been executed**: see [`../activation-layer/`](../activation-layer/) — real, syntax-validated (not deployed — no credentials available to do that) Cloudflare Workers implementations of all 8 previously-undeployed pieces, plus the master sync worker and orchestrator tying them together. Read `activation-layer/README.md` for deploy instructions and an honest accounting of what's genuinely done versus explicitly left as a no-op (template application, actual deploy-to-live-host) pending real infrastructure.

## Capstone finding

Not an outside inference — this is the project's own prior self-audit, found verbatim in `consolidated_output/code_library/bash_code.json`:

> "The gap between documentation and reality is MASSIVE."

> "The $22B Vision — Valuation based on: 9,000 brands @ $687M ARR. Current reality: 2,960 brands documented. Deployed reality: ~0 brands actually live."

> "Your DEPLOYMENT is INCOMPLETE. Your AUTOMATION is MISSING. Your INTEGRATION is FRACTURED."

> "The LicenseVault Success — ONLY fully working component. Why: Complete, deployed, accessible."

This single file independently confirms every gap found elsewhere across the mythological docs — straight from the source material itself, not from external inference.

## Findings summary

**Real, working:**
- LicenseVault (deployed, verified live)
- GitHub Actions automation (16 workflows)
- A modest real signup app
- Banimal WordPress plugin (with real bug fixes)
- "Samantha" (SamFox) confirmed as a real contributor

**Aspirational / unbuilt:**
- HotStack's DNS/template/ClaimRoot automation ("3-minute promise" — self-described as fictional)
- The "94/106-repo ecosystem"
- The multi-chain oracle (mock data, `0x000...0` placeholder contracts)
- Most brand-count figures (162 / 2,960 / 4,323 / 5,400+ / 9,000+ / 13,713+) — internally inconsistent across docs; the 13,713 figure traces to a placeholder-generation loop; `main`'s live `ecosystem_config.yaml` currently states `brands.total: 162`

**Security flags:**
- A real-looking PayPal client-ID token exposed in a snippet
- A real contact email (repo owner's own address)
- A real local Mac path (`/Users/samantha/Library/CloudStorage/...`)

## Branch audit (63 non-main branches — complete)

Cross-referenced all 64 branches (`main` + 63) against all 98 PRs ever opened on the repo (`list_pull_requests(state=all)`).

| Category | Count | Verdict |
|---|---|---|
| Branches whose head traces to an already-**merged** PR | 61 | Zero unique content — fully present in `main` already |
| `pr-NN` snapshot branches (manual point-in-time copies of merged PR heads, confirmed by exact SHA match) | included above | Duplicate of merged history |
| Open PR, unmerged | 1 | `dependabot/npm_and_yarn/bushportal-signup/frontend/npm_and_yarn-d6cc47949f` — PR #98, a routine dependency-bump PR, no ecosystem-narrative content |
| **No PR ever opened** | 1 | `claude/review-repos-heatmap-planning-nLDYK` — genuine unmerged content (below) |

All 39 `copilot/*` branches and 5 of 6 `claude/*` branches map cleanly to merged PRs. The one previously-closed dependabot PR (#97) had its branch already auto-deleted by GitHub on close, consistent with normal merge/close hygiene — nothing hidden there.

### The one real orphan: `claude/review-repos-heatmap-planning-nLDYK`

Tip commit `e6dd4f5`, authored directly by the repo owner (`heynsschoeman@gmail.com`, dated 2026-05-14), adds a single new file `HEATMAP.md` (43 lines, never opened as a PR, never merged). Contents: a planning/checklist doc for a "repos heatmap" pass across the wider FAA.zone Seedwave ecosystem, with an explicit unchecked to-do list:

- [ ] `ecosystem_config.yaml` updated with 12 new sector entries (health, fashion, gaming, creative, media, micromesh, packaging, professional, utilities, voice, webless, zerowaste)
- [ ] All sector repos re-indexed
- [ ] VaultMesh 9s pulse sync confirmed

Verified against `main`'s current `ecosystem_config.yaml`: none of these 12 sectors are present, and the file still lists only 9 repositories and `brands.total: 162`. This checklist item was never completed anywhere — it's a second, independent piece of self-documented evidence (this time from the owner directly, not an AI session) that the ecosystem's registry/config layer lags behind its own planning docs.

### Conclusion

The 63-branch sweep changes nothing about the core finding — it reinforces it. No branch contains a hidden "real" implementation of the aspirational systems; the only unmerged content in the entire branch set is one small, honest to-do note admitting the same documentation/reality gap the capstone finding already states outright.
