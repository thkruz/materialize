import { describe, it, expect } from 'vitest';

import { declValues, hasDecl, declText } from '../../test/helpers/sass';

// M3 Top App Bar compliance — https://m3.material.io/components/top-app-bar/specs
// These assertions read the compiled library CSS and check the app-bar rules
// against the spec's four top app bar sizes, container colors, typescale roles
// and the optional bottom app bar.
describe('M3 Top App Bar', () => {
  it('small app bar is 64dp tall', () => {
    expect(declValues(/^\.app-bar$/, 'height')).toContain('64px');
    expect(declValues(/^\.app-bar\.small$/, 'height')).toContain('64px');
  });

  it('small app bar uses the surface container color and on-surface text', () => {
    expect(hasDecl(/^\.app-bar$/, 'background-color', /--md-sys-color-surface\b/)).toBe(true);
    expect(hasDecl(/^\.app-bar$/, 'color', /--md-sys-color-on-surface\b/)).toBe(true);
  });

  it('small/center title uses the title-large typescale and on-surface', () => {
    expect(hasDecl(/\.app-bar \.app-bar-title$/, 'font-size', /--md-sys-typescale-title-large-font-size/)).toBe(true);
    expect(hasDecl(/\.app-bar \.app-bar-title$/, 'line-height', /--md-sys-typescale-title-large-line-height/)).toBe(true);
    expect(hasDecl(/\.app-bar \.app-bar-title$/, 'color', /--md-sys-color-on-surface\b/)).toBe(true);
  });

  it('leading nav + trailing actions are on-surface-variant at 24dp', () => {
    expect(hasDecl(/\.app-bar \.app-bar-nav > \*/, 'color', /--md-sys-color-on-surface-variant/)).toBe(true);
    expect(hasDecl(/\.app-bar \.app-bar-actions > \*/, 'color', /--md-sys-color-on-surface-variant/)).toBe(true);
    expect(declValues(/\.app-bar \.app-bar-nav > \*/, 'font-size')).toContain('24px');
  });

  it('center-aligned app bar is 64dp with a centered title', () => {
    expect(declValues(/^\.app-bar\.center-aligned$/, 'height')).toContain('64px');
    expect(hasDecl(/^\.app-bar\.center-aligned \.app-bar-title$/, 'text-align', /center/)).toBe(true);
  });

  it('medium app bar is 112dp with a headline-small title on its own line', () => {
    expect(declValues(/^\.app-bar\.medium$/, 'height')).toContain('112px');
    expect(hasDecl(/^\.app-bar\.medium \.app-bar-title$/, 'font-size', /--md-sys-typescale-headline-small-font-size/)).toBe(true);
    // Title drops to a full-width lower line.
    expect(declValues(/^\.app-bar\.medium \.app-bar-title$/, 'flex-basis')).toContain('100%');
  });

  it('large app bar is 152dp with a headline-medium title', () => {
    expect(declValues(/^\.app-bar\.large$/, 'height')).toContain('152px');
    expect(hasDecl(/^\.app-bar\.large \.app-bar-title$/, 'font-size', /--md-sys-typescale-headline-medium-font-size/)).toBe(true);
    expect(declValues(/^\.app-bar\.large \.app-bar-title$/, 'flex-basis')).toContain('100%');
  });

  it('container is surface at rest and surface-container when scrolled', () => {
    expect(hasDecl(/^\.app-bar$/, 'background-color', /--md-sys-color-surface\b/)).toBe(true);
    expect(hasDecl(/^\.app-bar\.scrolled$/, 'background-color', /--md-sys-color-surface-container\b/)).toBe(true);
  });

  it('uses motion tokens for its transitions (no ad-hoc easing)', () => {
    expect(declText(/^\.app-bar$/)).toMatch(/--md-sys-motion-easing-standard/);
  });
});

describe('M3 Bottom App Bar', () => {
  it('is 80dp tall', () => {
    expect(declValues(/^\.bottom-app-bar$/, 'height')).toContain('80px');
  });

  it('uses the surface-container container color', () => {
    expect(hasDecl(/^\.bottom-app-bar$/, 'background-color', /--md-sys-color-surface-container\b/)).toBe(true);
  });

  it('holds on-surface-variant icon buttons at 24dp', () => {
    expect(hasDecl(/\.bottom-app-bar \.app-bar-actions > \*/, 'color', /--md-sys-color-on-surface-variant/)).toBe(true);
    expect(declValues(/\.bottom-app-bar \.app-bar-actions > \*/, 'font-size')).toContain('24px');
  });

  it('reserves a slot for an optional trailing FAB', () => {
    expect(hasDecl(/\.bottom-app-bar \.app-bar-fab$/, 'margin-left', /auto/)).toBe(true);
  });
});
