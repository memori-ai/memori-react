import React from 'react';
import { fireEvent, render, screen, waitFor } from './testUtils';
import { memori, tenant } from './mocks/data';
import Memori from './index';

const LOGIN_TOKEN = 'login-token';
const SECRET = 'system-secret';

const mockBackend = {
  getMemori: jest.fn(),
  getMemoriByUserAndId: jest.fn(),
  getTenant: jest.fn(),
  pwlGetCurrentUser: jest.fn(),
};

const mockEngine = {
  initSession: jest.fn(),
  deleteSession: jest.fn(),
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
        getMemori: (...a: unknown[]) => mockBackend.getMemori(...a),
        getMemoriByUserAndId: (...a: unknown[]) =>
          mockBackend.getMemoriByUserAndId(...a),
        pwlGetCurrentUser: (...a: unknown[]) =>
          mockBackend.pwlGetCurrentUser(...a),
        tenant: {
          ...client.backend.tenant,
          getTenant: (...a: unknown[]) => mockBackend.getTenant(...a),
        },
      },
    };
  };
  return { __esModule: true, ...actual, default: mocked };
});

const privateAgent = {
  ...memori,
  privacyType: 'PRIVATE' as const,
  secretToken: SECRET,
  password: undefined,
  ageRestriction: 0,
  requireLoginToken: false,
  needsPosition: false,
};

const openedSession = {
  resultCode: 0,
  resultMessage: 'Ok',
  sessionID: 'session-1',
  currentState: {
    state: 'R1',
    stateName: 'WaitingForReceiverQuestion',
    previousState: 'R1',
    confidenceLevel: 'NONE',
    completion: false,
    acceptsMedia: false,
    contextVars: {},
    emittedMedia: [],
    emission: 'Benvenuto!',
  },
};

function agentResponse(agent = privateAgent) {
  return { resultCode: 0, resultMessage: 'Ok', memori: agent };
}

async function startSession(container: HTMLElement) {
  const start = await waitFor(() => {
    const button = container.querySelector('.memori--start-actions__start');
    expect(button).not.toBeNull();
    return button as HTMLElement;
  });
  fireEvent.click(start);
}

describe('private agent session', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    window.speechSynthesis = {
      speak: jest.fn(),
      cancel: jest.fn(),
      getVoices: () => [],
    } as unknown as typeof window.speechSynthesis;
    window.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ resultCode: 0, resultMessage: 'Ok' }),
      text: async () => '{}',
    }) as unknown as typeof fetch;
    mockBackend.getTenant.mockResolvedValue({
      resultCode: 0,
      resultMessage: 'Ok',
      tenant,
    });
    mockBackend.pwlGetCurrentUser.mockResolvedValue({
      resultCode: 0,
      resultMessage: 'Ok',
      user: { userID: 'user-1', userName: 'mario' },
    });
    mockEngine.initSession.mockResolvedValue(openedSession);
    mockEngine.deleteSession.mockResolvedValue({ resultCode: 0 });
    mockBackend.getMemoriByUserAndId.mockResolvedValue(agentResponse());
    mockBackend.getMemori.mockResolvedValue(agentResponse());
  });

  it('loads the secret token with the login and sends it to openSession', async () => {
    const { container } = render(
      <Memori
        memoriID={memori.memoriID}
        ownerUserID={memori.ownerUserID}
        tenantID={tenant.name}
        authToken={LOGIN_TOKEN}
      />
    );

    await waitFor(() =>
      expect(mockBackend.getMemoriByUserAndId).toHaveBeenCalledWith(
        tenant.name,
        memori.ownerUserID,
        memori.memoriID,
        LOGIN_TOKEN
      )
    );

    await startSession(container);

    await waitFor(() => expect(mockEngine.initSession).toHaveBeenCalled());
    expect(mockEngine.initSession).toHaveBeenCalledWith(
      expect.objectContaining({
        memoriID: memori.engineMemoriID,
        password: SECRET,
      })
    );
  });

  it('keeps the secret returned by the API when the host does not pass one', async () => {
    const { container } = render(
      <Memori
        memoriName={memori.name}
        ownerUserName={memori.ownerUserName}
        tenantID={tenant.name}
        authToken={LOGIN_TOKEN}
        secretToken={undefined}
      />
    );

    await waitFor(() =>
      expect(mockBackend.getMemori).toHaveBeenCalledWith(
        tenant.name,
        memori.ownerUserName,
        memori.name,
        LOGIN_TOKEN
      )
    );

    await startSession(container);

    await waitFor(() =>
      expect(mockEngine.initSession).toHaveBeenCalledWith(
        expect.objectContaining({ password: SECRET })
      )
    );
  });

  it('does not open a session when the private secret is unavailable', async () => {
    mockBackend.getMemoriByUserAndId.mockResolvedValue(
      agentResponse({
        ...privateAgent,
        secretToken: undefined,
        password: undefined,
      })
    );

    const { container } = render(
      <Memori
        memoriID={memori.memoriID}
        ownerUserID={memori.ownerUserID}
        tenantID={tenant.name}
      />
    );

    await startSession(container);

    await waitFor(() =>
      expect(container.querySelector('#auth-password')).not.toBeNull()
    );
    expect(mockEngine.initSession).not.toHaveBeenCalled();
  });

  it('does not use a login token that exists only in additionalInfo', async () => {
    mockBackend.getMemoriByUserAndId.mockImplementation(
      async (
        _tenant: string,
        _owner: string,
        _id: string,
        token?: string
      ) =>
        agentResponse({
          ...privateAgent,
          secretToken: token ? SECRET : undefined,
        })
    );

    const { container } = render(
      <Memori
        memoriID={memori.memoriID}
        ownerUserID={memori.ownerUserID}
        tenantID={tenant.name}
        additionalInfo={{ loginToken: LOGIN_TOKEN }}
      />
    );

    await waitFor(() =>
      expect(mockBackend.getMemoriByUserAndId).toHaveBeenCalledWith(
        tenant.name,
        memori.ownerUserID,
        memori.memoriID,
        undefined
      )
    );

    await startSession(container);

    await waitFor(() =>
      expect(container.querySelector('#auth-password')).not.toBeNull()
    );
    expect(mockEngine.initSession).not.toHaveBeenCalled();
  });

  it('does not ask for a password when a public agent is rejected with Empty password', async () => {
    mockBackend.getMemoriByUserAndId.mockResolvedValue(
      agentResponse({
        ...privateAgent,
        privacyType: 'PUBLIC',
        secretToken: undefined,
        password: undefined,
      })
    );
    mockEngine.initSession.mockResolvedValue({
      resultCode: 422,
      resultMessage: 'Empty password',
    });

    const { container } = render(
      <Memori
        memoriID={memori.memoriID}
        ownerUserID={memori.ownerUserID}
        tenantID={tenant.name}
      />
    );

    await startSession(container);

    await waitFor(() =>
      expect(screen.getByText('error.emptyPasswordPublic')).toBeTruthy()
    );
    expect(container.querySelector('#auth-password')).toBeNull();
    expect(mockEngine.initSession).toHaveBeenCalledWith(
      expect.objectContaining({
        memoriID: memori.engineMemoriID,
        password: undefined,
      })
    );
  });
});
