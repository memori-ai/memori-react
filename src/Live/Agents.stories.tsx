import type { Meta, StoryObj } from '@storybook/react';
import Memori from '../index';
import { withWidgetProviders } from '../../.storybook/decorators';

/**
 * Live / staging / localhost agent demos. Not fixture-first — expect network.
 * Keep out of Layouts canonical matrix.
 */
const meta = {
  title: 'Live/Agents',
  component: Memori,
  decorators: [withWidgetProviders],
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Memori>;

export default meta;
type Story = StoryObj<typeof meta>;

const stagingBase = {
  memoriName: 'Layout Storybook',
  ownerUserName: 'Andrea-Patini',
  memoriID: 'ae20fc5a-cc15-4db9-b7dd-2cd4a621b85e',
  ownerUserID: '91dbc9ba-b684-4fbe-9828-b5980af6cda9',
  tenantID: 'aisuru-staging.aclambda.online',
  engineURL: 'https://engine-staging.memori.ai/memori/v2',
  apiURL: 'https://backend-staging.memori.ai/api/v2',
  uiLang: 'IT' as const,
  spokenLang: 'IT' as const,
  integrationID: '32922e14-24d6-4f5f-a06b-d963da14a658',
  showSettings: true,
  autoStart: true,
};

export const StagingFullPage: Story = {
  args: {
    ...stagingBase,
    layout: 'FULLPAGE',
  },
};

export const StagingZoomedFullBody: Story = {
  args: {
    ...stagingBase,
    layout: 'ZOOMED_FULL_BODY',
  },
};

const halfBodyAvatarURL =
  'https://assets.memori.ai/api/v2/asset/acc38f4a-e4c3-4a21-9818-c3d1672820ea.glb#1762875973109';

/** WEBSITE_ASSISTANT only shows the 3D avatar when `show3dAvatar` is true. */
export const StagingWebsiteAssistantWith3DAvatar: Story = {
  args: {
    ...stagingBase,
    layout: 'WEBSITE_ASSISTANT',
    autoStart: false,
    show3dAvatar: true,
    avatar3DURL: halfBodyAvatarURL,
    integration: {
      integrationID: stagingBase.integrationID,
      memoriID: stagingBase.memoriID,
      type: 'LANDING_EXPERIENCE',
      state: 'NEW',
      publish: true,
      creationTimestamp: '2022-06-13T14:44:52.833573Z',
      lastChangeTimestamp: '2022-06-13T14:44:52.833573Z',
      customData: JSON.stringify({
        textColor: '#000000',
        buttonBgColor: '#007eb6',
        buttonTextColor: '#ffffff',
        innerBgColor: 'light',
        avatar: 'readyplayerme',
        avatarURL: halfBodyAvatarURL,
        name: 'Layout Storybook',
      }),
    },
  },
};

export const StagingWithConsumption: Story = {
  args: {
    ...stagingBase,
    memoriName: 'Layout Storybook',
    ownerUserName: 'Andrea-Patini',
    memoriID: 'ae20fc5a-cc15-4db9-b7dd-2cd4a621b85e',
    ownerUserID: '91dbc9ba-b684-4fbe-9828-b5980af6cda9',
    tenantID: 'aisuru-staging.aclambda.online',
    engineURL: 'https://engine-staging.memori.ai/memori/v2',
    apiURL: 'https://backend-staging.memori.ai/api/v2',
    baseURL: 'https://aisuru-staging.aclambda.online',
    layout: 'FULLPAGE',
    uiLang: 'IT',
    spokenLang: 'IT',
    autoStart: false,
    integrationID: '01a0af56-ca22-7093-805c-233a7ca482d2',
    showMessageConsumption: true,
  },
};
