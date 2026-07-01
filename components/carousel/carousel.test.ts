import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Carousel compliance — https://m3.material.io/components/carousel/specs
// These assertions read the compiled library CSS and check the carousel rules
// against the spec's shape (corner large / extra-large), color roles, state
// layers and motion tokens. They intentionally only cover the styling the
// stylesheet owns — carousel.ts sets item layout (width/height/transform/
// opacity/visibility) inline at runtime and is not exercised here.
describe('M3 Carousel', () => {
  it('gives carousel items the large (16dp) corner shape', () => {
    expect(
      hasDecl(/^\.carousel \.carousel-item$/, 'border-radius', /--md-sys-shape-corner-large/)
    ).toBe(true);
    // The `large` corner token resolves to 16dp.
    expect(declValues(/:root/, '--md-sys-shape-corner-large')).toContain('16px');
  });

  it('uses surface / on-surface color roles for items', () => {
    expect(
      hasDecl(/^\.carousel \.carousel-item$/, 'background-color', /--md-sys-color-surface/)
    ).toBe(true);
    expect(hasDecl(/^\.carousel \.carousel-item$/, 'color', /--md-sys-color-on-surface/)).toBe(true);
  });

  it('roots the carousel on the surface color role', () => {
    expect(hasDecl(/^\.carousel$/, 'background-color', /--md-sys-color-surface/)).toBe(true);
    expect(hasDecl(/^\.carousel$/, 'color', /--md-sys-color-on-surface/)).toBe(true);
  });

  it('renders a state layer that only appears on hover/focus/press', () => {
    expect(hasDecl(/\.carousel-item::before$/, 'opacity', /^0$/)).toBe(true);
    expect(
      hasDecl(
        /\.carousel-item:hover::before$/,
        'opacity',
        /--md-sys-state-hover-state-layer-opacity/
      )
    ).toBe(true);
    expect(
      hasDecl(
        /\.carousel-item:focus-visible::before$/,
        'opacity',
        /--md-sys-state-focus-state-layer-opacity/
      )
    ).toBe(true);
    expect(
      hasDecl(
        /\.carousel-item:active::before$/,
        'opacity',
        /--md-sys-state-pressed-state-layer-opacity/
      )
    ).toBe(true);
  });

  it('tints the state layer with the on-surface role', () => {
    expect(
      hasDecl(/\.carousel-item::before$/, 'background-color', /--md-sys-color-on-surface/)
    ).toBe(true);
  });

  it('scrims text overlays so on-surface text stays legible', () => {
    const text = declText(/\.carousel-caption,|\.carousel-overlay$/);
    expect(text).toMatch(/--md-sys-color-scrim/);
    expect(text).toMatch(/--md-sys-color-on-surface/);
  });

  it('uses motion tokens for item and indicator transitions (no ad-hoc easing)', () => {
    expect(declText(/^\.carousel \.carousel-item$/)).toMatch(/--md-sys-motion-easing-standard/);
    expect(declText(/^\.carousel \.carousel-item$/)).toMatch(/--md-sys-motion-duration-/);
    expect(declText(/\.carousel \.indicators \.indicator-item$/)).toMatch(
      /--md-sys-motion-easing-standard/
    );
  });

  it('colors indicators with M3 roles (on-surface idle, primary active)', () => {
    expect(
      hasDecl(
        /\.carousel \.indicators \.indicator-item$/,
        'background-color',
        /--md-sys-color-on-surface/
      )
    ).toBe(true);
    expect(
      hasDecl(
        /\.carousel \.indicators \.indicator-item\.active$/,
        'background-color',
        /--md-sys-color-primary/
      )
    ).toBe(true);
  });

  it('rounds indicators with the full corner shape (no magic 50%)', () => {
    expect(
      hasDecl(
        /\.carousel \.indicators \.indicator-item$/,
        'border-radius',
        /--md-sys-shape-corner-full/
      )
    ).toBe(true);
  });

  it('exposes the M3 layout variant classes', () => {
    expect(rulesMatching(/\.carousel\.multi-browse/).length).toBeGreaterThan(0);
    expect(rulesMatching(/\.carousel\.uncontained/).length).toBeGreaterThan(0);
    expect(rulesMatching(/\.carousel\.hero/).length).toBeGreaterThan(0);
    expect(rulesMatching(/\.carousel\.full-screen/).length).toBeGreaterThan(0);
  });

  it('full-screen items use the extra-large (28dp) corner', () => {
    expect(
      hasDecl(
        /\.carousel\.full-screen \.carousel-item$/,
        'border-radius',
        /--md-sys-shape-corner-extra-large/
      )
    ).toBe(true);
    expect(declValues(/:root/, '--md-sys-shape-corner-extra-large')).toContain('28px');
  });

  it('multi-browse and hero variants keep the large item corner', () => {
    expect(
      hasDecl(/\.carousel\.multi-browse \.carousel-item$/, 'border-radius', /corner-large/)
    ).toBe(true);
    expect(hasDecl(/\.carousel\.hero \.carousel-item$/, 'border-radius', /corner-large/)).toBe(true);
  });

  it('full-width slider items stay square-cornered (edge to edge)', () => {
    expect(hasDecl(/\.carousel\.carousel-slider \.carousel-item$/, 'border-radius', /^0$/)).toBe(
      true
    );
  });
});
