---
description: Ensure complete test coverage by detecting missing tests, fixing failures, and raising coverage ≥85%
subtask: true
---

# PHASE 1 — Detect files with NO tests
1. Scan all files under `src/` with extensions: .ts, .tsx, .js, .jsx.
2. For each file, check whether a matching test file exists using the naming pattern:
      <name>.test.tsx
      <name>.test.ts
3. Produce a list of all source files that have no corresponding test file.

# For each missing-test file:
4. Open the source file and analyze its public API (exports, props, functions).
5. Create a new test file next to it using the naming convention `<name>.test.tsx`.
6. Use the project's existing testing conventions:
      - @testing-library/react for components
      - renderHook() for hooks
      - direct invocation for pure functions
7. Generate baseline tests covering all public behavior.
8. After generating each test file, run `npm run test:run` to ensure no failures.

# PHASE 2 — Fix failing tests
9. Run: `npm run test:run`
10. For each failing test:
      - Read the failure output
      - Inspect both the test and implementation
      - Determine whether the test or implementation is wrong
      - Apply the minimal fix (do NOT comment out tests)
11. Re-run tests until all pass.

# PHASE 3 — Raise coverage to ≥85%
12. Run: `npm run test:coverage`
13. Parse the coverage report and identify all files under `src/` below 85%.
14. For each low-coverage file:
      - Run targeted coverage:
            npx vitest run --coverage src/path/to/file.tsx
      - Inspect uncovered lines and branches
      - Add tests that exercise those paths
      - Re-run coverage until the file reaches ≥85%

# PHASE 4 — Final verification
15. Run: `npm run test:coverage`
16. Confirm:
      - All tests pass
      - No file under src/ is below 85%
      - No missing-test files remain
      - No flaky tests remain

# RULES
- NEVER CHANGE PRODUCTION CODE WHEN WRITING TESTS.  Test much match codes current behavior when written.
- Never GIT commit any code when writing tests
- Always prioritize: missing tests → failing tests → coverage gaps
- Never reduce coverage or remove tests
- Skip CSS-only files and main.jsx
- Skip trivial passthrough files (3–5 LOC)
- Work in small batches (2–5 files)
