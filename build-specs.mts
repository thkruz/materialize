// Transpiles the TypeScript Jasmine specs (and their shared helper) to the
// `.js` files that jasmine-browser-runner loads (see jasmine.json). Run
// automatically before `npm test` via the `pretest` script.
//
// `bundle: false` keeps each file independent — the specs carry no imports and
// run against the built global `M` bundle plus the globals defined in
// spec/helper.ts — so this is a pure type-strip that preserves the classic
// (non-module) script shape the runner expects. Emitted `.js` are gitignored.
import { build } from 'esbuild';

await build({
  entryPoints: ['components/**/*Spec.ts', 'spec/*Spec.ts', 'spec/helper.ts'],
  outdir: '.',
  outbase: '.',
  outExtension: { '.js': '.js' },
  bundle: false,
  sourcemap: false,
  logLevel: 'warning'
});

console.log('transpiled specs to .js');
