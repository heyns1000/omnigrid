# Git Subtree Push to CodeNest

## Instructions

Run these commands from the OmniGrid repository:

```bash
# 1. Add CodeNest as a remote
git remote add codenest git@github.com:heyns1000/codenest.git

# 2. Create subtree from codenest_export/
git subtree split --prefix=codenest_export -b codenest-export-branch

# 3. Push to CodeNest main branch
git push codenest codenest-export-branch:main

# 4. Verify push
git ls-remote codenest

# 5. Clean up local branch
git branch -D codenest-export-branch
```

## Alternative: Direct Copy Method

```bash
# 1. Clone CodeNest
git clone git@github.com:heyns1000/codenest.git /tmp/codenest-repo

# 2. Copy export files
cp -r codenest_export/* /tmp/codenest-repo/

# 3. Commit and push
cd /tmp/codenest-repo
git add .
git commit -m "Add FAA Brand Export from OmniGrid (149 brands)"
git push origin main
```

## What Gets Pushed

- faa_brands_registry.json (149 FAA™ brands)
- sector_mappings.json (16 sectors)
- template_registry.json (8 templates)
- codenest_api_config.json (API configuration)
- CODENEST_README.md (Documentation)

This creates the **Source of Truth** for the entire ecosystem.
