import { describe, it, expect } from 'vitest';

import { rulesMatching, declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Text field compliance — https://m3.material.io/components/text-fields/specs
//
// These assertions read the compiled library CSS and check the `.input-field`
// rules (default/filled/outlined) against the spec's shape, color roles,
// typography and state behavior. The markup contract is the classic Materialize
// `.input-field > input + label` structure with `.supporting-text`, `.prefix`
// and `.suffix` helpers.

// Selector fragments for the three variants. Each targets the `input, textarea`
// rule of that variant.
const DEFAULT_INPUT = /^\.input-field input, \.input-field textarea$/;
const FILLED_INPUT = /^\.input-field\.filled input,/;
const OUTLINED_INPUT = /^\.input-field\.outlined input,/;

describe('M3 Text field', () => {
  describe('input text + label typography', () => {
    it('renders input text at body-large with on-surface color', () => {
      expect(hasDecl(DEFAULT_INPUT, 'font-size', /--md-sys-typescale-body-large-font-size/)).toBe(
        true
      );
      expect(hasDecl(DEFAULT_INPUT, 'color', /--md-sys-color-on-surface\b/)).toBe(true);
    });

    it('rests the label at body-large size in on-surface-variant', () => {
      expect(
        hasDecl(/\.input-field > label$/, 'font-size', /--md-sys-typescale-body-large-font-size/)
      ).toBe(true);
      expect(hasDecl(/\.input-field > label$/, 'color', /--md-sys-color-on-surface-variant/)).toBe(
        true
      );
    });

    it('shrinks the floated label toward body-small (12/16 scale)', () => {
      const floated = rulesMatching(
        /\.input-field input:focus:not\(\[readonly\]\) \+ label, \.input-field input:not\(\[placeholder=" "\]\) \+ label/
      );
      const text = floated.map((r) => r.toString()).join('\n');
      // 12dp (body-small) over 16dp (body-large) == 0.75 (Sass folds the calc).
      expect(text).toMatch(/transform:\s*scale\(0\.75\)/);
    });

    it('recolors the label to primary when the field is focused', () => {
      expect(
        hasDecl(
          /\.input-field input:focus:not\(\[readonly\]\) \+ label/,
          'color',
          /--input-color/
        )
      ).toBe(true);
      // --input-color resolves to md.sys.color.primary on the container.
      expect(hasDecl(/^\.input-field$/, '--input-color', /--md-sys-color-primary/)).toBe(true);
    });

    it('uses motion tokens for the label transition (no ad-hoc easing)', () => {
      expect(declText(/\.input-field > label$/)).toMatch(/--md-sys-motion-easing-standard/);
    });

    it('gives the container the M3 56dp minimum height', () => {
      expect(declValues(DEFAULT_INPUT, 'min-height')).toContain('56px');
    });
  });

  describe('filled variant', () => {
    it('fills the container with surface-container-highest', () => {
      expect(
        hasDecl(FILLED_INPUT, 'background-color', /--md-sys-color-surface-container-highest/)
      ).toBe(true);
      // Default variant also renders filled.
      expect(
        hasDecl(DEFAULT_INPUT, 'background-color', /--md-sys-color-surface-container-highest/)
      ).toBe(true);
    });

    it('rounds only the top corners (4dp top, square bottom)', () => {
      // extra-small-top token = "4px 4px 0px 0px".
      expect(
        hasDecl(FILLED_INPUT, 'border-radius', /--md-sys-shape-corner-extra-small-top/)
      ).toBe(true);
      expect(declValues(FILLED_INPUT, 'border-bottom-left-radius')).toContain('0');
      expect(declValues(FILLED_INPUT, 'border-bottom-right-radius')).toContain('0');
    });

    it('draws a 1dp on-surface-variant active indicator at the bottom', () => {
      expect(
        hasDecl(FILLED_INPUT, 'border-bottom', /1px solid var\(--md-sys-color-on-surface-variant\)/)
      ).toBe(true);
    });

    it('grows the active indicator to 2dp primary on focus', () => {
      expect(
        hasDecl(
          /\.input-field\.filled input:focus:not\(\[readonly\]\),/,
          'border-bottom',
          /2px solid var\(--input-color\)/
        )
      ).toBe(true);
    });

    it('has no full border box (filled uses an indicator, not an outline)', () => {
      expect(hasDecl(FILLED_INPUT, 'border', /^none$/)).toBe(true);
    });
  });

  describe('outlined variant', () => {
    it('draws a 1dp outline border on all sides', () => {
      expect(
        hasDecl(OUTLINED_INPUT, 'border', /1px solid var\(--md-sys-color-outline\)/)
      ).toBe(true);
    });

    it('uses 4dp corners everywhere (extra-small)', () => {
      expect(
        hasDecl(OUTLINED_INPUT, 'border-radius', /--md-sys-shape-corner-extra-small\b/)
      ).toBe(true);
    });

    it('thickens the border to 2dp primary on focus', () => {
      expect(
        hasDecl(
          /\.input-field\.outlined input:focus:not\(\[readonly\]\),/,
          'border',
          /2px solid var\(--input-color\)/
        )
      ).toBe(true);
    });

    it('lifts the label into a notch in the top border', () => {
      const notch = rulesMatching(
        /\.input-field\.outlined input:focus:not\(\[readonly\]\) \+ label, \.input-field\.outlined input:not\(\[placeholder=" "\]\)/
      );
      const text = notch.map((r) => r.toString()).join('\n');
      expect(text).toMatch(/top:\s*-8px/);
      // The notch background paints the field surface behind the label.
      expect(text).toMatch(/background-color:\s*var\(--md-sys-color-surface\)/);
    });

    it('recolors the floated label to primary on focus', () => {
      expect(
        hasDecl(
          /\.input-field\.outlined input:focus:not\(\[readonly\]\) \+ label/,
          'color',
          /--input-color/
        )
      ).toBe(true);
    });
  });

  describe('supporting text + character counter', () => {
    it('renders supporting text at body-small in on-surface-variant', () => {
      expect(
        hasDecl(
          /\.input-field \.supporting-text$/,
          'font-size',
          /--md-sys-typescale-body-small-font-size/
        )
      ).toBe(true);
      expect(
        hasDecl(/\.input-field \.supporting-text$/, 'color', /--md-sys-color-on-surface-variant/)
      ).toBe(true);
    });

    it('renders the character counter at body-small in on-surface-variant', () => {
      expect(
        hasDecl(
          /\.input-field \.character-counter$/,
          'font-size',
          /--md-sys-typescale-body-small-font-size/
        )
      ).toBe(true);
      expect(
        hasDecl(/\.input-field \.character-counter$/, 'color', /--md-sys-color-on-surface-variant/)
      ).toBe(true);
    });
  });

  describe('leading / trailing icons', () => {
    it('sizes the icon at 24dp inside a 48dp target', () => {
      expect(declValues(/\.input-field \.prefix$/, 'font-size')).toContain('24px');
      expect(declValues(/\.input-field \.prefix$/, 'width')).toContain('48px');
      expect(declValues(/\.input-field \.prefix$/, 'height')).toContain('48px');
      expect(declValues(/\.input-field \.suffix$/, 'font-size')).toContain('24px');
    });

    it('colors icons with on-surface-variant', () => {
      expect(hasDecl(/\.input-field \.prefix$/, 'color', /--md-sys-color-on-surface-variant/)).toBe(
        true
      );
      expect(hasDecl(/\.input-field \.suffix$/, 'color', /--md-sys-color-on-surface-variant/)).toBe(
        true
      );
    });
  });

  describe('error state', () => {
    it('recolors the border/active indicator to error', () => {
      expect(
        hasDecl(/\.input-field\.error input, \.input-field\.error textarea$/, 'border-color', /--md-sys-color-error/)
      ).toBe(true);
    });

    it('recolors the label to error', () => {
      expect(hasDecl(/\.input-field\.error label$/, 'color', /--md-sys-color-error/)).toBe(true);
    });

    it('recolors supporting text to error', () => {
      expect(
        hasDecl(/\.input-field\.error \.supporting-text$/, 'color', /--md-sys-color-error/)
      ).toBe(true);
    });

    it('recolors the trailing (and leading) icon to error', () => {
      expect(hasDecl(/\.input-field\.error \.suffix$/, 'color', /--md-sys-color-error/)).toBe(true);
      expect(hasDecl(/\.input-field\.error \.prefix$/, 'color', /--md-sys-color-error/)).toBe(true);
    });
  });
});
