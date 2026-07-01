import { create } from 'storybook/theming';

// Materialize brand palette (see sass/_variables.scss):
//   primary = materialize-red lighten-2 (#ee6e73)
const MATERIALIZE_RED = '#ee6e73';
const TEXT = '#444444';

export default create({
  base: 'light',

  // Brand (logo served from ../public via staticDirs in main.ts).
  brandTitle: 'Materialize',
  brandUrl: 'https://github.com/thkruz/materialize',
  brandImage: '/materialize.svg',
  brandTarget: '_self',

  // Accent colors — the salmon red drives selected nav items and active states,
  // matching the Materialize docs.
  colorPrimary: MATERIALIZE_RED,
  colorSecondary: MATERIALIZE_RED,

  // App shell.
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: 'rgba(0, 0, 0, 0.1)',
  appBorderRadius: 2,

  // Typography — Roboto to match Materialize, with system fallbacks.
  fontBase: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  fontCode: 'Consolas, "Courier New", monospace',

  // Text.
  textColor: TEXT,
  textInverseColor: '#ffffff',
  textMutedColor: '#9e9e9e',

  // Toolbar / top bar.
  barTextColor: '#616161',
  barSelectedColor: MATERIALIZE_RED,
  barHoverColor: MATERIALIZE_RED,
  barBg: '#ffffff',

  // Form inputs (e.g. the search box).
  inputBg: '#ffffff',
  inputBorder: 'rgba(0, 0, 0, 0.1)',
  inputTextColor: TEXT,
  inputBorderRadius: 2
});
