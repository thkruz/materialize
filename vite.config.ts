import type { Plugin } from 'vite';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { readFileSync, writeFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('./package.json').toString());
const version = packageJson.version;

const bannerText = `/*!
* Materialize v${version} (https://materializeweb.com)
* Copyright 2014-${new Date().getFullYear()} Materialize
* MIT License (https://raw.githubusercontent.com/materializecss/materialize/master/LICENSE)
*/`;

// Prepend the banner to an already-written file. Used for the minified IIFE
// bundle, where the minifier strips the `/*!` legal comment that Rollup's
// `output.banner` would otherwise add.
const prependBanner = (fileName: string): Plugin => ({
  name: 'prepend-banner',
  writeBundle(options) {
    const outFile = `${options.dir}/${fileName}`;
    const contents = readFileSync(outFile, 'utf8');
    if (!contents.startsWith('/*!')) writeFileSync(outFile, `${bannerText}\n${contents}`);
  }
});

// Inject the package.json version into src/index.ts at build time, replacing the
// `__MZ_VERSION__` placeholder. This keeps the version out of the tracked source.
const injectVersion = (): Plugin => ({
  name: 'inject-version',
  transform(code, id) {
    if (!id.replace(/\\/g, '/').endsWith('src/index.ts')) return null;
    return { code: code.replace(/__MZ_VERSION__/g, version), map: null };
  }
});

// Map each library format to its published filename (referenced by package.json
// `main`/`module`/`exports`).
const jsFileName = (format: string): string => {
  switch (format) {
    case 'es':
      return 'materialize.mjs';
    case 'cjs':
      return 'materialize.cjs.js';
    default:
      return 'materialize.js';
  }
};

// The build runs in two passes so the IIFE bundle ships in both readable and
// minified form (Vite cannot vary minification per-format in a single pass):
//   - default : es + cjs + iife (unminified) + bundled .d.ts
//   - --mode min : iife only -> materialize.min.js (minified)
export default defineConfig(({ mode }) => {
  const isMin = mode === 'min';

  return {
    // No index.html / public assets to serve for a library build.
    publicDir: false,
    // Resolve TypeScript sources first. Vite's default extension order would
    // resolve a `.mjs`/`.js` sibling ahead of the canonical `.ts`; the codebase
    // is now TypeScript-only, but keeping `.ts` first is a cheap safeguard.
    resolve: {
      extensions: ['.ts', '.tsx', '.mts', '.mjs', '.js', '.jsx', '.json']
    },
    plugins: [
      injectVersion(),
      // The minifier drops the banner comment, so re-add it after writing.
      ...(isMin ? [prependBanner('materialize.min.js')] : []),
      // Types only need to be emitted once (skip on the minify-only pass).
      ...(isMin
        ? []
        : [
            dts({
              bundleTypes: true,
              include: ['src', 'components']
            })
          ])
    ],
    build: {
      outDir: 'dist/js',
      // The default pass owns cleaning; the min pass must preserve its output.
      emptyOutDir: !isMin,
      copyPublicDir: false,
      minify: isMin ? 'esbuild' : false,
      lib: {
        entry: 'src/index.ts',
        name: 'M',
        formats: isMin ? ['iife'] : ['es', 'cjs', 'iife'],
        fileName: (format) => (isMin ? 'materialize.min.js' : jsFileName(format))
      },
      rollupOptions: {
        output: { banner: bannerText }
      }
    }
  };
});
