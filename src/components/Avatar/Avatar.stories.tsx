import React from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, tenant, integration } from '../../mocks/data';
import I18nWrapper from '../../I18nWrapper';
import Avatar, { Props } from './Avatar';

import './Avatar.css';

const meta: Meta = {
  title: 'Widget/Avatar',
  component: Avatar,
  argTypes: {
    avatar3dVisible: {
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

const integrationConfig = JSON.parse(integration.customData ?? '{}');

const Template: Story<Props> = args => {
  const [avatar3dVisible, setAvatar3dVisible] = React.useState(
    args.avatar3dVisible
  );

  return (
    <I18nWrapper>
      <div
        style={
          args.integrationConfig?.avatar === 'customglb' ||
          args.integrationConfig?.avatar === 'readyplayerme' ||
          args.integrationConfig?.avatar === 'readyplayerme-full'
            ? {}
            : { marginTop: '20vw' }
        }
      >
        <Avatar
          {...args}
          integrationConfig={
            args.integrationConfig
              ? {
                  ...args.integrationConfig,
                  avatarURL:
                    args.integrationConfig.avatarURL?.split('#')?.[0] +
                    `#${new Date(Date.now()).toISOString()}`,
                }
              : undefined
          }
          avatar3dVisible={avatar3dVisible}
          setAvatar3dVisible={setAvatar3dVisible}
          key={Date.now()}
        />
      </div>
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  memori,
  tenant,
  instruct: false,
  avatar3dVisible: true,
  setAvatar3dVisible: () => {},
  hasUserActivatedSpeak: false,
  isPlayingAudio: false,
};

export const AvatarInBlob = Template.bind({});
AvatarInBlob.args = {
  memori,
  tenant,
  instruct: false,
  avatar3dVisible: true,
  setAvatar3dVisible: () => {},
  hasUserActivatedSpeak: false,
  isPlayingAudio: false,
  integrationConfig: {
    ...integrationConfig,
    avatar: 'userAvatar',
    avatarURL: memori.avatarURL,
  },
};

export const CustomGLBModel = Template.bind({});
CustomGLBModel.args = {
  memori,
  tenant,
  instruct: false,
  avatar3dVisible: true,
  setAvatar3dVisible: () => {},
  hasUserActivatedSpeak: false,
  isPlayingAudio: false,
  integrationConfig: {
    ...integrationConfig,
    avatar: 'customglb',
    avatarURL:
      'https://assets.memori.ai/api/v2/asset/7383f05a-0788-49b0-b9b9-3bfc402c7ddf.glb#1669136149862',
  },
};

export const ReadyPlayerMeAvatar = Template.bind({});
ReadyPlayerMeAvatar.args = {
  memori,
  tenant,
  instruct: false,
  avatar3dVisible: true,
  setAvatar3dVisible: () => {},
  hasUserActivatedSpeak: false,
  isPlayingAudio: false,
  integration,
  integrationConfig,
};

export const FullbodyReadyPlayerMeAvatar = Template.bind({});
FullbodyReadyPlayerMeAvatar.args = {
  memori,
  tenant,
  instruct: false,
  avatar3dVisible: true,
  setAvatar3dVisible: () => {},
  hasUserActivatedSpeak: false,
  isPlayingAudio: false,
  integration,
  integrationConfig: {
    ...integrationConfig,
    avatar: 'readyplayerme-full',
    avatarURL:
      'https://models.readyplayer.me/63b55751f17e295642bf07a2.glb#1669136149862',
  },
};
