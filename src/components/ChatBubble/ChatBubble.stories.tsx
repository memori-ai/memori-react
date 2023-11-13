import React from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, tenant } from '../../mocks/data';
import ChatBubble, { Props } from './ChatBubble';

import './ChatBubble.css';

const meta: Meta = {
  title: 'Widget/Chat bubble',
  component: ChatBubble,
  argTypes: {
    fromUser: {
      control: {
        type: 'boolean',
      },
    },
    text: {
      control: {
        type: 'text',
      },
    },
    initial: {
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

const Template: Story<Props> = args => <ChatBubble {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
};

export const FromUser = Template.bind({});
FromUser.args = {
  memori,
  tenant,
  message: {
    fromUser: true,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
};

export const Initial = Template.bind({});
Initial.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: true,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
};

export const GeneratedByAI = Template.bind({});
GeneratedByAI.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    generatedByAI: true,
  },
};

export const WithFeedbackButtons = Template.bind({});
WithFeedbackButtons.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    generatedByAI: false,
  },
  showFeedback: true,
  simulateUserPrompt: () => {},
};

export const WithAllAddonsContents = Template.bind({});
WithAllAddonsContents.args = {
  memori,
  tenant,
  message: {
    fromUser: false,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    generatedByAI: true,
  },
  showFeedback: true,
  simulateUserPrompt: () => {},
};

export const FromUserWithAvatar = Template.bind({});
FromUserWithAvatar.args = {
  memori,
  tenant,
  user: { avatarURL: 'https://picsum.photos/200' },
  message: {
    fromUser: true,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
};

export const FromUserWithCustomAvatar = Template.bind({});
FromUserWithCustomAvatar.args = {
  memori,
  tenant,
  userAvatar: 'https://picsum.photos/200',
  message: {
    fromUser: true,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
};

export const FromUserWithCustomAvatarElement = Template.bind({});
FromUserWithCustomAvatarElement.args = {
  memori,
  tenant,
  userAvatar: <span>USER</span>,
  message: {
    fromUser: true,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
};

export const FromUserWithAvatarAndCustomAvatar = Template.bind({});
FromUserWithAvatarAndCustomAvatar.args = {
  memori,
  tenant,
  userAvatar: () => <span>USER</span>,
  user: { avatarURL: 'https://picsum.photos/200' },
  message: {
    fromUser: true,
    text: 'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
    initial: false,
    translatedText:
      'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
  },
};
