import React from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, tenant, integration } from '../../../mocks/data';
import Memori, { Props } from '../../../index';
import I18nWrapper from '../../../I18nWrapper';
import { VisemeProvider } from '../../../context/visemeContext';
import { ArtifactProvider } from '../../MemoriArtifactSystem/context/ArtifactContext';

const meta: Meta = {
  title: 'General/Layouts/WebsiteAssistant',
  component: (args: Props) => (
    <Memori
      {...args}
      engineURL="https://engine.memori.ai"
      apiURL="https://backend.memori.ai"
      baseURL="https://www.aisuru.com"
    />
  ),
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

