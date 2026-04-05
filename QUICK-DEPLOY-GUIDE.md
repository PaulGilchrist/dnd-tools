# Quick Deployment Guide

## Current Status

✅ Your repository is set up correctly  
✅ No gh-pages branch exists yet (good - we'll create it fresh)  
✅ All scripts are in place and ready

## Deploy Your Site

Simply run:

```bash
npm run deploy
```

This will:
1. Build your React app with all 267 monster images
2. Deploy to GitHub Pages, creating the gh-pages branch automatically
3. Process everything in 6 batches of ~45 images each

## What to Expect

The deployment will show:
```
Found 267 monster images to deploy in batches.
Batch size: 50

Total batches to deploy: 6

=== Deploying Batch 1 (45 files) ===
Building project...
Deploying to GitHub Pages...
✓ Batch 1 deployed successfully!

=== Deploying Batch 2 (50 files) ===
...
```

## After Deployment

Your site will be live at:
```
https://paulgilchrist.github.io/dnd-tools-react/
```

## Troubleshooting

### If you get "branch already exists" error

This shouldn't happen since there's no gh-pages branch, but if it does:

```bash
# Delete any local tracking
git branch -D gh-pages 2>/dev/null || true

# Try deploying again
npm run deploy
```

### If deployment fails completely

1. Make sure you're logged into GitHub via Git credentials
2. Check that your repository is accessible: `git ls-remote origin`
3. Ensure you have write permissions to the repository

## Enable GitHub Pages (Optional but Recommended)

After deployment, you can enable GitHub Pages display:

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (or go directly to `https://github.com/PaulGilchrist/dnd-tools-react/settings/pages`)
3. Under **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `gh-pages` 
   - Folder: `/ (root)`
4. Click **Save**

Your site should then be accessible at the URL above!

---

**Ready to deploy? Just run `npm run deploy`!**
