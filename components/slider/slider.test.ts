import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Slider (range) compliance — https://m3.material.io/components/sliders/specs
// These assertions read the compiled library CSS and check the range rules
// against the spec's dimensions, color roles, shape and state layers.
// Materialize markup contract: .range-field > input[type=range] + .thumb > .value
describe('M3 Slider (range)', () => {
  it('defines the 4dp track height token', () => {
    expect(declValues(/\.range-field$/, '--md-comp-slider-track-height')).toContain('4px');
  });

  it('defines the 20dp handle-size token', () => {
    expect(declValues(/\.range-field$/, '--md-comp-slider-handle-size')).toContain('20px');
  });

  it('defines the 40dp state-layer-size token', () => {
    expect(declValues(/\.range-field$/, '--md-comp-slider-state-layer-size')).toContain('40px');
  });

  it('gives the track a 4dp height (webkit + moz pseudo-tracks)', () => {
    expect(hasDecl(/::-webkit-slider-runnable-track/, 'height', /--md-comp-slider-track-height/)).toBe(true);
    expect(hasDecl(/::-moz-range-track/, 'height', /--md-comp-slider-track-height/)).toBe(true);
  });

  it('uses surface-container-highest for the inactive track', () => {
    expect(hasDecl(/::-webkit-slider-runnable-track/, 'background-color', /--md-sys-color-surface-container-highest/)).toBe(true);
    expect(hasDecl(/::-moz-range-track/, 'background-color', /--md-sys-color-surface-container-highest/)).toBe(true);
    // The base input paints the inactive track too.
    expect(hasDecl(/^input\[type=range\]$/, 'background', /--md-sys-color-surface-container-highest/)).toBe(true);
  });

  it('uses primary for the active (filled) track', () => {
    expect(hasDecl(/::-moz-range-progress/, 'background', /--md-sys-color-primary/)).toBe(true);
  });

  it('rounds the track ends (corner-full)', () => {
    expect(hasDecl(/::-webkit-slider-runnable-track/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
    expect(hasDecl(/::-moz-range-track/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
  });

  it('handle is 20dp, primary, fully rounded (webkit + moz thumbs)', () => {
    for (const sel of [/::-webkit-slider-thumb/, /::-moz-range-thumb/]) {
      expect(hasDecl(sel, 'width', /--md-comp-slider-handle-size/)).toBe(true);
      expect(hasDecl(sel, 'height', /--md-comp-slider-handle-size/)).toBe(true);
      expect(hasDecl(sel, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
      expect(hasDecl(sel, 'background', /--md-sys-color-primary/)).toBe(true);
    }
  });

  it('value label container uses primary', () => {
    expect(hasDecl(/input\[type=range\] \+ \.thumb$/, 'background-color', /--md-sys-color-primary/)).toBe(true);
  });

  it('value label text uses on-primary', () => {
    const thumbValue = rulesMatching(/input\[type=range\] \+ \.thumb .value/);
    const text = thumbValue.map((r) => r.toString()).join('\n');
    expect(text).toMatch(/color:\s*var\(--md-sys-color-on-primary\)/);
  });

  it('value label uses a fully-rounded container shape', () => {
    expect(hasDecl(/input\[type=range\] \+ \.thumb$/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
  });

  it('renders a primary state layer on keyboard focus', () => {
    expect(hasDecl(/\.keyboard-focused input\[type=range\]:focus:not\(\.active\)::-webkit-slider-thumb/, 'box-shadow', /--md-sys-color-primary/)).toBe(true);
    expect(hasDecl(/\.keyboard-focused input\[type=range\]:focus:not\(\.active\)::-moz-range-thumb/, 'box-shadow', /--md-sys-color-primary/)).toBe(true);
  });

  it('uses the focus state-layer opacity token (not a hardcoded %) for the handle state layer', () => {
    expect(hasDecl(/\.keyboard-focused input\[type=range\]:focus:not\(\.active\)::-webkit-slider-thumb/, 'box-shadow', /--md-sys-state-focus-state-layer-opacity/)).toBe(true);
  });

  it('value label text uses the label-large type token (not a hardcoded font-size)', () => {
    expect(hasDecl(/input\[type=range\] \+ \.thumb\.active \.value/, 'font-size', /--md-sys-typescale-label-large-font-size/)).toBe(true);
  });

  it('uses motion tokens for transitions (no ad-hoc easing)', () => {
    expect(declText(/input\[type=range\] \+ \.thumb$/)).toMatch(/--md-sys-motion-easing-emphasized/);
    expect(declText(/::-webkit-slider-thumb/)).toMatch(/--md-sys-motion-easing-standard/);
  });

  it('dims the disabled track with on-surface at 12%', () => {
    expect(hasDecl(/:disabled::-webkit-slider-runnable-track/, 'background-color', /on-surface.*12%/)).toBe(true);
    expect(hasDecl(/:disabled::-moz-range-track/, 'background-color', /on-surface.*12%/)).toBe(true);
  });

  it('dims the disabled handle with on-surface at 38%', () => {
    expect(hasDecl(/:disabled::-webkit-slider-thumb/, 'background', /on-surface.*38%/)).toBe(true);
    expect(hasDecl(/:disabled::-moz-range-thumb/, 'background', /on-surface.*38%/)).toBe(true);
  });
});
