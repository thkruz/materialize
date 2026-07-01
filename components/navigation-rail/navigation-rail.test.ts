import { describe, it, expect } from 'vitest';
import postcss from 'postcss';
import { compileSnippet } from '../../test/helpers/sass';

// M3 Navigation rail — https://m3.material.io/components/navigation-rail/specs
// Compile the partial in isolation and assert the compiled CSS against the spec.
const css = compileSnippet("@use 'components/navigation-rail/navigation-rail' as *;");
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

describe('navigation-rail: container', () => {
  it('renders a .navigation-rail rule', () => {
    expect(hasSelector(/^\.navigation-rail$/)).toBe(true);
  });

  it('is 80dp wide and full height', () => {
    expect(decls(/^\.navigation-rail$/, 'width')).toContain('80px');
    expect(decls(/^\.navigation-rail$/, 'height')).toContain('100%');
  });

  it('is fixed to the leading edge', () => {
    expect(decls(/^\.navigation-rail$/, 'position')).toContain('fixed');
    const inset = decls(/^\.navigation-rail$/, 'inset').join(' ');
    expect(inset).toMatch(/0 auto 0 0/);
  });

  it('uses the surface container color role', () => {
    const bg = decls(/^\.navigation-rail$/, 'background-color').join(' | ');
    expect(bg).toMatch(/--md-sys-color-surface\b/);
  });

  it('stacks destinations in a vertical column', () => {
    expect(decls(/^\.navigation-rail$/, 'display')).toContain('flex');
    expect(decls(/^\.navigation-rail$/, 'flex-direction')).toContain('column');
  });

  it('offers center + bottom alignment modifiers', () => {
    expect(decls(/\.navigation-rail--center$/, 'justify-content')).toContain('center');
    expect(decls(/\.navigation-rail--bottom$/, 'justify-content')).toContain('flex-end');
  });
});

describe('navigation-rail: item', () => {
  it('renders a .navigation-rail__item rule', () => {
    expect(hasSelector(/\.navigation-rail__item$/)).toBe(true);
  });

  it('stacks icon above label (column flex)', () => {
    expect(decls(/\.navigation-rail__item$/, 'flex-direction')).toContain('column');
    expect(decls(/\.navigation-rail__item$/, 'align-items')).toContain('center');
  });

  it('is inactive by default (on-surface-variant)', () => {
    expect(decls(/\.navigation-rail__item$/, 'color')).toContain(
      'var(--md-sys-color-on-surface-variant)'
    );
  });

  it('guarantees a 48dp minimum touch target', () => {
    const after = pairs(/\.navigation-rail__item::after$/).join(' ');
    expect(after).toMatch(/max\(100%, 48px\)/);
  });
});

describe('navigation-rail: active indicator', () => {
  it('is a 56x32dp pill', () => {
    expect(decls(/\.navigation-rail__indicator$/, 'width')).toContain('56px');
    expect(decls(/\.navigation-rail__indicator$/, 'height')).toContain('32px');
  });

  it('uses the full / rounded shape token', () => {
    expect(decls(/\.navigation-rail__indicator$/, 'border-radius')).toContain(
      'var(--md-sys-shape-corner-full)'
    );
  });

  it('paints secondary-container only when the item is active', () => {
    expect(decls(/^\.navigation-rail__indicator$/, 'background-color')).toHaveLength(0);
    expect(
      decls(/\.navigation-rail__item\.active .navigation-rail__indicator$/, 'background-color')
    ).toContain('var(--md-sys-color-secondary-container)');
  });

  it('has a state layer tinted with on-surface-variant with the state tokens', () => {
    const before = pairs(/\.navigation-rail__indicator::before$/).join(' ');
    expect(before).toMatch(/background-color: var\(--md-sys-color-on-surface-variant\)/);
    const hover = pairs(/\.navigation-rail__indicator:hover::before$/).join(' ');
    const focus = pairs(/\.navigation-rail__indicator:focus-visible::before$/).join(' ');
    const active = pairs(/\.navigation-rail__indicator:active::before$/).join(' ');
    expect(hover).toMatch(/--md-sys-state-hover-state-layer-opacity/);
    expect(focus).toMatch(/--md-sys-state-focus-state-layer-opacity/);
    expect(active).toMatch(/--md-sys-state-pressed-state-layer-opacity/);
  });
});

describe('navigation-rail: icon + label', () => {
  it('icon is 24dp, inactive on-surface-variant, active on-secondary-container', () => {
    expect(decls(/\.navigation-rail__icon$/, 'font-size')).toContain('24px');
    expect(decls(/^\.navigation-rail__icon$/, 'color')).toContain(
      'var(--md-sys-color-on-surface-variant)'
    );
    expect(
      decls(/\.navigation-rail__item\.active .navigation-rail__icon$/, 'color')
    ).toContain('var(--md-sys-color-on-secondary-container)');
  });

  it('label uses the label-medium type role', () => {
    const text = pairs(/^\.navigation-rail__label$/).join(' | ');
    expect(text).toMatch(/--md-sys-typescale-label-medium-font-size/);
    expect(text).toMatch(/--md-sys-typescale-label-medium-line-height/);
    expect(text).toMatch(/--md-sys-typescale-label-medium-font-weight/);
    expect(text).toMatch(/--md-sys-typescale-label-medium-letter-spacing/);
  });

  it('active label color is on-surface', () => {
    expect(
      decls(/\.navigation-rail__item\.active .navigation-rail__label$/, 'color')
    ).toContain('var(--md-sys-color-on-surface)');
  });
});
