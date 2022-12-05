import React from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, history } from '../../mocks/data';
import Header, { Props } from './Header';

const meta: Meta = {
  title: 'Widget/Header',
  component: Header,
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

const Template: Story<Props> = args => {
  const [speakerMuted, setSpeakerMuted] = React.useState(args.speakerMuted);
  return (
    <Header
      {...args}
      speakerMuted={speakerMuted}
      setSpeakerMuted={setSpeakerMuted}
    />
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  memori,
  history,
  setShowPositionDrawer: () => {},
  setShowSettingsDrawer: () => {},
  speakerMuted: false,
  hasUserActivatedSpeak: false,
  showShare: false,
  showSettings: false,
};

export const WithPosition = Template.bind({});
WithPosition.args = {
  memori: {
    ...memori,
    needsPosition: true,
  },
  history,
  position: {
    placeName: 'Berlin',
    latitude: 52.520008,
    longitude: 13.404954,
  },
  setShowPositionDrawer: () => {},
  setShowSettingsDrawer: () => {},
  speakerMuted: false,
  hasUserActivatedSpeak: false,
  showShare: false,
  showSettings: false,
};

export const SpeakerMuted = Template.bind({});
SpeakerMuted.args = {
  memori,
  history,
  setShowPositionDrawer: () => {},
  setShowSettingsDrawer: () => {},
  speakerMuted: true,
  hasUserActivatedSpeak: false,
  showShare: false,
  showSettings: false,
};

export const WithShare = Template.bind({});
WithShare.args = {
  memori,
  history,
  setShowPositionDrawer: () => {},
  setShowSettingsDrawer: () => {},
  speakerMuted: false,
  hasUserActivatedSpeak: false,
  showShare: true,
  showSettings: false,
};

export const WithSettings = Template.bind({});
WithSettings.args = {
  memori,
  history,
  setShowPositionDrawer: () => {},
  setShowSettingsDrawer: () => {},
  speakerMuted: false,
  hasUserActivatedSpeak: false,
  showShare: false,
  showSettings: true,
};

export const WithOngoingChat = Template.bind({});
WithOngoingChat.args = {
  memori,
  history,
  setShowPositionDrawer: () => {},
  setShowSettingsDrawer: () => {},
  speakerMuted: false,
  hasUserActivatedSpeak: true,
  showShare: false,
  showSettings: false,
};
