import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Progress indicators (preloader) compliance —
// https://m3.material.io/components/progress-indicators/specs
// These assertions read the compiled library CSS and check the linear and
// circular progress rules against the spec's dimensions, color roles and shape.
describe('M3 Progress indicators', () => {
  describe('Linear progress', () => {
    it('gives the track a 4dp height', () => {
      expect(declValues(/^\.progress$/, 'height')).toContain('4px');
    });

    it('uses the secondary-container role for the track', () => {
      expect(hasDecl(/^\.progress$/, 'background-color', /--md-sys-color-secondary-container/)).toBe(true);
    });

    it('does not leave the legacy surface-variant track color behind', () => {
      expect(hasDecl(/^\.progress$/, 'background-color', /--md-sys-color-surface-variant/)).toBe(false);
    });

    it('uses fully-rounded ends for the track', () => {
      expect(hasDecl(/^\.progress$/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
    });

    it('gives the determinate active indicator the primary role', () => {
      expect(hasDecl(/^\.progress \.determinate$/, 'background-color', /--md-sys-color-primary/)).toBe(true);
    });

    it('gives the determinate active indicator rounded ends', () => {
      expect(hasDecl(/^\.progress \.determinate$/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
    });

    it('animates the determinate width with a motion token (linear easing)', () => {
      expect(declText(/^\.progress \.determinate$/)).toMatch(/--md-sys-motion-easing-linear/);
    });

    it('gives the indeterminate active indicator the primary role', () => {
      expect(hasDecl(/^\.progress \.indeterminate$/, 'background-color', /--md-sys-color-primary/)).toBe(true);
    });

    it('gives the indeterminate active indicator rounded ends', () => {
      expect(hasDecl(/^\.progress \.indeterminate$/, 'border-radius', /--md-sys-shape-corner-full/)).toBe(true);
    });

    it('preserves the indeterminate animation contract', () => {
      const before = declText(/^\.progress \.indeterminate:before$/);
      const after = declText(/^\.progress \.indeterminate:after$/);
      expect(before).toMatch(/animation:\s*indeterminate\b/);
      expect(after).toMatch(/animation:\s*indeterminate-short\b/);
    });
  });

  describe('Circular progress', () => {
    it('keeps the preloader-wrapper markup contract', () => {
      expect(rulesMatching(/^\.preloader-wrapper$/).length).toBeGreaterThan(0);
    });

    it('gives the spinner layer the primary role by default', () => {
      expect(hasDecl(/^\.spinner-layer$/, 'border-color', /--md-sys-color-primary/)).toBe(true);
    });

    it('uses a 4dp stroke width for the circular indicator', () => {
      expect(declValues(/\.circle-clipper \.circle$/, 'border-width')).toContain('4px');
    });

    it('preserves the container-rotate animation on the active wrapper', () => {
      expect(declText(/^\.preloader-wrapper\.active$/)).toMatch(/container-rotate/);
    });
  });
});
