import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatHistoryDrawer from './ChatHistory';
import memoriApiClient from '@memori.ai/memori-api-client';
import { ChatLog, ChatLogLine, Memori } from '@memori.ai/memori-api-client/dist/types';

// Mock the translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'widget.chatHistory': 'Chat History',
        'widget.chatHistoryDescription': 'Your past conversations',
        'search': 'Search in chat history...',
        'write_and_speak.resumeButton': 'Resume chat',
        'previous': 'Previous',
        'next': 'Next'
      };
      return translations[key] || key;
    }
  })
}));

// Mock API client
const mockGetChatLogsByUser = jest.fn();
const mockApiClient = {
  chatLogs: {
    getChatLogsByUser: mockGetChatLogsByUser
  }
} as unknown as ReturnType<typeof memoriApiClient>;

// Sample data
const mockChatLogs: ChatLog[] = [
  {
    chatLogID: 'chat123',
    timestamp: '2023-01-01T10:00:00Z',
    memoriID: 'mem123',
    sessionID: 'session123',
    lines: [
      {
        text: 'Hello, how can I help?',
        inbound: true,
        timestamp: '2023-01-01T10:00:00Z',
        contextVars: {},
        media: []
      },
      {
        text: 'I need information about your services',
        inbound: false,
        timestamp: '2023-01-01T10:01:00Z',
        contextVars: {},
        media: []
      }
    ],
    boardOfExperts: false
  },
  {
    chatLogID: 'chat456',
    timestamp: '2023-01-02T14:00:00Z',
    memoriID: 'mem123',
    sessionID: 'session123',
    lines: [
      {
        text: 'What are your business hours?',
        inbound: false,
        timestamp: '2023-01-02T14:00:00Z',
        contextVars: {},
        media: []
      },
      {
        text: 'We are open from 9 AM to 5 PM weekdays.',
        inbound: true,
        timestamp: '2023-01-02T14:01:00Z',
        contextVars: {},
        media: []
      }
    ],
    boardOfExperts: true
  }
];

const mockMemori: Memori = {
  memoriID: 'mem123',
  name: 'Test Memori',
  avatar: { url: 'https://example.com/avatar.jpg' },
  description: 'A test memori',
  isPublic: true,
  memoriConfigurationID: 'mem123',
  privacyType: 'PUBLIC',
  voiceType: 'FEMALE'
} as Memori;

describe('ChatHistoryDrawer', () => {
  beforeEach(() => {
    mockGetChatLogsByUser.mockResolvedValue({ chatLogs: mockChatLogs });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the chat history drawer with correct title', async () => {
    render(
      <ChatHistoryDrawer
        open={true}
        onClose={() => {}}
        apiClient={mockApiClient}
        sessionId="session123"
        memori={mockMemori}
        resumeSession={() => {}}
         baseUrl="https://www.aisuru.com"
        apiUrl="https://backend.memori.ai"
      />
    );

    expect(screen.getByText('Chat History')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search in chat history...')).toBeInTheDocument();
    
    // Wait for the chat logs to be fetched and displayed
    await waitFor(() => {
      expect(mockGetChatLogsByUser).toHaveBeenCalledWith('session123');
      expect(screen.getByText('Chat-chat')).toBeInTheDocument(); // Shows shortened ID
    });
  });

  test('allows searching through chat logs', async () => {
    render(
      <ChatHistoryDrawer
        open={true}
        onClose={() => {}}
        apiClient={mockApiClient}
        sessionId="session123"
        memori={mockMemori}
        resumeSession={() => {}}
        baseUrl="https://www.aisuru.com"
        apiUrl="https://backend.memori.ai"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Chat-chat')).toBeInTheDocument();
    });

    // Search for something that should filter results
    const searchInput = screen.getByPlaceholderText('Search in chat history...');
    fireEvent.change(searchInput, { target: { value: 'business hours' } });

    // Only the chat with "business hours" should remain
    await waitFor(() => {
      expect(screen.queryByText('Chat-chat')).toBeInTheDocument();
      // We should only see the one matching the search
      expect(screen.getAllByText(/Chat-/i)).toHaveLength(1);
    });
  });

  test('displays chat details when a chat log is selected', async () => {
    render(
      <ChatHistoryDrawer
        open={true}
        onClose={() => {}}
        apiClient={mockApiClient}
        sessionId="session123"
        memori={mockMemori}
        resumeSession={() => {}}
        baseUrl="https://www.aisuru.com"
        apiUrl="https://backend.memori.ai"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Chat-chat')).toBeInTheDocument();
    });

    // Click on a chat log
    fireEvent.click(screen.getByText('Chat-chat'));

    // Check that chat details are displayed
    await waitFor(() => {
      expect(screen.getByText('Hello, how can I help?')).toBeInTheDocument();
      expect(screen.getByText('I need information about your services')).toBeInTheDocument();
      expect(screen.getByText('Resume chat')).toBeInTheDocument();
    });
  });

  test('calls resumeSession when resume button is clicked', async () => {
    const mockResumeSession = jest.fn();
    render(
      <ChatHistoryDrawer
        open={true}
        onClose={() => {}}
        apiClient={mockApiClient}
        sessionId="session123"
        memori={mockMemori}
        resumeSession={mockResumeSession}
        baseUrl="https://www.aisuru.com"
        apiUrl="https://backend.memori.ai"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Chat-chat')).toBeInTheDocument();
    });

    // Click on a chat log
    fireEvent.click(screen.getByText('Chat-chat'));

    // Wait for chat details to appear
    await waitFor(() => {
      expect(screen.getByText('Resume chat')).toBeInTheDocument();
    });

    // Click resume button
    fireEvent.click(screen.getByText('Resume chat'));

    // Check that resumeSession was called with correct args
    expect(mockResumeSession).toHaveBeenCalledWith(
      'session123',
      expect.any(Array),
      expect.any(Array)
    );
  });

  test('paginates chat logs correctly', async () => {
    // Create more mock data to test pagination
    const manyLogs = Array(15).fill(null).map((_, i) => ({
      chatLogID: `chat${i}`,
      lines: [
        {
          text: `Message ${i}`,
          inbound: i % 2 === 0,
          timestamp: `2023-01-0${i % 9 + 1}T10:00:00Z`,
          contextVars: {},
          media: []
        },
        {
          text: `Response ${i}`,
          inbound: i % 2 !== 0,
          timestamp: `2023-01-0${i % 9 + 1}T10:01:00Z`,
          contextVars: {},
          media: []
        }
      ],
      boardOfExperts: i % 3 === 0
    }));
    
    mockGetChatLogsByUser.mockResolvedValue({ chatLogs: manyLogs });

    render(
      <ChatHistoryDrawer
        open={true}
        onClose={() => {}}
        apiClient={mockApiClient}
        sessionId="session123"
        memori={mockMemori}
        resumeSession={() => {}}
        apiUrl="https://backend.memori.ai"
        baseUrl="https://www.aisuru.com"
      />
    );

    // Wait for the pagination to be displayed
    await waitFor(() => {
      expect(screen.getByText('1 / 2')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    // Click next page
    fireEvent.click(screen.getByText('Next'));

    // Check we're on page 2
    await waitFor(() => {
      expect(screen.getByText('2 / 2')).toBeInTheDocument();
    });

    // Click previous page
    fireEvent.click(screen.getByText('Previous'));

    // Check we're back on page 1
    await waitFor(() => {
      expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });
  });
});