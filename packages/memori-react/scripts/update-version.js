const path = require('node:path');
const { writeFileSync } = require('node:fs');

const pkgPath = require.resolve('../package.json');
const pkg = require(pkgPath);
const versionPath = path.join(path.dirname(pkgPath), 'src', 'version.ts');
writeFileSync(
  versionPath,
  `// This file is auto-generated. Do not edit manually.
export const version = '${pkg.version}';`
);
