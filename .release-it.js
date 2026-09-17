const { execSync } = require('child_process');

/**
 * release-it loads the first cosmiconfig hit only (package.json before
 * .release-it.js). Keep the full config here so we can pass functions.
 *
 * Why the SHA + generateOn hack:
 * conventional-changelog walks every semver tag in range. On this repo, v8.*
 * and v9.*-alpha tags are interleaved by date, so a tag name as `from` makes it
 * emit dozens of sections that all reuse the new release's compare URL.
 * Passing the previous tag's commit SHA forces a single `sha..HEAD` range;
 * generateOn: false keeps that range as one changelog section.
 */
function previousReleaseSha() {
  try {
    const tag = execSync('git describe --tags --abbrev=0', {
      encoding: 'utf8',
    }).trim();
    return execSync(`git rev-list -n1 ${tag}`, { encoding: 'utf8' }).trim();
  } catch {
    return undefined;
  }
}

module.exports = {
  hooks: {
    'after:bump': 'yarn update-version && yarn build',
  },
  git: {
    tagName: 'v${version}',
    commitMessage: 'chore: release v${version}',
    addUntrackedFiles: true,
  },
  npm: {
    publish: true,
  },
  github: {
    release: true,
    releaseName: '${version}',
  },
  plugins: {
    '@release-it/conventional-changelog': {
      infile: 'CHANGELOG.md',
      header: '# Changelog',
      outputUnreleased: true,
      gitRawCommitsOpts: {
        from: previousReleaseSha(),
      },
      writerOpts: {
        generateOn: () => false,
        doFlush: true,
      },
      preset: {
        name: 'conventionalcommits',
        types: [
          { type: 'feat', section: 'Features' },
          { type: 'fix', section: 'Bug Fixes' },
          { type: 'refactor', section: 'Changes' },
          { type: 'chore', section: 'Maintenance' },
        ],
      },
    },
  },
};
