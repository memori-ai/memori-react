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
  component: (args: Props) => <Memori {...args} />,
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
  memoriName: 'prova-sharepoint',
  ownerUserName: 'Andrea-Patini',
  memoriID: '019f129c-a5a3-74d3-b0c8-b7794437bb23',
  ownerUserID: '91dbc9ba-b684-4fbe-9828-b5980af6cda9',
  tenantID: 'aisuru-staging.aclambda.online',
  engineURL: 'https://engine-staging.memori.ai/memori/v2',
  apiURL: 'https://backend-staging.memori.ai/api/v2',
  baseURL: 'https://aisuru-staging.aclambda.online',
  layout: 'TOTEM',
  uiLang: 'IT',
  spokenLang: 'IT',
  integrationID: '019f1896-730d-7e19-9a88-6413f485247b',
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

export const WebsiteAssistant2 = Template.bind({});
WebsiteAssistant2.args = {
  memoriName: 'Marconi Express',
  ownerUserName: 'exmita',
  memoriID: '1755979f-28f1-45d1-8f41-bb34e1f7756b',
  ownerUserID: '3194fcd3-040b-4d5e-a925-691911fb1177',
  tenantID: 'exmachina.aclambda.online',
  engineURL: 'https://engine.memori.ai',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://exmachina.aclambda.online',
  uiLang: 'IT',
  avatar3dHidden: true,
  spokenLang: 'IT',
  layout: 'WEBSITE_ASSISTANT',
};

export const WebsiteAssistant3 = Template.bind({});
WebsiteAssistant3.args = {
  memoriName: 'Layout Storybook',
  ownerUserName: 'Andrea-Patini',
  memoriID: 'ae20fc5a-cc15-4db9-b7dd-2cd4a621b85e',
  ownerUserID: '91dbc9ba-b684-4fbe-9828-b5980af6cda9',
  tenantID: 'aisuru-staging.aclambda.online',
  engineURL: 'https://engine-staging.memori.ai/memori/v2',
  apiURL: 'https://backend-staging.memori.ai/api/v2',
  baseURL: 'http://localhost:3000',
  layout: 'WEBSITE_ASSISTANT',
  avatar3dHidden: true,
  uiLang: 'IT',
  spokenLang: 'IT',
  showOnlyLastMessages: true,
  integrationID: '716f4728-919c-4015-aae1-88998a081c6f',
};

export const WebsiteAssistant = Template.bind({});
WebsiteAssistant.args = {
  uiLang: 'EN',
  showShare: false,
  showSettings: true,
  memori: memori,
  tenant,
  layout: 'WEBSITE_ASSISTANT',
  memoriName: 'Memori',
  memoriID: '25ced51c-3520-41af-8bbe-222d861b8e32',
  ownerUserName: 'memoridev',
  tenantID: 'www.aisuru.com',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://www.aisuru.com',
  spokenLang: 'EN',
  context: {
    SOURCE: 'WEBSITE',
    PATH: '/en/',
  },
  multilingual: true,
  integrationID: 'cb3c4776-7f0b-4f97-a773-c32a5d7a3bf1',
  integration: {
    ...integration,
    customData: JSON.stringify({
      textColor: '#2a2a2a',
      buttonBgColor: '#653165',
      buttonTextColor: '#ffffff',
      blurBackground: true,
      innerBgColor: 'light',
      innerBgAlpha: 0.8,
      multilanguage: true,
      avatar: 'readyplayerme',
      avatarURL:
        'https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb',
    }),
  },
};

export const WebsiteAssistantWithout3DAvatar = Template.bind({});
WebsiteAssistantWithout3DAvatar.args = {
  ...WebsiteAssistant.args,
  avatar3dHidden: true,
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
  memoriName: 'Layout Storybook',
  ownerUserName: 'Andrea-Patini',
  memoriID: 'ae20fc5a-cc15-4db9-b7dd-2cd4a621b85e',
  ownerUserID: '91dbc9ba-b684-4fbe-9828-b5980af6cda9',
  tenantID: 'aisuru-staging.aclambda.online',
  engineURL: 'https://engine-staging.memori.ai/memori/v2',
  apiURL: 'https://backend-staging.memori.ai/api/v2',
  baseURL: 'http://localhost:3000',
  layout: 'FULLPAGE',
  uiLang: 'IT',
  spokenLang: 'IT',
  integrationID: '32922e14-24d6-4f5f-a06b-d963da14a658',
  showSettings: true,
};
