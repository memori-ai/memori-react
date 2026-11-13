# Memori Monorepo

Monorepo for the Memori front-end libraries, managed with Yarn workspaces.

| Package | Path | npm |
| --- | --- | --- |
| `@memori.ai/memori-react` | [packages/memori-react](packages/memori-react) | [npm](https://www.npmjs.com/package/@memori.ai/memori-react) |
| `@memori.ai/memori-webcomponent` | [packages/memori-webcomponent](packages/memori-webcomponent) | [npm](https://www.npmjs.com/package/@memori.ai/memori-webcomponent) |

Both packages are released together with a single version and a single `v<version>` tag.

## Development

Requires Node 24 and Corepack.

```bash
corepack enable && yarn install --immutable

yarn lint        # biome in every workspace, + stylelint for memori-react CSS
yarn typecheck   # tsc --noEmit in every workspace
yarn build       # build every workspace
yarn test:ci     # run memori-react tests once
yarn storybook   # run memori-react Storybook on http://localhost:6006
yarn dev:webcomponent  # run the webcomponent example app
```

## Release

From the repo root, `yarn release` bumps the version, updates `packages/memori-react/CHANGELOG.md`, builds, publishes both packages with `yarn npm publish` and creates the GitHub release. See [.release-it.js](.release-it.js).

## License

Apache-2.0, see [LICENSE](LICENSE).
