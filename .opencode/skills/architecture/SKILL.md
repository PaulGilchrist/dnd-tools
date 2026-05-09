---
name: architecture
description: >
  When exploring, explaining, or making structural changes to the project,
  to understand the tech stack, folder layout, data layer, server setup,
  and dual-ruleset architecture
---

## Project Overview

D&D Tools is a **client-side SPA** (no backend, no server) that provides searchable, filterable, bookmarkable access to D&D game data (spells, monsters, magic items, equipment, rules). Deployed as static files on GitHub Pages at `/dnd-tools/` subpath.

## Stack

React 19 · React Router DOM 7 · Bootstrap 5 · Vite 8 · Vitest 4 · DOMPurify 3. JavaScript/JSX only (no TypeScript).

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server (HMR) |
| `npm run build` | Production build (`vite build`) |
| `npm run preview` | Preview production build |
| `npm run test` | Vitest interactive mode |
| `npm run test:run` | Vitest single run (CI) |
| `npm run test:coverage` | Vitest with v8 coverage |
| `npm run lint` | ESLint |

## Directory Structure (key paths)

```
src/
  main.jsx              → entry (Bootstrap CSS/JS + App)
  App.jsx               → 30 lazy-loaded routes, RuleVersionProvider, BrowserRouter
  config/navRoutes.js   → declarative nav config (routes + dropdowns, version-aware)
  context/RuleVersionContext.jsx  → global 5e/2024 toggle (persisted in localStorage)
  data/
    dataServiceCore.js  → in-memory cache + fetchAndCache() with deduplication
    dataServiceHooks.js → 20+ hooks: useSpells(), useMonsters(), useMagicItems(), etc.
    dataServiceUtils.js → getBaseUrl(), sort(), handleError(), __clearCache() (test helper)
    utils.js            → scrollIntoView()
  hooks/
    useMonsterBookmarks.js   → monster bookmark management (localStorage)
    useMonsterFilter.js      → version-aware monster filtering
    usePlayerClassLogic.js   → class level/subclass logic
    useRouteInfo.js          → navigation state from navRoutes + location
    useSpellFilter.js        → spell filtering logic
    useSpellPersistence.js   → known/prepared spell persistence (localStorage)
    useVersionedData.js      → entity map: resolves correct cache key by rule version
  utils/
    htmlUtils.js       → DOMPurify-sanitized HTML rendering
    localStorage.js    → centralized storage keys (20+ keys) + helpers
    monsterGrouping.js → hierarchical monster grouping (2024)
    monsterUtils.js    → name/CR parsing
    raceUtils.js       → 2024 race ability/languages
    spellUtils.js      → spell class/level text helpers
  components/
    common/        → shared UI (MonsterCard, SpellCard, MagicItemCard, etc.)
    spells/        → spell browser (4 files)
    monsters/      → monster tools (22 files: search, lore, encounter builder)
    magic-items/   → magic items browser (8 files)
    equipment-items/ → equipment browser (8 files)
    rules/         → rules reference (30 files: classes, feats, races, etc.)
    names/         → name generator (5 files)
    Locations.jsx  → location browser (1 file)
    2024/          → 2024-only features: backgrounds, weapon mastery (60+ files)
```

## Data Layer

- **Static JSON**: `public/data/*.json` (20 files, 5e) + `public/data/2024/*.json` (13 files)
- **Images**: 200+ monster images, 7 location images (unhashed names for faster deploys)
- **In-memory cache**: `dataCache` object + `loadingPromises` for concurrent request deduplication
- **Data flow**: Component → data hook (e.g. `useSpells()`) → `fetchAndCache(key, url)` → cache check → fetch JSON → return
- **User persistence**: filters, bookmarks, known/prepared spells stored in `localStorage` with versioned keys (e.g. `spellsKnown2024`)

## Dual Ruleset (5e + 2024)

- `RuleVersionContext` holds current version (default: `'5e'`), persisted in `localStorage`
- **Adapters** normalize version-specific JSON into common shapes: `monsterAdapters.js`, `spellAdapters.js`, `magicItemAdapters.js`
- `useVersionedData()` resolves correct cache key/data path based on active rule version
- `navRoutes.js` supports `requiredVersion` for version-aware nav filtering
- Some 2024 features have no 5e equivalent (Backgrounds, Weapon Mastery)

## Routing

- 30 routes defined in `App.jsx`, all lazy-loaded via `React.lazy()` + `Suspense`
- Root `/` redirects to `/spells`
- GitHub Pages SPA routing handled by `public/404.html` + `sessionStorage.redirect`
- `basename` set to `/dnd-tools/` for GitHub Pages subpath

## Constraints

- **No backend** — all data is static JSON, no API server
- **Session-scoped cache** — data re-fetched on page reload
- **localStorage limits** — ~5-10MB per origin, not available in incognito
- **ESLint limits** — `max-lines: 300`, `max-lines-per-function: 200`
- **Bootstrap 5 dependency** — styling and JS components (modals, dropdowns)
- **DOMPurify** — all HTML from JSON sanitized before `dangerouslySetInnerHTML`

## Key Patterns

1. **Feature-based organization** — components grouped by domain (spells, monsters, etc.), not technical role
2. **Adapter pattern** — 3 adapters normalize version-specific data to common shapes
3. **Hook-based logic** — all app logic in custom hooks (data, business, persistence, navigation)
4. **Entity map** — `useVersionedData()` prevents invalid version/entity combinations
5. **Barrel exports** — `dataService.js` is single import point for data layer

## ESLint Rules (key ones)

- `no-unused-vars`: ignores `^[A-Z_]` (constants, React components)
- `no-console`: allows `warn` and `error` only
- `prefer-const`, `max-lines: 300`, `max-lines-per-function: 200`
- React: no array index keys, prop-types off

## Guidance

- Always check `RuleVersionContext` before accessing versioned data
- Use existing data hooks from `dataServiceHooks.js` — do not write raw fetch calls
- Adapters normalize data; UI components work with the normalized shape
- When adding a new feature, create hooks in `src/hooks/` and components in the appropriate feature directory
- Follow the `<feature>-2024.js` naming convention for 2024-specific logic in services
- If adding localStorage keys, register them in `localStorage.js` under `LOCAL_STORAGE_KEYS`
- If adding routes, update `navRoutes.js` and `App.jsx` (lazy load the route component)
