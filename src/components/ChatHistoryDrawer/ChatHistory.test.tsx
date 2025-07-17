import React from 'react';
import { render } from '@testing-library/react';
import ChatHistoryDrawer from './ChatHistory';
import memoriApiClient from '@memori.ai/memori-api-client';
import { memori } from '../../mocks/data';

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
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatHistoryDrawer with chat logs unchanged', () => {
  const { container } = render(
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
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatHistoryDrawer with selected chat log unchanged', () => {
  const { container } = render(
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
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatHistoryDrawer closed unchanged', () => {
  const { container } = render(
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
    />
  );
  expect(container).toMatchSnapshot();
});
