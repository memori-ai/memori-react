import React from 'react';
import { act, render, waitFor } from '../../testUtils';
import { DialogState } from '@memori.ai/memori-api-client/dist/types';
import MemoriWidget from './MemoriWidget';
import { VisemeProvider } from '../../context/visemeContext';
import { ArtifactProvider } from '../MemoriArtifactSystem/context/ArtifactContext';
import { memori, tenant } from '../../mocks/data';
import type { UseNatsOptions } from '../../helpers/nats/useNats';

const mockEngine = {
  initSession: jest.fn(),
  postEnterTextAsync: jest.fn(),
  getSession: jest.fn(),
};

jest.mock('@memori.ai/memori-api-client', () => {
  const actual = jest.requireActual('@memori.ai/memori-api-client');
  const factory = actual.default ?? actual;
  const mocked = (...args: unknown[]) => ({
    ...factory(...args),
    initSession: (...a: unknown[]) => mockEngine.initSession(...a),
    postEnterTextAsync: (...a: unknown[]) =>
      mockEngine.postEnterTextAsync(...a),
    getSession: (...a: unknown[]) => mockEngine.getSession(...a),
  });
  return { __esModule: true, ...actual, default: mocked };
});

let natsOptions: UseNatsOptions | undefined;
jest.mock('../../helpers/nats/useNats', () => ({
  useNats: (options: UseNatsOptions) => {
    natsOptions = options;
    return { connected: true, configError: null };
  },
}));

const SESSION_ID = 'session-1';
const SEARCHING = 'Searching the web for recent news';
const LOOKING_UP = 'Looking up your order';

const baseState = (overrides: Partial<DialogState>): DialogState =>
  ({
    state: 'R1',
    stateName: 'WaitingForReceiverQuestion',
    previousState: 'R1',
    confidenceLevel: 'NONE',
    completion: false,
    acceptsMedia: false,
    contextVars: {},
    emittedMedia: [],
    ...overrides,
  } as DialogState);

const sentTexts = () =>
  mockEngine.postEnterTextAsync.mock.calls.map(([params]) => params.text);

const progressLines = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll('.memori-chat--bubble-typing-progress-item')
  ).map(x => x.textContent);

const toolCall = (correlationID: string, message: string) => {
  act(() => {
    natsOptions!.onToolCall!({
      eventType: 'tool_call',
      correlationID,
      message,
    });
  });
};

async function openChat() {
  const result = render(
    <VisemeProvider>
      <ArtifactProvider>
        <MemoriWidget
          memori={{ ...memori, ageRestriction: 0 }}
          tenant={tenant}
          tenantID="www.aisuru.com"
          autoStart
          layout="FULLPAGE"
          enableAudio={false}
        />
      </ArtifactProvider>
    </VisemeProvider>
  );
  await waitFor(() => expect(natsOptions?.sessionId).toBe(SESSION_ID));
  return result;
}

describe('MemoriWidget tool call events', () => {
  beforeEach(() => {
    natsOptions = undefined;
    jest.clearAllMocks();
    window.localStorage.clear();
    Element.prototype.scrollTo = jest.fn();
    let correlation = 0;
    mockEngine.initSession.mockResolvedValue({
      resultCode: 0,
      resultMessage: 'Ok',
      sessionID: SESSION_ID,
      currentState: baseState({ emission: 'Benvenuto!' }),
    });
    mockEngine.postEnterTextAsync.mockImplementation(async () => ({
      resultCode: 0,
      resultMessage: 'Ok',
      correlationID: `corr-${++correlation}`,
    }));
    window.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ resultCode: 0, resultMessage: 'Ok' }),
      text: async () => '{}',
    }) as any;
  });

  it('shows the lines while waiting and removes them when the answer arrives', async () => {
    const { container } = await openChat();

    act(() => {
      window.typeMessage('what is new?');
    });
    await waitFor(() => expect(sentTexts()).toHaveLength(1));

    toolCall('corr-1', SEARCHING);
    toolCall('corr-1', LOOKING_UP);
    toolCall('corr-1', SEARCHING);

    await waitFor(() =>
      expect(progressLines(container)).toEqual([SEARCHING, LOOKING_UP])
    );
    expect(
      container.querySelector('.memori-chat--bubble-typing-progress')
    ).toHaveAttribute('role', 'status');

    act(() => {
      natsOptions!.onDialogResponse!({
        eventType: 'dialog_text_entered_response',
        correlationID: 'corr-1',
        resultCode: 0,
        resultMessage: 'Ok',
        currentState: baseState({ emission: 'Here is the news' }),
      } as any);
    });

    await waitFor(() =>
      expect(container.textContent).toContain('Here is the news')
    );
    expect(progressLines(container)).toEqual([]);
    expect(container.textContent).not.toContain(SEARCHING);
  });

  it('keeps a line that arrives before the send is acknowledged', async () => {
    let acknowledge: (value: unknown) => void = () => {};
    mockEngine.postEnterTextAsync.mockImplementationOnce(
      () => new Promise(resolve => (acknowledge = resolve))
    );
    const { container } = await openChat();

    act(() => {
      window.typeMessage('what is new?');
    });
    await waitFor(() => expect(sentTexts()).toHaveLength(1));

    toolCall('corr-early', SEARCHING);
    expect(progressLines(container)).toEqual([]);

    await act(async () => {
      acknowledge({
        resultCode: 0,
        resultMessage: 'Ok',
        correlationID: 'corr-early',
      });
    });

    await waitFor(() => expect(progressLines(container)).toEqual([SEARCHING]));
  });

  it('ignores the lines of other turns', async () => {
    const { container } = await openChat();

    act(() => {
      window.typeMessage('what is new?');
    });
    await waitFor(() => expect(sentTexts()).toHaveLength(1));

    toolCall('corr-closed', SEARCHING);
    toolCall('corr-1', LOOKING_UP);

    await waitFor(() => expect(progressLines(container)).toEqual([LOOKING_UP]));
  });

  it('removes the lines when the turn fails', async () => {
    const { container } = await openChat();

    act(() => {
      window.typeMessage('what is new?');
    });
    await waitFor(() => expect(sentTexts()).toHaveLength(1));

    toolCall('corr-1', SEARCHING);
    await waitFor(() => expect(progressLines(container)).toEqual([SEARCHING]));

    act(() => {
      natsOptions!.onError!({
        eventType: 'error',
        correlationID: 'corr-1',
        errorCode: 'EnterTextAsync Error',
        errorMessage: 'Something went wrong',
      });
    });

    await waitFor(() => expect(progressLines(container)).toEqual([]));
  });
});
