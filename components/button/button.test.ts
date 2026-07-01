import { describe, it, expect } from 'vitest';

import { compiledCss, rulesMatching, declValues, hasDecl } from '../../test/helpers/sass';

// M3 Common buttons — https://m3.material.io/components/buttons/specs
// The five M3 button types are modifier classes on `.btn`:
//   filled, tonal, elevated, outlined, text (+ legacy `.btn-flat` == text).
// Variant rules compile into grouped selectors (e.g.
// `.btn.filled, .filled.btn-small, ...`), so these regexes match the class
// fragment followed by a `,` / pseudo rather than anchoring the whole selector.
describe('M3 Common buttons', () => {
  const css = compiledCss();

  describe('shared base (.btn)', () => {
    const base = /^\.btn, \.btn-small, \.btn-large, \.btn-floating/;

    it('defaults to the fully-rounded (pill) shape and 40dp height tokens', () => {
      expect(css).toMatch(/--btn-border-radius:\s*9999px/);
      expect(css).toMatch(/--btn-height:\s*40px/);
    });

    it('the base rule wires height + radius to those tokens', () => {
      expect(hasDecl(base, 'height', /--btn-height/)).toBe(true);
      expect(hasDecl(base, 'border-radius', /--btn-border-radius/)).toBe(true);
    });

    it('uses the label-large weight/tracking (500 / 0.1px)', () => {
      expect(declValues(base, 'font-weight')).toContain('500');
      expect(declValues(base, 'letter-spacing')).toContain('0.1px');
    });
  });

  describe('filled variant', () => {
    it('is primary container with on-primary label', () => {
      expect(hasDecl(/\.btn\.filled,/, 'background-color', /--md-sys-color-primary\b/)).toBe(true);
      expect(hasDecl(/\.btn\.filled,/, 'color', /--md-sys-color-on-primary\b/)).toBe(true);
    });

    it('tints the container at the M3 hover/focus/press opacities (8/10/10%)', () => {
      expect(hasDecl(/\.btn\.filled:hover,/, 'background-color', /on-primary\) 8%/)).toBe(true);
      expect(hasDecl(/\.btn\.filled:focus,/, 'background-color', /on-primary\) 10%/)).toBe(true);
      expect(hasDecl(/\.btn\.filled:active,/, 'background-color', /on-primary\) 10%/)).toBe(true);
    });
  });

  describe('tonal variant', () => {
    it('is secondary-container with on-secondary-container label', () => {
      expect(
        hasDecl(/\.btn\.tonal,/, 'background-color', /--md-sys-color-secondary-container/)
      ).toBe(true);
      expect(hasDecl(/\.btn\.tonal,/, 'color', /--md-sys-color-on-secondary-container/)).toBe(true);
    });
  });

  describe('elevated variant', () => {
    it('is surface-container-low with a primary label', () => {
      expect(
        hasDecl(/\.btn\.elevated,/, 'background-color', /--md-sys-color-surface-container-low/)
      ).toBe(true);
      expect(hasDecl(/\.btn\.elevated,/, 'color', /--md-sys-color-primary\b/)).toBe(true);
    });
  });

  describe('outlined variant', () => {
    it('is transparent with a 1dp outline border and primary label', () => {
      expect(hasDecl(/\.btn\.outlined,/, 'background-color', /transparent/)).toBe(true);
      expect(
        hasDecl(/\.btn\.outlined,/, 'border', /1px solid var\(--md-sys-color-outline\)/)
      ).toBe(true);
      expect(hasDecl(/\.btn\.outlined,/, 'color', /--md-sys-color-primary\b/)).toBe(true);
    });

    it('recolors the border to primary on focus', () => {
      expect(
        hasDecl(/\.btn\.outlined:focus,/, 'border', /1px solid var\(--md-sys-color-primary\)/)
      ).toBe(true);
    });
  });

  describe('text variant (.btn.text / legacy .btn-flat)', () => {
    it('is transparent with a primary label', () => {
      expect(rulesMatching(/\.btn\.text,/).length).toBeGreaterThan(0);
      expect(hasDecl(/\.btn\.text,/, 'background-color', /transparent/)).toBe(true);
      expect(hasDecl(/\.btn\.text,/, 'color', /--md-sys-color-primary\b/)).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('uses on-surface at 38% label / 12% container (M3 disabled tokens)', () => {
      expect(hasDecl(/\.btn\.disabled,/, 'color', /on-surface\) 38%/)).toBe(true);
      expect(hasDecl(/\.btn\.disabled,/, 'background-color', /on-surface\) 12%/)).toBe(true);
    });
  });
});
