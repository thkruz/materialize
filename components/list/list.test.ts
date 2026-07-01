import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 List compliance — https://m3.material.io/components/lists/specs
// These assertions read the compiled library CSS and check the "collection"
// rules against the spec's line heights, type roles, color roles, leading /
// trailing sizing and state layers. The class/markup contract (`.collection`,
// `.collection-item`, `.collection-item.avatar`, `.secondary-content`, ...) is
// preserved — only the styling is validated here.
describe('M3 List (collection)', () => {
  it('container uses the surface color role', () => {
    expect(hasDecl(/^\.collection$/, 'background-color', /--md-sys-color-surface/)).toBe(true);
    expect(hasDecl(/^\.collection$/, 'color', /--md-sys-color-on-surface/)).toBe(true);
  });

  it('1-line item is 56dp tall', () => {
    expect(declValues(/\.collection \.collection-item$/, 'min-height')).toContain(
      'var(--list-item-height-one-line)'
    );
    expect(declValues(/^\.collection$/, '--list-item-height-one-line')).toContain('56px');
  });

  it('avatar (2-line) item is 72dp tall', () => {
    expect(declValues(/\.collection-item\.avatar$/, 'min-height')).toContain(
      'var(--list-item-height-two-line)'
    );
    expect(declValues(/^\.collection$/, '--list-item-height-two-line')).toContain('72px');
  });

  it('3-line item is 88dp tall', () => {
    expect(declValues(/\.collection-item\.three-line$/, 'min-height')).toContain(
      'var(--list-item-height-three-line)'
    );
    expect(declValues(/^\.collection$/, '--list-item-height-three-line')).toContain('88px');
  });

  it('headline is body-large / on-surface', () => {
    expect(
      hasDecl(/\.collection \.collection-item$/, 'font-size', /body-large-font-size/)
    ).toBe(true);
    expect(
      hasDecl(/\.collection \.collection-item$/, 'line-height', /body-large-line-height/)
    ).toBe(true);
    expect(hasDecl(/\.collection \.collection-item$/, 'color', /--md-sys-color-on-surface/)).toBe(
      true
    );
  });

  it('supporting text is body-medium / on-surface-variant', () => {
    const text = declText(/\.collection \.collection-item p$/);
    expect(text).toMatch(/body-medium-font-size/);
    expect(text).toMatch(/--md-sys-color-on-surface-variant/);
  });

  it('trailing supporting text is label-small / on-surface-variant', () => {
    expect(hasDecl(/^\.secondary-content$/, 'font-size', /label-small-font-size/)).toBe(true);
    expect(hasDecl(/^\.secondary-content$/, 'color', /--md-sys-color-on-surface-variant/)).toBe(
      true
    );
  });

  it('trailing icon uses the on-surface-variant icon color', () => {
    expect(hasDecl(/\.secondary-content i$/, 'color', /--md-sys-color-on-surface-variant/)).toBe(
      true
    );
  });

  it('leading avatar is 40dp', () => {
    expect(declValues(/^\.collection$/, '--list-leading-avatar-size')).toContain('40px');
    const circle = rulesMatching(/\.collection-item\.avatar.*\.circle/);
    const text = circle.map((r) => r.toString()).join('\n');
    expect(text).toMatch(/var\(--list-leading-avatar-size\)/);
  });

  it('leading image is 56dp and leading icon is 24dp', () => {
    expect(declValues(/^\.collection$/, '--list-leading-image-size')).toContain('56px');
    expect(declValues(/^\.collection$/, '--list-leading-icon-size')).toContain('24px');
  });

  it('uses 16dp horizontal padding and a 16dp leading/trailing gap', () => {
    expect(declValues(/^\.collection$/, '--list-item-padding-inline')).toContain('16px');
    expect(declValues(/^\.collection$/, '--list-item-gap')).toContain('16px');
    expect(
      hasDecl(/\.collection \.collection-item$/, 'padding', /var\(--list-item-padding-inline\)/)
    ).toBe(true);
  });

  it('divider is 1dp outline-variant', () => {
    expect(
      hasDecl(
        /\.collection \.collection-item$/,
        'border-bottom',
        /1px solid var\(--md-sys-color-outline-variant\)/
      )
    ).toBe(true);
  });

  it('interactive item renders an on-surface state layer, hidden until hover/focus/press', () => {
    expect(hasDecl(/a\.collection-item::before$/, 'background-color', /--md-sys-color-on-surface/)).toBe(
      true
    );
    expect(hasDecl(/a\.collection-item::before$/, 'opacity', /^0$/)).toBe(true);
    expect(hasDecl(/a\.collection-item:hover::before$/, 'opacity', /hover-state-layer-opacity/)).toBe(
      true
    );
    expect(hasDecl(/a\.collection-item:focus::before$/, 'opacity', /focus-state-layer-opacity/)).toBe(
      true
    );
    expect(
      hasDecl(/a\.collection-item:active::before$/, 'opacity', /pressed-state-layer-opacity/)
    ).toBe(true);
  });

  it('uses motion tokens for the state-layer transition (no ad-hoc easing)', () => {
    expect(declText(/a\.collection-item::before$/)).toMatch(/--md-sys-motion-easing-standard/);
  });

  it('selected item uses the primary / on-primary color roles', () => {
    expect(hasDecl(/\.collection-item\.active$/, 'background-color', /--md-sys-color-primary/)).toBe(
      true
    );
    expect(hasDecl(/\.collection-item\.active$/, 'color', /--md-sys-color-on-primary/)).toBe(true);
  });
});
