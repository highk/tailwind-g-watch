# Tailwind CSS v4 Plan

`tailwind-g-watch` currently supports Tailwind CSS v3. The v3 behavior is covered by
`npm run test:build:v3`.

Tailwind CSS v4 needs a separate migration path because the current build code uses
v3-specific PostCSS integration, including `tailwindcss/nesting/index.js`. With
Tailwind v4 installed, that subpath is not exported and the CLI fails before the
build smoke test can run.

## Current v3 Baseline

- `tailwindcss` is pinned through the v3 dependency range.
- The smoke fixture uses `@tailwind utilities;`.
- The build function creates the Tailwind PostCSS plugin through `require("tailwindcss")`.
- Default plugins are merged through the existing JavaScript Tailwind config path.

## v4 Migration Work

- Replace the v3 `tailwindcss/nesting/index.js` dependency with a v4-compatible
  nesting approach.
- Use the Tailwind v4 PostCSS integration package, `@tailwindcss/postcss`.
- Add a separate v4 fixture using the v4 CSS entrypoint, `@import "tailwindcss";`.
- Keep the v3 smoke test in place until v4 support is proven.
- Decide whether v3 and v4 are supported in the same major release or split by
  major version.

## Acceptance Criteria

- `npm run test:build:v3` continues to pass.
- A new `npm run test:build:v4` passes against a Tailwind v4 fixture.
- CI output identifies v3 and v4 failures separately.
- The README states the supported Tailwind major versions without ambiguity.
