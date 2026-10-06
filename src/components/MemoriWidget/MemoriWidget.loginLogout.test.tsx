import React from 'react';
import { act, fireEvent, render, waitFor } from '../../testUtils';
import { DialogState } from '@memori.ai/memori-api-client/dist/types';
import MemoriWidget, { Props } from './MemoriWidget';
import { VisemeProvider } from '../../context/visemeContext';
import { ArtifactProvider } from '../MemoriArtifactSystem/context/ArtifactContext';
import { memori, tenant } from '../../mocks/data';
import type { UseNatsOptions } from '../../helpers/nats/useNats';

const mockEngine = {
  initSession: jest.fn(),
  deleteSession: jest.fn(),
  pwlGetCurrentUser: jest.fn(),
};

jest.mock('@memori.ai/memori-api-client', () => {
  const actual = jest.requireActual('@memori.ai/memori-api-client');
  const factory = actual.default ?? actual;
  const mocked = (...args: unknown[]) => {
    const client = factory(...args);
    return {
      ...client,
      initSession: (...a: unknown[]) => mockEngine.initSession(...a),
      deleteSession: (...a: unknown[]) => mockEngine.deleteSession(...a),
      backend: {
        ...client.backend,
        pwlGetCurrentUser: (...a: unknown[]) =>
          mockEngine.pwlGetCurrentUser(...a),
      },
    };
  };
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
const LOGIN_TOKEN = 'login-token';

const greetingState = {
  state: 'R1',
  stateName: 'WaitingForReceiverQuestion',
  previousState: 'R1',
  confidenceLevel: 'NONE',
  completion: false,
  acceptsMedia: false,
  contextVars: {},
  emittedMedia: [],
  emission: 'Benvenuto!',
} as unknown as DialogState;

const openedSession = {
  resultCode: 0,
  resultMessage: 'Ok',
  sessionID: SESSION_ID,
  currentState: greetingState,
};

const Widget = (props: Partial<Props>) => (
  <VisemeProvider>
    <ArtifactProvider>
      <MemoriWidget
        memori={{ ...memori, ageRestriction: 0, requireLoginToken: true }}
        tenant={tenant}
        tenantID="www.aisuru.com"
        layout="FULLPAGE"
        enableAudio={false}
        showChatHistory
        {...props}
      />
    </ArtifactProvider>
  </VisemeProvider>
);

const loggedIn = { additionalInfo: { loginToken: LOGIN_TOKEN } };
const loggedOut = { additionalInfo: {} };

jest.setTimeout(15000);

describe('MemoriWidget with mandatory login', () => {
  beforeEach(() => {
    natsOptions = undefined;
    jest.clearAllMocks();
    window.localStorage.clear();
    Element.prototype.scrollTo = jest.fn();
    mockEngine.pwlGetCurrentUser.mockResolvedValue({
      resultCode: 0,
      resultMessage: 'Ok',
      user: { userID: 'user-1', userName: 'mario', pAndCUAccepted: true },
    });
    mockEngine.deleteSession.mockResolvedValue({ resultCode: 0 });
    window.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ resultCode: 0, resultMessage: 'Ok' }),
      text: async () => '{}',
    }) as any;
  });

  it('drops a session that finishes opening after the user logged out', async () => {
    let resolveSession: (value: typeof openedSession) => void = () => {};
    mockEngine.initSession.mockReturnValue(
      new Promise(resolve => {
        resolveSession = resolve;
      })
    );

    const { rerender, container } = render(<Widget autoStart {...loggedIn} />);
    await waitFor(() => expect(mockEngine.initSession).toHaveBeenCalled());

    rerender(<Widget autoStart {...loggedOut} />);
    await waitFor(() =>
      expect(container.querySelector('.memori--needsLogin')).not.toBeNull()
    );

    await act(async () => {
      resolveSession(openedSession);
    });

    await waitFor(() =>
      expect(mockEngine.deleteSession).toHaveBeenCalledWith(SESSION_ID)
    );
    expect(natsOptions?.sessionId).toBeUndefined();
    expect(container.querySelector('.memori--needsLogin')).not.toBeNull();
  });

  it('closes the chat history drawer on logout', async () => {
    mockEngine.initSession.mockResolvedValue(openedSession);

    const { rerender, container } = render(<Widget autoStart {...loggedIn} />);
    await waitFor(() => expect(natsOptions?.sessionId).toBe(SESSION_ID));

    const historyButton = await waitFor(() => {
      const button = container.querySelector(
        '.memori-header--chat-history-button'
      );
      expect(button).not.toBeNull();
      return button as HTMLElement;
    });
    fireEvent.click(historyButton);
    await waitFor(() =>
      expect(
        document.querySelector('.memori-chat-history-drawer')
      ).not.toBeNull()
    );

    rerender(<Widget autoStart {...loggedOut} />);

    await waitFor(() =>
      expect(document.querySelector('.memori-chat-history-drawer')).toBeNull()
    );
  });
});
