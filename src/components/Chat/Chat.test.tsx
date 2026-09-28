import React from 'react';
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
import { ArtifactProvider } from '../MemoriArtifactSystem/context/ArtifactContext';
import { fireEvent, render, screen } from '../../testUtils';
import { Message } from '@memori.ai/memori-api-client/dist/types';

const client = memoriApiClient();

const dialogState = {
  ...dialogStateWithHints,
  hints: [],
};

const DateTimeFormat = Intl.DateTimeFormat;
const FIXED_TEST_DATE = new Date('2024-01-15T10:30:00.000Z');

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(FIXED_TEST_DATE);
  jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(
    (locale, options) =>
      new DateTimeFormat(locale, {
        ...options,
        timeZone: 'Europe/Rome',
      })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

it('renders Chat unchanged', () => {
  const { container } = render(
    <ArtifactProvider
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
    </ArtifactProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with memori typing unchanged', () => {
  const { container } = render(
    <ArtifactProvider
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
    </ArtifactProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with hints unchanged', () => {
  const { container } = render(
    <ArtifactProvider
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
    </ArtifactProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with media unchanged', () => {
  const { container } = render(
    <ArtifactProvider
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
    </ArtifactProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with dates unchanged', () => {
  const { container } = render(
    <ArtifactProvider
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
    </ArtifactProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with context vars unchanged', () => {
  const { container } = render(
    <ArtifactProvider
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
    </ArtifactProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with message consumption unchanged', () => {
  const { container } = render(
    <ArtifactProvider>
      <Chat
        memori={memori}
        tenant={tenant}
        dialogState={dialogState}
        layout="DEFAULT"
        client={client}
        history={[
          ...(history as any),
          {
            text: 'AI message with usage',
            fromUser: false,
            timestamp: FIXED_TEST_DATE.toISOString(),
            llmUsage: {
              provider: 'openai',
              model: 'gpt-4.1-mini',
              totalInputTokens: 10,
              outputTokens: 20,
              durationMs: 1000,
              energyImpact: { energy: 0.001, energyUnit: 'kWh' },
            },
          } as any,
        ]}
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
        showMessageConsumption
      />
    </ArtifactProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with user unchanged', () => {
  const { container } = render(
    <ArtifactProvider
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
    </ArtifactProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with custom user avatar unchanged', () => {
  const { container } = render(
    <ArtifactProvider
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
    </ArtifactProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders Chat with custom user avatar as react element unchanged', () => {
  const { container } = render(
    <ArtifactProvider
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
    </ArtifactProvider>
  );
  expect(container).toMatchSnapshot();
});

const defaultChatProps = {
  memori,
  tenant,
  dialogState,
  layout: 'DEFAULT' as const,
  client,
  history,
  pushMessage: jest.fn(),
  sessionID,
  simulateUserPrompt: jest.fn(),
  setAttachmentsMenuOpen: jest.fn(),
  setSendOnEnter: jest.fn(),
  userMessage: '',
  onChangeUserMessage: jest.fn(),
  sendMessage: jest.fn(),
  isPlayingAudio: false,
  stopAudio: jest.fn(),
  showMicrophone: false,
  listening: false,
  startListening: jest.fn(),
  stopListening: jest.fn(),
  setEnableFocusChatInput: jest.fn(),
};

function renderChat(
  overrides: Partial<React.ComponentProps<typeof Chat>> = {}
) {
  const props = { ...defaultChatProps, ...overrides };
  const view = render(
    <ArtifactProvider>
      <Chat {...props} />
    </ArtifactProvider>
  );
  return {
    ...view,
    rerenderChat: (
      nextOverrides: Partial<React.ComponentProps<typeof Chat>> = {}
    ) =>
      view.rerender(
        <ArtifactProvider>
          <Chat {...props} {...nextOverrides} />
        </ArtifactProvider>
      ),
  };
}

function mockChatOverflow(
  element: HTMLElement,
  metrics: { scrollHeight: number; clientHeight: number; scrollTop?: number }
) {
  Object.defineProperty(element, 'scrollHeight', {
    configurable: true,
    get: () => metrics.scrollHeight,
  });
  Object.defineProperty(element, 'clientHeight', {
    configurable: true,
    get: () => metrics.clientHeight,
  });
  if (metrics.scrollTop != null) {
    element.scrollTop = metrics.scrollTop;
  }
}

it('hides the jump-to-latest button when the conversation is at the bottom', () => {
  const { container } = renderChat();
  const content = container.querySelector(
    '.memori-chat--content'
  ) as HTMLElement;
  mockChatOverflow(content, {
    scrollHeight: 1000,
    clientHeight: 400,
    scrollTop: 600,
  });
  fireEvent.scroll(content);

  expect(
    screen.queryByTestId('memori-chat-jump-to-latest')
  ).not.toBeInTheDocument();
});

it('shows the jump-to-latest button after scrolling away from the latest message', () => {
  const { container } = renderChat();
  const content = container.querySelector(
    '.memori-chat--content'
  ) as HTMLElement;
  mockChatOverflow(content, {
    scrollHeight: 1000,
    clientHeight: 400,
    scrollTop: 0,
  });
  fireEvent.scroll(content);

  expect(screen.getByTestId('memori-chat-jump-to-latest')).toBeInTheDocument();
});

it('scrolls to the latest message when the jump-to-latest button is pressed', () => {
  const { container } = renderChat();
  const content = container.querySelector(
    '.memori-chat--content'
  ) as HTMLElement;
  mockChatOverflow(content, {
    scrollHeight: 1000,
    clientHeight: 400,
    scrollTop: 0,
  });
  fireEvent.scroll(content);

  fireEvent.click(screen.getByTestId('memori-chat-jump-to-latest'));

  expect(content.scrollTop).toBe(1000);
});

it('scrolls to the latest message when the user sends, but not when a reply arrives', () => {
  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: { speak: jest.fn() },
  });
  Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    configurable: true,
    value: function SpeechSynthesisUtterance() {
      return {};
    },
  });

  const sendMessage = jest.fn();
  const { container, rerenderChat } = renderChat({
    sendMessage,
    userMessage: 'hello',
  });
  const content = container.querySelector(
    '.memori-chat--content'
  ) as HTMLElement;
  mockChatOverflow(content, {
    scrollHeight: 1000,
    clientHeight: 400,
    scrollTop: 0,
  });

  fireEvent.click(screen.getByRole('button', { name: /send/i }));
  expect(sendMessage).toHaveBeenCalled();

  const userMessage: Message = {
    text: 'hello',
    fromUser: true,
    timestamp: FIXED_TEST_DATE.toISOString(),
  };
  rerenderChat({
    sendMessage,
    userMessage: '',
    history: [...history, userMessage],
  });
  expect(content.scrollTop).toBe(1000);

  content.scrollTop = 0;
  const agentMessage: Message = {
    text: 'A long incoming reply that should not yank the viewport.',
    fromUser: false,
    timestamp: FIXED_TEST_DATE.toISOString(),
  };
  rerenderChat({
    sendMessage,
    userMessage: '',
    history: [...history, userMessage, agentMessage],
  });
  expect(content.scrollTop).toBe(0);
});

it('does not play enter motion on history present at first render', () => {
  const { container } = renderChat();
  expect(container.querySelectorAll('.memori-motion-enter-up')).toHaveLength(0);
});

it('plays enter motion only on a newly appended message', () => {
  const { container, rerenderChat } = renderChat();
  const userMessage: Message = {
    text: 'hello from the composer',
    fromUser: true,
    timestamp: FIXED_TEST_DATE.toISOString(),
  };
  rerenderChat({
    history: [...history, userMessage],
  });

  const entering = container.querySelectorAll('.memori-motion-enter-up');
  expect(entering).toHaveLength(1);
  expect(entering[0]).toHaveTextContent('hello from the composer');

  rerenderChat({
    history: [...history, userMessage],
    userMessage: 'keep composer state',
  });
  expect(container.querySelectorAll('.memori-motion-enter-up')).toHaveLength(1);
});

it('does not play enter motion when history is replaced in bulk', () => {
  const { container, rerenderChat } = renderChat({ history: [] });
  rerenderChat({ history });
  expect(container.querySelectorAll('.memori-motion-enter-up')).toHaveLength(0);
});
