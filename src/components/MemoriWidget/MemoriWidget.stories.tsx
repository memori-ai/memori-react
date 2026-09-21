import React from 'react';
import { Meta, Story } from '@storybook/react';
import { AlertProvider } from '@memori.ai/ui';
import { memori, integration, tenant } from '../../mocks/data';
import Memori, { Props } from '../../index';
import MemoriWidget, { Props as WidgetProps } from './MemoriWidget';
import { withWidgetProviders } from '../../../.storybook/decorators';
import { removeLocalConfig } from '../../helpers/configuration';

import './MemoriWidget.css';

const meta: Meta = {
  title: 'Compositions/MemoriWidget',
  component: Memori,
  decorators: [withWidgetProviders],
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

/** Same live agent as Layouts / Full Page. */
const fixtureBase: Partial<Props> = {
  memori,
  tenant,
  memoriName: memori.name,
  memoriID: memori.memoriID,
  ownerUserName: 'memoridev',
  tenantID: 'www.aisuru.com',
  engineURL: 'https://engine.memori.ai',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://www.aisuru.com',
  uiLang: 'IT',
  spokenLang: 'IT',
  showSettings: true,
  showShare: true,
};

const Template: Story<Props> = args => <Memori {...args} />;

/**
 * Fixture stories that must set `memori` flags (`needsPosition`,
 * `requireLoginToken`, `needsDateTime`). `<Memori>` always refetches the
 * agent from the API and would overwrite those flags.
 */
const widgetFixtureBase: Partial<WidgetProps> = {
  memori,
  tenant,
  tenantID: 'www.aisuru.com',
  ownerUserName: 'memoridev',
  apiURL: 'https://backend.memori.ai',
  engineURL: 'https://engine.memori.ai',
  baseUrl: 'https://www.aisuru.com',
  showSettings: true,
  showShare: true,
  layout: 'FULLPAGE',
};

/**
 * Position/login gates persist in localStorage across stories. Clear leftover
 * `position` before mount so autostart is held until this story collects it.
 */
const IsolatedWidget: React.FC<WidgetProps> = args => {
  const didReset = React.useRef(false);
  if (!didReset.current) {
    removeLocalConfig('position');
    didReset.current = true;
  }

  return (
    <AlertProvider defaultDuration={5000}>
      <MemoriWidget {...args} />
    </AlertProvider>
  );
};

const WidgetTemplate: Story<WidgetProps> = args => <IsolatedWidget {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  ...fixtureBase,
  layout: 'FULLPAGE',
};

export const WithAutoStart = Template.bind({});
WithAutoStart.args = {
  ...fixtureBase,
  autoStart: true,
  layout: 'FULLPAGE',
};

export const WithPosition = WidgetTemplate.bind({});
WithPosition.args = {
  ...widgetFixtureBase,
  memori: {
    ...memori,
    needsPosition: true,
  },
};

export const WithAutoStartAndRequiredPosition = WidgetTemplate.bind({});
WithAutoStartAndRequiredPosition.args = {
  ...widgetFixtureBase,
  autoStart: true,
  memori: {
    ...memori,
    needsPosition: true,
  },
};

export const WithLoginRequired = WidgetTemplate.bind({});
WithLoginRequired.args = {
  ...widgetFixtureBase,
  memori: {
    ...memori,
    requireLoginToken: true,
  },
};

export const WithDates = WidgetTemplate.bind({});
WithDates.args = {
  ...widgetFixtureBase,
  memori: {
    ...memori,
    needsDateTime: true,
  },
};

/** To test dateUTC/place in Enter Text: open DevTools → Network, start chat, set position (header position icon) if testing place, then send a message. Inspect the request to your backend/engine for body.dateUTC (ISO) and body.place (placeName, latitude, longitude, uncertaintyKm). */
export const WithDateAndPlaceForEnterText = WidgetTemplate.bind({});
WithDateAndPlaceForEnterText.args = {
  ...widgetFixtureBase,
  memori: {
    ...memori,
    needsDateTime: true,
    needsPosition: true,
  },
};

export const WithPublicPageIntegration = Template.bind({});
WithPublicPageIntegration.args = {
  ...fixtureBase,
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
  layout: 'FULLPAGE',
};

export const WithPublicPageIntegrationAndFullbodyAvatar = Template.bind({});
WithPublicPageIntegrationAndFullbodyAvatar.args = {
  ...fixtureBase,
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
  layout: 'FULLPAGE',
};

export const WithPublicPageIntegrationAndNonDefaultLang = Template.bind({});
WithPublicPageIntegrationAndNonDefaultLang.args = {
  ...fixtureBase,
  integration: {
    ...integration,
    customData: JSON.stringify({
      ...JSON.parse(integration.customData ?? '{}'),
      lang: 'es',
    }),
  },
  layout: 'FULLPAGE',
};

export const ShowShare = Template.bind({});
ShowShare.args = {
  ...fixtureBase,
  showShare: true,
  layout: 'FULLPAGE',
};

export const ShowSettings = Template.bind({});
ShowSettings.args = {
  ...fixtureBase,
  showSettings: true,
  layout: 'FULLPAGE',
};

export const ShowClear = Template.bind({});
ShowClear.args = {
  ...fixtureBase,
  showClear: true,
  layout: 'FULLPAGE',
};

export const ShowUpload = Template.bind({});
ShowUpload.args = {
  ...fixtureBase,
  showUpload: true,
  layout: 'FULLPAGE',
};

export const ShowUploadFromIntegration = Template.bind({});
ShowUploadFromIntegration.args = {
  ...fixtureBase,
  showUpload: false,
  integration: {
    ...integration,
    customData: JSON.stringify({
      ...JSON.parse(integration.customData ?? '{}'),
      showUpload: true,
    }),
  },
  layout: 'FULLPAGE',
};

export const WithoutAudio = Template.bind({});
WithoutAudio.args = {
  ...fixtureBase,
  enableAudio: false,
  AZURE_COGNITIVE_SERVICES_TTS_KEY: 'provide your key here',
  layout: 'FULLPAGE',
};

export const WithoutAudioFromIntegrationConfig = Template.bind({});
WithoutAudioFromIntegrationConfig.args = {
  ...fixtureBase,
  integration: {
    ...integration,
    customData: JSON.stringify({
      enableAudio: false,
    }),
  },
  AZURE_COGNITIVE_SERVICES_TTS_KEY: 'provide your key here',
  layout: 'FULLPAGE',
};

export const DefautSpeakerDisabled = Template.bind({});
DefautSpeakerDisabled.args = {
  ...fixtureBase,
  defaultSpeakerActive: false,
  AZURE_COGNITIVE_SERVICES_TTS_KEY: 'provide your key here',
  layout: 'FULLPAGE',
};

export const ShowOnlyLastMessages = Template.bind({});
ShowOnlyLastMessages.args = {
  ...fixtureBase,
  showOnlyLastMessages: true,
  layout: 'FULLPAGE',
};

export const ShowOnlyLastMessagesWithAnotherDefault = Template.bind({});
ShowOnlyLastMessagesWithAnotherDefault.args = {
  ...fixtureBase,
  showOnlyLastMessages: false,
  layout: 'FULLPAGE',
};

export const WithAzureSpeechKey = Template.bind({});
WithAzureSpeechKey.args = {
  ...fixtureBase,
  AZURE_COGNITIVE_SERVICES_TTS_KEY: 'provide your key here',
  layout: 'FULLPAGE',
};

export const WithCustomMediaRenderer = Template.bind({});
WithCustomMediaRenderer.args = {
  ...fixtureBase,
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
  ...fixtureBase,
  userAvatar: 'https://picsum.photos/200',
  layout: 'FULLPAGE',
};

export const WithUserAvatarAsElement = Template.bind({});
WithUserAvatarAsElement.args = {
  ...fixtureBase,
  userAvatar: <span>USER</span>,
  layout: 'FULLPAGE',
};

