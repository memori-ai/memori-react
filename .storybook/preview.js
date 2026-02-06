import React from 'react';
import '../src/styles.css';

// Decorator to sync Storybook background control with component theme
/** @type { import('@storybook/react').Decorator } */
const withTheme = (Story, context) => {
  // Apply theme based on Storybook background control
  const background =
    context.globals.backgrounds?.value ||
    context.parameters.backgrounds?.default ||
    'light';
  const root = document.documentElement;

  // Remove both theme attributes/classes
  root.removeAttribute('data-theme');
  root.classList.remove('dark');

  // Apply dark theme if background is dark
  if (background === 'dark') {
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
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
  :root.dark {
    --memori-label-color: #fff;
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
  initialGlobals: {
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
