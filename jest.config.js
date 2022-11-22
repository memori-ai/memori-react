/** @type {import('jest').Config} */
const config = {
  silent: true,
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};

module.exports = config;
