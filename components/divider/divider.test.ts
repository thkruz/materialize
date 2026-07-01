import { describe, it, expect } from 'vitest';
import postcss from 'postcss';

import { compileSnippet } from '../../test/helpers/sass';

const css = compileSnippet("@use 'components/divider/divider' as *;");
const root = postcss.parse(css);

/** Collect every value of `prop` declared in rules whose selector matches `selRe`. */
function decls(selRe: RegExp, prop: string): string[] {
  const out: string[] = [];
  root.walkRules((r) => {
    if (selRe.test(r.selector)) r.walkDecls(prop, (d) => { out.push(d.value); });
  });

  return out;
}

/** True when any rule selector matches `selRe`. */
function hasSelector(selRe: RegExp): boolean {
  let found = false;
  root.walkRules((r) => {
    if (selRe.test(r.selector)) found = true;
  });

  return found;
}

describe('divider (Material 3)', () => {
  it('compiles to non-empty CSS', () => {
    expect(css.trim().length).toBeGreaterThan(0);
  });

  describe('base .divider', () => {
    it('is 1dp thick (height: 1px)', () => {
      expect(decls(/^\.divider$/, 'height')).toContain('1px');
    });

    it('uses the outline-variant color token', () => {
      expect(decls(/^\.divider$/, 'background-color')).toContain(
        'var(--md-sys-color-outline-variant)'
      );
    });
  });

  describe('.divider.inset', () => {
    it('applies a 16dp leading (left) inset', () => {
      expect(decls(/\.divider\.inset/, 'margin-left')).toContain('16px');
    });
  });

  describe('.divider.middle-inset', () => {
    it('applies a 16dp inset on both sides', () => {
      expect(decls(/\.divider\.middle-inset/, 'margin-left')).toContain('16px');
      expect(decls(/\.divider\.middle-inset/, 'margin-right')).toContain('16px');
    });
  });

  describe('.divider.vertical', () => {
    it('is 1dp wide (width: 1px)', () => {
      expect(decls(/\.divider\.vertical/, 'width')).toContain('1px');
    });

    it('is displayed inline-block so it can sit beside content', () => {
      expect(decls(/\.divider\.vertical/, 'display')).toContain('inline-block');
    });

    it('stretches to fill height rather than a fixed 1px', () => {
      const heights = decls(/\.divider\.vertical/, 'height');
      expect(heights).toContain('auto');
      expect(heights).not.toContain('1px');
    });
  });

  it('exposes all four variant selectors', () => {
    expect(hasSelector(/^\.divider$/)).toBe(true);
    expect(hasSelector(/\.divider\.inset/)).toBe(true);
    expect(hasSelector(/\.divider\.middle-inset/)).toBe(true);
    expect(hasSelector(/\.divider\.vertical/)).toBe(true);
  });
});
