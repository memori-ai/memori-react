# vite-react-template

![TypeScript](https://img.shields.io/badge/TypeScript-✔️-blue)
![a11y axe](https://img.shields.io/badge/a11y-tested-brightgreen)
![Unit Tests](https://github.com/nzambello/vite-react-template/workflows/Unit%20Tests/badge.svg?branch=main)
![E2E Tests](https://github.com/nzambello/vite-react-template/workflows/E2E%20Tests/badge.svg?branch=main)

This is a [React](https://reactjs.org) + [TypeScript](https://www.typescriptlang.org/) boilerplate built with [Vite](https://vitejs.dev).

## What's inside?

- [ReactJS](https://reactjs.org)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)

### Linting and formatting

- [Prettier](https://prettier.io)
- [ESLint](https://eslint.org)
- [StyleLint](https://stylelint.io/)
- [Husky](https://typicode.github.io/husky/#/)
- [Commitlint](https://commitlint.js.org/#/)

### Testing

- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com)
- [Playwright](https://playwright.dev/)

### Misc

- [Storybook](https://storybook.js.org)
- [Release-it](https://github.com/release-it/release-it)
- [GitHub Actions](https://github.com/nzambello/vite-react-template/actions)

### Make it yours

In the `package.json` file, check `release-it`, `eslint`, `stylelint` and `prettier` configurations and change the values to match your project and your preferences.

## Getting started

1. Create the project.

   ```bash
   npx degit nzambello/vite-react-template my-app
   ```

2. Access the project directory.

   ```bash
   cd my-app
   ```

3. Initialize a git repository.

   ```bash
   git init
   ```

4. Install dependencies.

   ```bash
   yarn
   ```

5. Start dev server with hot reload at http://localhost:3000.
   ```bash
   yarn dev
   ```

## Other commands

### Lint commands

```bash
yarn lint
# or separately
yarn lint:js
yarn lint:css
```

### Type check

```bash
yarn typecheck
```

### Format with prettier

```bash
yarn format
```

### Build commands

```bash
yarn build
```

### Run the app in production mode at http://localhost:3000.

```bash
yarn preview
```

### Component stories

```bash
yarn storybook
```

### Test commands

- Run unit tests and watch
  ```bash
  yarn test
  ```
- Run unit tests with coverage
  ```bash
  yarn coverage
  ```
- Run e2e tests
  ```bash
  yarn test:e2e
  ```
- Run e2e tests in debug mode
  ```bash
  yarn test:e2e:debug
  ```
- Show e2e tests results
  ```bash
  yarn playwright show-report
  ```

## License

This project is licensed under the MIT License.

## Credits

This project was heavily inspired by [react-ts-vite-template](https://github.com/fabien-ml/react-ts-vite-template/).
