# omnigrid — Branch Reconciliation (definitive, local-git verified)

Supersedes the branch-count claims in `omnigrid-main-index.md` (which were established via the GitHub API) with a local-git, file-level verification: for every one of the 63 non-main branches, `git diff origin/main...<branch> --name-only` — a merge-base diff, which shows exactly the files that differ between where the branch actually diverged from `main` and `main`'s current tip. This is the strongest possible check: it doesn't matter how many commits a branch has or how old its history is, only whether any file content in it doesn't already exist in `main`.

**Result: 61 of 63 branches have zero unique files. 2 have real content.**

## The complete manifest

`omnigrid-file-manifest.csv` (also in this directory) is the full file tree of `main` — 2,196 files, each with its blob SHA and a direct `github.com/.../blob/main/<path>` URL. Since 61 of the 63 branches are proven byte-identical to `main` at the file level, this one manifest **is** the manifest for all 61 of them — there is no separate content to list per-branch because there isn't any. Re-listing the same 2,196 paths 61 times would be noise, not signal.

## The 2 branches that actually differ

### `claude/review-repos-heatmap-planning-nLDYK` — 1 file: `HEATMAP.md`

**Correction to the record**: `omnigrid-main-index.md` (PR #100) stated this branch was "merged" and its content "zero unique content beyond main." That was imprecise. What actually happened: PR #100 *quoted and described* `HEATMAP.md`'s content inside a new report file — it never copied the original file itself into `main`. Re-verified here with `git show origin/main:HEATMAP.md` → `fatal: path does not exist`. The branch was never literally merged; only summarized.

**Fixed in this PR**: `HEATMAP.md` is now copied into the repo root as-is (same content, same path it had on the source branch) — closing the loop for real this time.

- File: [`HEATMAP.md`](https://github.com/heyns1000/omnigrid/blob/main/HEATMAP.md) *(after this PR merges)*
- Source branch: https://github.com/heyns1000/omnigrid/blob/claude/review-repos-heatmap-planning-nLDYK/HEATMAP.md

### `dependabot/npm_and_yarn/bushportal-signup/frontend/npm_and_yarn-d6cc47949f` — 9 files

Open PR #98, a routine dependency-group bump across 5 project directories. Not something this session should merge unilaterally (it's an active, bot-owned PR with its own CI/review cycle) — listed here for completeness only.

| File | URL |
|---|---|
| `bushportal-signup/frontend/package.json` | https://github.com/heyns1000/omnigrid/blob/dependabot/npm_and_yarn/bushportal-signup/frontend/npm_and_yarn-d6cc47949f/bushportal-signup/frontend/package.json |
| `fullstack-app-extracted/.../backup/package-lock.json` | https://github.com/heyns1000/omnigrid/blob/dependabot/npm_and_yarn/bushportal-signup/frontend/npm_and_yarn-d6cc47949f/fullstack-app-extracted/Hello-there-What-kind-of-software-project-are-you-looking/backup/package-lock.json |
| `fullstack-app-extracted/.../backup/package.json` | https://github.com/heyns1000/omnigrid/blob/dependabot/npm_and_yarn/bushportal-signup/frontend/npm_and_yarn-d6cc47949f/fullstack-app-extracted/Hello-there-What-kind-of-software-project-are-you-looking/backup/package.json |
| `fullstack-app-extracted/.../package-lock.json` | https://github.com/heyns1000/omnigrid/blob/dependabot/npm_and_yarn/bushportal-signup/frontend/npm_and_yarn-d6cc47949f/fullstack-app-extracted/Hello-there-What-kind-of-software-project-are-you-looking/package-lock.json |
| `fullstack-app-extracted/.../package.json` | https://github.com/heyns1000/omnigrid/blob/dependabot/npm_and_yarn/bushportal-signup/frontend/npm_and_yarn-d6cc47949f/fullstack-app-extracted/Hello-there-What-kind-of-software-project-are-you-looking/package.json |
| `rebuilt_systems/fruitful-global/backup/package-lock.json` | https://github.com/heyns1000/omnigrid/blob/dependabot/npm_and_yarn/bushportal-signup/frontend/npm_and_yarn-d6cc47949f/rebuilt_systems/fruitful-global/backup/package-lock.json |
| `rebuilt_systems/fruitful-global/backup/package.json` | https://github.com/heyns1000/omnigrid/blob/dependabot/npm_and_yarn/bushportal-signup/frontend/npm_and_yarn-d6cc47949f/rebuilt_systems/fruitful-global/backup/package.json |
| `rebuilt_systems/fruitful-global/package-lock.json` | https://github.com/heyns1000/omnigrid/blob/dependabot/npm_and_yarn/bushportal-signup/frontend/npm_and_yarn-d6cc47949f/rebuilt_systems/fruitful-global/package-lock.json |
| `rebuilt_systems/fruitful-global/package.json` | https://github.com/heyns1000/omnigrid/blob/dependabot/npm_and_yarn/bushportal-signup/frontend/npm_and_yarn-d6cc47949f/rebuilt_systems/fruitful-global/package.json |

## One more corroborated data point (verified directly, this pass)

`consolidated_output/brand_registry.json` (on `main`): `metadata.total_brands: 162`, `generated_at: 2025-12-28`, `source: "Claude Profile Data Export"`. This is not a new, 4th contradictory figure — it's the **same 162** already recorded in `ecosystem_config.yaml` and in the original index's contradiction list. Worth flagging separately though: several "brand" entries in this file are named things like `"7"` and `"8000"` with empty `domains` and no real identifying data — consistent with the "placeholder-generation loop" origin already identified for the 13,713 figure elsewhere. `config/ecosystem-repos.json` was re-verified at **104** repositories (not 105).
