const fs = require('node:fs');
const path = require('node:path');

const version = process.argv[2];
if (!version) {
  console.error('Usage: node scripts/sync-versions.js <version>');
  process.exit(1);
}

const root = path.join(__dirname, '..');
const manifests = [
  path.join(root, 'package.json'),
  ...fs
    .readdirSync(path.join(root, 'packages'))
    .map(dir => path.join(root, 'packages', dir, 'package.json'))
    .filter(file => fs.existsSync(file)),
];

for (const file of manifests) {
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
  pkg.version = version;
  fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`${pkg.name}: ${version}`);
}
