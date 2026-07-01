import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Card compliance — https://m3.material.io/components/cards/specs
// These assertions read the compiled library CSS and check the card rules
// against the spec's shape, container color roles, elevation levels and the
// requirement that elevation/motion come from design tokens (not hardcoded
// shadows or ad-hoc easing). The existing markup contract (`.card`,
// `.card-content`, etc.) is preserved; variant classes are additive.
describe('M3 Card', () => {
  // ---- Shape -------------------------------------------------------------
  it('uses the medium (12dp) corner token on the base card', () => {
    expect(
      hasDecl(/^\.card$/, 'border-radius', /--md-sys-shape-corner-medium/)
    ).toBe(true);
  });

  it('uses the medium corner token on the card-panel too', () => {
    expect(
      hasDecl(/^\.card-panel$/, 'border-radius', /--md-sys-shape-corner-medium/)
    ).toBe(true);
  });

  it('rounds edge-flush images/content with the shape token, never a hardcoded 2px', () => {
    // The image + content corners follow the card container corner (medium).
    const radii = declValues(/\.card-image img|\.card \.card-content$/, 'border-radius');
    expect(radii.length).toBeGreaterThan(0);
    for (const r of radii) {
      expect(r).not.toMatch(/\b2px\b/);
      expect(r).toMatch(/--md-sys-shape-corner-medium/);
    }
  });

  // ---- Variants exist ----------------------------------------------------
  it('emits all three M3 variant classes', () => {
    expect(rulesMatching(/^\.card\.elevated$/).length).toBeGreaterThan(0);
    expect(rulesMatching(/^\.card\.filled$/).length).toBeGreaterThan(0);
    expect(rulesMatching(/^\.card\.outlined$/).length).toBeGreaterThan(0);
  });

  // ---- Elevated variant --------------------------------------------------
  it('elevated card: surface-container-low container at elevation level 1', () => {
    expect(
      hasDecl(/^\.card\.elevated$/, 'background-color', /--md-sys-color-surface-container-low\b/)
    ).toBe(true);
    expect(
      hasDecl(/^\.card\.elevated$/, 'box-shadow', /--md-sys-elevation-level1\b/)
    ).toBe(true);
  });

  it('elevated card raises to level 2 on hover when interactive', () => {
    expect(
      hasDecl(/\.card\.(clickable|reveal)\.elevated:hover/, 'box-shadow', /--md-sys-elevation-level2\b/)
    ).toBe(true);
  });

  // ---- Filled variant ----------------------------------------------------
  it('filled card: surface-container-highest container at elevation level 0', () => {
    expect(
      hasDecl(/^\.card\.filled$/, 'background-color', /--md-sys-color-surface-container-highest\b/)
    ).toBe(true);
    expect(
      hasDecl(/^\.card\.filled$/, 'box-shadow', /--md-sys-elevation-level0\b/)
    ).toBe(true);
  });

  it('filled card raises to level 1 on hover when interactive', () => {
    expect(
      hasDecl(/\.card\.(clickable|reveal)\.filled:hover/, 'box-shadow', /--md-sys-elevation-level1\b/)
    ).toBe(true);
  });

  // ---- Outlined variant --------------------------------------------------
  it('outlined card: plain surface container at elevation level 0', () => {
    expect(
      hasDecl(/^\.card\.outlined$/, 'background-color', /--md-sys-color-surface\b/)
    ).toBe(true);
    expect(
      hasDecl(/^\.card\.outlined$/, 'box-shadow', /--md-sys-elevation-level0\b/)
    ).toBe(true);
  });

  it('outlined card has a 1dp outline-variant border', () => {
    expect(
      hasDecl(/^\.card\.outlined$/, 'border', /1px solid var\(--md-sys-color-outline-variant\)/)
    ).toBe(true);
  });

  // ---- Text color roles --------------------------------------------------
  it('base card text uses the on-surface role', () => {
    expect(hasDecl(/^\.card$/, 'color', /--md-sys-color-on-surface\b/)).toBe(true);
  });

  it('supporting content text uses the on-surface-variant role', () => {
    expect(
      hasDecl(/^\.card \.card-content$/, 'color', /--md-sys-color-on-surface-variant\b/)
    ).toBe(true);
  });

  // ---- Token discipline --------------------------------------------------
  it('never hardcodes a box-shadow on card rules (always a token)', () => {
    const shadows = declValues(/\.card(\.|:| |$)/, 'box-shadow');
    expect(shadows.length).toBeGreaterThan(0);
    for (const shadow of shadows) {
      expect(shadow).toMatch(/--md-sys-elevation-level[0-5]/);
    }
  });

  it('transitions use motion tokens, not ad-hoc durations/easing', () => {
    const text = declText(/^\.card$/);
    expect(text).toMatch(/--md-sys-motion-duration-/);
    expect(text).toMatch(/--md-sys-motion-easing-/);
    // The pre-M3 hardcoded "box-shadow .25s" must be gone.
    expect(text).not.toMatch(/box-shadow\s+\.25s/);
    expect(text).not.toMatch(/transition:[^;]*\b0?\.\d+s/);
  });

  // ---- Backward compatibility -------------------------------------------
  it('keeps the legacy markup contract selectors', () => {
    expect(rulesMatching(/^\.card \.card-content$/).length).toBeGreaterThan(0);
    expect(rulesMatching(/^\.card \.card-action$/).length).toBeGreaterThan(0);
    expect(rulesMatching(/^\.card \.card-image$/).length).toBeGreaterThan(0);
    expect(rulesMatching(/^\.card \.card-reveal$/).length).toBeGreaterThan(0);
    expect(rulesMatching(/^\.card \.card-title$/).length).toBeGreaterThan(0);
  });
});
