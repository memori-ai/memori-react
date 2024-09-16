import React from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, integration, tenant } from '../../mocks/data';
import I18nWrapper from '../../I18nWrapper';
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
    showSettings: {
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

const Template: Story<Props> = args => (
  <I18nWrapper>
    <MemoriWidget {...args} />
  </I18nWrapper>
);
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

export const WithDates = Template.bind({});
WithDates.args = {
  memori: {
    ...memori,
    needsDateTime: true,
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
        'https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb#' +
        new Date(Date.now()).getTime(),
    }),
  },
};

export const WithPublicPageIntegrationAndFullbodyAvatar = Template.bind({});
WithPublicPageIntegrationAndFullbodyAvatar.args = {
  memori,
  tenant,
  integration: {
    ...integration,
    customData: JSON.stringify({
      ...JSON.parse(integration.customData ?? '{}'),
      avatar: 'readyplayerme-full',
      avatarURL:
        'https://models.readyplayer.me/63b55751f17e295642bf07a2.glb#' +
        new Date(Date.now()).getTime(),
    }),
  },
};

export const WithPublicPageIntegrationAndNonDefaultLang = Template.bind({});
WithPublicPageIntegrationAndNonDefaultLang.args = {
  memori,
  tenant,
  integration: {
    ...integration,
    customData: JSON.stringify({
      ...JSON.parse(integration.customData ?? '{}'),
      lang: 'es',
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

export const ShowSettings = Template.bind({});
ShowSettings.args = {
  memori,
  tenant,
  showSettings: true,
};

export const ShowClear = Template.bind({});
ShowClear.args = {
  memori,
  tenant,
  showClear: true,
};

export const WithoutAudio = Template.bind({});
WithoutAudio.args = {
  memori,
  tenant,
  enableAudio: false,
  AZURE_COGNITIVE_SERVICES_TTS_KEY: 'provide your key here',
};

export const WithoutAudioFromIntegrationConfig = Template.bind({});
WithoutAudioFromIntegrationConfig.args = {
  memori,
  tenant,
  integration: {
    ...integration,
    customData: JSON.stringify({
      enableAudio: false,
    }),
  },
  AZURE_COGNITIVE_SERVICES_TTS_KEY: 'provide your key here',
};

export const DefautSpeakerDisabled = Template.bind({});
DefautSpeakerDisabled.args = {
  memori,
  tenant,
  defaultSpeakerActive: false,
  AZURE_COGNITIVE_SERVICES_TTS_KEY: 'provide your key here',
};

export const ShowOnlyLastMessages = Template.bind({});
ShowOnlyLastMessages.args = {
  memori,
  tenant,
  showOnlyLastMessages: true,
};

export const ShowOnlyLastMessagesWithAnotherDefault = Template.bind({});
ShowOnlyLastMessagesWithAnotherDefault.args = {
  memori,
  tenant,
  showOnlyLastMessages: false,
  layout: 'WEBSITE_ASSISTANT',
};

export const WithAzureSpeechKey = Template.bind({});
WithAzureSpeechKey.args = {
  memori,
  tenant,
  AZURE_COGNITIVE_SERVICES_TTS_KEY: 'provide your key here',
};

export const WithCustomMediaRenderer = Template.bind({});
WithCustomMediaRenderer.args = {
  memori,
  tenant,
  customMediaRenderer: (mimeType: string) => (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {mimeType}
    </div>
  ),
};

export const WithUserAvatar = Template.bind({});
WithUserAvatar.args = {
  memori,
  tenant,
  userAvatar: 'https://picsum.photos/200',
};

export const WithUserAvatarAsElement = Template.bind({});
WithUserAvatarAsElement.args = {
  memori,
  tenant,
  userAvatar: <span>USER</span>,
};
