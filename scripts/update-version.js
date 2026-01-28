const pkg = require('../package.json');
const { writeFileSync } = require('node:fs');
const path = require('node:path');

const versionPath = path.join(path.dirname(), '../src/version.ts');
writeFileSync(
  versionPath,
  `// This file is auto-generated. Do not edit manually.
export const version = '${pkg.version}';`
);
