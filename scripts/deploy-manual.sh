#!/bin/bash

# Manual gh-pages deployment script
# This bypasses the gh-pages package issues by manually creating and pushing the branch

echo "=========================================="
echo "Manual gh-pages Deployment"
echo "=========================================="
echo ""

# Build the project first
echo "Building project..."
npm run build

if [ $? -ne 0 ]; then
  echo "✗ Build failed!"
  exit 1
fi

echo ""
echo "Creating gh-pages branch..."

# Checkout or create gh-pages branch
git checkout --orphan gh-pages 2>/dev/null || git checkout -b gh-pages

# Remove all files from the branch
git rm -rf . 2>/dev/null || true

# Copy dist files (excluding hidden files that might cause issues)
echo "Copying build files..."
cp -r ../dist/. . 2>/dev/null

# Remove any git-related files from dist
rm -rf .git node_modules 2>/dev/null || true

# Add and commit
echo "Committing changes..."
git add .
git config user.name "$(git config user.name || 'GitHub Actions')"
git config user.email "$(git config user.email || 'actions@github.com')"
git commit -m "Deploy D&D Tools to GitHub Pages"

# Push to remote
echo ""
echo "Pushing to GitHub..."
git push -f origin gh-pages

if [ $? -eq 0 ]; then
  echo ""
  echo "✓ SUCCESS! gh-pages branch created and deployed!"
  echo ""
  echo "Your site is now live at:"
  REPO_NAME=$(echo $(git remote get-url origin) | sed 's|.*github.com/||; s|.git$||')
  echo "https://paulgilchrist.github.io/$REPO_NAME/"
  echo ""
  echo "To enable GitHub Pages display:"
  echo "1. Go to repository Settings → Pages"
  echo "2. Source: Deploy from a branch"
  echo "3. Branch: gh-pages, Folder: / (root)"
  echo "4. Click Save"
else
  echo ""
  echo "✗ Push failed. Check errors above."
fi

# Return to main branch
git checkout main 2>/dev/null || git checkout master 2>/dev/null || true

echo ""
echo "=========================================="
