import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Time picker compliance — https://m3.material.io/components/time-pickers/specs
// These assertions read the compiled library CSS and check the timepicker
// rules against the spec's container/shape/elevation, dial surface, selector
// and hand colors, selected/unselected time-field treatment and AM/PM toggle.
describe('M3 Time picker', () => {
  it('uses surface-container-high for the picker container', () => {
    expect(
      hasDecl(/\.timepicker-container$/, 'background-color', /--md-sys-color-surface-container-high\b/)
    ).toBe(true);
  });

  it('applies the extra-large (28dp) corner to the container', () => {
    expect(
      hasDecl(/\.timepicker-container$/, 'border-radius', /--md-sys-shape-corner-extra-large/)
    ).toBe(true);
  });

  it('raises the container to elevation level 3', () => {
    expect(
      hasDecl(/\.timepicker-container$/, 'box-shadow', /--md-sys-elevation-level3/)
    ).toBe(true);
  });

  it('applies the same M3 container treatment to the modal variant', () => {
    expect(
      hasDecl(/\.timepicker-modal$/, 'background-color', /--md-sys-color-surface-container-high\b/)
    ).toBe(true);
    expect(
      hasDecl(/\.timepicker-modal$/, 'border-radius', /--md-sys-shape-corner-extra-large/)
    ).toBe(true);
    expect(hasDecl(/\.timepicker-modal$/, 'box-shadow', /--md-sys-elevation-level3/)).toBe(true);
  });

  it('gives the dial a surface-container-highest background', () => {
    expect(
      hasDecl(/\.timepicker-plate$/, 'background-color', /--md-sys-color-surface-container-highest/)
    ).toBe(true);
  });

  it('renders the dial as a full (circular) shape', () => {
    expect(hasDecl(/\.timepicker-plate$/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
  });

  it('draws the clock hand in primary', () => {
    const canvas = rulesMatching(/\.timepicker-canvas line$/);
    const text = canvas.map((r) => r.toString()).join('\n');
    expect(text).toMatch(/stroke:\s*var\(--md-sys-color-primary\)/);
  });

  it('colors the selector puck (bg) in primary', () => {
    expect(hasDecl(/\.timepicker-canvas-bg$/, 'fill', /--md-sys-color-primary\b/)).toBe(true);
  });

  it('colors the center dot (bearing) in primary', () => {
    expect(hasDecl(/\.timepicker-canvas-bearing$/, 'fill', /--md-sys-color-primary\b/)).toBe(true);
  });

  it('reads the selected dial number as on-primary', () => {
    expect(hasDecl(/\.timepicker-tick\.active$/, 'color', /--md-sys-color-on-primary\b/)).toBe(true);
  });

  it('uses surface-container-highest + on-surface for an unselected time field', () => {
    expect(
      hasDecl(
        /input\[type=text\]\.timepicker-input-hours/,
        'background-color',
        /--md-sys-color-surface-container-highest/
      )
    ).toBe(true);
    expect(
      hasDecl(
        /input\[type=text\]\.timepicker-input-hours/,
        'color',
        /--md-sys-color-on-surface\b/
      )
    ).toBe(true);
  });

  it('uses primary-container + on-primary-container for the selected time field', () => {
    expect(
      hasDecl(
        /\.timepicker-input-hours:focus/,
        'background-color',
        /--md-sys-color-primary-container/
      )
    ).toBe(true);
    expect(
      hasDecl(/\.timepicker-input-hours:focus/, 'color', /--md-sys-color-on-primary-container/)
    ).toBe(true);
  });

  it('uses tertiary-container for the selected AM/PM segment', () => {
    expect(
      hasDecl(/\.am-btn\.filled/, 'background-color', /--md-sys-color-tertiary-container/)
    ).toBe(true);
    expect(
      hasDecl(/\.am-btn\.filled/, 'color', /--md-sys-color-on-tertiary-container/)
    ).toBe(true);
  });

  it('outlines the unselected AM/PM segments with the outline role', () => {
    expect(
      hasDecl(/\.timepicker-container \.am-btn/, 'border', /--md-sys-color-outline/)
    ).toBe(true);
  });

  it('labels the headline/text container in on-surface-variant', () => {
    expect(
      hasDecl(/\.timepicker-text-container$/, 'color', /--md-sys-color-on-surface-variant/)
    ).toBe(true);
  });

  it('uses motion tokens for transitions (no ad-hoc easing)', () => {
    expect(declText(/\.timepicker-dial$/)).toMatch(/--md-sys-motion-easing-standard/);
  });

  it('does not leave legacy surface-variant on the dial or fields', () => {
    expect(declValues(/\.timepicker-plate$/, 'background-color')).not.toContain(
      'var(--md-sys-color-surface-variant)'
    );
  });
});
