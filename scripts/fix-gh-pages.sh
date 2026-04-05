#!/bin/bash

# Fix gh-pages branch issue - handles remote-only branches

echo "=========================================="
echo "Fixing gh-pages Branch Issue"
echo "=========================================="
echo ""

# Fetch all branches to see what exists remotely
git fetch origin --prune 2>/dev/null

echo "Checking branch status..."
echo ""

# Check if gh-pages exists remotely
if git ls-remote --heads origin | grep -q "gh-pages"; then
  echo "✓ gh-pages branch exists on remote (GitHub)"
  git ls-remote --heads origin | grep gh-pages || true
else
  echo "✗ No gh-pages branch found on remote"
fi

echo ""
echo "This is the issue - the branch exists on GitHub but not locally."
echo ""

# Option 1: Create local gh-pages from remote and update it
echo "Option A: Create local branch from remote and deploy"
echo "- This will checkout the existing gh-pages branch"
echo "- Then update it with your new build"

# Option 2: Delete remote branch and recreate
echo ""
echo "Option B: Delete remote gh-pages and create fresh"  
echo "- Requires GitHub repository settings access"
echo "- Will delete the branch on GitHub and recreate it"

# Option 3: Use main branch instead
echo ""
echo "Option C: Switch to using main branch for Pages"
echo -e "- Change GitHub Pages source from 'gh-pages' to 'main'\n"

read -p "Choose option [A/B/C]: " choice

case $choice in
  A|a)
    echo ""
    echo "Creating local gh-pages branch from remote..."
    
    # Fetch the remote gh-pages
    git fetch origin gh-pages
    
    # Checkout or create local branch tracking remote
    git checkout -b gh-pages origin/gh-pages 2>/dev/null || git checkout gh-pages
    
    echo ""
    echo "Building project..."
    npm run build
    
    if [ $? -ne 0 ]; then
      echo "✗ Build failed. Fix build errors first."
      git checkout main 2>/dev/null || git checkout master 2>/dev/null || true
      exit 1
    fi
    
    echo ""
    echo "Clearing branch and copying dist files..."
    git rm -rf . 2>/dev/null || true
    
    # Copy dist contents (excluding hidden files that might cause issues)
    cp -r ../dist/. . 2>/dev/null
    
    # Remove any git-related files
    rm -rf .git node_modules 2>/dev/null || true
    
    echo ""
    echo "Committing changes..."
    git add .
    git commit -m "Update gh-pages deployment"
    
    echo ""
    echo "Pushing to GitHub..."
    git push origin gh-pages
    
    if [ $? -eq 0 ]; then
      echo ""
      echo "✓ SUCCESS! gh-pages branch updated!"
      echo ""
      echo "Your site should now be live at:"
      echo "https://$(git remote get-url origin | sed 's|.*github.com/||; s|.git$||' | xargs -I {} echo "https://{}.github.io/{}")"
    else
      echo ""
      echo "✗ Push failed. Check errors above."
    fi
    
    # Return to main branch
    git checkout main 2>/dev/null || git checkout master 2>/dev/null || true
    ;;
    
  B|b)
    echo ""
    echo "This option requires deleting the remote branch on GitHub."
    echo ""
    echo "Steps to manually delete gh-pages branch:"
    echo "1. Go to your repository on GitHub"
    echo "2. Click 'Settings' → 'Code and automation'"
    echo "3. Scroll to 'Delete branch' section"
    echo "4. Find and delete the gh-pages branch"
    echo ""
    echo "After deleting it on GitHub, run:"
    echo "  npm run deploy"
    echo ""
    echo "This will create a fresh gh-pages branch."
    ;;
    
  C|c)
    echo ""
    echo "Switching to use main branch for GitHub Pages..."
    echo ""
    echo "You need to update your repository settings:"
    echo "1. Go to Settings → Pages"
    echo "2. Under 'Build and deployment':"
    echo "   - Source: Deploy from a branch"
    echo "   - Branch: main (or master)"
    echo "   - Folder: / (root)"
    echo "3. Click Save"
    echo ""
    echo "Then update package.json deploy script to:"
    echo "  'deploy': \"npx gh-pages -d dist --branch main\""
    ;;
    
  *)
    echo "Invalid option. Please run again."
    ;;
esac

echo ""
echo "=========================================="
