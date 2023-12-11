import React, { useEffect } from 'react';
import { Meta, Story } from '@storybook/react';
import ChatInputs, { Props } from './ChatInputs';
import I18nWrapper from '../../I18nWrapper';
import { dialogState } from '../../mocks/data';

import './ChatInputs.css';

const meta: Meta = {
  title: 'Widget/Chat inputs (footer)',
  component: ChatInputs,
  argTypes: {
    disabled: {
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

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    .split(' ')
    .reverse();

const Template: Story<Props> = args => {
  const [userMessage, setUserMessage] = React.useState(args.userMessage);
  const [listening, setListening] = React.useState(args.listening);
  const startListening = () => setListening(true);
  const stopListening = () => setListening(false);

  useEffect(() => {
    if (listening) {
      const interval = setInterval(() => {
        let nextWord = text.pop();

        if (!nextWord) {
          clearInterval(interval);
          return;
        }

        setUserMessage(prev => `${prev || ''}${prev ? ' ' : ''}${nextWord}`);
      }, Math.random() * 500 + 100);
      return () => clearInterval(interval);
    }
  }, [listening]);

  return (
    <I18nWrapper>
      <div style={{ paddingTop: '10rem' }}>
        <ChatInputs
          {...args}
          listening={listening}
          startListening={startListening}
          stopListening={stopListening}
          userMessage={userMessage}
          onChangeUserMessage={setUserMessage}
        />
      </div>
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  userMessage: '',
  dialogState,
  sendMessage: (msg: string) => console.log(msg),
  onTextareaBlur: () => {},
  onTextareaFocus: () => {},
  onTextareaPressEnter: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
  listening: false,
  isPlayingAudio: false,
  stopAudio: () => {},
  startListening: () => {},
  stopListening: () => {},
  showMicrophone: true,
};

export const WithValue = Template.bind({});
WithValue.args = {
  userMessage: 'Suspendisse sit amet volutpat velit.',
  dialogState,
  sendMessage: (msg: string) => console.log(msg),
  onTextareaBlur: () => {},
  onTextareaFocus: () => {},
  onTextareaPressEnter: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
  listening: false,
  isPlayingAudio: false,
  stopAudio: () => {},
  startListening: () => {},
  stopListening: () => {},
  showMicrophone: true,
};

export const WithLongText = Template.bind({});
WithLongText.args = {
  userMessage:
    'Suspendisse sit amet volutpat velit. Nunc at commodo tortor, id rutrum nunc. Vivamus condimentum vel nunc et congue. Ut laoreet imperdiet nisi ac finibus. Suspendisse molestie risus a justo sagittis efficitur. Suspendisse sit amet volutpat velit. Nunc at commodo tortor, id rutrum nunc. Vivamus condimentum vel nunc et congue. Ut laoreet imperdiet nisi ac finibus. Suspendisse molestie risus a justo sagittis efficitur.',
  dialogState,
  sendMessage: (msg: string) => console.log(msg),
  onTextareaBlur: () => {},
  onTextareaFocus: () => {},
  onTextareaPressEnter: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
  listening: false,
  isPlayingAudio: false,
  stopAudio: () => {},
  startListening: () => {},
  stopListening: () => {},
  showMicrophone: true,
};

export const Instruct = Template.bind({});
Instruct.args = {
  instruct: true,
  userMessage: 'Suspendisse sit amet volutpat velit.',
  dialogState: {
    ...dialogState,
    acceptsMedia: false,
  },
  sendMessage: (msg: string) => console.log(msg),
  onTextareaBlur: () => {},
  onTextareaFocus: () => {},
  onTextareaPressEnter: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
  listening: false,
  isPlayingAudio: false,
  stopAudio: () => {},
  startListening: () => {},
  stopListening: () => {},
  showMicrophone: true,
};

export const InstructAcceptingMedia = Template.bind({});
InstructAcceptingMedia.args = {
  instruct: true,
  userMessage: 'Suspendisse sit amet volutpat velit.',
  dialogState: {
    ...dialogState,
    acceptsMedia: true,
  },
  sendMessage: (msg: string) => console.log(msg),
  onTextareaBlur: () => {},
  onTextareaFocus: () => {},
  onTextareaPressEnter: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
  listening: false,
  isPlayingAudio: false,
  stopAudio: () => {},
  startListening: () => {},
  stopListening: () => {},
  showMicrophone: true,
  authToken: '123',
};

export const Disabled = Template.bind({});
Disabled.args = {
  dialogState: {
    ...dialogState,
    state: 'X3',
  },
  userMessage: 'Suspendisse sit amet volutpat velit.',
  sendMessage: (msg: string) => console.log(msg),
  onTextareaBlur: () => {},
  onTextareaFocus: () => {},
  onTextareaPressEnter: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
  listening: false,
  isPlayingAudio: false,
  stopAudio: () => {},
  startListening: () => {},
  stopListening: () => {},
  showMicrophone: true,
};

export const ContinuousSpeech = Template.bind({});
ContinuousSpeech.args = {
  dialogState,
  userMessage: 'Suspendisse sit amet volutpat velit.',
  sendMessage: (msg: string) => console.log(msg),
  onTextareaBlur: () => {},
  onTextareaFocus: () => {},
  onTextareaPressEnter: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
  listening: false,
  isPlayingAudio: false,
  stopAudio: () => {},
  startListening: () => {},
  stopListening: () => {},
  showMicrophone: true,
  microphoneMode: 'CONTINUOUS',
};

export const ContinuousSpeechListening = Template.bind({});
ContinuousSpeechListening.args = {
  dialogState,
  userMessage: 'Suspendisse sit amet volutpat velit.',
  sendMessage: (msg: string) => console.log(msg),
  onTextareaBlur: () => {},
  onTextareaFocus: () => {},
  onTextareaPressEnter: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
  listening: true,
  isPlayingAudio: false,
  stopAudio: () => {},
  startListening: () => {},
  stopListening: () => {},
  showMicrophone: true,
  microphoneMode: 'CONTINUOUS',
};

export const WithoutMicrophone = Template.bind({});
WithoutMicrophone.args = {
  dialogState,
  userMessage: 'Suspendisse sit amet volutpat velit.',
  sendMessage: (msg: string) => console.log(msg),
  onTextareaBlur: () => {},
  onTextareaFocus: () => {},
  onTextareaPressEnter: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
  listening: true,
  isPlayingAudio: false,
  stopAudio: () => {},
  startListening: () => {},
  stopListening: () => {},
  showMicrophone: false,
};
