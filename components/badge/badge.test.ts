import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Badge compliance — https://m3.material.io/components/badges/specs
// These assertions read the compiled library CSS and check the badge rules
// against the spec's two forms (small dot, large numeric), color roles, shape
// and typescale.
describe('M3 Badge', () => {
  it('uses the error container color role for its background', () => {
    expect(hasDecl(/span\.badge$/, 'background-color', /--md-sys-color-error/)).toBe(true);
  });

  it('uses on-error for the label color', () => {
    expect(hasDecl(/span\.badge$/, 'color', /--md-sys-color-on-error/)).toBe(true);
  });

  it('uses a fully-rounded (corner full) shape', () => {
    expect(hasDecl(/span\.badge$/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
  });

  it('large numeric badge is at least 16dp tall', () => {
    expect(declValues(/:root/, '--badge-height')).toContain('16px');
    // The height and min-height wire up to that 16dp token.
    expect(hasDecl(/span\.badge$/, 'min-height', /--badge-height/)).toBe(true);
    expect(hasDecl(/span\.badge$/, 'height', /--badge-height/)).toBe(true);
  });

  it('large numeric badge has 4dp horizontal padding', () => {
    expect(declValues(/:root/, '--badge-padding')).toContain('4px');
    expect(hasDecl(/span\.badge$/, 'padding', /--badge-padding/)).toBe(true);
  });

  it('uses the label-small typescale', () => {
    const text = declText(/span\.badge$/);
    expect(text).toMatch(/--md-sys-typescale-label-small-font-size/);
    expect(text).toMatch(/--md-sys-typescale-label-small-font-weight/);
    expect(text).toMatch(/--md-sys-typescale-label-small-line-height/);
  });

  it('defines a small dot badge of 6dp diameter', () => {
    expect(declValues(/:root/, '--badge-dot-size')).toContain('6px');
    expect(hasDecl(/span\.badge\.dot$/, 'width', /--badge-dot-size/)).toBe(true);
    expect(hasDecl(/span\.badge\.dot$/, 'height', /--badge-dot-size/)).toBe(true);
  });

  it('small dot badge is fully rounded and error colored', () => {
    expect(hasDecl(/span\.badge\.dot$/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
    expect(hasDecl(/span\.badge\.dot$/, 'background-color', /--md-sys-color-error/)).toBe(true);
  });

  it('small dot badge carries no visible label', () => {
    expect(hasDecl(/span\.badge\.dot$/, 'font-size', /^0$/)).toBe(true);
  });

  it('preserves the legacy .new modifier with M3 error colors', () => {
    expect(hasDecl(/span\.badge\.new$/, 'background-color', /--md-sys-color-error/)).toBe(true);
    expect(hasDecl(/span\.badge\.new$/, 'color', /--md-sys-color-on-error/)).toBe(true);
    expect(hasDecl(/span\.badge\.new$/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
  });

  it('preserves the data-badge-caption contract', () => {
    expect(rulesMatching(/span\.badge\[data-badge-caption\]::after/).length).toBeGreaterThan(0);
  });

  it('keeps the numeric badge centered via flex layout', () => {
    expect(hasDecl(/span\.badge$/, 'display', /inline-flex/)).toBe(true);
    expect(hasDecl(/span\.badge$/, 'align-items', /center/)).toBe(true);
  });
});
