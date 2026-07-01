import { defineConfig } from 'vitest/config';

// Vitest config kept separate from the library build config (vite.config.ts) so
// test-only settings never leak into the published bundle.
//
// Two flavours of test live side by side:
//   - CSS-compliance tests: compile the SCSS and assert on the emitted CSS,
//     validating that each component's stylesheet matches the M3 spec
//     (dimensions, corner radii, color roles, state layers, ...). These run in
//     the default `node` environment.
//   - Behavioural tests: exercise the TypeScript component classes in a DOM.
//     These opt into jsdom per-file via the `// @vitest-environment jsdom`
//     pragma at the top of the file.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['components/**/*.test.ts', 'test/**/*.test.ts'],
    css: false
  }
});
