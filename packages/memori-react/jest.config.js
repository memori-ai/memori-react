/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  silent: true,
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/esm/',
    '/example/',
    '/src/components/DateSelector/DateSelector.test.tsx',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    uuid: require.resolve('uuid'),
    '@react-leaflet/core': require.resolve('./__mocks__/react-leaflet-core.js'),
    // Portal `@memori.ai/ui` → ../ui can resolve a second React from ui/node_modules
    '^react$': require.resolve('react'),
    '^react-dom$': require.resolve('react-dom'),
    '^react/jsx-runtime$': require.resolve('react/jsx-runtime'),
    '^react/jsx-dev-runtime$': require.resolve('react/jsx-dev-runtime'),
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@memori\\.ai/ui)(?!@memori\\.ai/memori-api-client)(?!microsoft-cognitiveservices-speech-sdk)(?!uuid)(?!@react-leaflet/core)',
  ],
};
