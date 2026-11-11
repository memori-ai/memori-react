import React from 'react';
import { fireEvent } from '@testing-library/react';
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

beforeAll(() => {
  Object.assign(globalThis, {
    speechSynthesis: { speak: jest.fn() },
    SpeechSynthesisUtterance: jest.fn(),
  });
});

const micLabel = 'write_and_speak.micButtonPopover';
const stopLabel = 'write_and_speak.stopRecording';
const sendRecordingLabel = 'write_and_speak.sendRecording';
const waveLabel = 'write_and_speak.recordingInProgress';

it('disables the microphone while the agent is typing', () => {
  const { getByRole } = render(<ChatInputs {...baseProps} isTyping />);
  expect(getByRole('button', { name: micLabel })).toBeDisabled();
});

it('keeps the microphone enabled when the agent is idle', () => {
  const { getByRole } = render(<ChatInputs {...baseProps} isTyping={false} />);
  expect(getByRole('button', { name: micLabel })).not.toBeDisabled();
});

it('shows stop, an enabled send button and the wave as soon as the microphone is clicked', () => {
  const startListening = jest.fn();
  const { getByRole, container } = render(
    <ChatInputs {...baseProps} startListening={startListening} />
  );

  fireEvent.click(getByRole('button', { name: micLabel }));

  expect(startListening).toHaveBeenCalledTimes(1);
  expect(getByRole('button', { name: stopLabel })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  expect(getByRole('button', { name: sendRecordingLabel })).not.toBeDisabled();
  expect(getByRole('img', { name: waveLabel })).toBeInTheDocument();
  expect(container.querySelector('textarea')).toBeNull();
});

const transcribe =
  (text: string) => (onTranscript?: (text: string) => void) =>
    onTranscript?.(text);

it('sends the transcription, after any typed text, from the send button', () => {
  const sendMessage = jest.fn();
  const onChangeUserMessage = jest.fn();
  const { getByRole } = render(
    <ChatInputs
      {...baseProps}
      listening
      userMessage="Ciao"
      sendMessage={sendMessage}
      onChangeUserMessage={onChangeUserMessage}
      stopListening={transcribe('come stai?')}
    />
  );

  fireEvent.click(getByRole('button', { name: sendRecordingLabel }));

  expect(sendMessage).toHaveBeenCalledWith('Ciao come stai?', []);
  expect(onChangeUserMessage).not.toHaveBeenCalled();
  expect(getByRole('button', { name: micLabel })).toBeInTheDocument();
});

it('sends attached files together with the transcription', () => {
  const sendMessage = jest.fn();
  const { getByRole, container } = render(
    <ChatInputs
      {...baseProps}
      sendMessage={sendMessage}
      pasteAsCardCharThreshold={10}
      stopListening={transcribe('ecco il file')}
    />
  );

  fireEvent.paste(container.querySelector('textarea')!, {
    clipboardData: {
      files: [],
      getData: () => 'a pasted text long enough to become an attachment',
    },
  });
  fireEvent.click(getByRole('button', { name: micLabel }));
  fireEvent.click(getByRole('button', { name: sendRecordingLabel }));

  expect(sendMessage).toHaveBeenCalledTimes(1);
  const [message, media] = sendMessage.mock.calls[0];
  expect(message).toBe('ecco il file');
  expect(media).toHaveLength(1);
  expect(media[0].properties).toEqual({ isAttachedFile: true });
});

it('keeps the transcription in the textarea from the stop button', () => {
  const sendMessage = jest.fn();
  const onChangeUserMessage = jest.fn();
  const { getByRole } = render(
    <ChatInputs
      {...baseProps}
      listening
      sendMessage={sendMessage}
      onChangeUserMessage={onChangeUserMessage}
      stopListening={transcribe('come stai?')}
    />
  );

  fireEvent.click(getByRole('button', { name: stopLabel }));

  expect(onChangeUserMessage).toHaveBeenCalledWith('come stai?');
  expect(sendMessage).not.toHaveBeenCalled();
  expect(getByRole('button', { name: micLabel })).toBeInTheDocument();
});

it('locks the microphone, send button and Enter while transcribing', () => {
  const sendMessage = jest.fn();
  const { getByRole, container } = render(
    <ChatInputs
      {...baseProps}
      transcribing
      userMessage="Ciao"
      sendMessage={sendMessage}
    />
  );

  expect(getByRole('button', { name: micLabel })).toBeDisabled();
  const send = getByRole('button', { name: 'send' });
  expect(send).toBeDisabled();
  expect(send).toHaveAttribute('aria-busy', 'true');

  fireEvent.keyDown(container.querySelector('textarea')!, { key: 'Enter' });
  expect(sendMessage).not.toHaveBeenCalled();
});

it('goes back to the textarea when recording cannot start', async () => {
  const { getByRole, findByRole, container } = render(
    <ChatInputs
      {...baseProps}
      startListening={() => Promise.resolve(false)}
    />
  );

  fireEvent.click(getByRole('button', { name: micLabel }));
  expect(getByRole('button', { name: stopLabel })).toBeInTheDocument();

  expect(await findByRole('button', { name: micLabel })).toBeInTheDocument();
  expect(container.querySelector('textarea')).not.toBeNull();
});

it('keeps the stop button enabled while recording even if the microphone gets disabled', () => {
  const { getByRole } = render(
    <ChatInputs {...baseProps} listening sessionID={undefined} />
  );
  expect(getByRole('button', { name: stopLabel })).not.toBeDisabled();
});

it('stops the recording when the composer unmounts', () => {
  const stopListening = jest.fn();
  const { unmount } = render(
    <ChatInputs {...baseProps} listening stopListening={stopListening} />
  );

  unmount();

  expect(stopListening).toHaveBeenCalledTimes(1);
});

it('does not stop anything on unmount when not recording', () => {
  const stopListening = jest.fn();
  const { unmount } = render(
    <ChatInputs {...baseProps} stopListening={stopListening} />
  );

  unmount();

  expect(stopListening).not.toHaveBeenCalled();
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
