# Memori WebComponent

WebComponent to integrate an agent from [Memori](https://memori.ai) in a web page or web app.

Web Platform: [AIsuru](https://aisuru.com)

Uses [memori-react](https://github.com/memori-ai/memori-react) under the hood.
See [demo](https://memori-ai.github.io/memori-webcomponent/example/).

## Installation from npm

```bash
npm i --save @memori.ai/memori-webcomponent
```

## Embed or usage from CDN (suggested)

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@memori.ai/memori-webcomponent/dist/memori-webcomponent.js"
></script>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@memori.ai/memori-react/dist/styles.min.css"
/>
```

## Usage

```html
<memori-client
  memoriName="Memori"
  ownerUserName="memoridev"
  tenantID="www.aisuru.com"
  apiURL="https://backend.memori.ai"
  engineURL="https://engine.memori.ai"
  baseURL="https://www.aisuru.com"
  uiLang="it"
  multilingual="true"
  showShare="true"
></memori-client>
```

For more details on attributes, see [memori-react](https://github.com/memori-ai/memori-react) component props.

Special note for `height`: defaults to `100%` and can be set to a fixed value (e.g. `500px`).
For the best experience, it is recommended to set it to '100vh' (full height of the viewport) or '100svh'.

### Initial context

As for [memori-react](https://github.com/memori-ai/memori-react) component, it is possible to pass an initial context to the Memori session.
With this WebComponent that is slightly different, as the context is not passed as a JSON but as a string in the `context` attribute as comma-separated `KEY:VALUE` pairs:

```html
<memori-client ... context="VAR1:VALUE1,VAR2:VALUE2"></memori-client>
```

## Styling

You can override the default styles of the Agent by customizing the following CSS custom properties:

```css
memori-client,
#headlessui-portal-root,
.memori-widget {
  --memori-primary: rgb(102, 103, 171);
  --memori-primary-text: #fff;
  --memori-inner-content-pad: 1rem;
  --memori-inner-bg: transparent;
  --memori-chat-bubble-bg: #ffffff60;
  --memori-text-color: #000;
  --memori-button-bg: #fff;
  --memori-button-text: #000;
  --memori-button-padding: 0.5rem 1.5rem;
  --memori-button-border-color: #d9d9d9;
  --memori-button-radius: 5px;
  --memori-button-box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
  --memori-blur-background: 0px;
  --memori-drawer--width: 100%;
  --memori-drawer--width--md: 80%;
  --memori-drawer--width--lg: 60%;
  --memori-modal--width: 100%;
  --memori-modal--width--md: 80%;
  --memori-error-color: #ff4d4f;
}
```

You can review the default styles in the [styles.css](https://github.com/memori-ai/memori-react/blob/main/src/styles.css) file.

## See also

- [memori-api-client](https://github.com/memori-ai/memori-api-client) - API client for Memori
- [memori-react](https://github.com/memori-ai/memori-react) - React library for Memori, used by this library
