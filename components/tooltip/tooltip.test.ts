import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Tooltip compliance — https://m3.material.io/components/tooltips/specs
// The suite reads the compiled library CSS and checks the plain tooltip
// (`.material-tooltip`) and rich tooltip (`.material-tooltip.rich`) rules
// against the spec's color roles, shape, type and elevation.
describe('M3 Tooltip', () => {
  describe('plain tooltip', () => {
    it('uses the inverse-surface container color', () => {
      expect(
        hasDecl(/^\.material-tooltip$/, 'background-color', /--md-sys-color-inverse-surface/)
      ).toBe(true);
    });

    it('uses inverse-on-surface for the label text', () => {
      expect(hasDecl(/^\.material-tooltip$/, 'color', /--md-sys-color-inverse-on-surface/)).toBe(
        true
      );
    });

    it('applies the extra-small (4dp) corner shape', () => {
      expect(
        hasDecl(/^\.material-tooltip$/, 'border-radius', /--md-sys-shape-corner-extra-small/)
      ).toBe(true);
    });

    it('uses body-small typography tokens', () => {
      const text = declText(/^\.material-tooltip$/);
      expect(text).toMatch(/--md-sys-typescale-body-small-font-size/);
      expect(text).toMatch(/--md-sys-typescale-body-small-line-height/);
      expect(text).toMatch(/--md-sys-typescale-body-small-font-weight/);
    });

    it('has a 24dp minimum height', () => {
      expect(declValues(/^\.material-tooltip$/, 'min-height')).toContain('24px');
    });

    it('pads 4dp vertical and 8dp horizontal', () => {
      expect(declValues(/^\.material-tooltip$/, 'padding')).toContain('4px 8px');
    });
  });

  describe('rich tooltip', () => {
    it('uses the surface-container container color', () => {
      expect(
        hasDecl(/\.material-tooltip\.rich$/, 'background-color', /--md-sys-color-surface-container/)
      ).toBe(true);
    });

    it('applies the medium (12dp) corner shape', () => {
      expect(
        hasDecl(/\.material-tooltip\.rich$/, 'border-radius', /--md-sys-shape-corner-medium/)
      ).toBe(true);
    });

    it('renders elevation level 2 via the elevation token', () => {
      expect(
        hasDecl(/\.material-tooltip\.rich$/, 'box-shadow', /--md-sys-elevation-level2/)
      ).toBe(true);
    });

    it('uses body-medium typography on on-surface-variant body text', () => {
      const text = declText(/\.material-tooltip\.rich$/);
      expect(text).toMatch(/--md-sys-typescale-body-medium-font-size/);
      expect(text).toMatch(/--md-sys-color-on-surface-variant/);
    });

    it('styles the subhead as title-small on on-surface', () => {
      const subhead = rulesMatching(/\.material-tooltip\.rich \.tooltip-subhead$/);
      const text = subhead.map((r) => r.toString()).join('\n');
      expect(text).toMatch(/--md-sys-typescale-title-small-font-size/);
      expect(text).toMatch(/--md-sys-color-on-surface\b/);
    });

    it('gives action buttons the primary label-large text style', () => {
      const actions = rulesMatching(/\.material-tooltip\.rich \.tooltip-action/);
      const text = actions.map((r) => r.toString()).join('\n');
      expect(text).toMatch(/--md-sys-color-primary/);
      expect(text).toMatch(/--md-sys-typescale-label-large-font-size/);
    });
  });
});
