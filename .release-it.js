const { execSync } = require('child_process');

/**
 * Lockstep release for every public workspace: one version, one `v${version}`
 * tag. Run from the repo root with `yarn release`.
 *
 * release-it loads the first cosmiconfig hit only (package.json before
 * .release-it.js). Keep the full config here so we can pass functions.
 *
 * Why the SHA + generateOn hack:
 * conventional-changelog walks every semver tag in range. On this repo, v8.*
 * and v9.*-alpha tags are interleaved by date, so a tag name as `from` makes it
 * emit dozens of sections that all reuse the new release's compare URL.
 * Passing the previous tag's commit SHA forces a single `sha..HEAD` range;
 * generateOn: false keeps that range as one changelog section.
 *
 * The npm plugin is disabled: `npm publish` would ship `workspace:*` ranges
 * verbatim, while `yarn npm publish` rewrites them to the released version.
 */

// Tip of the memori-webcomponent history merged into packages/memori-webcomponent.
// None of its commits are reachable from v9.1.7, so without this exclusion the
// first monorepo release would list the whole imported history, and its old
// `feat!` commits would make the recommended bump "major".
const WEBCOMPONENT_IMPORT_TIP = '5401f53c8f3587fa22b8f6b120fd9fc7a209264c';
const importedCommits = new Set(
  execSync(`git rev-list ${WEBCOMPONENT_IMPORT_TIP}`, { encoding: 'utf8' })
    .trim()
    .split('\n')
);

// Same rules as the conventionalcommits preset, minus the imported history.
function whatBump(commits) {
  const relevant = commits.filter(commit => !importedCommits.has(commit.hash));
  const breakings = relevant.filter(commit => commit.notes.length > 0).length;
  const features = relevant.filter(commit => commit.type === 'feat').length;
  return {
    level: breakings > 0 ? 0 : features > 0 ? 1 : 2,
    reason: `There are ${breakings} BREAKING CHANGES and ${features} features`,
  };
}

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
    'after:bump': [
      'node scripts/sync-versions.js ${version}',
      'yarn workspace @memori.ai/memori-react update-version',
      'yarn build',
    ],
    'before:git:release':
      'yarn workspaces foreach --no-private -tv npm publish --access public',
  },
  npm: false,
  git: {
    tagName: 'v${version}',
    commitMessage: 'chore: release v${version}',
    addUntrackedFiles: true,
  },
  github: {
    release: true,
    releaseName: '${version}',
  },
  plugins: {
    '@release-it/conventional-changelog': {
      infile: 'packages/memori-react/CHANGELOG.md',
      header: '# Changelog',
      outputUnreleased: true,
      whatBump,
      gitRawCommitsOpts: {
        from: previousReleaseSha(),
        _: [`^${WEBCOMPONENT_IMPORT_TIP}`],
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
