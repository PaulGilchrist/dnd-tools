# gh-pages Branch Issue - Quick Fix

## The Problem

The error `fatal: a branch named 'gh-pages' already exists` occurs when the gh-pages branch was previously created but has issues.

## Solution 1: Use the Setup Script (Recommended)

Run the interactive setup script:

```bash
./scripts/setup-gh-pages.sh
```

This will give you options to:
1. Delete local gh-pages and start fresh
2. Force update existing branch  
3. Switch to using main branch instead

## Solution 2: Manual Reset

If you prefer manual control:

```bash
# Delete local gh-pages branch
git branch -D gh-pages

# Fetch latest changes
git fetch origin --prune

# Try deploying again
npm run deploy
```

## Solution 3: Force Push to Existing Branch

If the branch exists but needs updating:

```bash
# Checkout or create gh-pages
git checkout -b gh-pages 2>/dev/null || git checkout gh-pages

# Clear and copy dist files
git rm -rf . 2>/dev/null || true
cp -r ../dist/. .

# Remove git files from dist
rm -rf .git node_modules 2>/dev/null || true

# Commit and force push
git add .
git commit -m "Update gh-pages"
git push -f origin gh-pages

# Return to main branch
git checkout main 2>/dev/null || git checkout master 2>/dev/null || true
```

## Enable GitHub Pages

After fixing the branch, enable GitHub Pages:

1. Go to repository **Settings** → **Pages**
2. Under **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `gh-pages` (or `main` if you chose that option)
   - Folder: `/ (root)`
3. Click **Save**

## Try Deploying Again

```bash
npm run deploy
```

The updated script should now work without the `--delete` flag.

---

**Quick fix: Run `./scripts/setup-gh-pages.sh` for an interactive solution!**
