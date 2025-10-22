import React from 'react';
import { Meta, Story } from '@storybook/react';
import Memori, { Props } from './index';

const meta: Meta = {
  title: 'General/Default',
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

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Anonymous = Template.bind({});
Anonymous.args = {
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
  showChatHistory: true,
};

export const Vaccaboia = Template.bind({});
Vaccaboia.args = {
  ownerUserName: 'francesco.timo',
  memoriName: 'AI-ssistantSafe',
  tenantID: 'tecne.aclambda.online',
  engineURL: 'https://engine.memori.ai',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://www.aisuru.com',
  uiLang: 'IT',
  spokenLang: 'IT',
  enableAudio: true,
  autoStart: false,
  showChatHistory: true,
};

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

export const Nunzio = Template.bind({});
Nunzio.args = {
  ownerUserName: 'nunzio.fiore',
  memoriName: 'Nunzio',
  tenantID: 'aisuru.com',
  engineURL: 'https://engine.memori.ai',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://www.aisuru.com',
  uiLang: 'it',
  showShare: true,
  showSettings: true,
};

export const Localhost = Template.bind({});
Localhost.args = {
  memoriName: 'test9',
  ownerUserName: 'andrea.patini',
  memoriID: 'e31aa393-08c4-469a-b2e8-971eb45f4925',
  ownerUserID: '9266e23e-6822-4658-bbb0-4bebbc232bd4',
  tenantID: 'localhost:3000',
  engineURL: 'http://localhost:7778',
  apiURL: 'http://localhost:7778',
  baseURL: 'http://localhost:3000',
  uiLang: 'IT',
  spokenLang: 'IT',
  layout: 'FULLPAGE',
  showInstruct: false,
  showSettings: true,
  showChatHistory: true,
  showClear: false,
  showTypingText: false,
  showOnlyLastMessages: false,
  showTranslationOriginal: false,
  showCopyButton: false,
  showShare: true,
  showLogin: true,
  useMathFormatting: false,
  showUpload: false,
  autoStart: false,
  enableAudio: true,
  integrationID: 'c13fe42a-2d25-4bde-a502-f34824cd4ff1',
};

export const LocalhostBoE = Template.bind({});
LocalhostBoE.args = {
  memoriName: 'experts chairman',
  ownerUserName: 'nicola',
  memoriID: '2b094cd6-77b8-4e09-a807-0039b84c988e',
  ownerUserID: '04a8cff9-13d6-4367-9cb2-72b9af9ee494',
  tenantID: 'www.aisuru.com',
  engineURL: 'http://localhost:7777',
  apiURL: 'http://localhost:7778',
  baseURL: 'http://localhost:3000',
  uiLang: 'EN',
  lang: 'IT',
  layout: 'FULLPAGE',
  showShare: true,
  integrationID: '82f017cc-450b-4c47-acf5-47910d336ce9',
};

export const Staging = Template.bind({});
Staging.args = {
  memoriName: 'Giuseppe Verdi',
  ownerUserName: 'nunziofiore',
  memoriID: 'b996dbb9-3728-44d6-96f7-9b728224698c',
  ownerUserID: 'fbee9aaa-0c46-460e-9800-15e31d7c99c0',
  tenantID: 'aisuru-staging.aclambda.online',
  apiURL: 'https://backend-staging.memori.ai',
  engineURL: 'https://engine-staging.memori.ai',
  baseURL: 'https://aisuru-staging.aclambda.online',
  uiLang: 'EN',
  lang: 'IT',
  layout: 'FULLPAGE',
};

export const Giovanna = Template.bind({});
Giovanna.args = {
  memoriName: 'Giovanna',
  ownerUserName: 'memoridev',
  memoriID: '3b308d07-0ff8-4f18-b885-fad501164c43',
  ownerUserID: '13ab0379-a51d-4a83-8389-4f4b95e15567',
  tenantID: 'www.aisuru.com',
  engineURL: 'https://engine.memori.ai',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://www.aisuru.com',
  uiLang: 'IT',
  spokenLang: 'IT',
  layout: 'ZOOMED_FULL_BODY',
};

export const CreaRiassunti = Template.bind({});
CreaRiassunti.args = {
  memoriName: 'Crea Riassunti',
  ownerUserName: 'patini929',
  memoriID: '514dd043-ec26-4c57-a014-a512c9014822',
  ownerUserID: '1941d326-6986-4fa1-872b-458d09fb654c',
  tenantID: 'www.aisuru.com',
  engineURL: 'https://engine.memori.ai',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://www.aisuru.com',
  uiLang: 'IT',
  spokenLang: 'FR',
  layout: 'CHAT',
  showUpload: true,
  showSettings: true,
  showClear: false,
  showAIicon: true,
  showWhyThisAnswer: true,
  showTypingText: false,
  showOnlyLastMessages: false,
  showTranslationOriginal: false,
  showCopyButton: false,
  showShare: true,
  showLogin: false,
};

export const NunzioFiore = Template.bind({});
NunzioFiore.args = {
  ownerUserName: 'nunzio.fiore',
  memoriName: 'Nunzio',
  tenantID: 'www.aisuru.com',
  engineURL: 'https://engine.memori.ai',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://www.aisuru.com',
  uiLang: 'IT',
  spokenLang: 'IT',
  layout: 'ZOOMED_FULL_BODY',
  showSettings: 'true',
  showClear: 'false',
  showAIicon: 'true',
  showWhyThisAnswer: 'true',
  showTypingText: 'false',
  showOnlyLastMessages: 'false',
  showTranslationOriginal: 'false',
  showCopyButton: 'false',
  showShare: 'true',
  showLogin: 'false',
  enableAudio: 'true',
};

export const TestCustomAnimationsWithRPMSequence = Template.bind({});
TestCustomAnimationsWithRPMSequence.args = {
  memoriName: 'Dancing Avatar',
  ownerUserName: 'andrea.patini3',
  memoriID: '45420d30-a103-455c-bab1-b708a0566a02',
  ownerUserID: '58770358-a5db-4b49-b3a4-734fc468e745',
  tenantID: 'aisuru-staging.aclambda.online',
  engineURL: 'https://engine-staging.memori.ai/memori/v2',
  apiURL: 'https://backend-staging.memori.ai/api/v2',
  baseURL: 'https://aisuru-staging.aclambda.online',
  uiLang: 'IT',
  spokenLang: 'IT',
  layout: 'HIDDEN_CHAT',
  showLogin: true,
  autoStart: true,
  integrationID: '2f6e11a0-d799-4974-aa17-cf111d0af82a',
};

export const TestCustomGLBSingleAnimation = Template.bind({});
TestCustomGLBSingleAnimation.args = {
  memoriName: "Dragon's Journey",
  ownerUserName: 'andrea.patini3',
  memoriID: 'fa0568c0-aac2-494b-bde7-6a8ec7725a2d',
  ownerUserID: '58770358-a5db-4b49-b3a4-734fc468e745',
  tenantID: 'aisuru-staging.aclambda.online',
  engineURL: 'https://engine-staging.memori.ai',
  apiURL: 'https://backend-staging.memori.ai',
  baseURL: 'https://aisuru-staging.aclambda.online',
  uiLang: 'IT',
  spokenLang: 'IT',
  layout: 'TOTEM',
  showInstruct: false,
  showLogin: true,
  showSettings: 'true',
  showClear: 'false',
  showTypingText: 'false',
  showOnlyLastMessages: 'false',
  showTranslationOriginal: 'false',
  showCopyButton: 'false',
  showShare: 'true',
  useMathFormatting: 'false',
  showUpload: 'false',
  autoStart: 'false',
  enableAudio: 'true',
  integrationID: 'eea150e2-3ab3-47ae-a9ad-d3ea1704f623',
};

export const TestRPMEmotionFunction = Template.bind({});
TestRPMEmotionFunction.args = {
  memoriName: 'Test RPM',
  ownerUserName: 'andrea.patini3',
  memoriID: '35b7059f-08f4-45ab-98d8-899957666b77',
  ownerUserID: '58770358-a5db-4b49-b3a4-734fc468e745',
  tenantID: 'aisuru-staging.aclambda.online',
  engineURL: 'https://engine-staging.memori.ai',
  apiURL: 'https://backend-staging.memori.ai',
  baseURL: 'https://aisuru-staging.aclambda.online',
  uiLang: 'IT',
  showUpload: true,
  spokenLang: 'IT',
  layout: 'ZOOMED_FULL_BODY',
  integrationID: '60a37903-44a2-48c2-82e3-c7b8b620cb64',
};

const TemplateWithBatchButton: Story<Props> = args => (
  <div>
    <button
      style={{
        position: 'fixed',
        top: '0.5rem',
        left: '0.5rem',
        zIndex: 99999,
      }}
      onClick={() => {
        window.typeBatchMessages([
          {
            message: 'uno di tre',
            hidden: false,
            waitForPrevious: true,
          },
          {
            message: 'due di tre',
            hidden: false,
            waitForPrevious: true,
          },
          {
            message: 'tre di tre',
            hidden: false,
            waitForPrevious: true,
          },
        ]);
      }}
    >
      Start Batch
    </button>
    <Memori {...args} />
  </div>
);
export const WithBatch = TemplateWithBatchButton.bind({});
WithBatch.args = {
  ownerUserName: 'nzambello',
  memoriName: 'Nicola',
  tenantID: 'aisuru.com',
  apiURL: 'https://backend.memori.ai',
  engineURL: 'https://engine.memori.ai',
  baseURL: 'https://www.aisuru.com',
  uiLang: 'it',
  showShare: true,
  showSettings: true,
};

export const WithCustomUserAvatar = Template.bind({});
WithCustomUserAvatar.args = {
  ownerUserName: 'nzambello',
  memoriName: 'Nicola',
  tenantID: 'aisuru.com',
  apiURL: 'https://backend.memori.ai',
  engineURL: 'https://engine.memori.ai',
  baseURL: 'https://www.aisuru.com',
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  userAvatar: 'https://picsum.photos/200',
};

// export const Instruction = Template.bind({});
// Instruction.args = {
//   ownerUserName: 'nzambello',
//   memoriName: 'Nicola',
//   tenantID: 'aisuru.com',
//   apiURL: 'https://backend.memori.ai',
//   baseURL: 'https://aisuru.com',
//   uiLang: 'it',
//   showShare: true,
//   tag: 'giver',
//   pin: 'giver pin',
//   authToken: 'your login token',
// };

export const Test = Template.bind({});
Test.args = {
    memoriName: "test23",
    ownerUserName: "Andrea-Patini",
    memoriID: "bb672b4a-712a-4298-b440-61bfe5d67489",
    ownerUserID: "91dbc9ba-b684-4fbe-9828-b5980af6cda9",
    tenantID: "aisuru-staging.aclambda.online",
    apiURL: "https://backend-staging.memori.ai/api/v2",
    engineURL: "https://engine-staging.memori.ai/memori/v2",
    baseURL: "https://aisuru-staging.aclambda.online",
    uiLang: "it",
    spokenLang: "IT",
    layout: "FULLPAGE",
    multilingual: "false",
    showSettings: "true",
    showShare: "true",
  integrationID: "59c6f519-d02a-46e1-9bfb-ef8cf1203ebf",
};
