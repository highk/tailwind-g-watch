# Tailwind CSS v4 Plan

`tailwind-g-watch` supports Tailwind CSS v3 and has a separate Tailwind CSS v4
build path for v4 CSS entrypoints. The v3 behavior is covered by
`npm run test:build:v3`; the v4 behavior is covered by `npm run test:build:v4`.

Tailwind CSS v4 needs a separate path because the v3 build code uses v3-specific
PostCSS integration, including `tailwindcss/nesting/index.js`. Tailwind v4 uses
`@tailwindcss/postcss` and v4 CSS entrypoints such as `@import "tailwindcss";`.

## Current v3 Baseline

- `tailwindcss` is pinned through the v3 dependency range.
- The smoke fixture uses `@tailwind utilities;`.
- The build function creates the Tailwind PostCSS plugin through `require("tailwindcss")`.
- Default plugins are merged through the existing JavaScript Tailwind config path.

## v4 Build Path

- v4 entrypoints are detected by `@import "tailwindcss";`.
- v4 builds use the Tailwind v4 PostCSS integration package,
  `@tailwindcss/postcss`.
- v4 builds require Node.js 20 or newer.
- v4 projects must have Tailwind CSS v4 resolvable from the project root.
- The v3 smoke test remains in place so v3 support does not regress.
- The v4 smoke test uses a separate fixture and verifies generated utility CSS.

## Acceptance Criteria

- `npm run test:build:v3` continues to pass.
- `npm run test:build:v4` passes against a Tailwind v4 fixture.
- CI output identifies v3 and v4 failures separately.
- The README states the supported Tailwind major versions without ambiguity.
