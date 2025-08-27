import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ChatHistory from './ChatHistory';
import I18nWrapper from '../../I18nWrapper';
import { ChatLog, Memori } from '@memori.ai/memori-api-client/dist/types';

// Mock API client
const mockApiClient = {
  chatLogs: {
    getUserChatLogsByToken: (loginToken: string, memoriID: string, dateFrom: string, dateTo: string) => Promise.resolve({
      chatLogs: mockChatLogs
    }),
    getUserChatLogsByTokenPaged: (requestBody: any) => Promise.resolve({
      chatLogs: mockChatLogs,
      totalItems: mockChatLogs.length
    })
  }
};

// Sample data
const mockChatLogs: ChatLog[] = [
  {
    chatLogID: 'chat123456',
    memoriID: 'mem123',
    sessionID: 'session123',
    timestamp: '2023-01-01T10:00:00Z',
    lines: [
      {
        text: 'Hello, how can I help?',
        inbound: true,
        timestamp: '2023-01-01T10:00:00Z',
        contextVars: {},
        media: [],
        memoryID: 'mem123',
      },
      {
        text: 'I need information about your services',
        inbound: false,
        timestamp: '2023-01-01T10:01:00Z',
        contextVars: {},
        media: [],
        memoryID: 'mem123',
      },
      {
        text: 'We offer a range of services including consultation, implementation, and support.',
        inbound: true,
        timestamp: '2023-01-01T10:02:00Z',
        contextVars: {},
        media: [],
        memoryID: 'mem123',
      }
    ],
    boardOfExperts: false
  },
  {
    chatLogID: 'chat456789',
    memoriID: 'mem123',
    sessionID: 'session123',
    timestamp: '2023-01-02T14:00:00Z',
    lines: [
      {
        text: 'What are your business hours?',
        inbound: false,
        timestamp: '2023-01-02T14:00:00Z',
        contextVars: {},
        media: [],
        memoryID: 'mem123',
      },
      {
        text: 'We are open from 9 AM to 5 PM weekdays.',
        inbound: true,
        timestamp: '2023-01-02T14:01:00Z',
        contextVars: {},
        media: [],
        memoryID: 'mem123',
      }
    ],
    boardOfExperts: true
  },
  {
    chatLogID: 'chat789012',
    memoriID: 'mem123',
    sessionID: 'session123',
    timestamp: '2023-01-03T11:00:00Z',
    lines: [
      {
        text: 'Do you offer remote services?',
        inbound: false,
        timestamp: '2023-01-03T11:00:00Z',
        contextVars: {},
        media: [],
        memoryID: 'mem123',
      },
      {
        text: 'Yes, we offer both in-person and remote services to accommodate your needs.',
        inbound: true,
        timestamp: '2023-01-03T11:01:00Z',
        contextVars: {},
        media: [],
        memoryID: 'mem123',
      }
    ],
    boardOfExperts: false
  },
  {
    chatLogID: 'chat345678',
    memoriID: 'mem123',
    sessionID: 'session1234',
    timestamp: '2023-01-04T09:30:00Z',
    lines: [
      {
        text: 'What is your pricing structure?',
        inbound: false,
        timestamp: '2023-01-04T09:30:00Z',
        contextVars: {},
        media: [],
        memoryID: 'mem123',
      },
      {
        text: 'Our pricing is based on project scope. We offer packages starting at $499 for basic services, with custom quotes for larger projects.',
        inbound: true,
        timestamp: '2023-01-04T09:31:00Z',
        contextVars: {},
        media: [],
        memoryID: 'mem123',
      },
      {
        text: 'Do you offer any discounts?',
        inbound: false,
        timestamp: '2023-01-04T09:32:00Z',
        contextVars: {},
        media: [],
        memoryID: 'mem123',
      },
      {
        text: 'Yes, we offer discounts for non-profits and educational institutions. We also have loyalty programs for returning customers.',
        inbound: true,
        timestamp: '2023-01-04T09:33:00Z',
        contextVars: {},
        media: [],
        memoryID: 'mem123',
      }
    ],
    boardOfExperts: false
  }
];

const mockMemori: Memori = {
  memoriID: 'mem123',
  name: 'Test Memori',
  avatar: { url: 'https://example.com/avatar.jpg' },
  description: 'A test memori',
  isPublic: true,
  integrationEnabled: false,
  enableBoardOfExperts: true,
  memoriConfigurationID: 'mem123',
  privacyType: 'PUBLIC',
  voiceType: 'FEMALE'
} as Memori;

const mockParams = {
    open: true,
    sessionId: 'session12345',
    memori: mockMemori,
    apiClient: mockApiClient as any,
    onClose: () => console.log('Close button clicked'),
    history: mockChatLogs.map(chatLog => ({
      text: chatLog.lines[0].text,
      fromUser: chatLog.lines[0].inbound,
      timestamp: chatLog.lines[0].timestamp,
    })),
    resumeSession: (chatLog: ChatLog) => {
      console.log('Resume session called with:', chatLog);
    },
    loginToken: 'mock-login-token',
    language: 'EN',
    userLang: 'EN',
}

// Create a meta object for the component
const meta: Meta<typeof ChatHistory> = {
  title: 'Widget/Chat History Drawer',
  component: ChatHistory,
  decorators: [
    Story => (
      <I18nWrapper>
        <Story />
      </I18nWrapper>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  // Define common args that apply to all stories
  args: mockParams,
  // Add argTypes to configure controls in Storybook
  argTypes: {
    open: { control: 'boolean', description: 'Whether the drawer is open' },
    onClose: { action: 'closed' },
    resumeSession: { action: 'resumed session' },
  },
};

export default meta;

// Define types for our stories
type Story = StoryObj<typeof ChatHistory>;

// Default story
export const Default: Story = {
  args: {}
};

// With preselected chat
export const WithSelectedChat: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    // We need to use the play function to simulate clicking on a chat
    const canvas = canvasElement.ownerDocument.body;
    setTimeout(() => {
      const chatCard = canvas.querySelector('.memori-chat-history-drawer--card');
      if (chatCard) {
        (chatCard as HTMLElement).click();
      }
    }, 300);
  }
};

// Empty state
export const EmptyState: Story = {
  args: {
    apiClient: {
      chatLogs: {
        getUserChatLogsByToken: (loginToken: string, memoriID: string, dateFrom: string, dateTo: string) => Promise.resolve({ chatLogs: [] }),
        getUserChatLogsByTokenPaged: (requestBody: any) => Promise.resolve({ chatLogs: [], totalItems: 0 })
      }
    } as any
  }
};

// Loading state
export const LoadingState: Story = {
  args: {
    apiClient: {
      chatLogs: {
        getUserChatLogsByToken: (loginToken: string, memoriID: string, dateFrom: string, dateTo: string) => new Promise(resolve => {
          // Simulate a slow network
          setTimeout(() => {
            resolve({ chatLogs: mockChatLogs });
          }, 2000);
        }),
        getUserChatLogsByTokenPaged: (requestBody: any) => new Promise(resolve => {
          // Simulate a slow network
          setTimeout(() => {
            resolve({ chatLogs: mockChatLogs, totalItems: mockChatLogs.length });
          }, 2000);
        })
      }
    } as any
  }
};

// Search state
export const WithSearch: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.ownerDocument.body;
    setTimeout(() => {
      const searchInput = canvas.querySelector('input[type="text"]');
      if (searchInput) {
        (searchInput as HTMLInputElement).value = 'pricing';
        (searchInput as HTMLInputElement).dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, 300);
  }
};

// With pagination
export const WithPagination: Story = {
  args: {
    apiClient: {
      chatLogs: {
        getUserChatLogsByToken: (loginToken: string, memoriID: string, dateFrom: string, dateTo: string) => {
          // Create 20 mock chat logs to trigger pagination
          const manyLogs = Array.from({ length: 20 }, (_, i) => ({
            chatLogID: `chat${i}`,
            lines: [
              {
                text: `Question ${i}`,
                inbound: false,
                timestamp: `2023-01-0${(i % 9) + 1}T10:00:00Z`,
                contextVars: {},
                media: [],
                memoryID: 'mem123',
                sessionID: 'session123'
              },
              {
                text: `Answer ${i}`,
                inbound: true,
                timestamp: `2023-01-0${(i % 9) + 1}T10:01:00Z`,
                contextVars: {},
                media: [],
                memoryID: 'memori.memoriID',
                sessionID: 'session123'
              }
            ],
            boardOfExperts: i % 3 === 0
          }));
          return Promise.resolve({ chatLogs: manyLogs });
        },
        getUserChatLogsByTokenPaged: (requestBody: any) => {
          // Create 20 mock chat logs to trigger pagination
          const manyLogs = Array.from({ length: 20 }, (_, i) => ({
            chatLogID: `chat${i}`,
            lines: [
              {
                text: `Question ${i}`,
                inbound: false,
                timestamp: `2023-01-0${(i % 9) + 1}T10:00:00Z`,
                contextVars: {},
                media: [],
                memoryID: 'mem123',
                sessionID: 'session123'
              },
              {
                text: `Answer ${i}`,
                inbound: true,
                timestamp: `2023-01-0${(i % 9) + 1}T10:01:00Z`,
                contextVars: {},
                media: [],
                memoryID: 'memori.memoriID',
                sessionID: 'session123'
              }
            ],
            boardOfExperts: i % 3 === 0
          }));
          return Promise.resolve({ chatLogs: manyLogs, totalItems: 20 });
        }
      }
    } as any
  }
}
  

// With translation
export const WithTranslation: Story = {
  args: {
    ...mockParams,
    language: 'EN',
    userLang: 'IT',
    isMultilanguageEnabled: true
  }
};

// With current chat disabled
export const WithCurrentChatDisabled: Story = {
  args: {
    ...mockParams,
    sessionId: 'session1234',
  }
};