#!/bin/bash

# Setup gh-pages branch helper
# This script helps resolve the "branch already exists" issue

echo "=========================================="
echo "gh-pages Branch Setup Helper"
echo "=========================================="
echo ""

# Check if gh-pages branch exists locally
if git rev-parse --verify gh-pages >/dev/null 2>&1; then
  echo "✓ Local gh-pages branch exists"
  git log --oneline gh-pages -n 3 || echo "No commits on local branch"
else
  echo "✗ No local gh-pages branch found"
fi

echo ""

# Check if gh-pages exists remotely
if git ls-remote --heads origin | grep -q "gh-pages"; then
  echo "✓ Remote gh-pages branch exists"
  git ls-remote --heads origin | grep gh-pages
else
  echo "✗ No remote gh-pages branch found"
fi

echo ""
echo "Options:"
echo "1. Delete local gh-pages and start fresh"
echo "2. Force update existing branch"
echo "3. Use main branch instead (requires repo settings change)"
echo "4. Cancel"
echo ""

read -p "Select option [1-4]: " choice

case $choice in
  1)
    echo ""
    echo "Deleting local gh-pages branch..."
    git branch -D gh-pages 2>/dev/null
    
    echo ""
    echo "Fetching latest changes from origin..."
    git fetch origin --prune
    
    echo ""
    echo "Running full deployment..."
    npm run deploy
    
    if [ $? -eq 0 ]; then
      echo ""
      echo "✓ Deployment successful!"
    else
      echo ""
      echo "✗ Deployment failed. Check errors above."
    fi
    ;;
    
  2)
    echo ""
    echo "Force updating gh-pages branch..."
    
    # Checkout or create gh-pages branch
    git checkout -b gh-pages 2>/dev/null || git checkout gh-pages
    
    # Clear the branch
    git rm -rf . 2>/dev/null || true
    
    echo "Copying dist files..."
    cp -r ../dist/. . 2>/dev/null || {
      echo "Error: dist folder not found. Run 'npm run build' first."
      git checkout main 2>/dev/null || git checkout master 2>/dev/null || true
      exit 1
    }
    
    # Remove git files from dist
    rm -rf .git node_modules 2>/dev/null || true
    
    # Add and commit
    git add .
    git commit -m "Update gh-pages deployment"
    
    # Force push
    echo "Force pushing to remote..."
    git push -f origin gh-pages
    
    if [ $? -eq 0 ]; then
      echo ""
      echo "✓ Branch updated successfully!"
    else
      echo ""
      echo "✗ Push failed. Check errors above."
    fi
    
    # Return to main branch
    git checkout main 2>/dev/null || git checkout master 2>/dev/null || true
    ;;
    
  3)
    echo ""
    echo "Switching to use main branch for GitHub Pages..."
    echo ""
    echo "You'll need to:"
    echo "1. Go to repository Settings → Pages"
    echo "2. Change source from 'gh-pages' to 'main'"
    echo "3. Folder: / (root)"
    echo "4. Click Save"
    echo ""
    echo "Then update package.json to deploy from main:"
    echo "  'deploy': 'npx gh-pages -d dist --branch main'"
    ;;
    
  4)
    echo ""
    echo "Operation cancelled."
    ;;
    
  *)
    echo "Invalid option. Please run again."
    ;;
esac

echo ""
echo "=========================================="
