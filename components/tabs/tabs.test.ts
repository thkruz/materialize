import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Tabs compliance — https://m3.material.io/components/tabs/specs
// These assertions read the compiled library CSS and check the tabs rules
// against the spec's dimensions, color roles, indicator shape, typescale
// and state layers for both the primary (default) and secondary variants.
describe('M3 Tabs', () => {
  it('gives the tab container a 48dp height', () => {
    expect(declValues(/^\.tabs$/, 'height')).toContain('48px');
  });

  it('uses the surface color role for the container', () => {
    expect(hasDecl(/^\.tabs$/, 'background-color', /--md-sys-color-surface/)).toBe(true);
  });

  it('keeps tabs in a scrollable row (scrollable variant)', () => {
    expect(hasDecl(/^\.tabs$/, 'overflow-x', /auto/)).toBe(true);
    expect(hasDecl(/^\.tabs$/, 'white-space', /nowrap/)).toBe(true);
  });

  it('sizes each tab to 48dp min-height', () => {
    expect(declValues(/^\.tabs \.tab a$/, 'min-height')).toContain('48px');
  });

  // --- Primary tabs (default) -------------------------------------------

  it('primary indicator is a 3dp primary bar', () => {
    expect(declValues(/^\.tabs \.indicator$/, 'height')).toContain('3px');
    expect(hasDecl(/^\.tabs \.indicator$/, 'background-color', /--md-sys-color-primary/)).toBe(true);
  });

  it('primary indicator sits at the bottom with 3dp rounded top corners', () => {
    expect(hasDecl(/^\.tabs \.indicator$/, 'bottom', /0/)).toBe(true);
    expect(hasDecl(/^\.tabs \.indicator$/, 'border-radius', /3px 3px 0 0/)).toBe(true);
  });

  it('inactive labels use on-surface-variant', () => {
    expect(hasDecl(/^\.tabs \.tab a$/, 'color', /--md-sys-color-on-surface-variant/)).toBe(true);
  });

  it('active label + icon recolor to primary', () => {
    expect(hasDecl(/\.tabs \.tab a\.active/, 'color', /--md-sys-color-primary/)).toBe(true);
  });

  // --- Typography --------------------------------------------------------

  it('uses the title-small typescale for labels', () => {
    const text = declText(/^\.tabs \.tab a$/);
    expect(text).toMatch(/--md-sys-typescale-title-small-font-size/);
    expect(text).toMatch(/--md-sys-typescale-title-small-font-weight/);
    expect(text).toMatch(/--md-sys-typescale-title-small-letter-spacing/);
  });

  // --- State layers ------------------------------------------------------

  it('renders a primary-tinted state layer that only appears on interaction', () => {
    expect(hasDecl(/^\.tabs \.tab a::before$/, 'background-color', /--md-sys-color-primary/)).toBe(
      true
    );
    expect(hasDecl(/^\.tabs \.tab a::before$/, 'opacity', /^0$/)).toBe(true);
    expect(hasDecl(/\.tabs \.tab a:hover::before/, 'opacity', /hover-state-layer-opacity/)).toBe(
      true
    );
    expect(
      hasDecl(/\.tabs \.tab a:focus-visible::before/, 'opacity', /focus-state-layer-opacity/)
    ).toBe(true);
    expect(hasDecl(/\.tabs \.tab a:active::before/, 'opacity', /pressed-state-layer-opacity/)).toBe(
      true
    );
  });

  it('uses motion tokens for the label transition (no ad-hoc easing)', () => {
    expect(declText(/^\.tabs \.tab a$/)).toMatch(/--md-sys-motion-easing-standard/);
  });

  it('dims the disabled tab to the 38% on-surface role', () => {
    expect(
      hasDecl(/\.tabs \.tab\.disabled a/, 'color', /--md-sys-color-on-surface[^-].*38%|38%/)
    ).toBe(true);
  });

  // --- Secondary tabs variant -------------------------------------------

  it('secondary indicator is a 2dp bottom bar with square corners', () => {
    expect(declValues(/^\.tabs\.secondary \.indicator$/, 'height')).toContain('2px');
    expect(hasDecl(/^\.tabs\.secondary \.indicator$/, 'border-radius', /^0$/)).toBe(true);
    expect(
      hasDecl(/^\.tabs\.secondary \.indicator$/, 'background-color', /--md-sys-color-primary/)
    ).toBe(true);
  });

  it('secondary active text recolors to on-surface', () => {
    expect(
      hasDecl(/\.tabs\.secondary \.tab a\.active/, 'color', /--md-sys-color-on-surface/)
    ).toBe(true);
  });

  it('secondary state layer switches to the on-surface tint', () => {
    expect(
      hasDecl(/^\.tabs\.secondary \.tab a::before$/, 'background-color', /--md-sys-color-on-surface/)
    ).toBe(true);
  });

  it('exposes both the .indicator element and .tab a contract', () => {
    expect(rulesMatching(/^\.tabs \.indicator$/).length).toBeGreaterThan(0);
    expect(rulesMatching(/^\.tabs \.tab a$/).length).toBeGreaterThan(0);
  });
});
