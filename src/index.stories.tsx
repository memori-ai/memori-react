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
  tenantID: 'app.twincreator.com',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://app.twincreator.com',
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
  tenantID: 'app.memorytwin.com',
  apiURL: 'http://localhost:7778',
  baseURL: 'http://localhost:3000',
  uiLang: 'EN',
  lang: 'IT',
  layout: 'FULLPAGE',
  showShare: 'true',
  integrationID: '82f017cc-450b-4c47-acf5-47910d336ce9',
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
  tenantID: 'app.twincreator.com',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://app.twincreator.com',
  uiLang: 'it',
  showShare: true,
  showSettings: true,
};

export const WithCustomUserAvatar = Template.bind({});
WithCustomUserAvatar.args = {
  ownerUserName: 'nzambello',
  memoriName: 'Nicola',
  tenantID: 'app.twincreator.com',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://app.twincreator.com',
  uiLang: 'it',
  showShare: true,
  showSettings: true,
  userAvatar: 'https://picsum.photos/200',
};

// export const Instruction = Template.bind({});
// Instruction.args = {
//   ownerUserName: 'nzambello',
//   memoriName: 'Nicola',
//   tenantID: 'app.twincreator.com',
//   apiURL: 'https://backend.memori.ai',
//   baseURL: 'https://app.twincreator.com',
//   uiLang: 'it',
//   showShare: true,
//   tag: 'giver',
//   pin: 'giver pin',
//   authToken: 'your login token',
// };
