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

export const StagingWebsiteAssistant: Story = {
  args: {
    ...stagingBase,
    layout: 'WEBSITE_ASSISTANT',
    avatar3dHidden: true,
    showOnlyLastMessages: true,
    integrationID: '716f4728-919c-4015-aae1-88998a081c6f',
  },
};

/** Requires local backend — will fail without localhost:3000. */
export const LocalhostWebsiteAssistant: Story = {
  args: {
    ...stagingBase,
    layout: 'WEBSITE_ASSISTANT',
    baseURL: 'http://localhost:3000',
    avatar3dHidden: true,
    showOnlyLastMessages: true,
    integrationID: '716f4728-919c-4015-aae1-88998a081c6f',
  },
};

export const ProdWebsiteAssistantMarconi: Story = {
  args: {
    memoriName: 'Marconi Express',
    ownerUserName: 'exmita',
    memoriID: '1755979f-28f1-45d1-8f41-bb34e1f7756b',
    ownerUserID: '3194fcd3-040b-4d5e-a925-691911fb1177',
    tenantID: 'exmachina.aclambda.online',
    engineURL: 'https://engine.memori.ai',
    apiURL: 'https://backend.memori.ai',
    baseURL: 'https://exmachina.aclambda.online',
    uiLang: 'IT',
    spokenLang: 'IT',
    layout: 'WEBSITE_ASSISTANT',
    avatar3dHidden: true,
  },
};
