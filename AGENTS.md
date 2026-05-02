# D&D Tools — Agent Instructions

## Stack

React 19 + Vite 8 + Bootstrap 5, vanilla JS/JSX (no TypeScript). Tests use Vitest + jsdom + @testing-library.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Dev server (Vite) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run tests (watch mode) |
| `npm run test:run` | Run tests once (CI) |
| `npm run test:watch` | Explicit watch mode |
| `npm run test:coverage` | Tests + v8 coverage → `coverage/` |
| `npm run lint` | ESLint 9, flat config |
| `npm run deploy` | Deploy `dist/` to GitHub Pages via `gh-pages` |

No type-checking command exists — this is a plain JS/JSX project.

## Architecture

- **Two parallel rule versions**: 5e and 2024 Essentials. The `RuleVersionContext` provider manages which version is active; pages and components branch on this to load the correct data and sub-components.
- **Routing**: `App.jsx` defines all routes. Root `/` redirects to `/spells`. 2024 routes are prefixed `/2024/` with short-slug redirects (e.g. `/2024/classes` → `/2024/rules/classes`).
- **Component directories**: `src/components/` contains 5e components. `src/components/2024/` mirrors the structure for 2024-specific components (spells, monsters, magic-items, rules, feats).
- **Shared components**: `src/components/common/` has version-agnostic UI (MonsterCard, SpellCard, MagicItemCard, etc.). `src/components/adapters/` normalizes 5e/2024 data differences so shared components work with either version.
- **Data**: Static JSON in `public/data/` (5e) and `public/data/2024/` (2024). Lazily loaded via hooks in `src/data/dataService.js` with a module-level cache. The module also exports a `DataService` class for non-React usage.
- **Persistence**: All user state (filters, bookmarks, spell lists) stored in `localStorage` via utilities in `src/utils/localStorage.js`.

## Testing

- Vitest config: `vitest.config.js` — jsdom environment, globals enabled, setup file at `src/test/setup.js` (imports `@testing-library/jest-dom`).
- Tests are co-located or in `src/**/*.test.{js,jsx}` — ~48 test files across components, hooks, utils, and data layers.
- To run a single test: `npx vitest run src/path/to/file.test.jsx`

## Deployment

- Built for GitHub Pages at `https://PaulGilchrist.github.io/dnd-tools/`. Vite `base` is set to `/dnd-tools/` in `vite.config.js`.
- Image assets in the build output are NOT hashed (to enable fast deployments). All other assets use standard `[name].[ext]` naming.
- Deploy with `npm run deploy` — uses `gh-pages` package to push `dist/` to the `gh-pages` branch.

## Gitignore

`dist/`, `node_modules/`, `coverage/`, `.DS_Store`, and Vite plugin cache files are ignored.
