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

| Prop                               | Required       | Type           | Default                     | Description                                                                                              |
| ---------------------------------- | -------------- | -------------- | --------------------------- | -------------------------------------------------------------------------------------------------------- |
| `memoriName`                       | \* (see below) | `string`       |                             | Name of the Memori                                                                                       |
| `ownerUserName`                    | \* (see below) | `string`       |                             | Username of the Memori owner                                                                             |
| `memoriID`                         | \* (see below) | `string`       |                             | ID of the Memori                                                                                         |
| `ownerUserID`                      | \* (see below) | `string`       |                             | ID of the Memori owner                                                                                   |
| `tenantID`                         | ✔️             | `string`       |                             | Tenant ID, example: "app.twincreator.com" or "app.memorytwin.com"                                        |
| `integrationID`                    |                | `string`       |                             | Integration ID, UUID which refers to the public page layout                                              |
| `secretToken`                      |                | `string`       |                             | Secret token, the password of a private or secret Memori                                                 |
| `showShare`                        |                | `bool`         | `true`                      | Show the share button                                                                                    |
| `showSettings`                     |                | `bool`         | `false`                     | Show the settings panel button                                                                           |
| `showInstruct`                     |                | `bool`         | `false`                     | Show the switch selecting between test mode or instruct mode, needs an administrative session as a giver |
| `baseURL`                          |                | `string`       |                             | Base URL of the Memori, example: "https://app.twincreator.com" or "https://app.memorytwin.com"           |
| `apiURL`                           |                | `string`       | "https://backend.memori.ai" | URL of the Memori API                                                                                    |
| `tag`                              |                | `string`       |                             | Tag of the person opening the session to the Memori, could be the giver or a receiver                    |
| `pin`                              |                | `string`       |                             | PIN of the person opening the session to the Memori, could be the giver or a receiver                    |
| `context`                          |                | `string`       |                             | Initial context of the conversation, dictionary with "key: value" pairs as context variables             |
| `initialQuestion`                  |                | `string`       |                             | Initial question to ask to the Memori, starts the conversation as this would be sent to the Memori       |
| `uiLang`                           |                | `'en' \| 'it'` | "en"                        | Language of the UI, es: "en" or "it"                                                                     |
| `spokenLang`                       |                | `string`       |                             | Language of the spoken text, as defaults to user selection. Example: "en" or "it"                        |
| `onStateChange`                    |                | `function`     |                             | Callback function called when the state of the Memori changes                                            |
| `AZURE_COGNITIVE_SERVICES_TTS_KEY` |                | `string`       |                             | Azure Cognitive Services TTS key, used to generate the audio of the Memori and for STT recognition       |

\*: one of these pairs is required: `memoriName` + `ownerUserName`, `memoriID` + `ownerUserID`

### Customization

WIP

## See also

- [memori-api-client](https://github.com/memori-ai/memori-api-client) - API client for Memori
- [memori-webcomponent](https://github.com/memori-ai/memori-webcomponent) - Web component for Memori, uses this library
