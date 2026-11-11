import React from 'react';
import '../src/styles.css';
import '@memori.ai/ui/dist/memori-ai-ui.css';
import { withI18n } from './decorators';

const THEME_BG = {
  light: '#FFFFFF',
  dark: '#191919',
};

/** @type { import('@storybook/react').Decorator } */
const withTheme = (Story, context) => {
  const themeRaw = context.globals?.theme ?? 'light';
  const theme =
    typeof themeRaw === 'string' ? themeRaw : themeRaw?.value ?? 'light';
  const isDark = theme === 'dark';
  const root = document.documentElement;
  const body = document.body;

  root.removeAttribute('data-theme');
  root.classList.remove('dark');

  if (isDark) {
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
    body.style.backgroundColor = THEME_BG.dark;
  } else {
    body.style.backgroundColor = THEME_BG.light;
  }

  // Keep Storybook backgrounds addon in sync with the theme toolbar
  if (context.globals) {
    context.globals.backgrounds = { value: isDark ? 'dark' : 'light' };
  }

  return React.createElement(Story);
};

const style = document.createElement('style');
style.textContent = `
  :root {
    --memori-label-color: #141414;
    --showcase-section-bg: #fafafa;
    --showcase-section-border: #e0e0e0;
    --showcase-title-color: #333;
  }
  :root.dark,
  [data-theme='dark'] {
    --memori-label-color: #fff;
    --memori-text-color: #fff;
    --showcase-section-bg: #1a1a1a;
    --showcase-section-border: #444;
    --showcase-title-color: #e0e0e0;
  }

  /*
   * Fullscreen widget layouts need a definite height chain. Otherwise
   * height:100% / flex:1 on .memori-widget__surface collapse to content
   * (min-height on the widget alone does not make % children resolve).
   */
  html,
  body,
  #storybook-root,
  #root {
    height: 100%;
    margin: 0;
  }

  body {
    color: var(--memori-label-color);
  }

  #storybook-root,
  #root {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  /* Story wrappers (providers) and the widget must fill the canvas. */
  #storybook-root > *,
  #root > * {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    width: 100%;
    min-height: 0;
    height: 100%;
  }

  #storybook-root .memori-widget,
  #root .memori-widget {
    flex: 1 1 auto;
    width: 100%;
    min-height: 0;
  }
`;
document.head.appendChild(style);

/** @type { import('@storybook/react').Preview } */
const preview = {
  globalTypes: {
    theme: {
      description: 'Theme for Memori components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    backgrounds: {
      value: 'light',
    },
  },
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    options: {
      storySort: {
        order: [
          'Layouts',
          'Compositions',
          'Surfaces',
          'Internals',
          'Live',
          '*',
        ],
      },
    },
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: THEME_BG.dark },
        light: { name: 'Light', value: THEME_BG.light },
      },
      default: 'light',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Widget stories are mostly live/demo; keep soft until compositions are cleaned.
      test: 'todo',
    },
  },
  decorators: [withTheme, withI18n],
};

export default preview;
