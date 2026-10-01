import React, { useEffect } from 'react';
import { Meta, Story } from '@storybook/react';
import ChatInputs, { Props } from './ChatInputs';
import I18nWrapper from '../../I18nWrapper';
import { dialogState, sessionID } from '../../mocks/data';

import './ChatInputs.css';
import { AlertProvider } from '@memori.ai/ui';

const meta: Meta = {
  title: 'Compositions/Chat inputs',
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

const Template: Story<Props> = args => {
  const [userMessage, setUserMessage] = React.useState(args.userMessage);
  const [listening, setListening] = React.useState(args.listening);
  const [audioStream, setAudioStream] = React.useState<MediaStream | null>(
    null
  );
  const startListening = () => setListening(true);
  const stopListening = (onTranscript?: (text: string) => void) => {
    setListening(false);
    onTranscript?.('Example transcription');
  };

  useEffect(() => {
    if (!listening || !navigator.mediaDevices?.getUserMedia) return;
    let stream: MediaStream | null = null;
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(s => {
        stream = s;
        if (cancelled) s.getTracks().forEach(track => track.stop());
        else setAudioStream(s);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      stream?.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    };
  }, [listening]);

  return (
    <I18nWrapper>
      <AlertProvider defaultDuration={5000}>
        <div style={{ paddingTop: '10rem' }}>
          <ChatInputs
            {...args}
            listening={listening}
            startListening={startListening}
            stopListening={stopListening}
            audioStream={audioStream}
            userMessage={userMessage}
            onChangeUserMessage={setUserMessage}
          />
        </div>
      </AlertProvider>
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  userMessage: '',
  dialogState,
  sessionID,
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

export const WithUploadButton = Template.bind({});
WithUploadButton.args = {
  showUpload: true,
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
