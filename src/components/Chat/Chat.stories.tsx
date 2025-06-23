import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import {
  memori,
  tenant,
  history,
  historyWithMedia,
  historyWithAIGeneratedMessages,
  sessionID,
  dialogState as dialogStateWithHints,
  historyWithExpandable,
} from '../../mocks/data';
import I18nWrapper from '../../I18nWrapper';
import Chat, { Props } from './Chat';
import { DialogState, Message } from '@memori.ai/memori-api-client/dist/types';

import './Chat.css';

const meta: Meta = {
  title: 'Widget/Chat',
  component: Chat,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const dialogState = {
  ...dialogStateWithHints,
  hints: [],
};

const Template: Story<Props> = args => {
  const [userMessage, setUserMessage] = useState(args.userMessage);

  return (
    <I18nWrapper>
      <Chat
        {...args}
        userMessage={userMessage}
        onChangeUserMessage={setUserMessage}
      />
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const MemoriTyping = Template.bind({});
MemoriTyping.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  memoriTyping: true,
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithHints = Template.bind({});
WithHints.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState: dialogStateWithHints,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithMedia = Template.bind({});
WithMedia.args = {
  memori,
  tenant,
  sessionID,
  history: historyWithMedia,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithDates = Template.bind({});
WithDates.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
  showDates: true,
};

export const WithContext = Template.bind({});
WithContext.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
  showContextPerLine: true,
};

export const WithDatesAndContext = Template.bind({});
WithDatesAndContext.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
  showDates: true,
  showContextPerLine: true,
};

export const OnX3State = Template.bind({});
OnX3State.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState: {
    ...dialogState,
    state: 'X3',
  },
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const OnX2aState = Template.bind({});
OnX2aState.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState: {
    ...dialogState,
    state: 'X2a',
  },
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const AcceptsFeedback = Template.bind({});
AcceptsFeedback.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState: {
    ...dialogState,
    acceptsFeedback: true,
  },
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithAIGeneratedMessages = Template.bind({});
WithAIGeneratedMessages.args = {
  memori,
  tenant,
  sessionID,
  history: historyWithAIGeneratedMessages,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithUser = Template.bind({});
WithUser.args = {
  user: { avatarURL: 'https://picsum.photos/200' },
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithCustomUserAvatar = Template.bind({});
WithCustomUserAvatar.args = {
  userAvatar: 'https://picsum.photos/200',
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithCustomUserAvatarAsElement = Template.bind({});
WithCustomUserAvatarAsElement.args = {
  userAvatar: <span>USER</span>,
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithExpandable = Template.bind({});
WithExpandable.args = {
  memori,
  tenant,
  sessionID,
  history: historyWithExpandable,
  dialogState,
  layout: 'DEFAULT',
  simulateUserPrompt: () => {},
  sendMessage: (msg: string) => console.log(msg),
  stopListening: () => {},
  resetTranscript: () => {},
};

export const WithLongHTMLTable = Template.bind({});
WithLongHTMLTable.args = {
  memori,
  tenant,
  sessionID,
  history,
  dialogState,
  layout: 'DEFAULT',
};

// Mock data for testing
const mockMemori = {
  memoriID: 'test-memori-id',
  name: 'Test Memori',
  culture: 'en-US',
  coverURL: 'https://example.com/cover.jpg',
};

const mockHistory: Message[] = Array.from({ length: 20 }, (_, i) => ({
  text: `Message ${i + 1}`,
  fromUser: i % 2 === 0,
  timestamp: new Date().toISOString(),
}));

const mockDialogState: DialogState = {
  acceptsFeedback: true,
  hints: ['Hint 1', 'Hint 2'],
};

// Story for testing preview mode with scrolling
export const PreviewMode = Template.bind({});
PreviewMode.args = {
  memori: mockMemori,
  sessionID: 'test-session',
  history: mockHistory,
  dialogState: mockDialogState,
  preview: true,
  showInputs: true,
  showDates: true,
  showContextPerLine: true,
  showAIicon: true,
  showWhyThisAnswer: true,
  showCopyButton: true,
  showTranslationOriginal: false,
  showUpload: false,
  showMicrophone: false,
  userMessage: '',
  onChangeUserMessage: () => {},
  sendMessage: () => {},
  setDialogState: () => {},
  pushMessage: () => {},
  simulateUserPrompt: () => {},
  setSendOnEnter: () => {},
  setAttachmentsMenuOpen: () => {},
  setEnableFocusChatInput: () => {},
  stopAudio: () => {},
  startListening: () => {},
  stopListening: () => {},
  resetTranscript: () => {},
};

// Story for testing normal mode (non-preview) with scrolling
export const NormalMode = Template.bind({});
NormalMode.args = {
  ...PreviewMode.args,
  preview: false,
};