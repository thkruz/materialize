import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Navigation drawer compliance —
// https://m3.material.io/components/navigation-drawer/specs
// Materialize calls the component "sidenav". These assertions read the compiled
// library CSS and check the sidenav rules against the spec's dimensions, color
// roles, shape, type and state layers.
describe('M3 Navigation drawer (sidenav)', () => {
  it('sets the drawer width to 360dp', () => {
    // The width is driven by a custom prop; assert the value the drawer uses.
    expect(declValues(/^\.sidenav$/, '--sidenav-width')).toContain('360px');
    expect(hasDecl(/^\.sidenav$/, 'width', /--sidenav-width/)).toBe(true);
  });

  it('uses surface-container-low + elevation for the modal container', () => {
    expect(hasDecl(/^\.sidenav$/, 'background-color', /--md-sys-color-surface-container-low/)).toBe(
      true
    );
    expect(hasDecl(/^\.sidenav$/, 'box-shadow', /--md-sys-elevation-level1/)).toBe(true);
  });

  it('uses surface with no elevation for the standard (fixed) container', () => {
    expect(hasDecl(/\.sidenav\.sidenav-fixed$/, 'background-color', /--md-sys-color-surface\)/)).toBe(
      true
    );
    expect(hasDecl(/\.sidenav\.sidenav-fixed$/, 'box-shadow', /^none$/)).toBe(true);
  });

  it('makes drawer items 56dp tall', () => {
    expect(declValues(/^\.sidenav$/, '--sidenav-item-height')).toContain('56px');
    expect(hasDecl(/\.sidenav li > a$/, 'height', /--sidenav-item-height/)).toBe(true);
  });

  it('gives drawer items 16dp horizontal padding', () => {
    expect(declValues(/^\.sidenav$/, '--sidenav-padding')).toContain('16px');
    expect(hasDecl(/\.sidenav li > a$/, 'padding', /--sidenav-padding/)).toBe(true);
  });

  it('uses a 12dp gap between the leading icon and the label', () => {
    expect(declValues(/^\.sidenav$/, '--sidenav-icon-gap')).toContain('12px');
    expect(
      hasDecl(/\.sidenav li > a > \.material-icons/, 'margin-right', /--sidenav-icon-gap/)
    ).toBe(true);
  });

  it('uses a full/28dp rounded shape for drawer items', () => {
    expect(hasDecl(/\.sidenav li > a$/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
  });

  it('styles drawer item labels with the label-large typescale', () => {
    const text = declText(/\.sidenav li > a$/);
    expect(text).toMatch(/--md-sys-typescale-label-large-font-size/);
    expect(text).toMatch(/--md-sys-typescale-label-large-line-height/);
  });

  it('paints inactive items transparent with on-surface-variant text', () => {
    const inactive = /\.sidenav li > a:not\(\.btn\)/;
    expect(hasDecl(inactive, 'color', /--md-sys-color-on-surface-variant/)).toBe(true);
    expect(hasDecl(inactive, 'background-color', /^transparent$/)).toBe(true);
  });

  it('gives the active item a secondary-container active indicator', () => {
    const active = /li\.active\s+>\s+a/;
    expect(hasDecl(active, 'background-color', /--md-sys-color-secondary-container/)).toBe(true);
    expect(hasDecl(active, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
  });

  it('colors the active item label + icon on-secondary-container', () => {
    const active = /li\.active\s+>\s+a/;
    expect(hasDecl(active, 'color', /--md-sys-color-on-secondary-container/)).toBe(true);
    // the leading icon within the active item also recolors
    const activeIcon = /li\.active[\s\S]*\.material-icons/;
    expect(hasDecl(activeIcon, 'color', /--md-sys-color-on-secondary-container/)).toBe(true);
  });

  it('renders on-surface-variant state layers on hover/focus/press for inactive items', () => {
    expect(
      hasDecl(/\.sidenav li > a:not\(.*\):hover$/, 'background-color', /--md-sys-color-on-surface-variant/)
    ).toBe(true);
    expect(
      hasDecl(/\.sidenav li > a:not\(.*\):hover$/, 'background-color', /hover-state-layer-opacity/)
    ).toBe(true);
    expect(
      hasDecl(/\.sidenav li > a:not\(.*\):focus$/, 'background-color', /focus-state-layer-opacity/)
    ).toBe(true);
    expect(
      hasDecl(/\.sidenav li > a:not\(.*\):active$/, 'background-color', /pressed-state-layer-opacity/)
    ).toBe(true);
  });

  it('styles section headers with title-small and on-surface-variant', () => {
    const sub = /\.sidenav \.subheader$/;
    expect(hasDecl(sub, 'color', /--md-sys-color-on-surface-variant/)).toBe(true);
    expect(hasDecl(sub, 'font-size', /--md-sys-typescale-title-small-font-size/)).toBe(true);
    // the pre-M3 code hard-coded `color: red` — make sure that's gone
    expect(hasDecl(sub, 'color', /^red$/)).toBe(false);
  });

  it('renders dividers as 1dp outline-variant', () => {
    const divider = /\.sidenav \.divider$/;
    expect(hasDecl(divider, 'height', /^1px$/)).toBe(true);
    expect(hasDecl(divider, 'background-color', /--md-sys-color-outline-variant/)).toBe(true);
  });

  it('tints the modal scrim with the scrim color at 32%', () => {
    const overlay = /\.sidenav-overlay$/;
    expect(hasDecl(overlay, 'background-color', /--md-sys-color-scrim/)).toBe(true);
    expect(hasDecl(overlay, 'background-color', /32%/)).toBe(true);
  });

  it('uses motion tokens for the item background transition', () => {
    expect(declText(/\.sidenav li > a$/)).toMatch(/--md-sys-motion-easing-standard/);
  });

  it('does not rename any of the contract selectors', () => {
    expect(rulesMatching(/^\.sidenav$/).length).toBeGreaterThan(0);
    expect(rulesMatching(/\.sidenav\.sidenav-fixed/).length).toBeGreaterThan(0);
    expect(rulesMatching(/\.sidenav-overlay$/).length).toBeGreaterThan(0);
    expect(rulesMatching(/\.drag-target/).length).toBeGreaterThan(0);
    expect(rulesMatching(/li\.active\s+>\s+a/).length).toBeGreaterThan(0);
  });
});
