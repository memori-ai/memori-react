import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatHistoryDrawer from './ChatHistory';
import memoriApiClient from '@memori.ai/memori-api-client';
import { memori } from '../../mocks/data';
import { AlertProvider } from '@memori.ai/ui';

// Mock IntersectionObserver
beforeEach(() => {
  window.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
  }));
});

// Mock the translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const client = memoriApiClient();

it('renders ChatHistoryDrawer unchanged', () => {
  const { container } = render(
    <AlertProvider>
      <ChatHistoryDrawer
        history={[]}
        open={true}
        onClose={jest.fn()}
        apiClient={client}
        sessionId="test-session"
        memori={memori}
        resumeSession={jest.fn()}
        baseUrl="https://www.aisuru.com"
        apiUrl="https://backend.memori.ai"
        loginToken="test-login-token"
        language="EN"
        userLang="EN"
      />
    </AlertProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatHistoryDrawer with chat logs unchanged', () => {
  const { container } = render(
    <AlertProvider>
      <ChatHistoryDrawer
        history={[]}
        open={true}
        onClose={jest.fn()}
        apiClient={client}
        sessionId="test-session"
        memori={memori}
        resumeSession={jest.fn()}
        baseUrl="https://www.aisuru.com"
        apiUrl="https://backend.memori.ai"
        loginToken="test-login-token"
        language="EN"
        userLang="EN"
      />
    </AlertProvider>
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatHistoryDrawer with selected chat log unchanged', () => {
  const { container } = render(
    <AlertProvider>
      <ChatHistoryDrawer
        history={[]}
        open={true}
        onClose={jest.fn()}
        apiClient={client}
        sessionId="test-session"
        memori={memori}
        resumeSession={jest.fn()}
        baseUrl="https://www.aisuru.com"
        apiUrl="https://backend.memori.ai"
        loginToken="test-login-token"
        language="EN"
        userLang="EN"
      />
    </AlertProvider>
  );
  expect(container).toMatchSnapshot();
});

it('counts function calls apart from attached files', async () => {
  const chatLog = {
    chatLogID: 'chat-log-with-functions',
    sessionID: 'other-session',
    lines: [
      {
        timestamp: '2024-01-01T10:00:00.000Z',
        inbound: true,
        text: 'Elenca i tool del server MCP',
        media: [
          { mimeType: 'image/png', url: 'https://example.com/shot.png' },
          { mimeType: 'application/pdf', url: 'https://example.com/doc.pdf' },
        ],
      },
      {
        timestamp: '2024-01-01T10:00:05.000Z',
        inbound: false,
        text: 'Ecco i tool disponibili',
        media: [
          {
            mimeType: 'text/plain',
            content: '- Result: {"success":true}',
            title: 'Function Call to "LISTA_TOOLS"',
            properties: {
              functionCache: 'true',
              functionSignature: 'LISTA_TOOLS()',
            },
          },
          {
            mimeType: 'text/plain',
            content: '- Result: {"success":true}',
            properties: { functionSignature: 'ALTRA_FUNZIONE()' },
          },
        ],
      },
    ],
  };

  const apiClientWithLogs = {
    ...client,
    chatLogs: {
      ...client.chatLogs,
      getUserChatLogsByTokenPaged: jest
        .fn()
        .mockResolvedValue({ chatLogs: [chatLog], count: 1 }),
    },
  } as unknown as ReturnType<typeof memoriApiClient>;

  render(
    <AlertProvider>
      <ChatHistoryDrawer
        history={[]}
        open={true}
        onClose={jest.fn()}
        apiClient={apiClientWithLogs}
        sessionId="test-session"
        memori={memori}
        resumeSession={jest.fn()}
        baseUrl="https://www.aisuru.com"
        apiUrl="https://backend.memori.ai"
        loginToken="test-login-token"
        language="EN"
        userLang="EN"
      />
    </AlertProvider>
  );

  expect(await screen.findByText('1 write_and_speak.file')).toBeInTheDocument();
  expect(
    await screen.findByText('2 write_and_speak.functions')
  ).toBeInTheDocument();
  expect(
    await screen.findByText('1 write_and_speak.image')
  ).toBeInTheDocument();
});

it('renders ChatHistoryDrawer closed unchanged', () => {
  const { container } = render(
    <AlertProvider>
      <ChatHistoryDrawer
        history={[]}
        open={false}
        onClose={jest.fn()}
        apiClient={client}
        sessionId="test-session"
        memori={memori}
        resumeSession={jest.fn()}
        baseUrl="https://www.aisuru.com"
        apiUrl="https://backend.memori.ai"
        loginToken="test-login-token"
        language="EN"
        userLang="EN"
      />
    </AlertProvider>
  );
  expect(container).toMatchSnapshot();
});
