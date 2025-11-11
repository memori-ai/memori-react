import React from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, tenant, integration } from '../../mocks/data';
import Memori, { LayoutProps, Props } from '../MemoriWidget/MemoriWidget';
import I18nWrapper from '../../I18nWrapper';
import Spin from '../ui/Spin';
import { VisemeProvider } from '../../context/visemeContext';
import { ArtifactProvider } from '../MemoriArtifactSystem/context/ArtifactContext';

const meta: Meta = {
  title: 'General/Layouts',
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
    <ArtifactProvider >
    <VisemeProvider>
      <Memori {...args} />
    </VisemeProvider>
    </ArtifactProvider>
  </I18nWrapper>
);
// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
const layoutStoryMemori = {
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

const layoutStoryIntegration = {
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

export const Default = Template.bind({});
Default.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori: layoutStoryMemori,
  tenant,
  layout: 'FULLPAGE',
};

export const FullPage = Template.bind({});
FullPage.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori: layoutStoryMemori,
  tenant,
  layout: 'FULLPAGE',
};

export const Totem = Template.bind({});
Totem.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori: layoutStoryMemori,
  integration: {
    ...layoutStoryIntegration,
  },
  tenant,
  layout: 'TOTEM',
};

export const ChatOnly = Template.bind({});
ChatOnly.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  showUpload: true,
  memori: layoutStoryMemori,
  tenant,
  layout: 'CHAT',
};

const CustomLayout: React.FC<LayoutProps> = ({
  Header,
  headerProps,
  Avatar,
  avatarProps,
  Chat,
  chatProps,
  StartPanel,
  startPanelProps,
  integrationStyle,
  integrationBackground,
  sessionId,
  hasUserActivatedSpeak,
  loading = false,
  poweredBy,
}) => (
  <>
    {integrationStyle}
    {integrationBackground}

    <Spin spinning={loading} className="memori-mycustom-layout">
      {poweredBy}

      <div className="memori-mycustom-layout--controls">
        {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
          <Chat {...chatProps} />
        ) : startPanelProps ? (
          <StartPanel {...startPanelProps} />
        ) : null}
      </div>
    </Spin>
  </>
);

export const Custom = Template.bind({});
Custom.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori: layoutStoryMemori,
  tenant,
  layout: 'FULLPAGE',
  customLayout: CustomLayout,
};

export const WebsiteAssistant = Template.bind({});
WebsiteAssistant.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori: layoutStoryMemori,
  tenant,
  layout: 'WEBSITE_ASSISTANT',
};

export const HiddenChat = Template.bind({});
HiddenChat.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori: layoutStoryMemori,
  tenant,
  layout: 'HIDDEN_CHAT',
};

export const ZoomedFullBody = Template.bind({});
ZoomedFullBody.args = {
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  showAudio: true,
  enableAudio: true,
  memori: {
    ...layoutStoryMemori,
    voiceType: 'FEMALE',
  },
  tenant,
  layout: 'ZOOMED_FULL_BODY',
};
