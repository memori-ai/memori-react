import React from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, tenant, integration } from '../../mocks/data';
import { LayoutProps, Props } from '../MemoriWidget/MemoriWidget';
import Memori from '../../index';
import I18nWrapper from '../../I18nWrapper';
import Spin from '../ui/Spin';
import { VisemeProvider } from '../../context/visemeContext';
import { ArtifactProvider } from '../MemoriArtifactSystem/context/ArtifactContext';


const meta: Meta = {
  title: 'General/Layouts',
  component: (args: Props) => <Memori {...args} engineURL="https://engine.memori.ai" apiURL="https://backend.memori.ai" baseURL="https://www.aisuru.com"    />,
  argTypes: {},
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

const DefaultLayout = Template.bind({});
DefaultLayout.args = {
  memoriName: 'Layout Storybook',
  ownerUserName: 'andrea.patini',
  memoriID: 'ae20fc5a-cc15-4db9-b7dd-2cd4a621b85e',
  ownerUserID: '91dbc9ba-b684-4fbe-9828-b5980af6cda9',
  tenantID: 'aisuru-staging.aclambda.online',
  engineURL: 'https://engine-staging.memori.ai/memori/v2',
  apiURL: 'https://backend-staging.memori.ai/api/v2',
  baseURL: 'https://www.aisuru.com',
  layout: 'FULL_CHAT',
  uiLang: 'IT',
  spokenLang: 'IT',
  integrationID: '0b1256c1-530c-4e67-aef8-36667c8887bb',
  autoStart: false,
  sessionID: '' as string | undefined,
  showUpload: true,
  showReasoning: false,
};


export const Default = Template.bind({});
Default.args = {
  ...DefaultLayout.args,
};



export const Totem = Template.bind({});
Totem.args = {
  ...DefaultLayout.args,
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori: memori,
  integration: {
    ...integration,
  },
  tenant,
  layout: 'TOTEM',
};

export const ChatOnly = Template.bind({});
ChatOnly.args = {
  ...DefaultLayout.args,
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  showUpload: true,
  memori: memori,
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
  ...DefaultLayout.args,
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori: memori,
  tenant,
  layout: 'FULLPAGE',
  customLayout: CustomLayout,
};

export const WebsiteAssistant = Template.bind({});
WebsiteAssistant.args = {
  ...DefaultLayout.args,
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori: memori,
  tenant,
  layout: 'WEBSITE_ASSISTANT',
};

export const HiddenChat = Template.bind({});
HiddenChat.args = {
  ...DefaultLayout.args,
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  memori: memori,
  tenant,
  layout: 'HIDDEN_CHAT',
};

export const ZoomedFullBody = Template.bind({});
ZoomedFullBody.args = {
  ...DefaultLayout.args,
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  showAudio: true,
  enableAudio: true,
  integration: {
    
  },
  memori: {
    ...memori,
    voiceType: 'FEMALE',
  },
  tenant,
  layout: 'ZOOMED_FULL_BODY',
};
