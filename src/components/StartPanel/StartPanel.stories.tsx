import React from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, sessionID, integration, tenant } from '../../mocks/data';
import StartPanel, { Props } from './StartPanel';

import '../../i18n';

const meta: Meta = {
  title: 'Widget/Start panel',
  component: StartPanel,
  argTypes: {
    showShare: {
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const integrationConfig = {
  ...JSON.parse(integration.customData ?? '{}'),
  avatarURL:
    JSON.parse(integration.customData ?? '{}').avatarURL?.split('#')?.[0] +
    '#' +
    new Date(Date.now()).getTime(),
};
const integrationProperties = {
  '--memori-chat-bubble-bg': '#fff',
  ...(integrationConfig?.buttonBgColor
    ? {
        '--memori-button-bg': integrationConfig.buttonBgColor,
        '--memori-button-hover-brightness': '1.2',
        '--ant-primary-color': integrationConfig.buttonBgColor,
        '--ant-primary-color-hover': integrationConfig.buttonBgColor,
        '--ant-primary-4': integrationConfig.buttonBgColor,
        '--ant-primary-5': integrationConfig.buttonBgColor,
        '--ant-primary-7': integrationConfig.buttonBgColor,
      }
    : {
        '--memori-button-hover-brightness': '1',
      }),
  ...(integrationConfig?.buttonTextColor
    ? {
        '--memori-button-text': integrationConfig.buttonTextColor,
        '--ant-primary-text': integrationConfig.buttonTextColor,
      }
    : {}),
  ...(integrationConfig?.blurBackground
    ? {
        '--memori-blur-background': '5px',
      }
    : {
        '--memori-blur-background': '0px',
      }),
  ...(integrationConfig?.innerBgColor
    ? {
        '--memori-inner-bg': `rgba(${
          integrationConfig.innerBgColor === 'dark'
            ? '0, 0, 0'
            : '255, 255, 255'
        }, ${integrationConfig.innerBgAlpha ?? 0.4})`,
        '--memori-inner-content-pad': '1.5rem',
        '--memori-nav-bg-image': 'none',
        '--memori-nav-bg': `rgba(${
          integrationConfig.innerBgColor === 'dark'
            ? '0, 0, 0'
            : '255, 255, 255'
        }, ${integrationConfig?.innerBgAlpha ?? 0.4})`,
      }
    : {
        '--memori-inner-content-pad': '0px',
      }),
};

const integrationStylesheet = `
    #root {
      ${Object.entries(integrationProperties)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n')}
    }
  `;

const Template: Story<Props> = args => (
  <div style={{ maxWidth: '600px', margin: 'auto' }}>
    {args.integrationConfig && (
      <style dangerouslySetInnerHTML={{ __html: integrationStylesheet }} />
    )}
    <StartPanel {...args} />
  </div>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  memori,
  tenant,
  language: 'it',
  userLang: 'en',
  setUserLang: () => {},
  openPositionDrawer: () => {},
  instruct: false,
  sessionId: sessionID,
  clickedStart: false,
  onClickStart: () => {},
};

export const WithGamificationLevel = Template.bind({});
WithGamificationLevel.args = {
  memori,
  tenant,
  gamificationLevel: {
    points: 61,
    pointsForCurrentBadge: 60,
    badge: '🌍',
  },
  language: 'it',
  userLang: 'en',
  setUserLang: () => {},
  openPositionDrawer: () => {},
  instruct: false,
  sessionId: sessionID,
  clickedStart: false,
  onClickStart: () => {},
};

export const Instruct = Template.bind({});
Instruct.args = {
  memori,
  tenant,
  gamificationLevel: {
    points: 61,
    pointsForCurrentBadge: 60,
    badge: '🌍',
  },
  language: 'it',
  userLang: 'en',
  setUserLang: () => {},
  openPositionDrawer: () => {},
  instruct: true,
  sessionId: sessionID,
  clickedStart: false,
  onClickStart: () => {},
};

export const PositionRequired = Template.bind({});
PositionRequired.args = {
  memori: {
    ...memori,
    needsPosition: true,
  },
  tenant,
  language: 'it',
  userLang: 'en',
  setUserLang: () => {},
  openPositionDrawer: () => {},
  instruct: true,
  sessionId: sessionID,
  clickedStart: false,
  onClickStart: () => {},
};

export const WithIntegration = Template.bind({});
WithIntegration.args = {
  memori,
  tenant,
  integrationConfig,
  language: 'it',
  userLang: 'en',
  setUserLang: () => {},
  openPositionDrawer: () => {},
  instruct: false,
  sessionId: sessionID,
  clickedStart: false,
  onClickStart: () => {},
};
