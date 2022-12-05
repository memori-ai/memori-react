/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  silent: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/esm/', '/example/'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    uuid: require.resolve('uuid'),
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@memori.ai/memori-api-client)',
    '/node_modules/(?!microsoft-cognitiveservices-speech-sdk)',
    '/node_modules/(?!uuid)',
  ],
};
