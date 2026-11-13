import type { Meta, StoryObj } from '@storybook/react';
import { integration, venue } from '../../../mocks/data';
import { withWidgetProviders } from '../../../../.storybook/decorators';
import {
  FlowWidget,
  flowArgTypes,
  flowBase,
  noGates,
  renderFlow,
} from './FlowWidget';

/**
 * WEBSITE_ASSISTANT entry flows: open the bubble (bottom-right) to see the
 * panel. Gate order in `StartPanel`: position → login → start button;
 * age verification and password open as modals after clicking start.
 */
const meta = {
  title: 'Layouts/Flows/Website Assistant',
  component: FlowWidget,
  decorators: [withWidgetProviders],
  render: renderFlow,
  argTypes: flowArgTypes,
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
  },
  args: {
    ...flowBase,
    layout: 'WEBSITE_ASSISTANT',
  },
} satisfies Meta<typeof FlowWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No gates: StartPanel with the start button. */
export const Default: Story = {};

/**
 * Header as a site owner gets it with no header options set: fullscreen,
 * audio and close only (share is off by default in this layout).
 */
export const EmbedDefaults: Story = {
  args: { showShare: undefined, showSettings: undefined },
};

/** Extra header actions collapse into the ⋮ session panel. */
export const HeaderOverflowActions: Story = {
  args: {
    showShare: true,
    showClear: true,
    showLogin: true,
    showMessageConsumption: true,
    memoriOverrides: { ...noGates, needsPosition: true },
    storedPosition: venue,
  },
};

/** No session while collapsed; opening the bubble starts it. */
export const AutoStart: Story = {
  args: { autoStart: true },
};

/** Integration with a global background behind the chat messages. */
export const AutoStartWithGlobalBackground: Story = {
  args: {
    autoStart: true,
    integration: {
      ...integration,
      customData: JSON.stringify({
        ...JSON.parse(integration.customData || '{}'),
        avatar: undefined,
        avatarURL: undefined,
      }),
    },
  },
};

/** StartPanel asks to share or skip position before the start button. */
export const PositionRequired: Story = {
  args: { memoriOverrides: { ...noGates, needsPosition: true } },
};

/** Autostart is held until the user shares or skips position in the StartPanel. */
export const PositionRequiredWithAutoStart: Story = {
  args: {
    autoStart: true,
    memoriOverrides: { ...noGates, needsPosition: true },
  },
};

/** Position already in localStorage: autostart proceeds without asking. */
export const PositionAlreadyStoredWithAutoStart: Story = {
  args: {
    autoStart: true,
    memoriOverrides: { ...noGates, needsPosition: true },
    storedPosition: venue,
  },
};

/** StartPanel shows the login gate; "Accedi" opens the login drawer. */
export const LoginRequired: Story = {
  args: { memoriOverrides: { ...noGates, requireLoginToken: true } },
};

/** Autostart is held on the login gate until the user logs in. */
export const LoginRequiredWithAutoStart: Story = {
  args: {
    autoStart: true,
    memoriOverrides: { ...noGates, requireLoginToken: true },
  },
};

/** Position gate first, then login gate. */
export const LoginAndPositionRequired: Story = {
  args: {
    memoriOverrides: {
      ...noGates,
      needsPosition: true,
      requireLoginToken: true,
    },
  },
};

/** Paste a valid token in the `authToken` control to skip the login gate. */
export const LoginRequiredWithAuthToken: Story = {
  args: {
    memoriOverrides: { ...noGates, requireLoginToken: true },
    authToken: '',
  },
};

/** Login is optional: header shows the login button, StartPanel has no gate. */
export const LoginOptional: Story = {
  args: { showLogin: true },
};

/** Clicking start opens the age verification modal. */
export const AgeVerification: Story = {
  args: {
    memoriOverrides: { ...noGates, ageRestriction: 18 },
    storedBirthDate: undefined,
  },
};

/** Birth date already stored: start skips age verification. */
export const AgeAlreadyVerified: Story = {
  args: {
    memoriOverrides: { ...noGates, ageRestriction: 18 },
    storedBirthDate: '1990-01-01T00:00:00.000Z',
  },
};

/** Secret agent without token: clicking start opens the password modal. */
export const PasswordProtected: Story = {
  args: {
    memoriOverrides: {
      ...noGates,
      privacyType: 'SECRET',
      secretToken: undefined,
    },
  },
};

/** Every gate at once: position → login → age → password. */
export const AllGates: Story = {
  args: {
    memoriOverrides: {
      ...noGates,
      needsPosition: true,
      requireLoginToken: true,
      ageRestriction: 18,
      privacyType: 'SECRET',
      secretToken: undefined,
    },
    storedBirthDate: undefined,
  },
};
