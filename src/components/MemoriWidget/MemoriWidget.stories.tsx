import React from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, integration, tenant } from '../../mocks/data';
import MemoriWidget, { Props } from './MemoriWidget';

import './MemoriWidget.css';

const meta: Meta = {
  title: 'Widget/Default',
  component: MemoriWidget,
  argTypes: {
    AZURE_COGNITIVE_SERVICES_TTS_KEY: {
      control: {
        type: 'text',
      },
    },
    showShare: {
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
  },
};

export default meta;

const Template: Story<Props> = args => <MemoriWidget {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  memori,
  tenant,
};

export const WithPosition = Template.bind({});
WithPosition.args = {
  memori: {
    ...memori,
    needsPosition: true,
  },
  tenant,
};

export const WithPublicPageIntegration = Template.bind({});
WithPublicPageIntegration.args = {
  memori,
  tenant,
  integration: {
    ...integration,
    customData: JSON.stringify({
      ...JSON.parse(integration.customData ?? '{}'),
      avatar: 'readyplayerme',
      avatarURL:
        'https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb' +
        new Date(Date.now()).getTime(),
    }),
  },
};

export const ShowInstruct = Template.bind({});
ShowInstruct.args = {
  memori: {
    ...memori,
    isGiver: true,
  },
  tenant,
  showInstruct: true,
};

export const ShowShare = Template.bind({});
ShowShare.args = {
  memori,
  tenant,
  showShare: true,
};

export const WithAzureSpeechKey = Template.bind({});
WithAzureSpeechKey.args = {
  memori,
  tenant,
  AZURE_COGNITIVE_SERVICES_TTS_KEY: 'provide your key here',
};
