import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Date picker compliance — https://m3.material.io/components/date-pickers/specs
// These assertions read the compiled library CSS and check the datepicker rules
// against the spec's container, shape, elevation, color roles and state layers.
describe('M3 Date picker', () => {
  it('uses surface-container-high for the picker container', () => {
    expect(
      hasDecl(/\.datepicker-container$/, 'background-color', /--md-sys-color-surface-container-high/)
    ).toBe(true);
  });

  it('gives the container elevation level 3', () => {
    expect(hasDecl(/\.datepicker-container$/, 'box-shadow', /--md-sys-elevation-level3/)).toBe(true);
  });

  it('uses on-surface for container text and the headline', () => {
    expect(hasDecl(/\.datepicker-container$/, 'color', /--md-sys-color-on-surface/)).toBe(true);
    expect(
      hasDecl(/\.datepicker-date-display \.date-text$/, 'color', /--md-sys-color-on-surface/)
    ).toBe(true);
  });

  it('uses a medium (12dp) corner for the docked container', () => {
    expect(
      hasDecl(/\.datepicker-container$/, 'border-radius', /--md-sys-shape-corner-medium/)
    ).toBe(true);
  });

  it('uses an extra-large (28dp) corner for the modal variant', () => {
    expect(hasDecl(/\.datepicker-modal$/, 'border-radius', /--md-sys-shape-corner-extra-large/)).toBe(
      true
    );
  });

  it('gives the modal surface-container-high and elevation level 3', () => {
    expect(
      hasDecl(/\.datepicker-modal$/, 'background-color', /--md-sys-color-surface-container-high/)
    ).toBe(true);
    expect(hasDecl(/\.datepicker-modal$/, 'box-shadow', /--md-sys-elevation-level3/)).toBe(true);
  });

  it('renders the day button as a fully-rounded shape', () => {
    expect(
      hasDecl(/\.datepicker-day-button$/, 'border-radius', /--md-sys-shape-corner-full/)
    ).toBe(true);
  });

  it('gives regular days on-surface labels', () => {
    expect(hasDecl(/\.datepicker-table \.datepicker-day$/, 'color', /--md-sys-color-on-surface/)).toBe(
      true
    );
  });

  it('fills the selected day with primary and labels it on-primary', () => {
    expect(
      hasDecl(
        /\.datepicker-day\.is-selected \.datepicker-day-button$/,
        'background-color',
        /--md-sys-color-primary/
      )
    ).toBe(true);
    expect(
      hasDecl(
        /\.datepicker-day\.is-selected \.datepicker-day-button$/,
        'color',
        /--md-sys-color-on-primary/
      )
    ).toBe(true);
  });

  it('marks today with a 1dp primary outline and primary label', () => {
    expect(
      hasDecl(/\.datepicker-day\.is-today \.datepicker-day-button$/, 'border', /1px solid var\(--md-sys-color-primary\)/)
    ).toBe(true);
    expect(
      hasDecl(/\.datepicker-day\.is-today \.datepicker-day-button$/, 'color', /--md-sys-color-primary/)
    ).toBe(true);
  });

  it('renders a state layer that is invisible until hover/focus/press', () => {
    expect(hasDecl(/\.datepicker-day-button::before$/, 'opacity', /^0$/)).toBe(true);
    expect(hasDecl(/\.datepicker-day-button::before$/, 'background-color', /--md-sys-color-on-surface/)).toBe(
      true
    );
    expect(
      hasDecl(/\.datepicker-day-button:hover::before$/, 'opacity', /hover-state-layer-opacity/)
    ).toBe(true);
    expect(
      hasDecl(/\.datepicker-day-button:focus::before$/, 'opacity', /focus-state-layer-opacity/)
    ).toBe(true);
    expect(
      hasDecl(/\.datepicker-day-button:active::before$/, 'opacity', /pressed-state-layer-opacity/)
    ).toBe(true);
  });

  it('tints the selected-day state layer with on-primary', () => {
    const layer = rulesMatching(/\.datepicker-day\.is-selected \.datepicker-day-button/);
    const text = layer.map((r) => r.toString()).join('\n');
    expect(text).toMatch(/--md-sys-color-on-primary/);
  });

  it('uses body-small tokens for the weekday labels', () => {
    expect(declText(/\.datepicker-table abbr$/)).toMatch(/--md-sys-typescale-body-small-font-size/);
    expect(hasDecl(/\.datepicker-table abbr$/, 'color', /--md-sys-color-on-surface-variant/)).toBe(
      true
    );
  });

  it('uses body-large font tokens for the day labels', () => {
    expect(declText(/\.datepicker-day-button$/)).toMatch(/--md-sys-typescale-body-large-font-size/);
  });

  it('paints the range selection track with primary-container', () => {
    expect(
      hasDecl(/\.datepicker-day\.is-daterange/, 'background-color', /--md-sys-color-primary-container/)
    ).toBe(true);
  });

  it('dims disabled and outside-month days to 38% on-surface', () => {
    const values = declValues(
      /\.datepicker-day\.is-(disabled|outside-current-month) \.datepicker-day-button/,
      'color'
    );
    expect(values.some((v) => /on-surface/.test(v) && /38%/.test(v))).toBe(true);
  });

  it('uses motion tokens for the day-button transition (no ad-hoc easing)', () => {
    expect(declText(/\.datepicker-day-button$/)).toMatch(/--md-sys-motion-easing-standard/);
  });
});
