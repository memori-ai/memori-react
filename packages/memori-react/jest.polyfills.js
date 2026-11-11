// jsdom does not provide TextEncoder/TextDecoder, which are required by some
// dependencies (e.g. @nats-io/nats-core). Polyfill them from Node's util module.
const { TextEncoder, TextDecoder } = require('util');

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
