import React from 'react';
import '../src/styles.css';

import "@memori.ai/ui/dist/memori-ai-ui.css";

const THEME_BG = {
  light: '#F7F9F2',
  dark: '#333',
};

// Decorator: apply theme from the "Theme" toolbar (theme + canvas background)
/** @type { import('@storybook/react').Decorator } */
const withTheme = (Story, context) => {
  const themeRaw = context.globals?.theme ?? 'light';
  const theme = typeof themeRaw === 'string' ? themeRaw : themeRaw?.value ?? 'light';
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

  body {
    color: var(--memori-label-color);
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
    // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
    actions: { argTypesRegex: '^on.*' },
    options: {
      storySort: {
        order: ['General', 'Widget', ['Default', '*'], 'ui', '*', 'WIP'],
      },
    },
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: '#333' },
        light: { name: 'Light', value: '#F7F9F2' },
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
      test: 'todo',
    },
  },
  decorators: [withTheme],
};

export default preview;
