import React from 'react';
import { render } from '../../testUtils';
import { ArtifactProvider } from '../MemoriArtifactSystem/context/ArtifactContext';
import ChatLayout from './Chat';
import HiddenChatLayout from './HiddenChat';
import type { LayoutProps } from '../MemoriWidget/MemoriWidget';
import type { Props as ChatProps } from '../Chat/Chat';

const mockChatInputs = jest.fn((_props: Record<string, unknown>) => null);
jest.mock('../ChatInputs/ChatInputs', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => mockChatInputs(props),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const onMediumSelectedState = jest.fn();

const layoutProps = (overrides: Partial<LayoutProps> = {}): LayoutProps =>
  ({
    Chat: (() => null) as unknown as LayoutProps['Chat'],
    chatProps: {
      sessionID: 'session-1',
      showInputs: true,
      onMediumSelectedState,
    } as unknown as ChatProps,
    StartPanel: (() => null) as unknown as LayoutProps['StartPanel'],
    startPanelProps: {} as LayoutProps['startPanelProps'],
    Avatar: (() => null) as unknown as LayoutProps['Avatar'],
    ...overrides,
  } as LayoutProps);

const lastChatInputsProps = () =>
  mockChatInputs.mock.calls[mockChatInputs.mock.calls.length - 1]?.[0];

beforeEach(() => {
  mockChatInputs.mockClear();
});

it('CHAT layout forwards onMediumSelectedState to its input bar', () => {
  render(
    <ArtifactProvider>
      <ChatLayout
        {...layoutProps({ sessionId: 'session-1', hasUserActivatedSpeak: true })}
      />
    </ArtifactProvider>
  );

  expect(lastChatInputsProps()?.onMediumSelectedState).toBe(
    onMediumSelectedState
  );
});

it('HIDDEN_CHAT layout forwards onMediumSelectedState to its pre-chat input bar', () => {
  render(
    <ArtifactProvider>
      <HiddenChatLayout {...layoutProps()} />
    </ArtifactProvider>
  );

  expect(lastChatInputsProps()?.onMediumSelectedState).toBe(
    onMediumSelectedState
  );
});
