import { describe, it, expect } from 'vitest';
import postcss from 'postcss';

import { compileSnippet } from '../../test/helpers/sass';

// M3 Segmented button compliance —
// https://m3.material.io/components/segmented-buttons/specs
//
// The partial is compiled in isolation (tokens stay as `var(--md-sys-*)`
// references, which is exactly what we assert against). We read the emitted
// rules and check them against the spec's dimensions, shape, shared border,
// color roles, typography, state layers and disabled treatment.

const css = compileSnippet("@use 'components/segmented-button/segmented-button' as *;");
const root = postcss.parse(css);

/** Every declaration value for `prop` in rules whose selector matches `selRe`. */
function decls(selRe: RegExp, prop: string): string[] {
  const out: string[] = [];
  root.walkRules((r) => {
    if (selRe.test(r.selector)) r.walkDecls(prop, (d) => { out.push(d.value); });
  });

  return out;
}

/** True when some rule matching `selRe` sets `prop` to a value matching `valRe`. */
function has(selRe: RegExp, prop: string, valRe: RegExp): boolean {
  return decls(selRe, prop).some((v) => valRe.test(v));
}

/** True when any rule selector matches `selRe`. */
function hasRule(selRe: RegExp): boolean {
  let found = false;
  root.walkRules((r) => {
    if (selRe.test(r.selector)) found = true;
  });

  return found;
}

describe('M3 Segmented button', () => {
  // ---------------------------------------------------------------- //
  //  Group / markup contract
  // ---------------------------------------------------------------- //
  it('exposes the group and segment class contract', () => {
    expect(hasRule(/^\.segmented-button$/)).toBe(true);
    expect(hasRule(/\.segmented-button \.segment$/)).toBe(true);
    expect(hasRule(/\.segment\.selected$/)).toBe(true);
  });

  it('lays the group out as a horizontal row', () => {
    expect(has(/^\.segmented-button$/, 'display', /inline-flex/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Dimensions
  // ---------------------------------------------------------------- //
  it('each segment is 40dp tall', () => {
    expect(decls(/\.segment$/, 'height')).toContain('40px');
  });

  // ---------------------------------------------------------------- //
  //  Shape — outer full corners only
  // ---------------------------------------------------------------- //
  it('rounds the first segment outer (leading) corners with the full token', () => {
    expect(has(/\.segment:first-child$/, 'border-top-left-radius', /--md-sys-shape-corner-full/)).toBe(true);
    expect(has(/\.segment:first-child$/, 'border-bottom-left-radius', /--md-sys-shape-corner-full/)).toBe(true);
  });

  it('rounds the last segment outer (trailing) corners with the full token', () => {
    expect(has(/\.segment:last-child$/, 'border-top-right-radius', /--md-sys-shape-corner-full/)).toBe(true);
    expect(has(/\.segment:last-child$/, 'border-bottom-right-radius', /--md-sys-shape-corner-full/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Shared 1dp outline border
  // ---------------------------------------------------------------- //
  it('gives each segment a 1dp outline border', () => {
    expect(has(/\.segment$/, 'border', /^1px solid var\(--md-sys-color-outline\)$/)).toBe(true);
  });

  it('collapses the shared border between adjacent segments', () => {
    // Inner segments overlap the previous border by 1px…
    expect(decls(/\.segment$/, 'margin-left')).toContain('-1px');
    // …but the first segment does not pull left.
    expect(decls(/\.segment:first-child$/, 'margin-left')).toContain('0');
  });

  // ---------------------------------------------------------------- //
  //  Unselected treatment
  // ---------------------------------------------------------------- //
  it('unselected segment: transparent container, on-surface label', () => {
    expect(has(/\.segment$/, 'background-color', /transparent/)).toBe(true);
    expect(has(/\.segment$/, 'color', /--md-sys-color-on-surface\b/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Selected treatment
  // ---------------------------------------------------------------- //
  it('selected segment: secondary-container container + on-secondary-container label', () => {
    expect(has(/\.segment\.selected$/, 'background-color', /--md-sys-color-secondary-container/)).toBe(true);
    expect(has(/\.segment\.selected$/, 'color', /--md-sys-color-on-secondary-container/)).toBe(true);
  });

  it('selected segment: leading check icon is 18dp and on-secondary-container', () => {
    expect(decls(/\.segment\.selected \.check$/, 'width')).toContain('18px');
    expect(decls(/\.segment\.selected \.check$/, 'height')).toContain('18px');
    expect(has(/\.segment\.selected \.check$/, 'color', /--md-sys-color-on-secondary-container/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Typography — label-large
  // ---------------------------------------------------------------- //
  it('uses the label-large typescale for the segment label', () => {
    expect(has(/\.segment$/, 'font-size', /--md-sys-typescale-label-large-font-size/)).toBe(true);
    expect(has(/\.segment$/, 'font-weight', /--md-sys-typescale-label-large-font-weight/)).toBe(true);
    expect(has(/\.segment$/, 'line-height', /--md-sys-typescale-label-large-line-height/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Icons — 18dp
  // ---------------------------------------------------------------- //
  it('sizes segment icons at 18dp', () => {
    expect(decls(/\.segment \.material-icons$/, 'width')).toContain('18px');
    expect(decls(/\.segment \.material-icons$/, 'height')).toContain('18px');
    expect(decls(/\.segment \.material-icons$/, 'font-size')).toContain('18px');
  });

  // ---------------------------------------------------------------- //
  //  State layers (hover 8 / focus 10 / pressed 10%)
  // ---------------------------------------------------------------- //
  it('renders a state layer invisible at rest', () => {
    expect(has(/\.segment::before$/, 'opacity', /^0$/)).toBe(true);
  });

  it('applies the hover state-layer opacity', () => {
    expect(has(/\.segment:hover::before$/, 'opacity', /hover-state-layer-opacity/)).toBe(true);
  });

  it('applies the focus state-layer opacity', () => {
    expect(has(/\.segment:focus-visible::before$/, 'opacity', /focus-state-layer-opacity/)).toBe(true);
  });

  it('applies the pressed state-layer opacity', () => {
    expect(has(/\.segment:active::before$/, 'opacity', /pressed-state-layer-opacity/)).toBe(true);
  });

  it('uses motion tokens for the state-layer transition (no ad-hoc easing)', () => {
    expect(has(/\.segment::before$/, 'transition', /--md-sys-motion-easing-standard/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Disabled treatment — on-surface 38% label, border 12%
  // ---------------------------------------------------------------- //
  it('disabled segment: on-surface 38% label and 12% border', () => {
    expect(has(/\.segment:disabled|\.segment\.disabled/, 'color', /var\(--md-sys-color-on-surface\) 38%/)).toBe(true);
    expect(
      has(/\.segment:disabled|\.segment\.disabled/, 'border-color', /var\(--md-sys-color-on-surface\) 12%/)
    ).toBe(true);
  });

  it('disabled segment: suppresses the state layer', () => {
    expect(has(/\.segment(:disabled|\.disabled).*::before$/, 'opacity', /^0$/)).toBe(true);
  });
});
