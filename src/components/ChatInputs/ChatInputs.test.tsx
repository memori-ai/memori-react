import React from 'react';
import { render } from '../../testUtils';
import ChatInputs from './ChatInputs';
import { dialogState, sessionID } from '../../mocks/data';

const baseProps = {
  dialogState,
  sessionID,
  userMessage: '',
  sendOnEnter: 'keypress' as const,
  setSendOnEnter: jest.fn(),
  setAttachmentsMenuOpen: jest.fn(),
  onChangeUserMessage: jest.fn(),
  sendMessage: jest.fn(),
  onTextareaFocus: jest.fn(),
  onTextareaBlur: jest.fn(),
  stopAudio: jest.fn(),
  startListening: jest.fn(),
  stopListening: jest.fn(),
  showMicrophone: true,
  microphoneMode: 'CONTINUOUS' as const,
};

it('disables the microphone while the agent is typing', () => {
  const { container } = render(<ChatInputs {...baseProps} isTyping />);
  const mic = container.querySelector('.memori-chat-inputs--mic-btn');
  expect(mic).toBeDisabled();
});

it('keeps the microphone enabled when the agent is idle', () => {
  const { container } = render(<ChatInputs {...baseProps} isTyping={false} />);
  const mic = container.querySelector('.memori-chat-inputs--mic-btn');
  expect(mic).not.toBeDisabled();
});

it('stops listening when the agent starts typing', () => {
  const stopListening = jest.fn();
  render(
    <ChatInputs
      {...baseProps}
      listening
      isTyping
      stopListening={stopListening}
    />
  );
  expect(stopListening).toHaveBeenCalled();
});
