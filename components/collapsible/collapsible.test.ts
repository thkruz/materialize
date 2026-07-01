import { describe, it, expect } from 'vitest';

import { declValues, hasDecl } from '../../test/helpers/sass';

// Collapsible is a legacy (non-M3) component that is kept but harmonized with
// the M3 token system: no hardcoded rgba() shadows or state layers. These
// assertions guard that token discipline against regressions.
describe('Collapsible (M3 token discipline)', () => {
  it('uses outline-variant for its borders', () => {
    expect(hasDecl(/^\.collapsible$/, 'border-top', /--md-sys-color-outline-variant/)).toBe(true);
    expect(hasDecl(/^\.collapsible-header$/, 'border-bottom', /--md-sys-color-outline-variant/)).toBe(true);
  });

  it('draws the keyboard-focus state layer from the on-surface + focus-opacity tokens (no rgba)', () => {
    const focus = declValues(/\.keyboard-focused \.collapsible-header:focus/, 'background-color');
    expect(focus.length).toBeGreaterThan(0);
    for (const v of focus) {
      expect(v).not.toMatch(/rgba\(/);
      expect(v).toMatch(/--md-sys-color-on-surface/);
      expect(v).toMatch(/--md-sys-state-focus-state-layer-opacity/);
    }
  });

  it('uses elevation tokens for the popout shadows (never a hardcoded rgba shadow)', () => {
    const shadows = declValues(/\.collapsible\.popout > li/, 'box-shadow');
    expect(shadows.length).toBeGreaterThan(0);
    for (const s of shadows) {
      expect(s).toMatch(/--md-sys-elevation-level[0-5]/);
      expect(s).not.toMatch(/rgba\(/);
    }
  });

  it('uses motion tokens for the popout margin transition', () => {
    expect(hasDecl(/\.collapsible\.popout > li/, 'transition', /--md-sys-motion-easing-emphasized/)).toBe(true);
  });
});
