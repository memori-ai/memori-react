# Storybook conventions — `memori-react`

Scope: **layouts and product compositions**, not design-system primitives (those live in `@memori.ai/ui`).

Full plan: workspace `storybook-plan.md` (PR-R0 / R1).

## Title taxonomy

| Prefix | Content |
|--------|---------|
| `Layouts/` | One story per `LayoutName` (+ HiddenChat states, avatar variants) |
| `Compositions/` | Chat, StartPanel, Header, MemoriWidget smoke |
| `Surfaces/` | Drawers / modals (Login, Settings, ChatHistory, …) |
| `Internals/` | Leaf UI (ChatBubble matrices, Snippet, AvatarView, Showcase, …) |
| `Live/` | Staging / localhost / prod agent demos — not CI-critical |

## Providers

- Preview: theme toolbar + `I18nWrapper` (`.storybook/preview.js`)
- Full widget / layouts: also `withWidgetProviders` from `.storybook/decorators.js` (Artifact + Viseme)

## Layout stories

- Valid `layout` values only (`src/types/layout.ts`): `FULLPAGE`, `TOTEM`, `CHAT`, `WEBSITE_ASSISTANT`, `HIDDEN_CHAT`, `ZOOMED_FULL_BODY` (and `DEFAULT` alias)
- Prefer fixture `memori` / `tenant` from `mocks/data` for canonical Layouts
- Put localhost / hard-coded staging agents under `Live/`
- CSF3 for new/migrated files
