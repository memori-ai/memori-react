# Memori React

[![npm version](https://img.shields.io/github/package-json/v/memori-ai/memori-react)](https://www.npmjs.com/package/@memori.ai/memori-react)
![Tests](https://github.com/memori-ai/memori-react/workflows/CI/badge.svg?branch=main)
![TypeScript Support](https://img.shields.io/badge/TypeScript-Support-blue)

Library to integrate a [Memori](https://memori.ai) in a React app.

Platforms:

- [MemoryTwin](https://app.memorytwin.com/en): consumer / creator platform
- [TwinCreator](https://app.twincreator.com/en): developer-oriented platform

## Work in progress

This library is still in development and is not ready for production.

## Installation

```bash
yarn add @memori.ai/memori-react
```

```bash
npm install @memori.ai/memori-react
```

## Usage

```tsx
import Memori from '@memori.ai/memori-react';

const App = () => (
  <Memori
    memoriName="Memori"
    ownerUserName="nunziofiore"
    tenantID="app.memorytwin.com"
    apiURL="https://backend.memori.ai"
    uiLang="it"
    showShare
  />
);
```

### Props

WIP

### Customization

WIP

## See also

- [memori-api-client](https://github.com/memori-ai/memori-api-client) - API client for Memori
- [memori-webcomponent](https://github.com/memori-ai/memori-webcomponent) - Web component for Memori, uses this library
