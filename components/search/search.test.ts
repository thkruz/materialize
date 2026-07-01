// @vitest-environment node
import { describe, it, expect } from 'vitest';
import postcss from 'postcss';
import { compileSnippet } from '../../test/helpers/sass';

// Compile the search partial in isolation (repo root is on the sass load path,
// so `components/search/search` resolves to `components/search/_search.scss`).
const css = compileSnippet("@use 'components/search/search' as *;");
const root = postcss.parse(css);

/** Collect every value of `prop` declared in rules whose selector matches `selRe`. */
function decls(selRe: RegExp, prop: string): string[] {
  const out: string[] = [];
  root.walkRules((r) => {
    if (selRe.test(r.selector)) r.walkDecls(prop, (d) => { out.push(d.value); });
  });
  return out;
}

/** True when any rule matching `selRe` declares `prop` with a value matching `valRe`. */
function has(selRe: RegExp, prop: string, valRe: RegExp): boolean {
  return decls(selRe, prop).some((v) => valRe.test(v));
}

describe('search partial compiles', () => {
  it('produces non-empty CSS', () => {
    expect(css.trim().length).toBeGreaterThan(0);
  });
});

describe('search bar', () => {
  it('is 56dp tall', () => {
    expect(decls(/^\.search-bar$/, 'height')).toContain('56px');
  });

  it('uses corner `full` (9999px via token)', () => {
    expect(has(/^\.search-bar$/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
  });

  it('uses a surface-container-high container', () => {
    expect(
      has(/^\.search-bar$/, 'background-color', /--md-sys-color-surface-container-high/)
    ).toBe(true);
  });

  it('rests at elevation level 0 and raises to level 1 when active/hovered', () => {
    // Resting state.
    expect(has(/^\.search-bar$/, 'box-shadow', /--md-sys-elevation-level0/)).toBe(true);
    // Active / hover / focus-within raise.
    expect(
      has(/\.search-bar(:hover|\.active|:focus-within)/, 'box-shadow', /--md-sys-elevation-level1/)
    ).toBe(true);
  });

  it('leading icon is 24dp and on-surface-variant', () => {
    expect(decls(/\.search-bar__icon/, 'font-size')).toContain('24px');
    expect(has(/\.search-bar__icon/, 'color', /--md-sys-color-on-surface-variant/)).toBe(true);
  });

  it('input text is body-large and on-surface', () => {
    expect(
      has(/\.search-bar__input/, 'font-size', /--md-sys-typescale-body-large-font-size/)
    ).toBe(true);
    expect(
      has(/\.search-bar__input/, 'line-height', /--md-sys-typescale-body-large-line-height/)
    ).toBe(true);
    expect(has(/\.search-bar__input/, 'color', /--md-sys-color-on-surface\)/)).toBe(true);
  });

  it('placeholder is on-surface-variant', () => {
    expect(
      has(/\.search-bar__input::placeholder/, 'color', /--md-sys-color-on-surface-variant/)
    ).toBe(true);
  });
});

describe('search view', () => {
  it('uses a surface-container-high container', () => {
    expect(
      has(/^\.search-view$/, 'background-color', /--md-sys-color-surface-container-high/)
    ).toBe(true);
  });

  it('input is body-large', () => {
    expect(
      has(/\.search-view__input/, 'font-size', /--md-sys-typescale-body-large-font-size/)
    ).toBe(true);
  });

  it('docked variant uses corner extra-large (28dp) and elevation level 2', () => {
    expect(
      has(/\.search-view--docked/, 'border-radius', /--md-sys-shape-corner-extra-large/)
    ).toBe(true);
    expect(has(/\.search-view--docked/, 'box-shadow', /--md-sys-elevation-level2/)).toBe(true);
  });
});

describe('legacy autocomplete re-skinned to M3', () => {
  it('uses a surface-container-high container', () => {
    expect(
      has(/\.autocomplete-content/, 'background-color', /--md-sys-color-surface-container-high/)
    ).toBe(true);
  });

  it('uses corner extra-large', () => {
    expect(
      has(/\.autocomplete-content/, 'border-radius', /--md-sys-shape-corner-extra-large/)
    ).toBe(true);
  });

  it('uses elevation level 2', () => {
    expect(has(/\.autocomplete-content/, 'box-shadow', /--md-sys-elevation-level2/)).toBe(true);
  });

  it('list items render body-large text', () => {
    expect(
      has(/\.autocomplete-content li/, 'font-size', /--md-sys-typescale-body-large-font-size/)
    ).toBe(true);
  });
});
