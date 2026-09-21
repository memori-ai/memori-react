import React from 'react';
import { fireEvent, render, screen } from '../../testUtils';
import ChatHistoryDrawer from './ChatHistory';
import memoriApiClient from '@memori.ai/memori-api-client';
import { memori } from '../../mocks/data';
import { ChatLog } from '@memori.ai/memori-api-client/dist/types';
import { ArtifactProvider } from '../MemoriArtifactSystem/context/ArtifactContext';

const client = memoriApiClient();

const makeChatLog = (
  overrides: Partial<ChatLog> & { title?: string } = {}
): ChatLog =>
  ({
    chatLogID: 'chat-1',
    memoriID: 'mem-1',
    sessionID: 'other-session',
    timestamp: '2026-09-18T14:30:00.000Z',
    lines: [
      {
        timestamp: '2026-09-18T14:30:00.000Z',
        inbound: true,
        text: 'Saluti e artifact markdown di prova',
        media: [],
      },
      {
        timestamp: '2026-09-18T14:31:00.000Z',
        inbound: false,
        text: 'Ciao, ecco il markdown',
        media: [],
      },
    ],
    ...overrides,
  } as ChatLog);

const renderDrawer = (
  apiClient: ReturnType<typeof memoriApiClient>,
  extra: Partial<React.ComponentProps<typeof ChatHistoryDrawer>> = {}
) =>
  render(
    <ArtifactProvider>
      <ChatHistoryDrawer
        history={[]}
        open
        onClose={jest.fn()}
        apiClient={apiClient}
        sessionId="test-session"
        memori={memori}
        resumeSession={jest.fn()}
        baseUrl="https://www.aisuru.com"
        apiUrl="https://backend.memori.ai"
        loginToken="test-login-token"
        language="EN"
        userLang="EN"
        {...extra}
      />
    </ArtifactProvider>
  );

const mockPagedClient = (chatLogs: ChatLog[], count = chatLogs.length) =>
  ({
    ...client,
    chatLogs: {
      ...client.chatLogs,
      getUserChatLogsByTokenPaged: jest.fn().mockResolvedValue({
        chatLogs,
        count,
      }),
    },
  } as unknown as ReturnType<typeof memoriApiClient>);

it('does not show a subtitle that repeats the drawer title', async () => {
  renderDrawer(mockPagedClient([]));

  expect(
    await screen.findByRole('heading', { name: 'write_and_speak.chatHistory' })
  ).toBeInTheDocument();
  expect(
    screen.queryByText('write_and_speak.chatHistoryDescription')
  ).not.toBeInTheDocument();
});

it('renders each conversation title with date and message count', async () => {
  const longTitle =
    'Attrezzatura audio per le riprese in interni e scelta dei microfoni da usare in produzione';
  renderDrawer(
    mockPagedClient([
      makeChatLog({
        lines: [
          {
            timestamp: '2026-09-16T09:48:00.000Z',
            inbound: true,
            text: longTitle,
            media: [],
          },
          {
            timestamp: '2026-09-16T09:49:00.000Z',
            inbound: false,
            text: 'Ok',
            media: [],
          },
        ],
      }),
    ])
  );

  const title = await screen.findByText(longTitle);
  expect(title).toHaveClass('memori-chat-history-drawer--list-item--title');
  expect(title.textContent?.includes('\n')).toBe(false);
  expect(screen.getByText(/2 write_and_speak.messages/)).toBeInTheDocument();
  expect(screen.queryByText('1 write_and_speak.file')).not.toBeInTheDocument();
});

it('labels the download action as this conversation, not all history', async () => {
  renderDrawer(mockPagedClient([makeChatLog()]));

  expect(
    await screen.findByRole('button', {
      name: 'write_and_speak.downloadThisConversation',
    })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('button', {
      name: 'write_and_speak.downloadAllConversations',
    })
  ).not.toBeInTheDocument();
});

it('renders the download action with the same square icon chrome as the drawer close', async () => {
  renderDrawer(mockPagedClient([makeChatLog()]));

  const download = await screen.findByRole('button', {
    name: 'write_and_speak.downloadThisConversation',
  });
  expect(download).toHaveClass('memori-icon-button');
  expect(download.className).not.toMatch(/circle/);
});

it('opens a conversation with chat bubbles and resumes in the same view', async () => {
  const resumeSession = jest.fn();
  renderDrawer(mockPagedClient([makeChatLog()]), { resumeSession });

  fireEvent.click(
    await screen.findByRole('button', {
      name: /Saluti e artifact markdown di prova/,
    })
  );

  expect(
    await screen.findByRole('button', { name: 'chatResume.resume' })
  ).toBeInTheDocument();
  expect(
    screen
      .getByRole('button', { name: 'chatResume.resume' })
      .querySelector('svg')
  ).toBeNull();
  expect(document.querySelector('.memori-chat--bubble')).toBeTruthy();
  expect(
    screen.getByRole('button', {
      name: 'write_and_speak.downloadThisConversation',
    })
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'chatResume.resume' }));
  expect(resumeSession).toHaveBeenCalledTimes(1);
});

it('does not show the drawer when closed', () => {
  renderDrawer(mockPagedClient([]), { open: false });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('keeps date and minimum-message filters behind an expandable control', async () => {
  renderDrawer(mockPagedClient([makeChatLog()]));

  await screen.findByText('Saluti e artifact markdown di prova');
  expect(screen.queryByText('all')).not.toBeInTheDocument();
  expect(screen.queryByText('chatLogs.atLeast3')).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole('button', { name: 'write_and_speak.filters' })
  );

  expect(screen.getByText('all')).toBeInTheDocument();
  expect(screen.getByText('chatLogs.atLeast3')).toBeInTheDocument();
});
