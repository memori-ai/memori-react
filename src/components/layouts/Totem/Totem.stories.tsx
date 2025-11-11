import React from 'react';
import { Meta, Story } from '@storybook/react';
import { tenant } from '../../../mocks/data';
import Memori, { Props } from '../../MemoriWidget/MemoriWidget';
import I18nWrapper from '../../../I18nWrapper';
import { VisemeProvider } from '../../../context/visemeContext';
import { ArtifactProvider } from '../../MemoriArtifactSystem/context/ArtifactContext';

const meta: Meta = {
  title: 'General/Layouts/Totem',
  component: Memori,
  argTypes: {
    AZURE_COGNITIVE_SERVICES_TTS_KEY: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
  },
};

export default meta;

const Template: Story<Props> = args => (
  <I18nWrapper>
    <ArtifactProvider>
      <VisemeProvider>
        <Memori {...args} />
      </VisemeProvider>
    </ArtifactProvider>
  </I18nWrapper>
);

const baseMemori = {
  memoriID: '157860e8-f014-43b3-a7c5-fb4a08c87025',
  name: 'Layout Storybook',
  ownerUserName: 'andrea.patini',
  ownerUserID: '95753bbe-9e88-4799-ae35-dc060bc11c48',
  ownerTenantName: 'aisuru.com',
  tenantID: 'www.aisuru.com',
  password: null,
  recoveryTokens: null,
  newPassword: null,
  memoriConfigurationID: 'fd10bb42-98d9-4c08-8e02-2b08bd4e4975',
  description: 'Layout Storybook Demo',
  completionDescription: null,
  engineMemoriID: '9b0a2913-d3d8-4e98-a49d-6e1c99479e1b',
  isOwner: false,
  isGiver: false,
  isReceiver: false,
  giverTag: null,
  giverPIN: null,
  privacyType: 'PUBLIC',
  secretToken: null,
  minimumNumberOfRecoveryTokens: null,
  totalNumberOfRecoveryTokens: null,
  sentInvitations: [],
  receivedInvitations: [],
  needsPosition: false,
  voiceType: 'MALE',
  culture: 'it-IT',
  categories: ['demo', 'layout'],
  exposed: true,
  disableR2R3Loop: null,
  disableR4Loop: null,
  disableR5Loop: null,
  enableCompletions: true,
  completionModel: null,
  chainingMemoriID: null,
  chainingBaseURL: null,
  chainingPassword: null,
  contentQualityIndex: 100,
  contentQualityIndexTimestamp: '2023-04-17T00:01:32.194744Z',
  publishedInTheMetaverse: false,
  metaverseEnvironment: null,
  blockedUntil: null,
  creationTimestamp: '2022-06-13T14:21:55.793034Z',
  lastChangeTimestamp: '2023-04-15T08:15:36.403546Z',
};

const baseIntegration = {
  integrationID: '0b1256c1-530c-4e67-aef8-36667c8887bb',
  memoriID: '157860e8-f014-43b3-a7c5-fb4a08c87025',
  type: 'LANDING_EXPERIENCE',
  state: 'NEW',
  deviceEmails: null,
  invocationText: null,
  jobID: null,
  publish: true,
  creationTimestamp: '2022-06-13T14:44:52.833573Z',
  lastChangeTimestamp: '2022-06-13T14:44:52.833573Z',
};

export const TotemWithFullBodyAvatar = Template.bind({});
TotemWithFullBodyAvatar.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori: {
    ...baseMemori,
    avatar3DURL:
      'https://assets.memori.ai/api/v2/asset/692580d6-7b25-4ed0-84ce-82d5f4ac4270.glb#1762875775270',
  },
  integration: {
    ...baseIntegration,
    customData: JSON.stringify({
      textColor: '#000000',
      buttonBgColor: '#007eb6',
      buttonTextColor: '#ffffff',
      blurBackground: true,
      innerBgColor: 'light',
      multilanguage: true,
      avatar: 'readyplayerme-full',
      avatarURL:
        'https://assets.memori.ai/api/v2/asset/692580d6-7b25-4ed0-84ce-82d5f4ac4270.glb#1762875775270',
      name: 'Layout Storybook',
      showShare: true,
    }),
  },
  tenant,
  layout: 'TOTEM',
};

export const TotemWithHalfBodyAvatar = Template.bind({});
TotemWithHalfBodyAvatar.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori: {
    ...baseMemori,
    avatar3DURL:
      'https://assets.memori.ai/api/v2/asset/acc38f4a-e4c3-4a21-9818-c3d1672820ea.glb#1762875973109',
  },
  integration: {
    ...baseIntegration,
    customData: JSON.stringify({
      textColor: '#000000',
      buttonBgColor: '#007eb6',
      buttonTextColor: '#ffffff',
      blurBackground: true,
      innerBgColor: 'light',
      multilanguage: true,
      avatar: 'readyplayerme',
      avatarURL:
        'https://assets.memori.ai/api/v2/asset/acc38f4a-e4c3-4a21-9818-c3d1672820ea.glb#1762875973109',
      name: 'Layout Storybook',
      showShare: true,
    }),
  },
  tenant,
  layout: 'TOTEM',
};

export const TotemWithDefaultTotem = Template.bind({});
TotemWithDefaultTotem.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori: baseMemori,
  integration: {
    ...baseIntegration,
    customData: JSON.stringify({
      textColor: '#000000',
      buttonBgColor: '#007eb6',
      buttonTextColor: '#ffffff',
      blurBackground: true,
      innerBgColor: 'light',
      multilanguage: true,
      avatar: 'default_totem',
      name: 'Layout Storybook',
      showShare: true,
    }),
  },
  tenant,
  layout: 'TOTEM',
};

