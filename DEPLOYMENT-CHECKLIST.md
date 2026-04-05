# Deployment Checklist for GitHub Pages

## Pre-Deployment Verification ✅

### Build Output
- [x] `dist/` folder contains all required files
- [x] `dist/data/` has 15 JSON files (ability-scores, classes, conditions, etc.)
- [x] `dist/assets/` has 251 monster images
- [x] `dist/favicon.svg` and `dist/icons.svg` present
- [x] `dist/index.html` has correct base path `/dnd-tools-react/assets/...`

### Code Changes
- [x] `vite.config.js` has `copyPublicDir: true`
- [x] `src/components/Locations.jsx` uses BASE_URL for image paths
- [x] `src/components/monsters/Monster.jsx` uses BASE_URL for image paths
- [x] `src/main.jsx` dynamically sets favicon path

### Configuration
- [x] `package.json.homepage` = `"https://PaulGilchrist.github.io/dnd-tools-react/"`
- [x] React Router `basename` = `/dnd-tools-react`

## Deployment Steps

1. **Run Build**
   ```bash
   npm run build
   ```

2. **Verify Build Output**
   ```bash
   ls dist/
   # Should show: assets/, data/, favicon.svg, icons.svg, index.html
   
   cat dist/index.html
   # Should show: src="/dnd-tools-react/assets/..." and href="/dnd-tools-react/assets/..."
   ```

3. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

4. **Monitor Deployment Progress**
   - Watch for batch deployment messages
   - Ensure all batches complete successfully

## Post-Deployment Testing

### Navigation Tests
1. Navigate to `/spells` - Should load without errors
2. Navigate to `/monsters/search` - Should load monster data successfully  
3. Navigate to `/locations` - Should load location data and images
4. Click on monster image modal - Should display full-size image
5. Click on location map image - Should display full-size map

### Data Loading Tests
1. Check browser console for any 404 errors when loading JSON files
2. Verify all spell/monster/location data loads correctly
3. Confirm no "Failed to load resource" errors in Network tab

### Expected URLs on GitHub Pages
- Home: `https://PaulGilchrist.github.io/dnd-tools-react/` → redirects to `/spells`
- Spells: `https://PaulGilchrist.github.io/dnd-tools-react/spells`
- Monsters Search: `https://PaulGilchrist.github.io/dnd-tools-react/monsters/search`
- Locations: `https://PaulGilchrist.github.io/dnd-tools-react/locations`

### Resource URLs (should all work)
- Data: `https://PaulGilchrist.github.io/dnd-tools-react/data/spells.json`
- Images: `https://PaulGilchrist.github.io/dnd-tools-react/assets/monsters/tarrasque.jpg`
- Location Maps: `https://PaulGilchrist.github.io/dnd-tools-react/assets/locations/baldurs-gate-map-player.jpg`

## Troubleshooting

### If 404 errors occur:
1. Check that `dist/` folder exists with all files
2. Verify `BASE_URL` is being set correctly in components
3. Check browser console for specific missing resource paths
4. Ensure GitHub Pages is serving from `gh-pages` branch

### If images don't load:
1. Verify monster images exist in `dist/assets/`
2. Check that image paths use `${BASE_URL}assets/monsters/...` format
3. Confirm `import.meta.glob()` is resolving correctly

### If data doesn't load:
1. Verify JSON files exist in `dist/data/`
2. Check that dataService uses `${BASE_URL}data/...` paths
3. Ensure `copyPublicDir: true` in vite.config.js

## Success Criteria

✅ All pages load without 404 errors
✅ Monster data loads successfully  
✅ Location data and images load correctly
✅ Spell data loads without errors
✅ Image modals work for both monsters and locations
✅ Navigation between all routes works smoothly
