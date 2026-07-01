import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import * as sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

const packageJson = JSON.parse(readFileSync('./package.json').toString());
const version = packageJson.version;

const bannerText = `/*!
* Materialize v${version} (https://materializeweb.com)
* Copyright 2014-${new Date().getFullYear()} Materialize
* MIT License (https://raw.githubusercontent.com/materializecss/materialize/master/LICENSE)
*/`;

const outDir = 'dist/css';
// Sourcemaps are emitted for local builds but omitted from release artifacts,
// matching the previous rollup-plugin-scss behaviour.
const isRelease = process.argv.includes('--release');

mkdirSync(outDir, { recursive: true });

interface BuildCssOptions {
  compressed?: boolean;
  sourceMap?: boolean;
}

/**
 * Compile one SCSS entry, run it through autoprefixer, prepend the banner and
 * write the result (plus an optional external sourcemap).
 */
async function buildCss(
  entry: string,
  fileName: string,
  { compressed = false, sourceMap = false }: BuildCssOptions = {}
): Promise<void> {
  const compiled = sass.compile(entry, {
    style: compressed ? 'compressed' : 'expanded',
    sourceMap
  });

  const outFile = `${outDir}/${fileName}`;
  const processed = await postcss([autoprefixer]).process(compiled.css, {
    from: entry,
    to: outFile,
    map: sourceMap
      ? { inline: false, annotation: `${fileName}.map`, prev: compiled.sourceMap }
      : false
  });

  writeFileSync(outFile, `${bannerText}\n${processed.css}`);
  if (processed.map) writeFileSync(`${outFile}.map`, processed.map.toString());

  console.log(`created ${outFile}`);
}

await buildCss('sass/materialize.scss', 'materialize.css');
await buildCss('sass/materialize.scss', 'materialize.min.css', {
  compressed: true,
  sourceMap: !isRelease
});
await buildCss('sass/_colors.scss', 'materialize.colors.min.css', { compressed: true });
