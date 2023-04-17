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
  tenantID: 'app.memorytwin.com',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://app.memorytwin.com',
  uiLang: 'it',
  showShare: true,
  showSettings: true,
};

// export const Instruction = Template.bind({});
// Instruction.args = {
//   ownerUserName: 'nzambello',
//   memoriName: 'Nicola',
//   tenantID: 'app.memorytwin.com',
//   apiURL: 'https://backend.memori.ai',
//   baseURL: 'https://app.memorytwin.com',
//   uiLang: 'it',
//   showShare: true,
//   tag: 'giver',
//   pin: 'giver pin',
//   authToken: 'your login token',
// };
