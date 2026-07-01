import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Chip compliance — https://m3.material.io/components/chips/specs
// These assertions read the compiled library CSS and check the chip rules
// against the spec's dimensions, color roles, shape, state layers and the
// per-type container/border/label treatments.
describe('M3 Chip', () => {
  it('is 32dp tall', () => {
    expect(declValues(/^\.chip$/, 'height')).toContain('32px');
  });

  it('uses the small (8dp) corner shape token', () => {
    expect(hasDecl(/^\.chip$/, 'border-radius', /--md-sys-shape-corner-small/)).toBe(true);
  });

  it('uses the label-large typescale for the label', () => {
    const text = declText(/^\.chip$/);
    expect(text).toMatch(/--md-sys-typescale-label-large-font-size/);
    expect(text).toMatch(/--md-sys-typescale-label-large-font-weight/);
    expect(text).toMatch(/--md-sys-typescale-label-large-line-height/);
  });

  it('sizes leading/trailing icons at 18dp', () => {
    expect(declValues(/^\.chip$/, '--font-size-icon')).toContain('18px');
    expect(declValues(/^\.chip > \.material-icons$/, 'width')).toContain('18px');
    expect(declValues(/^\.chip > \.material-icons$/, 'height')).toContain('18px');
  });

  it('sizes the leading avatar image at 24dp and fully rounds it', () => {
    expect(declValues(/^\.chip > img$/, 'width')).toContain('24px');
    expect(declValues(/^\.chip > img$/, 'height')).toContain('24px');
    expect(hasDecl(/^\.chip > img$/, 'border-radius', /50%/)).toBe(true);
  });

  it('uses motion tokens for transitions (no ad-hoc easing)', () => {
    expect(declText(/^\.chip$/)).toMatch(/--md-sys-motion-easing-standard/);
  });

  // ---------------------------------------------------------------- //
  //  State layer
  // ---------------------------------------------------------------- //
  it('renders a state layer that is invisible at rest', () => {
    expect(hasDecl(/^\.chip::before$/, 'opacity', /^0$/)).toBe(true);
    // Tinted with the label color role.
    expect(hasDecl(/^\.chip::before$/, 'background-color', /currentColor/i)).toBe(true);
  });

  it('applies the 8% hover state-layer opacity', () => {
    expect(hasDecl(/\.chip:hover::before$/, 'opacity', /hover-state-layer-opacity/)).toBe(true);
  });

  it('applies the 10% focus state-layer opacity', () => {
    expect(hasDecl(/\.chip:focus::before$/, 'opacity', /focus-state-layer-opacity/)).toBe(true);
  });

  it('applies the 10% pressed state-layer opacity', () => {
    expect(hasDecl(/\.chip:active::before$/, 'opacity', /pressed-state-layer-opacity/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Assist chip
  // ---------------------------------------------------------------- //
  it('assist chip: transparent container with 1dp outline border and on-surface label', () => {
    expect(hasDecl(/^\.chip\.assist$/, 'background-color', /transparent/)).toBe(true);
    expect(hasDecl(/^\.chip\.assist$/, 'border-width', /1px/)).toBe(true);
    expect(hasDecl(/^\.chip\.assist$/, 'border-color', /--md-sys-color-outline/)).toBe(true);
    expect(hasDecl(/^\.chip\.assist$/, 'color', /--md-sys-color-on-surface\b/)).toBe(true);
  });

  it('assist chip: leading icon uses the primary role', () => {
    expect(hasDecl(/^\.chip\.assist > \.material-icons$/, 'color', /--md-sys-color-primary/)).toBe(true);
  });

  it('elevated chip: surface-container-low bg + elevation level 1, no border', () => {
    expect(hasDecl(/\.chip\.elevated/, 'background-color', /--md-sys-color-surface-container-low/)).toBe(true);
    expect(hasDecl(/\.chip\.elevated/, 'box-shadow', /--md-sys-elevation-level1/)).toBe(true);
    expect(hasDecl(/\.chip\.elevated/, 'border-width', /^0$/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Filter chip
  // ---------------------------------------------------------------- //
  it('filter chip (unselected): transparent container, 1dp outline, on-surface-variant label', () => {
    expect(hasDecl(/^\.chip\.filter$/, 'background-color', /transparent/)).toBe(true);
    expect(hasDecl(/^\.chip\.filter$/, 'border-width', /1px/)).toBe(true);
    expect(hasDecl(/^\.chip\.filter$/, 'border-color', /--md-sys-color-outline/)).toBe(true);
    expect(hasDecl(/^\.chip\.filter$/, 'color', /--md-sys-color-on-surface-variant/)).toBe(true);
  });

  it('filter chip (selected): secondary-container bg, on-secondary-container label, no border', () => {
    expect(hasDecl(/^\.chip\.filter\.selected$/, 'background-color', /--md-sys-color-secondary-container/)).toBe(true);
    expect(hasDecl(/^\.chip\.filter\.selected$/, 'color', /--md-sys-color-on-secondary-container/)).toBe(true);
    expect(hasDecl(/^\.chip\.filter\.selected$/, 'border-width', /^0$/)).toBe(true);
  });

  it('filter chip (selected): leading check icon takes on-secondary-container', () => {
    expect(
      hasDecl(/^\.chip\.filter\.selected > \.material-icons$/, 'color', /--md-sys-color-on-secondary-container/)
    ).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Input chip
  // ---------------------------------------------------------------- //
  it('input chip: transparent container, 1dp outline, on-surface-variant label', () => {
    expect(hasDecl(/^\.chip\.input$/, 'background-color', /transparent/)).toBe(true);
    expect(hasDecl(/^\.chip\.input$/, 'border-width', /1px/)).toBe(true);
    expect(hasDecl(/^\.chip\.input$/, 'border-color', /--md-sys-color-outline/)).toBe(true);
    expect(hasDecl(/^\.chip\.input$/, 'color', /--md-sys-color-on-surface-variant/)).toBe(true);
  });

  it('input chip: trailing close icon is 18dp and on-surface-variant', () => {
    expect(declValues(/^\.chip \.close$/, 'width')).toContain('18px');
    expect(declValues(/^\.chip \.close$/, 'height')).toContain('18px');
    expect(hasDecl(/^\.chip\.input \.close$/, 'color', /--md-sys-color-on-surface-variant/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Suggestion chip
  // ---------------------------------------------------------------- //
  it('suggestion chip: transparent container, 1dp outline, on-surface-variant label', () => {
    expect(hasDecl(/^\.chip\.suggestion$/, 'background-color', /transparent/)).toBe(true);
    expect(hasDecl(/^\.chip\.suggestion$/, 'border-width', /1px/)).toBe(true);
    expect(hasDecl(/^\.chip\.suggestion$/, 'border-color', /--md-sys-color-outline/)).toBe(true);
    expect(hasDecl(/^\.chip\.suggestion$/, 'color', /--md-sys-color-on-surface-variant/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Disabled
  // ---------------------------------------------------------------- //
  it('disabled chip: on-surface 38% label, 12% container, 12% border', () => {
    const text = declText(/\.chip\.disabled/);
    // label 38%
    expect(text).toMatch(/color:\s*color-mix\(in srgb, var\(--md-sys-color-on-surface\) 38%/);
    // container 12%
    expect(text).toMatch(/background-color:\s*color-mix\(in srgb, var\(--md-sys-color-on-surface\) 12%/);
    // border 12%
    expect(text).toMatch(/border-color:\s*color-mix\(in srgb, var\(--md-sys-color-on-surface\) 12%/);
  });

  it('disabled chip: suppresses the state layer', () => {
    expect(hasDecl(/\.chip\.disabled::before/, 'opacity', /^0$/)).toBe(true);
  });

  // ---------------------------------------------------------------- //
  //  Markup contract preserved
  // ---------------------------------------------------------------- //
  it('keeps the historical class contract', () => {
    expect(rulesMatching(/^\.chip$/).length).toBeGreaterThan(0);
    expect(rulesMatching(/^\.chip \.close$/).length).toBeGreaterThan(0);
    expect(rulesMatching(/^\.chips$/).length).toBeGreaterThan(0);
    expect(rulesMatching(/^\.chip > img$/).length).toBeGreaterThan(0);
    expect(rulesMatching(/^\.chip > \.material-icons$/).length).toBeGreaterThan(0);
  });
});
