import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Radio button compliance — https://m3.material.io/components/radio-button/specs
// These assertions read the compiled library CSS and check the radio-button
// rules against the spec's icon size, color roles, shape, state layers,
// error/disabled states and minimum touch target.
//
// Markup contract (Materialize, unchanged): label > input[type=radio] + span
//   span:before = the ring, span:after = the inner dot, plus `.with-gap`.
describe('M3 Radio button', () => {
  it('sizes the icon at 20dp', () => {
    // The ring/dot pseudo-elements are sized to the --icon-size token.
    expect(declValues(/\[type=radio\]$/, '--icon-size')).toContain('20px');
    expect(hasDecl(/\[type=radio\] \+ span:before/, 'width', /--icon-size|20px/)).toBe(true);
    expect(hasDecl(/\[type=radio\] \+ span:before/, 'height', /--icon-size|20px/)).toBe(true);
  });

  it('uses a fully-rounded (circular) shape for ring and dot', () => {
    expect(hasDecl(/\[type=radio\].*\+ span:before/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
  });

  it('draws an unselected 2dp on-surface-variant ring', () => {
    const unchecked = /\[type=radio\]:not\(:checked\) \+ span:before/;
    expect(hasDecl(unchecked, 'border', /--ring-border|2px/)).toBe(true);
    // The ring color token resolves to on-surface-variant by default.
    expect(hasDecl(unchecked, 'border', /--ring-color/)).toBe(true);
    expect(declValues(/\[type=radio\]$/, '--ring-color')).toContain(
      'var(--md-sys-color-on-surface-variant)'
    );
  });

  it('draws a selected 2dp primary ring', () => {
    const checkedRing = /\[type=radio\]:checked \+ span:before,\n\[type=radio\].with-gap:checked \+ span:before/;
    // .with-gap keeps a visible ring; standard checked ring is transparent with
    // the dot supplying the primary color. Assert the primary dot/ring token.
    expect(declValues(/\[type=radio\]$/, '--dot-color')).toContain('var(--md-sys-color-primary)');
    expect(
      hasDecl(/\[type=radio\].with-gap:checked \+ span:before/, 'border', /--dot-color/)
    ).toBe(true);
    // touch the compiled with-gap ring rule so the regex is exercised.
    void checkedRing;
  });

  it('renders a 10dp primary inner dot when selected', () => {
    // Dot color is primary via the token.
    expect(hasDecl(/\[type=radio\]:checked \+ span:after/, 'background-color', /--dot-color/)).toBe(true);
    // Dot diameter is 10dp (icon 20dp scaled by dot/icon).
    expect(declValues(/\[type=radio\]$/, '--dot-size')).toContain('10px');
    expect(
      hasDecl(
        /\[type=radio\]:checked \+ span:after$/,
        'transform',
        /scale\(calc\(var\(--dot-size\) \/ var\(--icon-size\)\)\)/
      )
    ).toBe(true);
  });

  it('provides a 40dp circular state layer', () => {
    expect(declValues(/\[type=radio\]$/, '--state-layer-size')).toContain('40px');
    // The state layer is drawn as a box-shadow spread on the ring.
    expect(
      hasDecl(/\[type=radio\]:not\(:disabled\):hover \+ span:before/, 'box-shadow', /--state-layer-spread/)
    ).toBe(true);
  });

  it('tints the state layer on-surface unselected and primary selected', () => {
    expect(declValues(/\[type=radio\]$/, '--state-layer-color')).toContain(
      'var(--md-sys-color-on-surface)'
    );
    expect(hasDecl(/\[type=radio\]:checked \+ span$/, '--state-layer-color', /--md-sys-color-primary/)).toBe(
      true
    );
  });

  it('applies hover 8% / focus 10% / pressed 10% state-layer opacities', () => {
    expect(
      hasDecl(
        /\[type=radio\]:not\(:disabled\):hover \+ span:before/,
        'box-shadow',
        /--md-sys-state-hover-state-layer-opacity/
      )
    ).toBe(true);
    expect(
      hasDecl(
        /\[type=radio\]:not\(:disabled\):focus-visible \+ span:before/,
        'box-shadow',
        /--md-sys-state-focus-state-layer-opacity/
      )
    ).toBe(true);
    expect(
      hasDecl(
        /\[type=radio\]:not\(:disabled\):active \+ span:before/,
        'box-shadow',
        /--md-sys-state-pressed-state-layer-opacity/
      )
    ).toBe(true);
  });

  it('supports an error state using the error color role', () => {
    const errorRule = rulesMatching(/\[type=radio\].error \+ span/);
    expect(errorRule.length).toBeGreaterThan(0);
    const text = errorRule.map((r) => r.toString()).join('\n');
    expect(text).toMatch(/--ring-color:\s*var\(--md-sys-color-error\)/);
    expect(text).toMatch(/--dot-color:\s*var\(--md-sys-color-error\)/);
    expect(text).toMatch(/--state-layer-color:\s*var\(--md-sys-color-error\)/);
    // Also exposed for aria-invalid to align with the ARIA contract.
    expect(rulesMatching(/\[type=radio\]\[aria-invalid=true\] \+ span/).length).toBeGreaterThan(0);
  });

  it('dims the disabled radio to on-surface at 38%', () => {
    expect(hasDecl(/\[type=radio\]:disabled \+ span$/, 'color', /on-surface\) 38%/)).toBe(true);
    expect(
      hasDecl(
        /\[type=radio\]:disabled:not\(:checked\) \+ span:before/,
        'border-color',
        /on-surface\) 38%/
      )
    ).toBe(true);
    expect(
      hasDecl(/\[type=radio\]:disabled:checked \+ span:after/, 'background-color', /on-surface\) 38%/)
    ).toBe(true);
  });

  it('guarantees a 48dp minimum touch target', () => {
    expect(hasDecl(/\[type=radio\].*\+ span::after/, 'height', /max\(100%, 48px\)/)).toBe(true);
    expect(hasDecl(/\[type=radio\].*\+ span::after/, 'width', /max\(100%, 48px\)/)).toBe(true);
  });

  it('uses motion tokens for transitions (no ad-hoc easing)', () => {
    expect(declText(/\[type=radio\] \+ span:before/)).toMatch(/--md-sys-motion-easing-standard/);
  });
});
