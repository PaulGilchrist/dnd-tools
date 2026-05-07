# D&D Tools — Architecture Document

> **Generated:** 2026-05-07
> **Repository:** https://github.com/PaulGilchrist/dnd-tools.git
> **Tech Stack:** React 19 · React Router DOM 7 · Bootstrap 5 · Vite 8 · Vitest 4 · DOMPurify 3

---

## 1. High-Level Overview

D&D Tools is a client-side single-page application (SPA) that provides a comprehensive reference toolkit for Dungeons & Dragons players and Dungeon Masters. The application serves as a browser-based companion tool, delivering searchable, filterable, and bookmarkable access to game data including spells, monsters, magic items, equipment, rules, and more.

The application is deployed as a static site on GitHub Pages (`/dnd-tools/` subpath). All game data is delivered as static JSON files served from the `public/data/` directory. There is no backend server — the entire application runs in the browser.

**Key characteristics:**
- **Rule-version aware:** Supports both 5e (2014 PHB) and 2024 (One D&D) rule sets, with user preference persisted in `localStorage`.
- **Data-driven:** UI components render from JSON data files; no hardcoded game content.
- **Client-side caching:** Data is fetched once and cached in memory for the session.
- **Lazy-loaded routes:** Route components are code-split via `React.lazy()` for performance.
- **Bookmarkable/filterable:** User preferences (filters, bookmarks, known/prepared spells) persist in `localStorage`.

---

## 2. Directory Structure

```
dnd-tools/
├── public/                          # Static assets served as-is
│   ├── 404.html                     # SPA redirect helper for GitHub Pages
│   ├── favicon.svg                  # Purple d20 favicon
│   ├── icons.svg                    # Icon sprite sheet (social links)
│   └── data/                      # 33 JSON data files (5e + 2024)
│       ├── ability-scores.json
│       ├── actions.json
│       ├── alignments.json
│       ├── classes.json
│       ├── conditions.json
│       ├── environments.json
│       ├── equipment.json
│       ├── feats.json
│       ├── fighting-styles.json
│       ├── languages.json
│       ├── locations.json
│       ├── magic-items.json
│       ├── monster-types.json
│       ├── monsters.json
│       ├── names.json
│       ├── passive-skills.json
│       ├── races.json
│       ├── resistances-immunities.json
│       ├── rules.json
│       ├── spells.json
│       ├── weapon-properties.json
│       └── 2024/                  # 2024 rule set data (13 files)
├── src/
│   ├── main.jsx                   # Application entry point
│   ├── App.jsx                    # Route definitions + lazy loading
│   ├── App.css                    # Global app styles
│   ├── index.css                  # Base styles
│   ├── config/
│   │   └── navRoutes.js           # Navigation configuration (routes + dropdowns)
│   ├── context/
│   │   └── RuleVersionContext.jsx  # Global rule version state (5e/2024)
│   ├── data/
│   │   ├── dataService.js         # Barrel export (cache, hooks, utils)
│   │   ├── dataServiceCore.js     # In-memory cache + fetchAndCache()
│   │   ├── dataServiceHooks.js    # 20+ data-fetching hooks
│   │   ├── dataServiceUtils.js    # getBaseUrl(), sort(), handleError()
│   │   └── utils.js               # scrollIntoView() helper
│   ├── hooks/
│   │   ├── useMonsterBookmarks.js  # Monster bookmark management
│   │   ├── useMonsterFilter.js     # Version-aware monster filtering
│   │   ├── usePlayerClassLogic.js  # Class level/subclass logic
│   │   ├── useRouteInfo.js         # Navigation route info
│   │   ├── useSpellFilter.js       # Spell filtering logic
│   │   ├── useSpellPersistence.js  # Known/prepared spell persistence
│   │   └── useVersionedData.js     # Version-aware data fetching
│   ├── utils/
│   │   ├── htmlUtils.js           # DOMPurify-sanitized HTML rendering
│   │   ├── localStorage.js        # Centralized storage keys + helpers
│   │   ├── monsterGrouping.js     # Hierarchical monster grouping (2024)
│   │   ├── monsterUtils.js        # Name parsing, CR parsing
│   │   ├── raceUtils.js           # 2024 race ability/languages
│   │   └── spellUtils.js          # Spell class/level text helpers
│   ├── assets/                    # Images (monsters, locations, icons)
│   ├── test/
│   │   └── setup.js               # Vitest test setup
│   └── components/
│       ├── NavTop.jsx + .css      # Top navigation bar
│       ├── Locations.jsx + .css   # Location browser
│       ├── adapters/              # Data normalization (3 adapters)
│       ├── common/                # Shared UI components (16 files)
│       ├── equipment-items/       # Equipment browser (8 files)
│       ├── magic-items/           # Magic items browser (8 files)
│       ├── monsters/              # Monster tools (22 files)
│       ├── names/                 # Name generator (5 files)
│       ├── rules/                 # Rules reference (30 files)
│       ├── spells/                # Spell browser (4 files)
│       └── 2024/                  # 2024-only features (60+ files)
├── vite.config.js                 # Vite build configuration
├── vitest.config.js               # Vitest test configuration
├── eslint.config.js               # ESLint flat config
├── index.html                     # SPA entry HTML + redirect handling
├── package.json                   # Dependencies and scripts
└── README.md                      # Project documentation
```

---

## 3. Module-by-Module Breakdown

### 3.1 Entry Points

**`src/main.jsx`** — Bootstrap entry point. Imports Bootstrap CSS/JS, renders `<App />` inside `<StrictMode>`. Dynamically sets the favicon path based on the Vite base URL.

**`src/App.jsx`** — Application root. Defines all 30 routes using `React.lazy()` + `Suspense` for code splitting. Wraps all routes in `RuleVersionProvider` and `BrowserRouter` (with `basename` for GitHub Pages subpath). Root `/` redirects to `/spells`.

### 3.2 Routing Layer

**`src/config/navRoutes.js`** — Declarative navigation configuration. Defines the top navigation bar structure as an array of link/dropdown objects. Supports `requiredVersion` property for version-aware filtering (e.g., Backgrounds and Weapon Mastery only show in 2024).

**`src/hooks/useRouteInfo.js`** — Hook that processes `navRoutes` with the current rule version, filters dropdown items, and determines active states based on `useLocation()`.

### 3.3 State Management

**`src/context/RuleVersionContext.jsx`** — Global React Context for rule version selection (5e vs 2024). Persists the selected version in `localStorage` under key `ruleVersion`. Default: `'5e'`.

**`src/utils/localStorage.js`** — Centralized localStorage management:
- `LOCAL_STORAGE_KEYS` constant object defining all storage keys (20+ keys for filters, bookmarks, known/prepared spells, etc.)
- `getVersionedStorageKey()` — Appends `2024` suffix for versioned keys
- `getVersionedStorageKeys()` — Batch versioning of key maps
- `sanitizeFilter()` — Fills null/undefined filter values with defaults
- `getLocalStorageItem()` / `setLocalStorageItem()` / `removeLocalStorageItem()` — Safe JSON storage with error handling

### 3.4 Data Layer

**`src/data/dataServiceCore.js`** — In-memory caching layer:
- `dataCache` — Object storing loaded data by key
- `loadingPromises` — Object tracking in-flight fetches (prevents duplicate requests)
- `fetchAndCache(key, url)` — Fetches JSON, caches result, deduplicates concurrent requests

**`src/data/dataServiceHooks.js`** — 20+ React hooks for data fetching:
- `useDataCache(key, url)` — Generic hook with loading/error states, early return for cached data
- Individual hooks: `useSpells()`, `useMonsters()`, `useMagicItems()`, `useEquipment()`, `useFeats()`, `useRaces()`, `usePlayerClasses()`, `useConditions()`, `useRules()`, `useLocations()`, `useNames()`, `useMonsterTypes()`, `useWeaponProperties()`, plus 2024 variants

**`src/data/dataServiceUtils.js`** — Utilities: `getBaseUrl()` (reads Vite `BASE_URL`), `sort()`, `handleError()`, `__clearCache()` (test helper).

**`src/data/utils.js`** — `scrollIntoView(index)` — Smooth-scrolls to a card by ID, accounting for the fixed navbar offset (61px).

**`src/hooks/useVersionedData.js`** — Entity map abstraction that resolves the correct cache key and data path based on the current rule version. Supports: spells, monsters, monsterTypes, magicItems, classes, feats, races.

### 3.5 Adapters (Data Normalization)

**`src/components/adapters/monsterAdapters.js`** — Normalizes 5e and 2024 monster JSON into a common shape with ability scores, modifiers, saving throws, skills, actions, traits, reactions, legendary actions, lair actions, senses, speed, immunities, resistances, vulnerabilities, and metadata.

**`src/components/adapters/spellAdapters.js`** — Normalizes 5e and 2024 spell JSON into a common shape (casting time, range, components, duration, classes, subclasses, area of effect, damage, saving throw, status effects, description, higher-level effects).

**`src/components/adapters/magicItemAdapters.js`** — Normalizes 5e and 2024 magic item JSON into a common shape (type, rarity, attunement, subtype, description, plus 2024-specific fields: charge system, spell casting, damage, saving throws, bonuses, advantage/disadvantage, conditions, resistances, immunities, curse, sentience, item slot, usage limit, duration, action types, properties, attunement requirements).

### 3.6 Feature Modules

| Module | Directory | Components | Description |
|--------|-----------|------------|-------------|
| **Spells** | `src/components/spells/` | 4 | Spell browser with filters (name, class, level, casting time, status), known/prepared tracking, URL index handling |
| **Monsters** | `src/components/monsters/` | 22 | Monster search, lore (type grouping), encounter builder (difficulty calc, XP tracking, monster selection with quantity controls) |
| **Magic Items** | `src/components/magic-items/` | 8 | Unified 5e + 2024 magic items browser with filters (name, rarity, type, attunement, bookmarked) |
| **Equipment** | `src/components/equipment-items/` | 8 | Equipment browser with filters (category, property, range, name, bookmarked), category-specific rendering (weapons, armor, tools, etc.) |
| **Rules** | `src/components/rules/` | 30 | General rules search (full-text with sticky header, keyboard nav, match highlighting), ability scores, conditions, feats, races, player classes (all 12 classes with level selectors, subclass systems, spellcasting) |
| **Names** | `src/components/names/` | 5 | Name generator with race/building selection, sex filter, used/available tracking, dual table display |
| **Locations** | `src/components/Locations.jsx` | 1 | Location browser with images |
| **2024** | `src/components/2024/` | 60+ | 2024 rule set components: backgrounds, weapon mastery, plus 5e equivalents with 2024 data support |

### 3.7 Shared Components

**`src/components/common/`** (16 files):
- `MonsterCard.jsx` — Full monster card with image modal, stats, ability scores, defenses, actions, reactions, legendary actions, lair actions, regional effects, description
- `MonsterStats.jsx` — AC, HP, hit dice, speed (walk/burrow/climb/fly/swim), image button
- `MonsterAbilityScores.jsx` — STR/DEX/CON/INT/WIS/CHA display with modifiers
- `MonsterDefenses.jsx` — Saving throws, skills, senses, immunities, resistances, vulnerabilities, languages, environments, CR, equipment, habitat, treasure
- `MonsterActions.jsx` — Actions, traits, lair actions display (both 5e and 2024 formats)
- `MonsterReactions.jsx` — Reactions with triggers
- `MonsterLegendaryActions.jsx` — Legendary actions display
- `MonsterRegionalEffects.jsx` — Regional effects display
- `SpellCard.jsx` — Expandable spell card with Known/Prepared checkboxes
- `SpellDetails.jsx` — Expanded spell body (casting time, range, components, duration, classes, subclasses, AoE, damage, saving throw, status effects, description, higher-level effects)
- `SpellFilter.jsx` — Filter form (name, class, level range, casting time, status)
- `MagicItemCard.jsx` — Expandable card with bookmark checkbox, 2024-specific section renderers
- `MagicItemSections.jsx` — 16 section renderers (ChargeSystem, SpellCasting, Damage, SavingThrows, Bonuses, AdvantageDisadvantage, Conditions, ResistancesImmunities, Curse, Sentience, ItemSlot, UsageLimit, Duration, ActionTypes, Properties, AttunementRequirements)
- `Cover.css`, `Trait.css`, `Subrace.css` — Shared styles

### 3.8 Build & Configuration

**`vite.config.js`** — React plugin, `/dnd-tools/` base path, custom asset output (JS hashed, images keep original names for faster deployments), output to `dist/`.

**`vitest.config.js`** — jsdom environment, V8 coverage, test glob `src/**/*.{test,spec}.{js,jsx}`.

**`eslint.config.js`** — Flat config: `no-unused-vars` (ignores `^[A-Z_]`), `no-console` (allows warn/error), `prefer-const`, `max-lines: 300`, `max-lines-per-function: 200`, React rules (no array index keys, prop-types off).

**`index.html`** — SPA entry with inline JS for `sessionStorage.redirect` handling (SPA rewrites for GitHub Pages).

**`public/404.html`** — SPA redirect helper that saves the requested path to `sessionStorage` for client-side routing.

---

## 4. Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  User Interaction (React components)                                 │
│  - Filters, bookmarks, rule version toggle, spell known/prepared     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  State Management                                                   │
│  ┌──────────────────┐  ┌──────────────────────┐                    │
│  │ RuleVersionCtx   │  │ localStorage          │                    │
│  │ (5e/2024)        │  │ - filters             │                    │
│  └──────────────────┘  │ - bookmarks           │                    │
│                         │ - known/prepared      │                    │
│                         └──────────────────────┘                    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Data Fetching Layer                                                │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ useDataCache │  │ fetchAndCache()  │  │ dataCache (in-memory)│  │
│  │ (React hook) │→ │ (dedup + cache)  │→ │ (session-scoped)     │  │
│  └──────────────┘  └──────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Static JSON Data (public/data/)                                    │
│  - 5e data: 20 JSON files (spells, monsters, classes, etc.)         │
│  - 2024 data: 13 JSON files (spells, monsters, classes, etc.)       │
│  - Images: 200+ monster images, 7 location images (unhashed)        │
└─────────────────────────────────────────────────────────────────────┘
```

**Data lifecycle:**
1. Component mounts → calls a data hook (e.g., `useSpells()`)
2. Hook calls `fetchAndCache(key, url)` with the data key and relative URL
3. `fetchAndCache` checks `dataCache` (return cached) or `loadingPromises` (deduplicate concurrent requests)
4. If new, fetches JSON from `public/data/`, stores in `dataCache`, returns result
5. Component renders with the data

**User persistence lifecycle:**
1. User interacts (sets filter, bookmarks monster, marks spell known)
2. Hook writes to `localStorage` using versioned keys (e.g., `spellsKnown2024`)
3. On next visit, hooks read from `localStorage` and restore state

---

## 5. Dependency Graph (Textual)

```
main.jsx
  └── App.jsx
        ├── RuleVersionProvider (context)
        │     └── RuleVersionContext (global state: 5e/2024)
        ├── BrowserRouter (React Router)
        │     └── NavTop (navigation bar)
        │           └── useRouteInfo (navRoutes config + location)
        │                 └── navRoutes.js (declarative nav config)
        │
        └── Routes (30 lazy-loaded route components)
              │
              ├── Spells
              │     ├── useSpells() → useDataCache() → fetchAndCache()
              │     ├── useSpellFilter() (filtering logic)
              │     ├── useSpellPersistence() (localStorage: known/prepared)
              │     └── SpellCard → SpellDetails
              │
              ├── MonsterSearch
              │     ├── useMonsters() → useDataCache()
              │     ├── useMonsterFilter() (version-aware filtering)
              │     ├── useMonsterBookmarks() (localStorage bookmarks)
              │     └── MonsterCard → MonsterStats → MonsterAbilityScores
              │                                    → MonsterDefenses
              │                                    → MonsterActions
              │                                    → MonsterReactions
              │                                    → MonsterLegendaryActions
              │                                    → MonsterRegionalEffects
              │
              ├── MonsterLore
              │     ├── useMonsters() + useMonsterTypes()
              │     └── monsterGrouping.js (hierarchical grouping for 2024)
              │
              ├── Encounters
              │     ├── useMonsters() + useMonsterTypes()
              │     └── Encounter builder (difficulty calc, XP tracking)
              │
              ├── MagicItems
              │     ├── useMagicItems() + use2024MagicItems()
              │     └── normalizeMagicItem5e()/normalizeMagicItem2024()
              │
              ├── EquipmentItems
              │     ├── useEquipment()
              │     └── Category-specific rendering
              │
              ├── Rules (General, Ability Scores, Classes, Conditions, Feats, Races)
              │     ├── useRules(), useAbilityScores(), usePlayerClasses(), etc.
              │     ├── useVersionedData() (entity map for versioned fetching)
              │     └── PlayerClassLevels (all 12 class stat components)
              │
              ├── Names
              │     └── useNames()
              │
              ├── Locations
              │     └── useLocations()
              │
              └── 2024 Components (Backgrounds, Weapon Mastery)
                    └── use2024Backgrounds(), useWeaponMastery2024()
```

**Cross-cutting dependencies:**
- All data hooks depend on `dataServiceCore.js` (cache + fetch)
- All adapters depend on `htmlUtils.js` (DOMPurify rendering)
- All persistence hooks depend on `localStorage.js` (keys + helpers)
- `RuleVersionContext` is consumed by `useVersionedData`, `useMonsterFilter`, `useSpellPersistence`, `useMonsterBookmarks`, `useRouteInfo`

---

## 6. Architectural Patterns

### 6.1 Feature-Based Module Organization
Components are organized by feature domain (spells, monsters, magic-items, equipment, rules, names, locations, 2024) rather than by technical role. Each feature directory contains its own list, filter, and item components.

### 6.2 Adapter Pattern (Data Normalization)
Three adapter modules (`monsterAdapters.js`, `spellAdapters.js`, `magicItemAdapters.js`) normalize version-specific JSON data into a common shape. This allows UI components to work with a single data structure regardless of the active rule version.

### 6.3 Hook-Based State Management
Custom React hooks encapsulate all application logic:
- **Data hooks** (`useDataCache`, 20+ individual hooks) — data fetching with caching
- **Business logic hooks** (`useMonsterFilter`, `useSpellFilter`, `usePlayerClassLogic`) — filtering, class logic
- **Persistence hooks** (`useSpellPersistence`, `useMonsterBookmarks`) — localStorage state
- **Navigation hooks** (`useRouteInfo`) — navigation state

### 6.4 Entity Map Abstraction
`useVersionedData()` uses a typed entity map to resolve the correct cache key and data path based on the current rule version. This provides type safety and prevents invalid version/entity combinations.

### 6.5 Barrel Exports
`dataService.js` acts as a single import point for all data-layer exports (cache, hooks, utilities), simplifying imports across the codebase.

### 6.6 Lazy Route Loading
All route components are lazy-loaded via `React.lazy()` with `Suspense` fallback, enabling code splitting and reduced initial bundle size.

---

## 7. Key Architectural Decisions

### ADR-001: Static JSON Data (No Backend)
**Decision:** All game data is delivered as static JSON files served from the `public/data/` directory. There is no API server or database.

**Rationale:** The application is a reference tool meant to be fast and self-contained. Static JSON files enable:
- Zero server costs (GitHub Pages)
- Instant data loading (cached in memory after first fetch)
- Full offline capability (data bundled with the app)
- Simple versioning (JSON files can be updated independently)

**Trade-offs:** No real-time data updates; data changes require a full redeployment.

### ADR-002: In-Memory Caching with Deduplication
**Decision:** Data is cached in a global `dataCache` object with concurrent request deduplication via `loadingPromises`.

**Rationale:** Prevents redundant fetches within a session and avoids race conditions from concurrent requests for the same data. The cache is session-scoped (cleared on page reload), which is appropriate for a reference tool.

**Trade-offs:** No persistence across page reloads; data must be re-fetched on each visit.

### ADR-003: Dual Rule Set Support (5e + 2024)
**Decision:** The application supports both 5e (2014 PHB) and 2024 (One D&D) rule sets, with user preference persisted in `localStorage`.

**Rationale:** D&D has two active rule sets simultaneously. The application provides value to users of both by:
- Using adapters to normalize version-specific data into common shapes
- Using `useVersionedData()` to resolve the correct data source based on the active rule version
- Using versioned localStorage keys for user preferences

**Trade-offs:** Increased component complexity (each feature must handle both data shapes); some 2024 features have no 5e equivalent (Backgrounds, Weapon Mastery).

### ADR-004: DOMPurify for HTML Rendering
**Decision:** All HTML content from JSON data is sanitized through DOMPurify before rendering via `dangerouslySetInnerHTML`.

**Rationale:** D&D JSON data contains HTML-formatted descriptions. DOMPurify allows safe rendering of expected tags (b, i, em, strong, br, hr, ul, ol, li, span, div, mark, small, a, h5, h6, p, table elements) while blocking XSS vectors.

**Trade-offs:** Requires maintaining an explicit allowlist of tags and attributes.

### ADR-005: GitHub Pages Deployment with SPA Routing
**Decision:** The application is deployed to GitHub Pages with a `/dnd-tools/` subpath and custom `404.html` for SPA routing.

**Rationale:** GitHub Pages is free and integrates with the existing Git workflow. The `404.html` + `sessionStorage.redirect` pattern handles client-side routing for direct links and browser refreshes.

**Trade-offs:** No server-side rendering; all routing is client-side.

---

## 8. Known Constraints and Assumptions

1. **Browser-only:** The application runs entirely in the browser. No server-side rendering, no API calls to external services (beyond fetching static JSON).

2. **Session-scoped data cache:** Data is cached in memory for the duration of the session. Page reloads trigger re-fetches.

3. **localStorage limits:** User preferences (filters, bookmarks, known/prepared spells) are stored in `localStorage`. This is subject to browser storage limits (~5-10MB) and is not available in private/incognito modes.

4. **No server-side data validation:** JSON data files are assumed to be valid and well-formed. No runtime schema validation is performed.

5. **Bootstrap dependency:** The application depends on Bootstrap 5 for styling and JavaScript components (modals, dropdowns, etc.).

6. **Image count:** 200+ monster images and 7 location images are bundled with the application. Images are served unhashed for faster deployments but result in larger bundle sizes.

7. **Component size limits:** ESLint enforces `max-lines: 300` and `max-lines-per-function: 200`. Some components (e.g., `MonsterCard.jsx`) approach these limits.

8. **React 19:** The application uses React 19 with concurrent features. Some third-party libraries may need updates for full compatibility.

9. **No TypeScript:** The application uses JavaScript (`.jsx`) exclusively. No type checking is performed at build time.

10. **Data completeness:** The application assumes all referenced entities (monsters, spells, etc.) exist in the JSON data files. Broken references between entities are not validated.

---

## 9. Recommended Future Improvements

### 9.1 Performance
- **Implement virtual scrolling** for monster/spell lists with 200+ items to improve rendering performance
- **Add service worker** for offline support and faster subsequent loads
- **Cache data in IndexedDB** instead of re-fetching on every page reload

### 9.2 Architecture
- **Introduce TypeScript** for type-safe data handling and adapter interfaces
- **Extract a data schema layer** with runtime validation (e.g., Zod schemas for each entity type)
- **Consolidate duplicate filter logic** — many features implement similar filter patterns that could be abstracted

### 9.3 Feature Gaps
- **Cross-reference links** between related entities (e.g., spells that affect monsters, equipment used by classes)
- **Character builder** — combine class, race, equipment, and spells into a full character view
- **Export/import** — allow users to export their character sheets or bookmarked data

### 9.4 Testing
- **Increase test coverage** — many components lack unit tests
- **Add integration tests** for data fetching and rendering pipelines
- **Add E2E tests** for critical user flows (spell lookup, encounter building)

### 9.5 Maintainability
- **Reduce component duplication** — many 2024 components mirror 5e components with minor data differences; a shared component with version-aware props could reduce code by ~40%
- **Document the adapter contracts** — each adapter normalizes to a specific shape; documenting these shapes would help new contributors
- **Add lint rules** for `max-depth` and `complexity` to prevent the growing complexity in components like `MonsterCard.jsx`

---

*Document generated: 2026-05-07*
*Source: https://github.com/PaulGilchrist/dnd-tools*
