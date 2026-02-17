import React from 'react';
import { Meta, Story } from '@storybook/react';
import Memori, { Props } from './index';

const meta: Meta = {
  title: 'General/Functionalities',
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

const Template: Story<Props> = args => <Memori {...args} />;


export const WithInitialContextAndQuestion = Template.bind({});
WithInitialContextAndQuestion.args = {
  ownerUserName: 'nzambello',
  memoriName: 'Nicola',
  tenantID: 'www.aisuru.com',
  engineURL: 'https://engine.memori.ai',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://www.aisuru.com',
  uiLang: 'IT',
  spokenLang: 'IT',
  enableAudio: true,
  autoStart: true,
  initialQuestion: 'Ciao',
  context: { STORYBOOK: 'true' },
};

export const WithInitialContextAndQuestionFromIntegration = Template.bind({});
WithInitialContextAndQuestionFromIntegration.args = {
  ownerUserName: 'nzambello',
  memoriName: 'Nicola',
  tenantID: 'www.aisuru.com',
  engineURL: 'https://engine.memori.ai',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://www.aisuru.com',
  uiLang: 'IT',
  spokenLang: 'IT',
  enableAudio: true,
  autoStart: true,
  integration: {
    integrationID: 'test',
    customData: JSON.stringify({
      initialQuestion: 'Ciao',
      contextVars: 'STORYBOOK:true',
    }),
  },
};

export const WithPreviousSession = Template.bind({});
WithPreviousSession.args = {
  ownerUserName: 'nzambello',
  memoriName: 'Nicola',
  tenantID: 'www.aisuru.com',
  engineURL: 'https://engine.memori.ai',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://www.aisuru.com',
  sessionID: '1234567890',
  uiLang: 'IT',
  spokenLang: 'IT',
};

export const WithChatHistory = Template.bind({});
WithChatHistory.args = {
  ownerUserName: 'nzambello',
  memoriName: 'Nicola',
  tenantID: 'www.aisuru.com',
  engineURL: 'https://engine.memori.ai',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://www.aisuru.com',
  uiLang: 'IT',
  spokenLang: 'IT',
  showChatHistory: true,
};

export const WithUploadWithMaxTotalMessagePayload = Template.bind({});
WithUploadWithMaxTotalMessagePayload.args = {
  ownerUserName: 'nzambello',
  memoriName: 'Nicola',
  tenantID: 'www.aisuru.com',
  engineURL: 'https://engine.memori.ai',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://www.aisuru.com',
  uiLang: 'IT',
  spokenLang: 'IT',
  enableAudio: true,
  showUpload: true,
  maxTotalMessagePayload: 300000,
};

export const WithPrivateAgent = Template.bind({});
WithPrivateAgent.args = {
  memoriName: 'Test Private',
  ownerUserName: 'Andrea-Patini',
  memoriID: 'c58cd5f9-43c4-4a3b-9fb6-56aedf58ff7a',
  ownerUserID: '91dbc9ba-b684-4fbe-9828-b5980af6cda9',
  tenantID: 'aisuru-staging.aclambda.online',
  apiURL: 'https://backend-staging.memori.ai/api/v2',
  engineURL: 'https://engine-staging.memori.ai/memori/v2',
  baseURL: 'https://aisuru-staging.aclambda.online',
  uiLang: 'EN',
  spokenLang: 'IT',
  layout: 'FULLPAGE',
  multilingual: true,
  showSettings: true,
  showShare: true,
  integrationID: '19f95abe-3493-4568-971d-14471480e5bc',
};