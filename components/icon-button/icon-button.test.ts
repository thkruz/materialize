import { describe, it, expect } from 'vitest';
import postcss from 'postcss';

import { compileSnippet } from '../../test/helpers/sass';

// M3 Icon button compliance — https://m3.material.io/components/icon-buttons/specs
//
// The partial is compiled in isolation (rather than reading the whole compiled
// library) so this suite stands on its own before the parent wires up the
// @forward. Expected markup:
//   <button class="icon-button"><i class="material-icons">favorite</i></button>
const css = compileSnippet("@use 'components/icon-button/icon-button' as *;");
const root = postcss.parse(css);

/** Every value declared for `prop` across rules whose selector matches `selRe`. */
function decls(selRe: RegExp, prop: string): string[] {
  const out: string[] = [];
  root.walkRules((r) => {
    if (selRe.test(r.selector)) r.walkDecls(prop, (d) => { out.push(d.value); });
  });

  return out;
}

/** True when some rule matching `selRe` declares `prop` with a value matching `valRe`. */
function has(selRe: RegExp, prop: string, valRe: RegExp): boolean {
  return decls(selRe, prop).some((v) => valRe.test(v));
}

/** True when any rule selector matches `selRe`. */
function hasSelector(selRe: RegExp): boolean {
  let found = false;
  root.walkRules((r) => {
    if (selRe.test(r.selector)) found = true;
  });

  return found;
}

describe('M3 Icon button', () => {
  // ---------------------------------------------------------------- //
  //  Dimensions & shape (all styles)
  // ---------------------------------------------------------------- //
  it('uses a 40dp container', () => {
    expect(decls(/^\.icon-button$/, 'width')).toContain('40px');
    expect(decls(/^\.icon-button$/, 'height')).toContain('40px');
  });

  it('renders the icon at 24dp', () => {
    expect(decls(/^\.icon-button \.material-icons/, 'font-size')).toContain('24px');
    expect(decls(/^\.icon-button \.material-icons/, 'width')).toContain('24px');
    expect(decls(/^\.icon-button \.material-icons/, 'height')).toContain('24px');
  });

  it('uses the full corner shape token', () => {
    expect(has(/^\.icon-button$/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
  });

  it('guarantees a >=48dp touch target', () => {
    expect(has(/^\.icon-button::after$/, 'height', /max\(100%,\s*48px\)/)).toBe(true);
    expect(has(/^\.icon-button::after$/, 'width', /max\(100%,\s*48px\)/)).toBe(true);
  });

  it('drives transitions from motion tokens (no ad-hoc easing)', () => {
    expect(has(/^\.icon-button$/, 'transition', /--md-sys-motion-easing-standard/)).toBe(true);
    expect(has(/^\.icon-button$/, 'transition', /--md-sys-motion-duration-short2/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Standard style
  // ---------------------------------------------------------------- //
  it('standard: transparent container', () => {
    expect(has(/^\.icon-button$/, 'background-color', /transparent/)).toBe(true);
  });

  it('standard (unselected): on-surface-variant icon', () => {
    expect(has(/^\.icon-button$/, 'color', /--md-sys-color-on-surface-variant/)).toBe(true);
  });

  it('standard (selected): primary icon', () => {
    expect(has(/^\.icon-button\.selected$/, 'color', /--md-sys-color-primary/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  State layers
  // ---------------------------------------------------------------- //
  it('renders a state layer that is invisible at rest and tinted with the icon color', () => {
    expect(has(/^\.icon-button::before$/, 'opacity', /^0$/)).toBe(true);
    expect(has(/^\.icon-button::before$/, 'background-color', /currentColor/i)).toBe(true);
  });

  it('applies the 8% hover state-layer opacity', () => {
    expect(has(/^\.icon-button:hover::before$/, 'opacity', /hover-state-layer-opacity/)).toBe(true);
  });

  it('applies the 10% focus state-layer opacity', () => {
    expect(has(/^\.icon-button:focus-visible::before$/, 'opacity', /focus-state-layer-opacity/)).toBe(true);
  });

  it('applies the 10% pressed state-layer opacity', () => {
    expect(has(/^\.icon-button:active::before$/, 'opacity', /pressed-state-layer-opacity/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Filled
  // ---------------------------------------------------------------- //
  it('filled (default/selected): primary container + on-primary icon', () => {
    expect(has(/^\.icon-button\.filled$/, 'background-color', /--md-sys-color-primary\b/)).toBe(true);
    expect(has(/^\.icon-button\.filled$/, 'color', /--md-sys-color-on-primary\b/)).toBe(true);
  });

  it('filled (unselected toggle): surface-container-highest container + primary icon', () => {
    expect(
      has(/^\.icon-button\.filled:not\(\.selected\)$/, 'background-color', /--md-sys-color-surface-container-highest/)
    ).toBe(true);
    expect(has(/^\.icon-button\.filled:not\(\.selected\)$/, 'color', /--md-sys-color-primary\b/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Filled tonal
  // ---------------------------------------------------------------- //
  it('tonal: secondary-container container + on-secondary-container icon', () => {
    expect(has(/^\.icon-button\.tonal$/, 'background-color', /--md-sys-color-secondary-container/)).toBe(true);
    expect(has(/^\.icon-button\.tonal$/, 'color', /--md-sys-color-on-secondary-container/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Outlined
  // ---------------------------------------------------------------- //
  it('outlined: 1dp outline border, transparent container, on-surface-variant icon', () => {
    expect(has(/^\.icon-button\.outlined$/, 'border', /1px solid var\(--md-sys-color-outline\)/)).toBe(true);
    expect(has(/^\.icon-button\.outlined$/, 'background-color', /transparent/)).toBe(true);
    expect(has(/^\.icon-button\.outlined$/, 'color', /--md-sys-color-on-surface-variant/)).toBe(true);
  });

  it('outlined (selected toggle): inverse-surface container + inverse-on-surface icon', () => {
    expect(has(/^\.icon-button\.outlined\.selected$/, 'background-color', /--md-sys-color-inverse-surface/)).toBe(true);
    expect(has(/^\.icon-button\.outlined\.selected$/, 'color', /--md-sys-color-inverse-on-surface/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Disabled
  // ---------------------------------------------------------------- //
  it('disabled: icon fades to on-surface 38%', () => {
    expect(
      has(/\.icon-button:disabled/, 'color', /color-mix\(in srgb, var\(--md-sys-color-on-surface\) 38%/)
    ).toBe(true);
  });

  it('disabled filled/tonal/outlined-selected: on-surface 12% container', () => {
    expect(
      has(
        /\.icon-button:disabled\.filled/,
        'background-color',
        /color-mix\(in srgb, var\(--md-sys-color-on-surface\) 12%/
      )
    ).toBe(true);
  });

  it('disabled: suppresses the state layer', () => {
    expect(has(/\.icon-button:disabled::before/, 'opacity', /^0$/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Class contract
  // ---------------------------------------------------------------- //
  it('exposes the documented class contract', () => {
    expect(hasSelector(/^\.icon-button$/)).toBe(true);
    expect(hasSelector(/^\.icon-button\.filled$/)).toBe(true);
    expect(hasSelector(/^\.icon-button\.tonal$/)).toBe(true);
    expect(hasSelector(/^\.icon-button\.outlined$/)).toBe(true);
    expect(hasSelector(/^\.icon-button\.selected$/)).toBe(true);
  });
});
