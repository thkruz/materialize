import { describe, it, expect } from 'vitest';

import { compiledCss, hasDecl, declValues } from './helpers/sass';

// Phase 0 foundation. Every component keys off these tokens, so they are
// validated on their own before any component-level test runs.
describe('M3 design tokens (Phase 0)', () => {
  const css = compiledCss();

  describe('color roles', () => {
    const roles = [
      'primary', 'on-primary', 'primary-container', 'on-primary-container',
      'secondary', 'on-secondary', 'secondary-container', 'on-secondary-container',
      'tertiary', 'on-tertiary', 'tertiary-container', 'on-tertiary-container',
      'error', 'on-error', 'error-container', 'on-error-container',
      'surface', 'on-surface', 'surface-variant', 'on-surface-variant',
      'outline', 'outline-variant',
      'inverse-surface', 'inverse-on-surface', 'inverse-primary',
      'scrim', 'shadow'
    ];

    it.each(roles)('defines runtime role --md-sys-color-%s', (role) => {
      expect(css).toContain(`--md-sys-color-${role}:`);
    });

    const tonalSurfaces = [
      'surface-dim', 'surface-bright',
      'surface-container-lowest', 'surface-container-low', 'surface-container',
      'surface-container-high', 'surface-container-highest'
    ];

    it.each(tonalSurfaces)('defines tonal surface role --md-sys-color-%s (light + dark)', (role) => {
      expect(css).toContain(`--md-sys-color-${role}-light:`);
      expect(css).toContain(`--md-sys-color-${role}-dark:`);
      // and the runtime alias that flips with the theme
      expect(css).toMatch(new RegExp(`--md-sys-color-${role}:\\s*var\\(--md-sys-color-${role}-(light|dark)\\)`));
    });
  });

  describe('type scale', () => {
    const scales = [
      'display-large', 'display-medium', 'display-small',
      'headline-large', 'headline-medium', 'headline-small',
      'title-large', 'title-medium', 'title-small',
      'body-large', 'body-medium', 'body-small',
      'label-large', 'label-medium', 'label-small'
    ];

    it.each(scales)('defines size + line-height + tracking + weight for %s', (scale) => {
      expect(css).toContain(`--md-sys-typescale-${scale}-font-size:`);
      expect(css).toContain(`--md-sys-typescale-${scale}-line-height:`);
      expect(css).toContain(`--md-sys-typescale-${scale}-letter-spacing:`);
      expect(css).toContain(`--md-sys-typescale-${scale}-font-weight:`);
    });

    it('uses unitless font-weight values (no stray px)', () => {
      expect(css).not.toMatch(/--md-sys-typescale-[a-z-]+-font-weight:\s*\d+px/);
    });

    it('exposes working type-scale utility classes wired to the tokens', () => {
      expect(hasDecl(/\.body-large/, 'font-size', /--md-sys-typescale-body-large-font-size/)).toBe(true);
      expect(hasDecl(/\.label-large/, 'letter-spacing', /--md-sys-typescale-label-large-letter-spacing/)).toBe(true);
    });
  });

  describe('shape scale', () => {
    it.each([
      ['none', '0px'],
      ['extra-small', '4px'],
      ['small', '8px'],
      ['medium', '12px'],
      ['large', '16px'],
      ['extra-large', '28px']
    ])('corner %s = %s', (name, value) => {
      expect(css).toContain(`--md-sys-shape-corner-${name}: ${value}`);
    });

    it('defines a fully-rounded corner token', () => {
      expect(css).toMatch(/--md-sys-shape-corner-full:\s*9999px/);
    });
  });

  describe('elevation', () => {
    it.each([0, 1, 2, 3, 4, 5])('defines --md-sys-elevation-level%i', (level) => {
      expect(css).toContain(`--md-sys-elevation-level${level}:`);
    });

    it('maps .z-depth classes onto the elevation tokens', () => {
      expect(hasDecl(/\.z-depth-1\b/, 'box-shadow', /--md-sys-elevation-level/)).toBe(true);
    });
  });

  describe('motion', () => {
    it('defines the emphasized + standard easing sets', () => {
      expect(css).toContain('--md-sys-motion-easing-standard:');
      expect(css).toContain('--md-sys-motion-easing-emphasized:');
      expect(css).toContain('--md-sys-motion-easing-emphasized-decelerate:');
    });

    it('defines short/medium/long duration tokens', () => {
      expect(declValues(/:root/, 'transition').length).toBeGreaterThanOrEqual(0);
      expect(css).toContain('--md-sys-motion-duration-short2:');
      expect(css).toContain('--md-sys-motion-duration-medium2:');
      expect(css).toContain('--md-sys-motion-duration-long2:');
    });
  });

  describe('state layers', () => {
    it('defines the M3 state-layer opacities', () => {
      expect(css).toMatch(/--md-sys-state-hover-state-layer-opacity:\s*0?\.08/);
      expect(css).toMatch(/--md-sys-state-focus-state-layer-opacity:\s*0?\.10?/);
      expect(css).toMatch(/--md-sys-state-pressed-state-layer-opacity:\s*0?\.10?/);
      expect(css).toMatch(/--md-sys-state-dragged-state-layer-opacity:\s*0?\.16/);
    });
  });
});
