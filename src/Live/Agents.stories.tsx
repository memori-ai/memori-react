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
