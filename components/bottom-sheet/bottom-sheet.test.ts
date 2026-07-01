import { describe, it, expect } from 'vitest';
import postcss from 'postcss';
import { compileSnippet } from '../../test/helpers/sass';

// M3 Bottom sheet — https://m3.material.io/components/bottom-sheets/specs
const css = compileSnippet("@use 'components/bottom-sheet/bottom-sheet' as *;");
const root = postcss.parse(css);

function decls(selRe: RegExp, prop: string): string[] {
  const out: string[] = [];
  root.walkRules((r) => {
    if (selRe.test(r.selector)) r.walkDecls(prop, (d) => { out.push(d.value); });
  });
  return out;
}

function hasSelector(selRe: RegExp): boolean {
  let found = false;
  root.walkRules((r) => { if (selRe.test(r.selector)) found = true; });
  return found;
}

describe('bottom-sheet: container', () => {
  it('renders a .bottom-sheet rule anchored to the bottom edge', () => {
    expect(hasSelector(/^\.bottom-sheet$/)).toBe(true);
    expect(decls(/^\.bottom-sheet$/, 'position')).toContain('fixed');
    expect(decls(/^\.bottom-sheet$/, 'inset').join(' ')).toMatch(/auto 0 0 0/);
  });

  it('uses the surface-container-low container role', () => {
    expect(decls(/^\.bottom-sheet$/, 'background-color')).toContain(
      'var(--md-sys-color-surface-container-low)'
    );
  });

  it('rounds only the TOP corners with the extra-large (28dp) shape token', () => {
    const radius = decls(/^\.bottom-sheet$/, 'border-radius').join(' ');
    expect(radius).toMatch(/--md-sys-shape-corner-extra-large.*--md-sys-shape-corner-extra-large.*0.*0/);
  });

  it('elevates with the level-1 token (no hardcoded shadow)', () => {
    const shadow = decls(/^\.bottom-sheet$/, 'box-shadow').join(' ');
    expect(shadow).toMatch(/--md-sys-elevation-level1/);
    expect(shadow).not.toMatch(/rgba\(/);
  });

  it('caps the width at 640dp and centers the sheet', () => {
    expect(decls(/^\.bottom-sheet$/, 'max-width')).toContain('640px');
    expect(decls(/^\.bottom-sheet$/, 'margin')).toContain('0 auto');
  });

  it('is hidden below the viewport until .open, using emphasized motion', () => {
    expect(decls(/^\.bottom-sheet$/, 'transform')).toContain('translateY(100%)');
    expect(decls(/\.bottom-sheet\.open$/, 'transform')).toContain('translateY(0)');
    expect(decls(/^\.bottom-sheet$/, 'transition').join(' ')).toMatch(/--md-sys-motion-easing-emphasized/);
  });
});

describe('bottom-sheet: drag handle', () => {
  it('is a 32x4dp fully-rounded on-surface-variant handle at 40%', () => {
    expect(decls(/\.bottom-sheet__handle$/, 'width')).toContain('32px');
    expect(decls(/\.bottom-sheet__handle$/, 'height')).toContain('4px');
    expect(decls(/\.bottom-sheet__handle$/, 'border-radius')).toContain('var(--md-sys-shape-corner-full)');
    const bg = decls(/\.bottom-sheet__handle$/, 'background-color').join(' ');
    expect(bg).toMatch(/--md-sys-color-on-surface-variant/);
    expect(bg).toMatch(/40%/);
  });
});

describe('bottom-sheet: modal scrim', () => {
  it('covers the viewport with the M3 scrim at 32%', () => {
    expect(decls(/\.bottom-sheet__scrim$/, 'position')).toContain('fixed');
    expect(decls(/\.bottom-sheet__scrim$/, 'inset')).toContain('0');
    const bg = decls(/\.bottom-sheet__scrim$/, 'background-color').join(' ');
    expect(bg).toMatch(/--md-sys-color-scrim/);
    expect(bg).toMatch(/32%/);
  });

  it('fades in only when .open', () => {
    expect(decls(/^\.bottom-sheet__scrim$/, 'opacity')).toContain('0');
    expect(decls(/\.bottom-sheet__scrim\.open$/, 'opacity')).toContain('1');
  });
});
