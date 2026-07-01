import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Menu (Dropdown) compliance — https://m3.material.io/components/menus/specs
// These assertions read the compiled library CSS and check the dropdown rules
// against the spec's container surface, shape, elevation, list-item metrics,
// typography, icon roles and state layers.
describe('M3 Dropdown (Menu)', () => {
  const container = /\.dropdown-content$/;
  const item = /\.dropdown-content li$/;
  const itemLink = /\.dropdown-content li > a, \.dropdown-content li > span$/;

  it('uses a surface-container background for the menu container', () => {
    expect(hasDecl(container, 'background-color', /--md-sys-color-surface-container/)).toBe(true);
  });

  it('uses the extra-small (4dp) corner shape', () => {
    expect(hasDecl(container, 'border-radius', /--md-sys-shape-corner-extra-small/)).toBe(true);
  });

  it('applies elevation level 2', () => {
    expect(hasDecl(container, 'box-shadow', /--md-sys-elevation-level2/)).toBe(true);
  });

  it('constrains width to 112dp..280dp', () => {
    expect(declValues(container, 'min-width')).toContain('112px');
    expect(declValues(container, 'max-width')).toContain('280px');
  });

  it('applies 8dp vertical padding to the container', () => {
    expect(declValues(container, 'padding-top')).toContain('8px');
    expect(declValues(container, 'padding-bottom')).toContain('8px');
  });

  it('gives list items a 48dp minimum height', () => {
    expect(declValues(item, 'min-height')).toContain('48px');
  });

  it('colors list items with on-surface', () => {
    expect(hasDecl(item, 'color', /--md-sys-color-on-surface/)).toBe(true);
  });

  it('renders item labels with the label-large typescale', () => {
    const text = declText(itemLink);
    expect(text).toMatch(/--md-sys-typescale-label-large-font-size/);
    expect(text).toMatch(/--md-sys-typescale-label-large-font-weight/);
    expect(text).toMatch(/--md-sys-typescale-label-large-line-height/);
    expect(text).toMatch(/--md-sys-typescale-label-large-letter-spacing/);
  });

  it('colors item labels with on-surface', () => {
    expect(hasDecl(itemLink, 'color', /--md-sys-color-on-surface/)).toBe(true);
  });

  it('applies 12dp horizontal padding to item labels', () => {
    expect(declValues(itemLink, 'padding')).toContain('0 12px');
  });

  it('sizes leading/trailing icons at 24dp with on-surface-variant', () => {
    const icon = /\.dropdown-content li > a > i, \.dropdown-content li > span > i$/;
    expect(declValues(icon, 'width')).toContain('24px');
    expect(declValues(icon, 'height')).toContain('24px');
    expect(hasDecl(icon, 'color', /--md-sys-color-on-surface-variant/)).toBe(true);
  });

  it('renders a state layer that only appears on hover/focus/press', () => {
    expect(hasDecl(/\.dropdown-content li::before/, 'opacity', /^0$/)).toBe(true);
    expect(
      hasDecl(/\.dropdown-content li:hover::before/, 'opacity', /hover-state-layer-opacity/)
    ).toBe(true);
    expect(
      hasDecl(/\.dropdown-content li:focus-visible::before/, 'opacity', /focus-state-layer-opacity/)
    ).toBe(true);
    expect(
      hasDecl(/\.dropdown-content li:active::before/, 'opacity', /pressed-state-layer-opacity/)
    ).toBe(true);
  });

  it('tints the state layer with on-surface', () => {
    expect(
      hasDecl(/\.dropdown-content li::before/, 'background-color', /--md-sys-color-on-surface/)
    ).toBe(true);
  });

  it('dims disabled items to 38% on-surface', () => {
    const disabled = /\.dropdown-content li\.disabled > a/;
    expect(hasDecl(disabled, 'opacity', /0\.38/)).toBe(true);
    expect(hasDecl(disabled, 'color', /--md-sys-color-on-surface/)).toBe(true);
    expect(rulesMatching(/\.dropdown-content li\.disabled/).length).toBeGreaterThan(0);
  });
});
