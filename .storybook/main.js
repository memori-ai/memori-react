module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  typescript: {
    check: false, // type-check stories during Storybook build
  },

  core: {
    disableTelemetry: true,
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      legacyRootApi: true,
    },
  },
  docs: {
    autodocs: false,
  },
};
