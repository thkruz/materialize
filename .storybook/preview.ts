import type { Preview } from '@storybook/html-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { createElement, useEffect, useState, type PropsWithChildren } from 'react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { addons } from 'storybook/preview-api';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { themes } from 'storybook/theming';
import './material-icons.css';
import './docs-theme.css';
import '../sass/materialize.scss';

// addon-docs chromes Docs pages with a static theme, so the theme toolbar
// would flip the M3 tokens while the page around the stories stayed light.
// This container reads the `theme` global (and follows toolbar changes) so
// the docs chrome switches to Storybook's dark theme alongside the tokens.
const ThemedDocsContainer = (props: PropsWithChildren<DocsContainerProps>) => {
  const readTheme = (): string =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props.context as any)?.store?.userGlobals?.globals?.theme ??
    document.documentElement.getAttribute('theme') ??
    'light';
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    const channel = addons.getChannel();
    const onGlobalsUpdated = ({ globals }: { globals?: { theme?: string } }) => {
      if (globals?.theme) setTheme(globals.theme);
    };
    channel.on(GLOBALS_UPDATED, onGlobalsUpdated);
    return () => channel.off(GLOBALS_UPDATED, onGlobalsUpdated);
  }, []);

  return createElement(DocsContainer, {
    ...props,
    theme: theme === 'dark' ? themes.dark : themes.light
  });
};

const preview: Preview = {
  decorators: [
    // Decorator to be able to switch between light and dark themes
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark'
      },
      defaultTheme: 'light',
      attributeName: 'theme'
    })
  ],
  parameters: {
    docs: {
      container: ThemedDocsContainer,
      toc: true // Enables the table of contents in auto generated docs
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
