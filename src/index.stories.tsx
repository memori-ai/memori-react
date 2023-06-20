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

export const DemoSophia = Template.bind({});
DemoSophia.args = {
  layout: 'TOTEM',
  memoriName: 'Sophia',
  ownerUserName: 'francescoimpellizzeri',
  memoriID: '57405959-a2c5-4499-adb8-bb8dcc848ad5',
  ownerUserID: '44ccefdb-d7a2-447e-9851-2a76be055a40',
  tenantID: 'nextpresent.aclambda.online',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://nextpresent.aclambda.online',
  uiLang: 'it',
  lang: 'it',
  showShare: true,
  showSettings: true,
  integrationID: 'd10bbffd-26f3-4614-a092-15b215d04ffa',
  initialQuestion: 'Welcome Totem',
  contextVars: 'CONTEXT:TOTEM',
  // https://assets.memori.ai/api/v2/asset/6af08bf1-f011-40ea-92a2-699b7b53a53c.glb
};

export const DemoStefano = Template.bind({});
DemoStefano.args = {
  layout: 'TOTEM',
  memoriName: 'Stefano Zingoni',
  ownerUserName: 'roberta.bianchi',
  memoriID: 'd6df4c75-8dfb-4e6d-b19f-193fa8a9bcce',
  ownerUserID: 'b242160e-c19c-468f-b7f8-b2dc1ce51045',
  tenantID: 'gruppoe.aclambda.online',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://gruppoe.aclambda.online',
  uiLang: 'it',
  lang: 'it',
  showShare: true,
  showSettings: true,
  contextVars: 'CONTEXT:TOTEM',
  integrationID: '5712601d-6174-45e7-bfb1-b4ac71c4ff80',
  // https://assets.memori.ai/api/v2/asset/ed50c6a4-37cd-458b-9209-8cabfa256b30.glb
};
