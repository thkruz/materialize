import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Dialog / Modal compliance — https://m3.material.io/components/dialogs/specs
// These assertions read the compiled library CSS and check the `.modal` rules
// against the spec's shape, color roles, elevation, sizing and typography.
// The M3 dialog is a native <dialog class="modal"> whose scrim is drawn on the
// native `::backdrop` pseudo-element.
describe('M3 Dialog', () => {
  describe('basic dialog container', () => {
    it('uses the extra-large (28dp) corner shape', () => {
      // token drives the radius, and the token itself resolves to 28px
      expect(hasDecl(/^\.modal$/, '--modal-border-radius', /--md-sys-shape-corner-extra-large/)).toBe(true);
      expect(hasDecl(/^\.modal$/, 'border-radius', /--modal-border-radius/)).toBe(true);
      expect(declValues(/:root|html/, '--md-sys-shape-corner-extra-large')).toContain('28px');
    });

    it('uses surface-container-high as the container color', () => {
      expect(hasDecl(/^\.modal$/, '--modal-background-color', /--md-sys-color-surface-container-high\b/)).toBe(true);
      expect(hasDecl(/^\.modal$/, 'background-color', /--modal-background-color/)).toBe(true);
    });

    it('applies elevation level 3', () => {
      expect(hasDecl(/^\.modal$/, 'box-shadow', /--md-sys-elevation-level3/)).toBe(true);
    });

    it('sizes to min 280dp / max 560dp', () => {
      expect(declValues(/^\.modal$/, 'min-width')).toContain('280px');
      expect(declValues(/^\.modal$/, 'max-width')).toContain('560px');
    });

    it('uses 24dp padding on header, content and footer', () => {
      expect(declValues(/^\.modal$/, '--modal-padding')).toContain('24px');
      expect(hasDecl(/\.modal \.modal-header$/, 'padding', /--modal-padding/)).toBe(true);
      expect(hasDecl(/\.modal \.modal-content$/, 'padding', /--modal-padding/)).toBe(true);
      expect(hasDecl(/\.modal \.modal-footer$/, 'padding', /--modal-padding/)).toBe(true);
    });

    it('colors dialog text with on-surface', () => {
      expect(hasDecl(/^\.modal$/, 'color', /--md-sys-color-on-surface\b/)).toBe(true);
    });

    it('animates with M3 motion tokens (no ad-hoc easing)', () => {
      expect(declText(/^\.modal$/)).toMatch(/--md-sys-motion-easing-emphasized/);
      expect(declText(/^\.modal$/)).toMatch(/--md-sys-motion-duration-/);
    });
  });

  describe('scrim', () => {
    it('draws a scrim on the native ::backdrop', () => {
      expect(rulesMatching(/\.modal::backdrop/).length).toBeGreaterThan(0);
    });

    it('uses the scrim color at ~32% opacity', () => {
      expect(hasDecl(/^\.modal$/, '--modal-scrim-color', /--md-sys-color-scrim/)).toBe(true);
      expect(hasDecl(/^\.modal$/, '--modal-scrim-color', /32%/)).toBe(true);
      expect(hasDecl(/\.modal::backdrop/, 'background-color', /--modal-scrim-color/)).toBe(true);
    });
  });

  describe('optional icon', () => {
    it('renders a 24dp icon centered horizontally', () => {
      expect(declValues(/\.modal \.modal-icon$/, 'width')).toContain('24px');
      expect(declValues(/\.modal \.modal-icon$/, 'height')).toContain('24px');
      expect(hasDecl(/\.modal \.modal-icon$/, 'margin', /auto/)).toBe(true);
    });

    it('colors the icon with the secondary role', () => {
      expect(hasDecl(/\.modal \.modal-icon$/, 'color', /--md-sys-color-secondary\b/)).toBe(true);
    });

    it('centers the headline when an icon is present', () => {
      expect(hasDecl(/\.modal \.modal-icon \+ \.modal-headline|\.modal\.has-icon \.modal-header/, 'text-align', /center/)).toBe(true);
    });
  });

  describe('headline typography', () => {
    it('uses headline-small type', () => {
      expect(hasDecl(/\.modal-headline/, 'font-size', /--md-sys-typescale-headline-small-font-size/)).toBe(true);
      expect(hasDecl(/\.modal-headline/, 'line-height', /--md-sys-typescale-headline-small-line-height/)).toBe(true);
      expect(hasDecl(/\.modal-headline/, 'font-weight', /--md-sys-typescale-headline-small-font-weight/)).toBe(true);
    });

    it('colors the headline with on-surface', () => {
      expect(hasDecl(/\.modal-headline/, 'color', /--md-sys-color-on-surface\b/)).toBe(true);
    });
  });

  describe('supporting text typography', () => {
    it('uses body-medium type for the content', () => {
      expect(hasDecl(/\.modal \.modal-content$/, 'font-size', /--md-sys-typescale-body-medium-font-size/)).toBe(true);
      expect(hasDecl(/\.modal \.modal-content$/, 'line-height', /--md-sys-typescale-body-medium-line-height/)).toBe(true);
    });

    it('colors supporting text with on-surface-variant', () => {
      expect(hasDecl(/\.modal \.modal-content$/, 'color', /--md-sys-color-on-surface-variant/)).toBe(true);
    });
  });

  describe('actions', () => {
    it('aligns actions to the trailing edge with an 8dp gap', () => {
      expect(hasDecl(/\.modal \.modal-footer$/, 'justify-content', /flex-end/)).toBe(true);
      expect(declValues(/\.modal \.modal-footer$/, 'gap')).toContain('8px');
    });
  });

  describe('full-screen variant', () => {
    it('exposes a .modal.fullscreen selector', () => {
      expect(rulesMatching(/\.modal\.fullscreen$/).length).toBeGreaterThan(0);
    });

    it('zeroes the corner radius (fills the screen)', () => {
      expect(hasDecl(/\.modal\.fullscreen$/, '--modal-border-radius', /--md-sys-shape-corner-none/)).toBe(true);
      expect(declValues(/:root|html/, '--md-sys-shape-corner-none')).toContain('0px');
    });

    it('fills the viewport width and height', () => {
      expect(declValues(/\.modal\.fullscreen$/, 'width')).toContain('100%');
      expect(declValues(/\.modal\.fullscreen$/, 'max-width')).toContain('100%');
      expect(declValues(/\.modal\.fullscreen$/, 'height')).toContain('100%');
      expect(declValues(/\.modal\.fullscreen$/, 'max-height')).toContain('100%');
    });

    it('supports an optional header divider using outline-variant', () => {
      expect(hasDecl(/\.modal\.fullscreen \.modal-header$/, 'border-bottom', /--md-sys-color-outline-variant/)).toBe(true);
    });
  });

  describe('markup contract preserved', () => {
    it('keeps the core .modal structural classes', () => {
      expect(rulesMatching(/\.modal \.modal-header$/).length).toBeGreaterThan(0);
      expect(rulesMatching(/\.modal \.modal-content$/).length).toBeGreaterThan(0);
      expect(rulesMatching(/\.modal \.modal-footer$/).length).toBeGreaterThan(0);
      expect(rulesMatching(/\.modal \.modal-close$/).length).toBeGreaterThan(0);
      expect(rulesMatching(/\.modal\.bottom-sheet$/).length).toBeGreaterThan(0);
    });
  });
});
