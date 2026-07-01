import { describe, it, expect } from 'vitest';
import postcss from 'postcss';
import { compileSnippet } from '../../test/helpers/sass';

// Compile the partial directly (it is not yet @forwarded into the library).
// The loadPaths include the repo root and the file is `_navigation-bar.scss`,
// so `components/navigation-bar/navigation-bar` resolves.
const css = compileSnippet("@use 'components/navigation-bar/navigation-bar' as *;");
const root = postcss.parse(css);

/** Collect declaration values for `prop` across rules whose selector matches `selRe`. */
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

/** All prop:value pairs (as strings) inside rules matching `selRe`. */
function pairs(selRe: RegExp): string[] {
  const out: string[] = [];
  root.walkRules((r) => {
    if (selRe.test(r.selector)) r.walkDecls((d) => { out.push(`${d.prop}: ${d.value}`); });
  });
  return out;
}

describe('navigation-bar: container', () => {
  it('renders a .navigation-bar rule', () => {
    expect(hasSelector(/^\.navigation-bar$/)).toBe(true);
  });

  it('is 80dp tall', () => {
    expect(decls(/^\.navigation-bar$/, 'height')).toContain('80px');
  });

  it('is fixed to the bottom spanning full width', () => {
    expect(decls(/^\.navigation-bar$/, 'position')).toContain('fixed');
    expect(decls(/^\.navigation-bar$/, 'width')).toContain('100%');
    // inset shorthand pins bottom/left/right to 0.
    const inset = decls(/^\.navigation-bar$/, 'inset').join(' ');
    expect(inset).toMatch(/0 0 0/);
  });

  it('uses the surface-container container color role (with surface fallback)', () => {
    const bg = decls(/^\.navigation-bar$/, 'background-color').join(' | ');
    expect(bg).toMatch(/--md-sys-color-surface-container/);
    expect(bg).toMatch(/--md-sys-color-surface\b/);
  });

  it('lays items out evenly (space-between flex row)', () => {
    expect(decls(/^\.navigation-bar$/, 'display')).toContain('flex');
    expect(decls(/^\.navigation-bar$/, 'justify-content')).toContain('space-between');
  });
});

describe('navigation-bar: item', () => {
  it('renders a .navigation-bar__item rule', () => {
    expect(hasSelector(/\.navigation-bar__item$/)).toBe(true);
  });

  it('flexes to fill an even share of the bar', () => {
    expect(decls(/\.navigation-bar__item$/, 'flex')).toContain('1 1 0');
  });

  it('stacks icon above label (column flex)', () => {
    expect(decls(/\.navigation-bar__item$/, 'flex-direction')).toContain('column');
    expect(decls(/\.navigation-bar__item$/, 'align-items')).toContain('center');
  });

  it('is inactive by default (on-surface-variant)', () => {
    expect(decls(/\.navigation-bar__item$/, 'color')).toContain(
      'var(--md-sys-color-on-surface-variant)'
    );
  });

  it('guarantees a 48dp minimum touch target', () => {
    // The min-touch-target mixin emits an ::after pseudo sized to max(100%, 48px).
    const after = pairs(/\.navigation-bar__item::after$/).join(' ');
    expect(after).toMatch(/max\(100%, 48px\)/);
  });
});

describe('navigation-bar: active indicator', () => {
  it('renders a .navigation-bar__indicator rule', () => {
    expect(hasSelector(/\.navigation-bar__indicator$/)).toBe(true);
  });

  it('is a 64x32dp pill', () => {
    expect(decls(/\.navigation-bar__indicator$/, 'width')).toContain('64px');
    expect(decls(/\.navigation-bar__indicator$/, 'height')).toContain('32px');
  });

  it('uses the full / rounded shape token', () => {
    expect(decls(/\.navigation-bar__indicator$/, 'border-radius')).toContain(
      'var(--md-sys-shape-corner-full)'
    );
  });

  it('paints secondary-container only when the item is active', () => {
    // Base indicator has no background-color; active variant does.
    expect(decls(/^\.navigation-bar__indicator$/, 'background-color')).toHaveLength(0);
    expect(
      decls(/\.navigation-bar__item\.active .navigation-bar__indicator$/, 'background-color')
    ).toContain('var(--md-sys-color-secondary-container)');
  });

  it('has a state layer tinted with on-surface-variant', () => {
    // state-layer mixin emits a ::before with the tint as background-color.
    const before = pairs(/\.navigation-bar__indicator::before$/).join(' ');
    expect(before).toMatch(/background-color: var\(--md-sys-color-on-surface-variant\)/);
  });

  it('state layer hover/focus/pressed opacities use the state tokens', () => {
    const hover = pairs(/\.navigation-bar__indicator:hover::before$/).join(' ');
    const focus = pairs(/\.navigation-bar__indicator:focus-visible::before$/).join(' ');
    const active = pairs(/\.navigation-bar__indicator:active::before$/).join(' ');
    expect(hover).toMatch(/--md-sys-state-hover-state-layer-opacity/);
    expect(focus).toMatch(/--md-sys-state-focus-state-layer-opacity/);
    expect(active).toMatch(/--md-sys-state-pressed-state-layer-opacity/);
  });
});

describe('navigation-bar: icon', () => {
  it('is 24dp', () => {
    expect(decls(/\.navigation-bar__icon$/, 'font-size')).toContain('24px');
    expect(decls(/\.navigation-bar__icon$/, 'width')).toContain('24px');
    expect(decls(/\.navigation-bar__icon$/, 'height')).toContain('24px');
  });

  it('inactive icon color is on-surface-variant', () => {
    expect(decls(/^\.navigation-bar__icon$/, 'color')).toContain(
      'var(--md-sys-color-on-surface-variant)'
    );
  });

  it('active icon color is on-secondary-container', () => {
    expect(
      decls(/\.navigation-bar__item\.active .navigation-bar__icon$/, 'color')
    ).toContain('var(--md-sys-color-on-secondary-container)');
  });
});

describe('navigation-bar: label', () => {
  it('uses the label-medium type role', () => {
    const text = pairs(/^\.navigation-bar__label$/).join(' | ');
    expect(text).toMatch(/--md-sys-typescale-label-medium-font-size/);
    expect(text).toMatch(/--md-sys-typescale-label-medium-line-height/);
    expect(text).toMatch(/--md-sys-typescale-label-medium-font-weight/);
    expect(text).toMatch(/--md-sys-typescale-label-medium-letter-spacing/);
  });

  it('inactive label color is on-surface-variant', () => {
    expect(decls(/^\.navigation-bar__label$/, 'color')).toContain(
      'var(--md-sys-color-on-surface-variant)'
    );
  });

  it('active label color is on-surface', () => {
    expect(
      decls(/\.navigation-bar__item\.active .navigation-bar__label$/, 'color')
    ).toContain('var(--md-sys-color-on-surface)');
  });
});
