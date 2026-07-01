import { describe, it, expect } from 'vitest';
import postcss from 'postcss';
import { compileSnippet } from '../../test/helpers/sass';

// M3 Side sheet — https://m3.material.io/components/side-sheets/specs
const css = compileSnippet("@use 'components/side-sheet/side-sheet' as *;");
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

function pairs(selRe: RegExp): string[] {
  const out: string[] = [];
  root.walkRules((r) => {
    if (selRe.test(r.selector)) r.walkDecls((d) => { out.push(`${d.prop}: ${d.value}`); });
  });
  return out;
}

describe('side-sheet: container', () => {
  it('renders a .side-sheet docked full-height to the trailing edge', () => {
    expect(hasSelector(/^\.side-sheet$/)).toBe(true);
    expect(decls(/^\.side-sheet$/, 'position')).toContain('fixed');
    expect(decls(/^\.side-sheet$/, 'inset').join(' ')).toMatch(/0 0 0 auto/);
    expect(decls(/^\.side-sheet$/, 'height')).toContain('100%');
  });

  it('constrains the width to the M3 256-400dp range', () => {
    expect(decls(/^\.side-sheet$/, 'min-width')).toContain('256px');
    expect(decls(/^\.side-sheet$/, 'max-width')).toContain('400px');
  });

  it('uses the surface-container-low container role', () => {
    expect(decls(/^\.side-sheet$/, 'background-color')).toContain(
      'var(--md-sys-color-surface-container-low)'
    );
  });

  it('is hidden off the trailing edge until .open, with emphasized motion', () => {
    expect(decls(/^\.side-sheet$/, 'transform')).toContain('translateX(100%)');
    expect(decls(/\.side-sheet\.open$/, 'transform')).toContain('translateX(0)');
    expect(decls(/^\.side-sheet$/, 'transition').join(' ')).toMatch(/--md-sys-motion-easing-emphasized/);
  });

  it('supports a leading-edge dock modifier', () => {
    expect(decls(/\.side-sheet--left$/, 'inset').join(' ')).toMatch(/0 auto 0 0/);
    expect(decls(/^\.side-sheet--left$/, 'transform')).toContain('translateX(-100%)');
  });
});

describe('side-sheet: modal', () => {
  it('elevates with the level-1 token and rounds the leading vertical edge (large 16dp)', () => {
    const shadow = decls(/\.side-sheet--modal$/, 'box-shadow').join(' ');
    expect(shadow).toMatch(/--md-sys-elevation-level1/);
    expect(shadow).not.toMatch(/rgba\(/);
    expect(decls(/^\.side-sheet--modal$/, 'border-radius').join(' ')).toMatch(/--md-sys-shape-corner-large/);
  });

  it('dims the screen with the M3 scrim at 32%, fading in on .open', () => {
    const bg = decls(/\.side-sheet__scrim$/, 'background-color').join(' ');
    expect(bg).toMatch(/--md-sys-color-scrim/);
    expect(bg).toMatch(/32%/);
    expect(decls(/^\.side-sheet__scrim$/, 'opacity')).toContain('0');
    expect(decls(/\.side-sheet__scrim\.open$/, 'opacity')).toContain('1');
  });
});

describe('side-sheet: header', () => {
  it('lays out a header row with a title using the title-small type role', () => {
    expect(decls(/\.side-sheet__header$/, 'justify-content')).toContain('space-between');
    const title = pairs(/\.side-sheet__title$/).join(' | ');
    expect(title).toMatch(/--md-sys-typescale-title-small-font-size/);
    expect(title).toMatch(/--md-sys-color-on-surface\b/);
  });
});
