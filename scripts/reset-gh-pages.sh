#!/bin/bash

# Reset gh-pages branch helper script
# Use this if you need to completely reset the deployment branch

echo "=========================================="
echo "Reset gh-pages Branch"
echo "=========================================="
echo ""

# Check if gh-pages branch exists locally
if git rev-parse --verify gh-pages >/dev/null 2>&1; then
  echo "Local gh-pages branch found. Deleting..."
  git branch -D gh-pages
fi

# Check if gh-pages branch exists remotely
echo "Checking remote branches..."
git ls-remote --heads origin | grep gh-pages || echo "No remote gh-pages branch found"

echo ""
echo "Options:"
echo "1. Delete local gh-pages branch and redeploy"
echo "2. Force push to update remote gh-pages"
echo "3. Cancel operation"
echo ""

read -p "Select option [1-3]: " choice

case $choice in
  1)
    echo ""
    echo "Deleting local gh-pages branch..."
    git branch -D gh-pages 2>/dev/null || echo "Branch doesn't exist locally"
    
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
    echo "Force pushing to update remote gh-pages branch..."
    
    # Fetch latest changes
    git fetch origin
    
    # Delete local gh-pages if exists
    git branch -D gh-pages 2>/dev/null || true
    
    # Create fresh gh-pages from dist
    git checkout --orphan gh-pages
    git rm -rf .
    
    echo "Adding dist files..."
    cp -r ../dist/. .
    rm -rf node_modules .git
    
    git add .
    git commit -m "Reset gh-pages branch"
    
    echo "Force pushing to remote..."
    git push -f origin gh-pages
    
    if [ $? -eq 0 ]; then
      echo ""
      echo "✓ Remote gh-pages branch updated!"
    else
      echo ""
      echo "✗ Push failed. Check errors above."
    fi
    
    # Return to main branch
    git checkout main 2>/dev/null || git checkout master 2>/dev/null || true
    ;;
    
  3)
    echo ""
    echo "Operation cancelled."
    ;;
    
  *)
    echo "Invalid option. Please run again."
    ;;
esac

echo ""
echo "=========================================="
