import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import * as sass from 'sass';
import postcss, { type Rule } from 'postcss';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..');

let cachedCss: string | null = null;

/**
 * Compile the whole library SCSS entrypoint to a CSS string. The result is
 * cached for the lifetime of the test process because the compile is the single
 * most expensive thing the CSS-compliance suite does and the output never
 * changes within a run.
 */
export function compiledCss(): string {
  if (cachedCss === null) {
    const result = sass.compile(resolve(repoRoot, 'sass', 'materialize.scss'), {
      loadPaths: [repoRoot],
      style: 'expanded'
    });
    cachedCss = result.css;
  }

  return cachedCss;
}

/**
 * Compile an arbitrary SCSS snippet (with the repo root on the load path so
 * `@use '../..'` style imports resolve). Useful for testing a single partial in
 * isolation.
 */
export function compileSnippet(scss: string): string {
  return sass.compileString(scss, { loadPaths: [repoRoot], style: 'expanded' }).css;
}

let cachedRoot: postcss.Root | null = null;

function root(): postcss.Root {
  if (cachedRoot === null) {
    cachedRoot = postcss.parse(compiledCss());
  }

  return cachedRoot;
}

/** Every rule whose selector list contains a selector matching `re`. */
export function rulesMatching(re: RegExp): Rule[] {
  const out: Rule[] = [];
  root().walkRules((rule) => {
    if (re.test(rule.selector)) out.push(rule);
  });

  return out;
}

/**
 * Collect every declaration value for `prop` across all rules whose selector
 * text matches `selectorRe`. Returns the list of values seen (in source order).
 */
export function declValues(selectorRe: RegExp, prop: string): string[] {
  const values: string[] = [];
  for (const rule of rulesMatching(selectorRe)) {
    rule.walkDecls(prop, (d) => {
      values.push(d.value);
    });
  }

  return values;
}

/**
 * True when some rule whose selector matches `selectorRe` declares `prop` with a
 * value matching `valueRe`.
 */
export function hasDecl(selectorRe: RegExp, prop: string, valueRe: RegExp): boolean {
  return declValues(selectorRe, prop).some((v) => valueRe.test(v));
}

/** True when any rule selector matches `selectorRe`. */
export function hasSelector(selectorRe: RegExp): boolean {
  return rulesMatching(selectorRe).length > 0;
}

/**
 * Flatten every declaration inside rules matching `selectorRe` into a single
 * "prop: value; ..." string. Handy for coarse substring assertions.
 */
export function declText(selectorRe: RegExp): string {
  return rulesMatching(selectorRe)
    .flatMap((rule) => {
      const decls: string[] = [];
      rule.walkDecls((d) => {
        decls.push(`${d.prop}: ${d.value}`);
      });

      return decls;
    })
    .join('; ');
}
