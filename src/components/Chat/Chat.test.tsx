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
import { ArtifactSystemProvider } from '../MemoriArtifactSystem';

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
    <ArtifactSystemProvider
      config={{
        supportedMimeTypes: {
          html: {
            name: 'HTML',
            icon: '🌐',
            hasPreview: true,
            language: 'html',
            mimeType: 'text/html',
          },
        },
      }}
    >
      <Chat
        memori={memori}
        tenant={tenant}
        dialogState={dialogState}
        layout="DEFAULT"
        client={client}
        history={history}
        pushMessage={jest.fn()}
        sessionID={sessionID}
        simulateUserPrompt={jest.fn()}
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
        setEnableFocusChatInput={jest.fn()}
      />
    </ArtifactSystemProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with memori typing unchanged', () => {
  const { container } = render(
    <ArtifactSystemProvider
      config={{
        supportedMimeTypes: {
          html: {
            name: 'HTML',
            icon: '🌐',
            hasPreview: true,
            language: 'html',
            mimeType: 'text/html',
          },
        },
      }}
    >
      <Chat
        memori={memori}
        tenant={tenant}
        dialogState={dialogState}
        client={client}
        history={history}
        layout="DEFAULT"
        pushMessage={jest.fn()}
        sessionID={sessionID}
        simulateUserPrompt={jest.fn()}
        setAttachmentsMenuOpen={jest.fn()}
        setSendOnEnter={jest.fn()}
        userMessage=""
        onChangeUserMessage={jest.fn()}
        sendMessage={jest.fn()}
        stopListening={jest.fn()}
        isPlayingAudio={false}
        stopAudio={jest.fn()}
        showMicrophone={false}
        listening={false}
        startListening={jest.fn()}
        setEnableFocusChatInput={jest.fn()}
        memoriTyping
      />
    </ArtifactSystemProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with hints unchanged', () => {
  const { container } = render(
    <ArtifactSystemProvider
      config={{
        supportedMimeTypes: {
          html: {
            name: 'HTML',
            icon: '🌐',
            hasPreview: true,
            language: 'html',
            mimeType: 'text/html',
          },
        },
      }}
    >
      <Chat
        memori={memori}
        tenant={tenant}
        dialogState={dialogStateWithHints}
        client={client}
        history={history}
        layout="DEFAULT"
        pushMessage={jest.fn()}
        sessionID={sessionID}
        simulateUserPrompt={jest.fn()}
        setAttachmentsMenuOpen={jest.fn()}
        setSendOnEnter={jest.fn()}
        userMessage=""
        onChangeUserMessage={jest.fn()}
        sendMessage={jest.fn()}
        stopListening={jest.fn()}
        isPlayingAudio={false}
        stopAudio={jest.fn()}
        showMicrophone={false}
        listening={false}
        startListening={jest.fn()}
        setEnableFocusChatInput={jest.fn()}
      />
    </ArtifactSystemProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with media unchanged', () => {
  const { container } = render(
    <ArtifactSystemProvider
      config={{
        supportedMimeTypes: {
          html: {
            name: 'HTML',
            icon: '🌐',
            hasPreview: true,
            language: 'html',
            mimeType: 'text/html',
          },
        },
      }}
    >
      <Chat
        memori={memori}
        tenant={tenant}
        dialogState={dialogState}
        client={client}
        history={historyWithMedia}
        layout="DEFAULT"
        pushMessage={jest.fn()}
        sessionID={sessionID}
        simulateUserPrompt={jest.fn()}
        setAttachmentsMenuOpen={jest.fn()}
        setSendOnEnter={jest.fn()}
        userMessage=""
        onChangeUserMessage={jest.fn()}
        sendMessage={jest.fn()}
        stopListening={jest.fn()}
        isPlayingAudio={false}
        stopAudio={jest.fn()}
        showMicrophone={false}
        listening={false}
        startListening={jest.fn()}
        setEnableFocusChatInput={jest.fn()}
      />
    </ArtifactSystemProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with dates unchanged', () => {
  const { container } = render(
    <ArtifactSystemProvider
      config={{
        supportedMimeTypes: {
          html: {
            name: 'HTML',
            icon: '🌐',
            hasPreview: true,
            language: 'html',
            mimeType: 'text/html',
          },
        },
      }}
    >
      <Chat
        memori={memori}
        tenant={tenant}
        dialogState={dialogState}
        client={client}
        history={history}
        layout="DEFAULT"
        pushMessage={jest.fn()}
        sessionID={sessionID}
        simulateUserPrompt={jest.fn()}
        setAttachmentsMenuOpen={jest.fn()}
        setSendOnEnter={jest.fn()}
        userMessage=""
        onChangeUserMessage={jest.fn()}
        sendMessage={jest.fn()}
        stopListening={jest.fn()}
        isPlayingAudio={false}
        stopAudio={jest.fn()}
        showMicrophone={false}
        listening={false}
        startListening={jest.fn()}
        showDates
        setEnableFocusChatInput={jest.fn()}
      />
    </ArtifactSystemProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with context vars unchanged', () => {
  const { container } = render(
    <ArtifactSystemProvider
      config={{
        supportedMimeTypes: {
          html: {
            name: 'HTML',
            icon: '🌐',
            hasPreview: true,
            language: 'html',
            mimeType: 'text/html',
          },
        },
      }}
    >
      <Chat
        memori={memori}
        tenant={tenant}
        dialogState={dialogState}
        client={client}
        history={history}
        layout="DEFAULT"
        pushMessage={jest.fn()}
        sessionID={sessionID}
        simulateUserPrompt={jest.fn()}
        setAttachmentsMenuOpen={jest.fn()}
        setSendOnEnter={jest.fn()}
        userMessage=""
        onChangeUserMessage={jest.fn()}
        sendMessage={jest.fn()}
        stopListening={jest.fn()}
        isPlayingAudio={false}
        stopAudio={jest.fn()}
        showMicrophone={false}
        listening={false}
        startListening={jest.fn()}
        setEnableFocusChatInput={jest.fn()}
        showContextPerLine
      />
    </ArtifactSystemProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with user unchanged', () => {
  const { container } = render(
    <ArtifactSystemProvider
      config={{
        supportedMimeTypes: {
          html: {
            name: 'HTML',
            icon: '🌐',
            hasPreview: true,
            language: 'html',
            mimeType: 'text/html',
          },
        },
      }}
    >
      <Chat
        user={{ avatarURL: 'https://picsum.photos/200' }}
        memori={memori}
        tenant={tenant}
        dialogState={dialogState}
        layout="DEFAULT"
        client={client}
        history={history}
        pushMessage={jest.fn()}
        sessionID={sessionID}
        simulateUserPrompt={jest.fn()}
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
        setEnableFocusChatInput={jest.fn()}
      />
    </ArtifactSystemProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with custom user avatar unchanged', () => {
  const { container } = render(
    <ArtifactSystemProvider
      config={{
        supportedMimeTypes: {
          html: {
            name: 'HTML',
            icon: '🌐',
            hasPreview: true,
            language: 'html',
            mimeType: 'text/html',
          },
        },
      }}
    >
      <Chat
        userAvatar="https://picsum.photos/200"
        memori={memori}
        tenant={tenant}
        dialogState={dialogState}
        layout="DEFAULT"
        client={client}
        history={history}
        pushMessage={jest.fn()}
        sessionID={sessionID}
        simulateUserPrompt={jest.fn()}
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
        setEnableFocusChatInput={jest.fn()}
      />
    </ArtifactSystemProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with custom user avatar as react element unchanged', () => {
  const { container } = render(
    <ArtifactSystemProvider
      config={{
        supportedMimeTypes: {
          html: {
            name: 'HTML',
            icon: '🌐',
            hasPreview: true,
            language: 'html',
            mimeType: 'text/html',
          },
        },
      }}
    >
      <Chat
        userAvatar={<span>USER</span>}
        memori={memori}
        tenant={tenant}
        dialogState={dialogState}
        layout="DEFAULT"
        client={client}
        history={history}
        pushMessage={jest.fn()}
        sessionID={sessionID}
        simulateUserPrompt={jest.fn()}
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
        setEnableFocusChatInput={jest.fn()}
      />
    </ArtifactSystemProvider>
  );
  expect(container).toMatchSnapshot();
});
