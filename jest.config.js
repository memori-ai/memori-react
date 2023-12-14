/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  silent: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/esm/', '/example/'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@memori.ai/memori-api-client)',
    '/node_modules/(?!microsoft-cognitiveservices-speech-sdk)',
  ],
};
