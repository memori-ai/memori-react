import React from 'react';
import { act, render, waitFor } from '../../testUtils';
import { DialogState } from '@memori.ai/memori-api-client/dist/types';
import MemoriWidget, { Props } from './MemoriWidget';
import { VisemeProvider } from '../../context/visemeContext';
import { ArtifactProvider } from '../MemoriArtifactSystem/context/ArtifactContext';
import { memori, tenant } from '../../mocks/data';
import type { UseNatsOptions } from '../../helpers/nats/useNats';
import { setLocalConfig } from '../../helpers/configuration';

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
    postEnterTextAsync: (...a: unknown[]) => mockEngine.postEnterTextAsync(...a),
    getSession: (...a: unknown[]) => mockEngine.getSession(...a),
  });
  return { __esModule: true, ...actual, default: mocked };
});

jest.mock('../../helpers/translations', () => ({
  ...jest.requireActual('../../helpers/translations'),
  getTranslation: jest.fn(async (text: string, to: string) => ({
    text: `[${to}] ${text}`,
    originalText: text,
  })),
}));

let natsOptions: UseNatsOptions | undefined;
jest.mock('../../helpers/nats/useNats', () => ({
  useNats: (options: UseNatsOptions) => {
    natsOptions = options;
    return { connected: true, configError: null };
  },
}));

const SESSION_ID = 'session-1';
const USER_TEXT = 'mostrami il contenuto';
const HIDDEN_TEXT = 'HIDDEN_TRIGGER';

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

const greetingState = baseState({ emission: 'Benvenuto!' });
const contentWithSnippet = baseState({
  emission: 'Contenuto con snippet',
  currentMemoryID: 'memory-1',
  lastMatchedMemoryID: 'memory-1',
  hints: ['Continua'],
  emittedMedia: [
    {
      mediumID: 'snippet-1',
      mimeType: 'text/javascript',
      title: 'snippet',
      content: `window.typeMessageHidden('${HIDDEN_TEXT}')`,
      properties: { executable: true },
    } as any,
  ],
});
const hiddenReplyState = baseState({
  emission: 'Risposta al messaggio nascosto',
  currentMemoryID: 'memory-2',
  lastMatchedMemoryID: 'memory-2',
});

const sentTexts = () =>
  mockEngine.postEnterTextAsync.mock.calls.map(([params]) => params.text);

const hiddenSends = () => sentTexts().filter(t => t === HIDDEN_TEXT).length;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Opens a session, sends a message whose NATS reply carries an executable
 * snippet, and waits until that snippet has sent its hidden message.
 */
async function reachPendingHiddenTurn(props: Partial<Props> = {}) {
  const onStateChange = jest.fn();
  render(
    <VisemeProvider>
      <ArtifactProvider>
        <MemoriWidget
          memori={{ ...memori, ageRestriction: 0 }}
          tenant={tenant}
          tenantID="www.aisuru.com"
          autoStart
          layout="FULLPAGE"
          enableAudio={false}
          onStateChange={onStateChange}
          {...props}
        />
      </ArtifactProvider>
    </VisemeProvider>
  );

  await waitFor(() => expect(natsOptions?.sessionId).toBe(SESSION_ID));

  act(() => {
    window.typeMessage(USER_TEXT);
  });
  await waitFor(() => expect(sentTexts()).toHaveLength(1));

  act(() => {
    natsOptions!.onDialogResponse!({
      eventType: 'dialog_text_entered_response',
      correlationID: 'corr-1',
      resultCode: 0,
      resultMessage: 'Ok',
      currentState: contentWithSnippet,
    } as any);
  });

  await waitFor(() => expect(sentTexts()).toHaveLength(2), { timeout: 3000 });
  expect(sentTexts()[1]).toBe(HIDDEN_TEXT);

  return { onStateChange };
}

/** Simulates the user leaving and returning to the tab `times` times. */
async function resumeTab(times: number) {
  for (let i = 0; i < times; i++) {
    await act(async () => {
      await natsOptions!.onCatchUp!();
      // Snippets run 1s after a state is applied.
      await wait(1500);
    });
  }
}

describe('MemoriWidget NATS catch-up', () => {
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
      currentState: greetingState,
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

  it('does not re-send a hidden message when the tab resumes while that turn is still pending', async () => {
    await reachPendingHiddenTurn();
    mockEngine.getSession.mockResolvedValue({
      resultCode: 0,
      resultMessage: 'Ok',
      currentState: contentWithSnippet,
    });

    await resumeTab(2);

    expect(mockEngine.getSession).toHaveBeenCalledTimes(2);
    expect(hiddenSends()).toBe(1);
  });

  it('does not re-send a hidden message when the displayed state holds a translated emission', async () => {
    await reachPendingHiddenTurn({ multilingual: true, spokenLang: 'EN' });
    mockEngine.getSession.mockResolvedValue({
      resultCode: 0,
      resultMessage: 'Ok',
      currentState: contentWithSnippet,
    });

    await resumeTab(2);

    expect(mockEngine.getSession).toHaveBeenCalledTimes(2);
    expect(hiddenSends()).toBe(1);
  });

  it('sends the next batch step after the previous one is answered', async () => {
    setLocalConfig('muteSpeaker', false);
    render(
      <VisemeProvider>
        <ArtifactProvider>
          <MemoriWidget
            memori={{ ...memori, ageRestriction: 0 }}
            tenant={tenant}
            tenantID="www.aisuru.com"
            autoStart
            layout="FULLPAGE"
          />
        </ArtifactProvider>
      </VisemeProvider>
    );
    await waitFor(() => expect(natsOptions?.sessionId).toBe(SESSION_ID));

    act(() => {
      window.typeBatchMessages([
        { message: 'STEP_1', hidden: true },
        { message: 'STEP_2', hidden: true },
      ]);
    });
    await waitFor(() => expect(sentTexts()).toEqual(['STEP_1']));

    act(() => {
      natsOptions!.onDialogResponse!({
        eventType: 'dialog_text_entered_response',
        correlationID: 'corr-1',
        resultCode: 0,
        resultMessage: 'Ok',
        currentState: hiddenReplyState,
      } as any);
    });
    // TTS finished reading the reply to STEP_1.
    act(() => {
      document.dispatchEvent(new CustomEvent('MemoriEndSpeak'));
    });

    await waitFor(() => expect(sentTexts()).toEqual(['STEP_1', 'STEP_2']), {
      timeout: 4000,
    });
  });

  it('waitForPrevious holds a message until the previous request is answered', async () => {
    setLocalConfig('muteSpeaker', false);
    render(
      <VisemeProvider>
        <ArtifactProvider>
          <MemoriWidget
            memori={{ ...memori, ageRestriction: 0 }}
            tenant={tenant}
            tenantID="www.aisuru.com"
            autoStart
            layout="FULLPAGE"
          />
        </ArtifactProvider>
      </VisemeProvider>
    );
    await waitFor(() => expect(natsOptions?.sessionId).toBe(SESSION_ID));

    act(() => {
      window.typeMessageHidden('FIRST');
    });
    await waitFor(() => expect(sentTexts()).toEqual(['FIRST']));

    act(() => {
      window.typeMessageHidden('SECOND');
    });
    await act(async () => {
      await wait(1500);
    });
    expect(sentTexts()).toEqual(['FIRST']);

    act(() => {
      natsOptions!.onDialogResponse!({
        eventType: 'dialog_text_entered_response',
        correlationID: 'corr-1',
        resultCode: 0,
        resultMessage: 'Ok',
        currentState: hiddenReplyState,
      } as any);
    });
    await waitFor(() => expect(sentTexts()).toEqual(['FIRST', 'SECOND']), {
      timeout: 3000,
    });
  });

  it('applies the engine state on resume once the hidden turn has completed', async () => {
    const { onStateChange } = await reachPendingHiddenTurn();
    mockEngine.getSession.mockResolvedValue({
      resultCode: 0,
      resultMessage: 'Ok',
      currentState: hiddenReplyState,
    });

    await resumeTab(1);

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ emission: hiddenReplyState.emission })
    );
    expect(hiddenSends()).toBe(1);
  });
});
