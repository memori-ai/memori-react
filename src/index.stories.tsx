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
  layout: 'ZOOMED_FULL_BODY',
  showInstruct: 'false',
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

export const Nunzio = Template.bind({});
Nunzio.args = {
  ownerUserName: 'nunzio.fiore',
  memoriName: 'Nunzio',
  tenantID: 'aisuru.com',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://www.aisuru.com',
  uiLang: 'it',
  showShare: true,
  showSettings: true,
};

export const Localhost = Template.bind({});
Localhost.args = {
  memoriName: 'test memori',
  ownerUserName: 'nicola',
  memoriID: '1a9c75e8-57aa-4ce3-8ea5-256185fa79a7',
  ownerUserID: '04a8cff9-13d6-4367-9cb2-72b9af9ee494',
  tenantID: 'www.aisuru.com',
  apiURL: 'http://localhost:7778',
  baseURL: 'http://localhost:3000',
  uiLang: 'EN',
  lang: 'IT',
  layout: 'FULLPAGE',
  showShare: true,
  integrationID: '82f017cc-450b-4c47-acf5-47910d336ce9',
};

export const LocalhostBoE = Template.bind({});
LocalhostBoE.args = {
  memoriName: 'experts chairman',
  ownerUserName: 'nicola',
  memoriID: '2b094cd6-77b8-4e09-a807-0039b84c988e',
  ownerUserID: '04a8cff9-13d6-4367-9cb2-72b9af9ee494',
  tenantID: 'www.aisuru.com',
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
  engineURL: 'https://engine-staging-tmp.memori.ai',
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

export const GiovannaProva = Template.bind({});
GiovannaProva.args = {
  memoriName: 'Giovanna Test',
  ownerUserName: 'andrea.patini3',
  memoriID: '431d9819-c958-442c-a799-f90617371c0c',
  ownerUserID: '58770358-a5db-4b49-b3a4-734fc468e745',
  tenantID: 'aisuru-staging.aclambda.online',
  engineURL: 'https://engine-staging.memori.ai',
  apiURL: 'https://backend-staging.memori.ai',
  baseURL: 'https://aisuru-staging.aclambda.online',
  uiLang: 'EN',
  spokenLang: 'IT',
  layout: 'ZOOMED_FULL_BODY',
  integrationID: 'e92ac275-39b5-474d-8f9e-826cc5284f1e',
  initialQuestion: 'inizio simulazione',
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
  showInstruct: 'false',
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
  ownerUserName: 'dpezzettone',
  memoriName: 'Meta Prompt Engineer',
  tenantID: 'www.aisuru.com',
  layout: 'CHAT',
  uiLang: 'en',
  showShare: true,
  showSettings: true,
  showLogin: true,
};
