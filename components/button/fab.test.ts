import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 FAB compliance — https://m3.material.io/components/floating-action-button/specs
// and https://m3.material.io/components/extended-fab/specs
//
// M3 FABs are rounded SQUARES (not circles) with a `primary-container` container,
// `on-primary-container` content, elevation level 3 resting / level 4 on hover,
// and a per-size shape token. These assertions read the compiled library CSS and
// verify the `.btn-floating` family against the spec.

// The bare `.btn-floating` block (its own rule, not the shared @extend groups).
const FAB = /^\.btn-floating$/;

describe('M3 FAB (floating action button)', () => {
  it('is a rounded square using the large (16dp) corner token by default', () => {
    // corner `large` maps to 16dp — a rounded square, not a circle.
    expect(hasDecl(FAB, 'border-radius', /--(fab-corner|md-sys-shape-corner-large)/)).toBe(true);
    expect(hasDecl(/\.btn-floating$/, '--fab-corner', /--md-sys-shape-corner-large/)).toBe(true);
  });

  it('uses the primary-container container with on-primary-container content', () => {
    expect(hasDecl(/\.btn-floating$/, '--fab-container', /--md-sys-color-primary-container/)).toBe(true);
    expect(hasDecl(/\.btn-floating$/, '--fab-on-container', /--md-sys-color-on-primary-container/)).toBe(true);
    expect(hasDecl(FAB, 'background-color', /--fab-container/)).toBe(true);
    expect(hasDecl(FAB, 'color', /--fab-on-container/)).toBe(true);
  });

  it('is a 56dp square by default (regular FAB)', () => {
    expect(declValues(/\.btn-floating$/, '--fab-size')).toContain('56px');
    expect(hasDecl(FAB, 'width', /--fab-size/)).toBe(true);
    expect(hasDecl(FAB, 'height', /--fab-size/)).toBe(true);
  });

  it('rests at elevation level 3 and rises to level 4 on hover', () => {
    expect(hasDecl(FAB, 'box-shadow', /--md-sys-elevation-level3/)).toBe(true);
    expect(hasDecl(/\.btn-floating:hover$/, 'box-shadow', /--md-sys-elevation-level4/)).toBe(true);
  });

  it('renders a state layer revealed only on hover / focus / press', () => {
    expect(hasDecl(/\.btn-floating::before$/, 'opacity', /^0$/)).toBe(true);
    expect(hasDecl(/\.btn-floating:hover::before$/, 'opacity', /hover-state-layer-opacity/)).toBe(true);
    expect(hasDecl(/\.btn-floating:focus::before$/, 'opacity', /focus-state-layer-opacity/)).toBe(true);
    expect(hasDecl(/\.btn-floating:active::before$/, 'opacity', /pressed-state-layer-opacity/)).toBe(true);
  });

  it('uses motion tokens for its transitions (no ad-hoc easing)', () => {
    expect(declText(FAB)).toMatch(/--md-sys-motion-easing-standard/);
    expect(declText(FAB)).toMatch(/--md-sys-motion-duration-/);
  });

  it('small FAB is 40dp with the medium (12dp) corner token', () => {
    expect(declValues(/\.btn-floating\.btn-small$/, '--fab-size')).toContain('40px');
    expect(hasDecl(/\.btn-floating\.btn-small$/, '--fab-corner', /--md-sys-shape-corner-medium/)).toBe(true);
  });

  it('large FAB (.large-fab) is 96dp with the extra-large (28dp) corner token', () => {
    expect(declValues(/\.btn-floating\.large-fab$/, '--fab-size')).toContain('96px');
    expect(hasDecl(/\.btn-floating\.large-fab$/, '--fab-corner', /--md-sys-shape-corner-extra-large/)).toBe(true);
  });

  it('keeps the legacy .btn-large FAB at 56dp so existing markup is unaffected', () => {
    expect(declValues(/\.btn-floating\.btn-large$/, '--fab-size')).toContain('56px');
  });

  it('uses a 24dp icon', () => {
    // 24dp icon at the default 16px root => 1.5rem.
    expect(hasDecl(/\.btn-floating i$/, 'font-size', /1\.5rem/)).toBe(true);
  });

  describe('extended FAB', () => {
    const EXT = /\.btn-floating\.extended/;

    it('exists as both .extended and .fab-extended', () => {
      expect(rulesMatching(/\.btn-floating\.extended/).length).toBeGreaterThan(0);
      expect(rulesMatching(/\.btn-floating\.fab-extended/).length).toBeGreaterThan(0);
    });

    it('is 56dp tall with auto width and a min-width', () => {
      expect(declValues(EXT, '--fab-size')).toContain('56px');
      expect(hasDecl(EXT, 'width', /auto/)).toBe(true);
      expect(hasDecl(EXT, 'height', /--fab-size/)).toBe(true);
      expect(hasDecl(EXT, 'min-width', /80px/)).toBe(true);
    });

    it('inherits the large (16dp) corner from the base FAB (not overridden)', () => {
      // The extended FAB does not override --fab-corner, so it keeps corner large.
      expect(declValues(EXT, '--fab-corner')).toEqual([]);
    });

    it('has horizontal padding (16-20dp) and an icon-label gap', () => {
      expect(hasDecl(EXT, 'padding', /20px/)).toBe(true);
      expect(hasDecl(EXT, 'gap', /8px/)).toBe(true);
    });

    it('uses the label-large typescale for the label', () => {
      expect(hasDecl(EXT, 'font-size', /--md-sys-typescale-label-large-font-size/)).toBe(true);
      expect(hasDecl(EXT, 'font-weight', /--md-sys-typescale-label-large-font-weight/)).toBe(true);
      expect(hasDecl(EXT, 'line-height', /--md-sys-typescale-label-large-line-height/)).toBe(true);
    });
  });

  describe('color variants', () => {
    it('surface variant uses surface-container-high + primary', () => {
      expect(hasDecl(/\.btn-floating\.surface$/, '--fab-container', /--md-sys-color-surface-container-high/)).toBe(true);
      expect(hasDecl(/\.btn-floating\.surface$/, '--fab-on-container', /--md-sys-color-primary/)).toBe(true);
    });

    it('secondary variant uses secondary-container + on-secondary-container', () => {
      expect(hasDecl(/\.btn-floating\.secondary$/, '--fab-container', /--md-sys-color-secondary-container/)).toBe(true);
      expect(hasDecl(/\.btn-floating\.secondary$/, '--fab-on-container', /--md-sys-color-on-secondary-container/)).toBe(true);
    });

    it('tertiary variant uses tertiary-container + on-tertiary-container', () => {
      expect(hasDecl(/\.btn-floating\.tertiary$/, '--fab-container', /--md-sys-color-tertiary-container/)).toBe(true);
      expect(hasDecl(/\.btn-floating\.tertiary$/, '--fab-on-container', /--md-sys-color-on-tertiary-container/)).toBe(true);
    });
  });
});
