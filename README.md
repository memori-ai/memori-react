# Memori React

[![npm version](https://img.shields.io/github/package-json/v/memori-ai/memori-react)](https://www.npmjs.com/package/@memori.ai/memori-react)
![Tests](https://github.com/memori-ai/memori-react/workflows/CI/badge.svg?branch=main)
![TypeScript Support](https://img.shields.io/badge/TypeScript-Support-blue)

Library to integrate a [Memori](https://memori.ai) in a React app.

Platforms:

- [MemoryTwin](https://app.memorytwin.com/en): consumer / creator platform
- [TwinCreator](https://app.twincreator.com/en): developer-oriented platform

## Installation

```bash
yarn add @memori.ai/memori-react
```

```bash
npm install @memori.ai/memori-react
```

## Usage

Import the component:

```tsx
import Memori from '@memori.ai/memori-react';
```

Import the CSS:

```tsx
import '@memori.ai/memori-react/dist/styles.css';
```

Then use it in your app:

```tsx
const App = () => (
  <Memori
    memoriName="Memori"
    ownerUserName="nunziofiore"
    tenantID="app.memorytwin.com"
    apiURL="https://backend.memori.ai"
    baseURL="https://app.memorytwin.com"
    uiLang="it"
    showShare
    height="100vh"
  />
);
```

### Props

| Prop                               | Required       | Type                    | Default                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------- | -------------- | ----------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `memoriName`                       | \* (see below) | `string`                |                             | Name of the Memori                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `ownerUserName`                    | \* (see below) | `string`                |                             | Username of the Memori owner                                                                                                                                                                                                                                                                                                                                                                                                            |
| `memoriID`                         | \* (see below) | `string`                |                             | ID of the Memori                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `ownerUserID`                      | \* (see below) | `string`                |                             | ID of the Memori owner                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `tenantID`                         | ✔️             | `string`                |                             | Tenant ID, example: "app.twincreator.com" or "app.memorytwin.com"                                                                                                                                                                                                                                                                                                                                                                       |
| `sessionID`                        |                | `string`                |                             | Initial Session ID, UUID which refers to the session to the Memori and identifies a conversation and its permissions (giver, receiver, anonymous). A session would be started autonomously with the params set, but if you have an existing and valid sessionID you can pass it as already opened one. Use this at your risk, as session recovery might break or start session as anon user. In most cases, you shoudn't use this prop. |
| `authToken`                        |                | `string`                |                             | Authentication token from user login, needed for giver sessions to upload assets                                                                                                                                                                                                                                                                                                                                                        |
| `integrationID`                    |                | `string`                |                             | Integration ID, UUID which refers to the public page layout                                                                                                                                                                                                                                                                                                                                                                             |
| `secretToken`                      |                | `string`                |                             | Secret token, the password of a private or secret Memori                                                                                                                                                                                                                                                                                                                                                                                |
| `height`                           |                | `string`                | "100%"                      | Height of the Memori                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `showShare`                        |                | `bool`                  | `true`                      | Show the share button                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `showSettings`                     |                | `bool`                  | `false`                     | Show the settings panel button                                                                                                                                                                                                                                                                                                                                                                                                          |
| `showInstruct`                     |                | `bool`                  | `false`                     | Show the switch selecting between test mode or instruct mode, needs an administrative session as a giver                                                                                                                                                                                                                                                                                                                                |
| `baseURL`                          |                | `string`                |                             | Base URL of the Memori, example: "https://app.twincreator.com" or "https://app.memorytwin.com"                                                                                                                                                                                                                                                                                                                                          |
| `apiURL`                           |                | `string`                | "https://backend.memori.ai" | URL of the Memori API                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `tag`                              |                | `string`                |                             | Tag of the person opening the session to the Memori, could be the giver or a receiver                                                                                                                                                                                                                                                                                                                                                   |
| `pin`                              |                | `string`                |                             | PIN of the person opening the session to the Memori, could be the giver or a receiver                                                                                                                                                                                                                                                                                                                                                   |
| `context`                          |                | `string`                |                             | Initial context of the conversation, dictionary with "key: value" pairs as context variables                                                                                                                                                                                                                                                                                                                                            |
| `initialQuestion`                  |                | `string`                |                             | Initial question to ask to the Memori, starts the conversation as this would be sent to the Memori                                                                                                                                                                                                                                                                                                                                      |
| `uiLang`                           |                | `'en' \| 'it'`          | "en"                        | Language of the UI, es: "en" or "it"                                                                                                                                                                                                                                                                                                                                                                                                    |
| `spokenLang`                       |                | `string`                |                             | Language of the spoken text, as defaults to user selection. Example: "en" or "it"                                                                                                                                                                                                                                                                                                                                                       |
| `onStateChange`                    |                | `function`              |                             | Callback function called when the state of the Memori changes                                                                                                                                                                                                                                                                                                                                                                           |
| `AZURE_COGNITIVE_SERVICES_TTS_KEY` |                | `string`                |                             | Azure Cognitive Services TTS key, used to generate the audio of the Memori and for STT recognition                                                                                                                                                                                                                                                                                                                                      |
| `layout`                           |                | `string`                |                             | Layout of the Memori, can be "FULLPAGE" (default) or "TOTEM", see [below](#layouts)                                                                                                                                                                                                                                                                                                                                                     |
| `customLayout`                     |                | `React.FC<LayoutProps>` |                             | Custom layout component, see [below](#custom-layout)                                                                                                                                                                                                                                                                                                                                                                                    |

\*: one of these pairs is required: `memoriName` + `ownerUserName`, `memoriID` + `ownerUserID`

### Layouts

The Memori can be displayed in two different layouts: `FULLPAGE` and `TOTEM`.
If you don't specify a layout, the default one is `FULLPAGE`.

#### FULLPAGE

<img alt="Full page layout" src="./docs/fullpage.png" width="300" />

#### TOTEM

<img alt="Totem layout" src="./docs/totem.png" width="300" />

#### Custom layout

You can override the default layout by passing a custom layout component to the `customLayout` prop.

The custom layout component must be a React functional component that accepts a [LayoutProps](https://github.com/memori-ai/memori-react/blob/a6e0de73f3610f763bcd8e28deb7626fea91f0d1/src/components/MemoriWidget/MemoriWidget.tsx#LL148C21-L148C21) object as props.

```tsx
import type { LayoutProps } from '@memori.ai/memori-react/components/MemoriWidget';

const MyCustomLayout: React.FC<LayoutProps> = = ({
  header,
  avatar,
  chat,
  startPanel,
  integrationStyle,
  integrationBackground,
  changeMode,
  sessionId,
  hasUserActivatedSpeak,
  showInstruct = false,
  loading = false,
  poweredBy,
}) => (
  <>
    {integrationStyle}
    {integrationBackground}

    <Spin spinning={loading} className="memori-mycustom-layout">
      {poweredBy}

      <div className="memori-mycustom-layout--controls">
        {sessionId && hasUserActivatedSpeak ? chat : startPanel}
      </div>
    </Spin>
  </>
);
```

And then pass it to the `customLayout` prop:

```tsx
  <Memori
    ...
    customLayout={MyCustomLayout}
  />
```

## See also

- [memori-api-client](https://github.com/memori-ai/memori-api-client) - API client for Memori
- [memori-webcomponent](https://github.com/memori-ai/memori-webcomponent) - Web component for Memori, uses this library
