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
    expect(declValues(/\[type=radio\] \+ span$/, '--icon-size')).toContain('20px');
    expect(hasDecl(/\[type=radio\] \+ span:before/, 'width', /--icon-size|20px/)).toBe(true);
    expect(hasDecl(/\[type=radio\] \+ span:before/, 'height', /--icon-size|20px/)).toBe(true);
  });

  it('uses a fully-rounded (circular) shape for ring and dot', () => {
    expect(hasDecl(/\[type=radio\].*\+ span:before/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
  });

  it('draws an unselected 2dp on-surface-variant ring', () => {
    const ring = /\[type=radio\] \+ span:before$/;
    expect(hasDecl(ring, 'border', /--ring-border|2px/)).toBe(true);
    // The ring color token resolves to on-surface-variant by default.
    expect(hasDecl(ring, 'border', /--ring-color/)).toBe(true);
    expect(declValues(/\[type=radio\] \+ span$/, '--ring-color')).toContain(
      'var(--md-sys-color-on-surface-variant)'
    );
  });

  it('draws a selected 2dp primary ring', () => {
    expect(declValues(/\[type=radio\] \+ span$/, '--dot-color')).toContain('var(--md-sys-color-primary)');
    expect(hasDecl(/\[type=radio\]:checked \+ span:before/, 'border-color', /--dot-color/)).toBe(true);
    // `.with-gap` is a legacy alias — ring + gapped dot IS the M3 selected
    // style, so it shares the checked rule.
    expect(hasDecl(/\[type=radio\].with-gap:checked \+ span:before/, 'border-color', /--dot-color/)).toBe(
      true
    );
  });

  it('renders a 10dp primary inner dot when selected', () => {
    // The dot is a radial-gradient on the ring pseudo-element (::after is
    // reserved for the touch target), grown from 0 to 10dp when checked.
    expect(
      hasDecl(/\[type=radio\] \+ span:before$/, 'background-image', /radial-gradient.*--dot-color/)
    ).toBe(true);
    expect(hasDecl(/\[type=radio\] \+ span:before$/, 'background-size', /^0 0$/)).toBe(true);
    expect(declValues(/\[type=radio\] \+ span$/, '--dot-size')).toContain('10px');
    expect(
      hasDecl(
        /\[type=radio\]:checked \+ span:before/,
        'background-size',
        /var\(--dot-size\) var\(--dot-size\)/
      )
    ).toBe(true);
  });

  it('provides a 40dp circular state layer', () => {
    expect(declValues(/\[type=radio\] \+ span$/, '--state-layer-size')).toContain('40px');
    // The state layer is drawn as a box-shadow spread on the ring.
    expect(
      hasDecl(/\[type=radio\]:not\(:disabled\):hover \+ span:before/, 'box-shadow', /--state-layer-spread/)
    ).toBe(true);
  });

  it('tints the state layer on-surface unselected and primary selected', () => {
    expect(declValues(/\[type=radio\] \+ span$/, '--state-layer-color')).toContain(
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
    const disabled = /\[type=radio\]:disabled \+ span$/;
    expect(hasDecl(disabled, 'color', /on-surface\) 38%/)).toBe(true);
    // Ring and dot dim through their color tokens.
    expect(hasDecl(disabled, '--ring-color', /on-surface\) 38%/)).toBe(true);
    expect(hasDecl(disabled, '--dot-color', /on-surface\) 38%/)).toBe(true);
  });

  it('guarantees a 48dp minimum touch target', () => {
    expect(hasDecl(/\[type=radio\].*\+ span::after/, 'height', /max\(100%, 48px\)/)).toBe(true);
    expect(hasDecl(/\[type=radio\].*\+ span::after/, 'width', /max\(100%, 48px\)/)).toBe(true);
  });

  it('uses motion tokens for transitions (no ad-hoc easing)', () => {
    expect(declText(/\[type=radio\] \+ span:before/)).toMatch(/--md-sys-motion-easing-standard/);
  });
});
