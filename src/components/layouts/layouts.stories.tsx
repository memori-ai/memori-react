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
  memoriID: '157860e8-f014-43b3-a7c5-fb4a08c87025',
  ownerUserID: '95753bbe-9e88-4799-ae35-dc060bc11c48',
  tenantID: 'www.aisuru.com',
  engineURL: 'https://engine.memori.ai/memori/v2',
  apiURL: 'https://backend.memori.ai/api/v2',
  baseURL: 'https://www.aisuru.com',
  layout: 'FULL_CHAT',
  uiLang: 'IT',
  spokenLang: 'IT',
  integrationID: '0b1256c1-530c-4e67-aef8-36667c8887bb',
  enableAudio: false,
  showUpload: false,
  showShare: false,
  autoStart: false,
  showSettings: false,
  showCopyButton: false,
  showTranslationOriginal: false,
  showInputs: false,
  showDates: false,
  showContextPerLine: false,
  showClear: false,
  showOnlyLastMessages: false,
  showTypingText: false,
  showLogin: false,
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
