# GitHub Pages Base Path Fix Summary

## Problem
The D&D Tools React application was experiencing 404 errors when navigating from the first page to subsequent pages on GitHub Pages. The root cause was that relative paths were not including the repository name (`/dnd-tools-react/`) when loading resources.

## Root Causes Identified

1. **Missing Data Folder**: The `public/data/` folder was deleted in a previous commit and wasn't being copied to the dist directory during build.

2. **Relative Paths in Components**: 
   - `Locations.jsx` was using relative path `../assets/locations/${location.image}`
   - `Monster.jsx` was using relative path `../assets/monsters/${monster.index}.jpg`
   - These paths didn't include the repo name when navigating between routes

3. **Favicon Path**: The favicon link in `index.html` used a relative path (`./favicon.svg`) which caused 404 errors on sub-routes.

## Solutions Implemented

### 1. Restored Data Folder
- Restored `public/data/` folder with all 15 JSON files from git history
- Updated `vite.config.js` to set `copyPublicDir: true` so data folder is copied during build

### 2. Fixed Asset Loading in Components

**Locations.jsx:**
```javascript
// Added BASE_URL constant
const BASE_URL = import.meta.env.BASE_URL || '';

// Updated image path to use absolute base URL
const imagePath = `${BASE_URL}assets/locations/${location.image}`;
```

**Monster.jsx:**
```javascript
// Added BASE_URL constant  
const BASE_URL = import.meta.env.BASE_URL || '';

// Updated image path to use absolute base URL
const imagePath = `${BASE_URL}assets/monsters/${monster.index}.jpg`;
```

### 3. Fixed Favicon Path in main.jsx
```javascript
// Set favicon path dynamically based on base URL
const BASE_URL = import.meta.env.BASE_URL || '';
if (BASE_URL) {
  const faviconLink = document.querySelector('link[rel="icon"]');
  if (faviconLink) {
    faviconLink.href = `${BASE_URL}favicon.svg`;
  }
}
```

### 4. Verified Configuration

**vite.config.js:**
- `base` is extracted from `package.json.homepage` → `/dnd-tools-react`
- `copyPublicDir: true` ensures public folder is copied to dist
- RollupOptions configured for proper asset naming

**package.json:**
```json
{
  "homepage": "https://PaulGilchrist.github.io/dnd-tools-react/"
}
```

**React Router in App.jsx:**
- `basename={base}` correctly set to `/dnd-tools-react`

## Build Output Verification

```bash
ls dist/
# data/ (15 JSON files)
# assets/ (251 monster images + JS/CSS bundles)
# favicon.svg
# icons.svg  
# index.html

cat dist/index.html
# <script type="module" crossorigin src="/dnd-tools-react/assets/index.js"></script>
# <link rel="stylesheet" crossorigin href="/dnd-tools-react/assets/index.css">
```

## Files Modified

1. `vite.config.js` - Added `copyPublicDir: true`
2. `src/components/Locations.jsx` - Fixed image path to use BASE_URL
3. `src/components/monsters/Monster.jsx` - Fixed image path to use BASE_URL
4. `src/main.jsx` - Added dynamic favicon path setting

## Deployment Status

- ✅ Build successful with all assets in correct locations
- ✅ Data folder present in dist/data/
- ✅ All 251 monster images in dist/assets/
- ✅ Base path correctly set to `/dnd-tools-react` in generated HTML
- ✅ React Router configured with correct basename

## Next Steps

1. Deploy to GitHub Pages using `npm run deploy`
2. Test navigation from home page to all sub-routes
3. Verify no 404 errors occur when loading data or images
4. Test image modals for both monsters and locations

## Technical Notes

- `import.meta.env.BASE_URL` is automatically set by Vite based on the `base` config in vite.config.js
- React Router's `basename` prop handles route prefixing for GitHub Pages subdirectories
- Dynamic favicon setting in main.jsx avoids the need to modify index.html template
- `import.meta.glob()` uses relative paths at build time, which is resolved correctly
