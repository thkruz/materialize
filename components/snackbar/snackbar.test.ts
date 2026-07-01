import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Snackbar (toast) compliance — https://m3.material.io/components/snackbar/specs
// These assertions read the compiled library CSS and check the toast rules
// against the spec's color roles, shape, elevation, sizing and typescale.
describe('M3 Snackbar', () => {
  it('uses the inverse-surface container background', () => {
    expect(
      hasDecl(/\.toast$/, 'background-color', /--md-sys-color-inverse-surface/)
    ).toBe(true);
  });

  it('uses inverse-on-surface for the label text', () => {
    expect(hasDecl(/\.toast$/, 'color', /--md-sys-color-inverse-on-surface/)).toBe(true);
  });

  it('applies the extra-small (4dp) corner shape', () => {
    expect(
      hasDecl(/\.toast$/, 'border-radius', /--md-sys-shape-corner-extra-small/)
    ).toBe(true);
  });

  it('applies elevation level 3', () => {
    expect(hasDecl(/\.toast$/, 'box-shadow', /--md-sys-elevation-level3/)).toBe(true);
  });

  it('has a single-line min-height of 48dp', () => {
    expect(declValues(/\.toast$/, 'min-height')).toContain('48px');
  });

  it('constrains width to 344dp min and 672dp max', () => {
    expect(declValues(/\.toast$/, 'min-width')).toContain('344px');
    expect(declValues(/\.toast$/, 'max-width')).toContain('672px');
  });

  it('supports two lines by leaving height auto', () => {
    expect(declValues(/\.toast$/, 'height')).toContain('auto');
  });

  it('labels use the body-medium typescale', () => {
    const text = declText(/\.toast$/);
    expect(text).toMatch(/--md-sys-typescale-body-medium-font-size/);
    expect(text).toMatch(/--md-sys-typescale-body-medium-line-height/);
  });

  it('gives the action label the inverse-primary role', () => {
    expect(
      hasDecl(/\.toast \.toast-action$/, 'color', /--md-sys-color-inverse-primary/)
    ).toBe(true);
  });

  it('gives the action label the label-large typescale', () => {
    const text = declText(/\.toast \.toast-action$/);
    expect(text).toMatch(/--md-sys-typescale-label-large-font-size/);
    expect(text).toMatch(/--md-sys-typescale-label-large-font-weight/);
  });

  it('styles the close icon as inverse-on-surface at 24dp', () => {
    expect(
      hasDecl(/\.toast \.toast-close$/, 'color', /--md-sys-color-inverse-on-surface/)
    ).toBe(true);
    expect(declValues(/\.toast \.toast-close$/, 'width')).toContain('24px');
    expect(declValues(/\.toast \.toast-close$/, 'height')).toContain('24px');
  });

  it('uses motion tokens for transitions (no ad-hoc easing)', () => {
    expect(declText(/\.toast$/)).toMatch(/--md-sys-motion-easing-standard/);
  });

  it('keeps the fixed container above other content', () => {
    expect(declValues(/#toast-container$/, 'z-index')).toContain('10000');
  });

  it('still exposes the rounded variant', () => {
    expect(rulesMatching(/\.toast\.rounded$/).length).toBeGreaterThan(0);
  });
});
