# gh-pages Branch Setup Guide

## The Issue

The error `fatal: a branch named 'gh-pages' already exists` means the gh-pages branch was created but may have issues.

## Solutions

### Option 1: Use Updated Deployment Script (Recommended)

The updated `batch-deploy.js` now uses `--delete --force` flags:

```bash
npm run deploy
```

This will automatically handle the existing branch.

### Option 2: Reset gh-pages Branch Manually

If Option 1 doesn't work, use the reset script:

```bash
./scripts/reset-gh-pages.sh
```

This provides an interactive menu to:
1. Delete local gh-pages branch and redeploy
2. Force push to update remote gh-pages
3. Cancel operation

### Option 3: Manual Reset (Advanced)

```bash
# Delete local gh-pages branch
git branch -D gh-pages

# Fetch latest changes
git fetch origin

# Delete remote gh-pages (if you have permissions)
# Then redeploy
npm run deploy
```

## Enable GitHub Pages

After deployment, make sure GitHub Pages is enabled:

1. Go to repository **Settings** → **Pages**
2. Under **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `gh-pages` (or `main`)
   - Folder: `/ (root)`
3. Click **Save**

## Verify Deployment

Visit your site at:
```
https://<your-username>.github.io/<repository-name>/
```

## Troubleshooting

### "Permission denied" when pushing to gh-pages
- Ensure you have write permissions to the repository
- Check your Git credentials

### Deployment keeps failing
- Run `./scripts/reset-gh-pages.sh` to reset the branch
- Try Option 1 from the menu (delete and redeploy)

### Want to use main branch instead
- In repository Settings → Pages, select `main` branch as source
- Update deployment script to use main branch if needed

---

**Try running `npm run deploy` first - the updated script should handle the existing branch automatically.**
