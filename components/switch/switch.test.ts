import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Switch compliance — https://m3.material.io/components/switch
// These assertions read the compiled library CSS and check the switch rules
// against the spec's dimensions, color roles, shape and state layers.
describe('M3 Switch', () => {
  it('defines the 52x32dp track dimensions', () => {
    expect(declValues(/\.switch(\s|$|,|\{)/, '--track-width')).toContain('52px');
    expect(declValues(/\.switch(\s|$|,|\{)/, '--track-height')).toContain('32px');
  });

  it('uses a fully-rounded track shape', () => {
    expect(hasDecl(/\.switch label \.lever$/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
  });

  it('gives the track a 2dp outline border when unselected', () => {
    expect(hasDecl(/\.switch label \.lever$/, 'border-width', /--border-width|2px/)).toBe(true);
    expect(hasDecl(/\.switch label \.lever$/, 'border-color', /--md-sys-color-outline/)).toBe(true);
  });

  it('uses surface-container-highest for the unselected track', () => {
    expect(hasDecl(/\.switch label \.lever$/, 'background-color', /--md-sys-color-surface-container-highest/)).toBe(true);
  });

  it('uses primary for the selected track', () => {
    expect(hasDecl(/:checked \+ \.lever/, 'background-color', /--md-sys-color-primary/)).toBe(true);
  });

  it('handle is 16dp unselected and 24dp selected', () => {
    expect(declValues(/\.switch$/, '--handle-size-off')).toContain('16px');
    expect(declValues(/\.switch$/, '--handle-size-on')).toContain('24px');
  });

  it('selected handle recolors to on-primary', () => {
    const checkedHandle = rulesMatching(/:checked \+ \.lever/);
    const text = checkedHandle.map((r) => r.toString()).join('\n');
    expect(text).toMatch(/--md-sys-color-on-primary/);
  });

  it('handle grows to 28dp while pressed', () => {
    expect(declValues(/\.lever:active::after/, 'width')).toContain('var(--handle-size-pressed)');
    expect(declValues(/\.switch$/, '--handle-size-pressed')).toContain('28px');
  });

  it('renders a state layer that only appears on hover/press', () => {
    expect(hasDecl(/\.lever::before/, 'opacity', /^0$/)).toBe(true);
    expect(hasDecl(/\.lever:hover::before/, 'opacity', /hover-state-layer-opacity/)).toBe(true);
    expect(hasDecl(/\.lever:active::before/, 'opacity', /pressed-state-layer-opacity/)).toBe(true);
  });

  it('renders a focus state layer on modern keyboard focus (:focus-visible)', () => {
    expect(hasDecl(/:focus-visible ~ \.lever::before/, 'opacity', /focus-state-layer-opacity/)).toBe(true);
  });

  it('uses motion tokens for transitions (no ad-hoc easing)', () => {
    expect(declText(/\.switch label \.lever$/)).toMatch(/--md-sys-motion-easing-standard/);
  });

  it('dims the disabled switch', () => {
    expect(hasDecl(/input\[type=checkbox\]\[disabled\] \+ \.lever/, 'opacity', /0\.38/)).toBe(true);
  });
});
