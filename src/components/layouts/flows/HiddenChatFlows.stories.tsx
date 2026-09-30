import type { Meta, StoryObj } from '@storybook/react';
import { venue } from '../../../mocks/data';
import { withWidgetProviders } from '../../../../.storybook/decorators';
import {
  FlowWidget,
  flowArgTypes,
  flowBase,
  noGates,
  renderFlow,
} from './FlowWidget';

/**
 * HIDDEN_CHAT entry flows: open the sidebar with the help button.
 * Unlike other layouts, autostart fires on first open (not on mount) and the
 * StartPanel is only rendered with `autoStart` while a position/login gate
 * is pending. The header never
 * shows login / position controls.
 */
const meta = {
  title: 'Layouts/Flows/Hidden Chat',
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
    layout: 'HIDDEN_CHAT',
  },
} satisfies Meta<typeof FlowWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No gates: StartPanel + pre-chat inputs. */
export const Default: Story = {};

/** Opening the sidebar starts the session. */
export const AutoStart: Story = {
  args: { autoStart: true },
};

/** StartPanel asks to share or skip position. */
export const PositionRequired: Story = {
  args: { memoriOverrides: { ...noGates, needsPosition: true } },
};

/** Autostart is held on the StartPanel until position is shared or skipped. */
export const PositionRequiredWithAutoStart: Story = {
  args: {
    autoStart: true,
    memoriOverrides: { ...noGates, needsPosition: true },
  },
};

/** Position already in localStorage: autostart proceeds on open. */
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

/** Clicking start opens the age verification modal. */
export const AgeVerification: Story = {
  args: {
    memoriOverrides: { ...noGates, ageRestriction: 18 },
    storedBirthDate: undefined,
  },
};

/** Autostart on open triggers the age verification modal. */
export const AgeVerificationWithAutoStart: Story = {
  args: {
    autoStart: true,
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
