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

export const WithUpload = Template.bind({});
WithUpload.args = {
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
};

