import '../src/styles.css';

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
  options: {
    storySort: {
      order: ['General', 'Widget', ['Default', '*'], 'ui', '*', 'WIP'],
    },
  },
};
