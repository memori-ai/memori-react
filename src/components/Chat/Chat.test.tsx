import React from 'react';
import { render } from '@testing-library/react';
import Chat from './Chat';
import {
  memori,
  tenant,
  history,
  historyWithMedia,
  sessionID,
  dialogState as dialogStateWithHints,
} from '../../mocks/data';
import memoriApiClient from '@memori.ai/memori-api-client';

const client = memoriApiClient();

const dialogState = {
  ...dialogStateWithHints,
  hints: [],
};

const DateTimeFormat = Intl.DateTimeFormat;
beforeEach(() => {
  jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(
    (locale, options) =>
      new DateTimeFormat(locale, {
        ...options,
        timeZone: 'Europe/Rome',
      })
  );
});

it('renders Chat unchanged', () => {
  const { container } = render(
    <Chat
      memori={memori}
      tenant={tenant}
      dialogState={dialogState}
      layout="DEFAULT"
      setDialogState={jest.fn()}
      client={client}
      history={history}
      pushMessage={jest.fn()}
      sessionID={sessionID}
      simulateUserPrompt={jest.fn()}
      selectReceiverTag={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      userMessage=""
      onChangeUserMessage={jest.fn()}
      sendMessage={jest.fn()}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      showMicrophone={false}
      listening={false}
      startListening={jest.fn()}
      stopListening={jest.fn()}
      resetTranscript={jest.fn()}
      setEnableFocusChatInput={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with memori typing unchanged', () => {
  const { container } = render(
    <Chat
      memori={memori}
      tenant={tenant}
      dialogState={dialogState}
      setDialogState={jest.fn()}
      client={client}
      history={history}
      layout="DEFAULT"
      pushMessage={jest.fn()}
      sessionID={sessionID}
      simulateUserPrompt={jest.fn()}
      selectReceiverTag={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      userMessage=""
      onChangeUserMessage={jest.fn()}
      sendMessage={jest.fn()}
      stopListening={jest.fn()}
      resetTranscript={jest.fn()}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      showMicrophone={false}
      listening={false}
      startListening={jest.fn()}
      setEnableFocusChatInput={jest.fn()}
      memoriTyping
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with hints unchanged', () => {
  const { container } = render(
    <Chat
      memori={memori}
      tenant={tenant}
      dialogState={dialogStateWithHints}
      setDialogState={jest.fn()}
      client={client}
      history={history}
      layout="DEFAULT"
      pushMessage={jest.fn()}
      sessionID={sessionID}
      simulateUserPrompt={jest.fn()}
      selectReceiverTag={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      userMessage=""
      onChangeUserMessage={jest.fn()}
      sendMessage={jest.fn()}
      stopListening={jest.fn()}
      resetTranscript={jest.fn()}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      showMicrophone={false}
      listening={false}
      startListening={jest.fn()}
      setEnableFocusChatInput={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with media unchanged', () => {
  const { container } = render(
    <Chat
      memori={memori}
      tenant={tenant}
      dialogState={dialogState}
      setDialogState={jest.fn()}
      client={client}
      history={historyWithMedia}
      layout="DEFAULT"
      pushMessage={jest.fn()}
      sessionID={sessionID}
      simulateUserPrompt={jest.fn()}
      selectReceiverTag={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      userMessage=""
      onChangeUserMessage={jest.fn()}
      sendMessage={jest.fn()}
      stopListening={jest.fn()}
      resetTranscript={jest.fn()}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      showMicrophone={false}
      listening={false}
      startListening={jest.fn()}
      setEnableFocusChatInput={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with dates unchanged', () => {
  const { container } = render(
    <Chat
      memori={memori}
      tenant={tenant}
      dialogState={dialogState}
      setDialogState={jest.fn()}
      client={client}
      history={history}
      layout="DEFAULT"
      pushMessage={jest.fn()}
      sessionID={sessionID}
      simulateUserPrompt={jest.fn()}
      selectReceiverTag={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      userMessage=""
      onChangeUserMessage={jest.fn()}
      sendMessage={jest.fn()}
      stopListening={jest.fn()}
      resetTranscript={jest.fn()}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      showMicrophone={false}
      listening={false}
      startListening={jest.fn()}
      showDates
      setEnableFocusChatInput={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with context vars unchanged', () => {
  const { container } = render(
    <Chat
      memori={memori}
      tenant={tenant}
      dialogState={dialogState}
      setDialogState={jest.fn()}
      client={client}
      history={history}
      layout="DEFAULT"
      pushMessage={jest.fn()}
      sessionID={sessionID}
      simulateUserPrompt={jest.fn()}
      selectReceiverTag={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      userMessage=""
      onChangeUserMessage={jest.fn()}
      sendMessage={jest.fn()}
      stopListening={jest.fn()}
      resetTranscript={jest.fn()}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      showMicrophone={false}
      listening={false}
      startListening={jest.fn()}
      setEnableFocusChatInput={jest.fn()}
      showContextPerLine
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat on X3 state unchanged', () => {
  const { container } = render(
    <Chat
      memori={memori}
      tenant={tenant}
      dialogState={{
        ...dialogState,
        state: 'X3',
      }}
      setDialogState={jest.fn()}
      client={client}
      history={history}
      layout="DEFAULT"
      pushMessage={jest.fn()}
      sessionID={sessionID}
      simulateUserPrompt={jest.fn()}
      selectReceiverTag={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      userMessage=""
      onChangeUserMessage={jest.fn()}
      sendMessage={jest.fn()}
      stopListening={jest.fn()}
      resetTranscript={jest.fn()}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      showMicrophone={false}
      listening={false}
      startListening={jest.fn()}
      setEnableFocusChatInput={jest.fn()}
      showContextPerLine
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat on X2a state unchanged', () => {
  const { container } = render(
    <Chat
      memori={memori}
      tenant={tenant}
      dialogState={{
        ...dialogState,
        state: 'X2a',
      }}
      setDialogState={jest.fn()}
      client={client}
      history={history}
      layout="DEFAULT"
      pushMessage={jest.fn()}
      sessionID={sessionID}
      simulateUserPrompt={jest.fn()}
      selectReceiverTag={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      userMessage=""
      onChangeUserMessage={jest.fn()}
      sendMessage={jest.fn()}
      stopListening={jest.fn()}
      resetTranscript={jest.fn()}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      showMicrophone={false}
      listening={false}
      startListening={jest.fn()}
      setEnableFocusChatInput={jest.fn()}
      showContextPerLine
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with user unchanged', () => {
  const { container } = render(
    <Chat
      user={{ avatarURL: 'https://picsum.photos/200' }}
      memori={memori}
      tenant={tenant}
      dialogState={dialogState}
      layout="DEFAULT"
      setDialogState={jest.fn()}
      client={client}
      history={history}
      pushMessage={jest.fn()}
      sessionID={sessionID}
      simulateUserPrompt={jest.fn()}
      selectReceiverTag={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      userMessage=""
      onChangeUserMessage={jest.fn()}
      sendMessage={jest.fn()}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      showMicrophone={false}
      listening={false}
      startListening={jest.fn()}
      stopListening={jest.fn()}
      resetTranscript={jest.fn()}
      setEnableFocusChatInput={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with custom user avatar unchanged', () => {
  const { container } = render(
    <Chat
      userAvatar="https://picsum.photos/200"
      memori={memori}
      tenant={tenant}
      dialogState={dialogState}
      layout="DEFAULT"
      setDialogState={jest.fn()}
      client={client}
      history={history}
      pushMessage={jest.fn()}
      sessionID={sessionID}
      simulateUserPrompt={jest.fn()}
      selectReceiverTag={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      userMessage=""
      onChangeUserMessage={jest.fn()}
      sendMessage={jest.fn()}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      showMicrophone={false}
      listening={false}
      startListening={jest.fn()}
      stopListening={jest.fn()}
      resetTranscript={jest.fn()}
      setEnableFocusChatInput={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with custom user avatar as react element unchanged', () => {
  const { container } = render(
    <Chat
      userAvatar={<span>USER</span>}
      memori={memori}
      tenant={tenant}
      dialogState={dialogState}
      layout="DEFAULT"
      setDialogState={jest.fn()}
      client={client}
      history={history}
      pushMessage={jest.fn()}
      sessionID={sessionID}
      simulateUserPrompt={jest.fn()}
      selectReceiverTag={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      userMessage=""
      onChangeUserMessage={jest.fn()}
      sendMessage={jest.fn()}
      isPlayingAudio={false}
      stopAudio={jest.fn()}
      showMicrophone={false}
      listening={false}
      startListening={jest.fn()}
      stopListening={jest.fn()}
      resetTranscript={jest.fn()}
      setEnableFocusChatInput={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
