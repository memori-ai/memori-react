import React from 'react';
import { render, screen, waitFor } from '../../testUtils';
import { DialogState } from '@memori.ai/memori-api-client/dist/types';
import MemoriWidget, { Props } from './MemoriWidget';
import { VisemeProvider } from '../../context/visemeContext';
import { ArtifactProvider } from '../MemoriArtifactSystem/context/ArtifactContext';
import { memori, tenant } from '../../mocks/data';

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

jest.mock('../../helpers/nats/useNats', () => ({
  useNats: () => ({ connected: true, configError: null }),
}));

const ENGINE_MEMORI_ID = 'engine-memori-1';

const openedSession = {
  resultCode: 0,
  resultMessage: 'Ok',
  sessionID: 'session-1',
  currentState: {
    state: 'R1',
    stateName: 'WaitingForReceiverQuestion',
    confidenceLevel: 'NONE',
    emission: 'Benvenuto!',
  } as unknown as DialogState,
};

// Embedded webcomponent loaded by name: the public memori has no ownerUserID.
const embeddedMemori = {
  ...memori,
  ageRestriction: 0,
  requireLoginToken: true,
  ownerUserID: undefined,
  engineMemoriID: ENGINE_MEMORI_ID,
};

const Widget = (props: Partial<Props>) => (
  <VisemeProvider>
    <ArtifactProvider>
      <MemoriWidget
        memori={embeddedMemori}
        tenant={{ ...tenant, billingDelegation: true }}
        tenantID="www.aisuru.com"
        baseUrl="https://www.aisuru.com"
        layout="FULLPAGE"
        enableAudio={false}
        autoStart
        additionalInfo={{ loginToken: 'login-token' }}
        {...props}
      />
    </ArtifactProvider>
  </VisemeProvider>
);

const mockVerifyTokens = (response: {
  ok: boolean;
  status?: number;
  body?: unknown;
}) => {
  window.fetch = jest.fn().mockImplementation((url: string) =>
    Promise.resolve(
      String(url).includes('/api/verify-tokens')
        ? {
            ok: response.ok,
            status: response.status ?? 200,
            json: async () => response.body,
          }
        : {
            ok: true,
            status: 200,
            json: async () => ({ resultCode: 0, resultMessage: 'Ok' }),
            text: async () => '{}',
          }
    )
  ) as any;
};

const verifyTokensBodies = () =>
  (window.fetch as jest.Mock).mock.calls
    .filter(([url]) => String(url).includes('/api/verify-tokens'))
    .map(([, init]) => JSON.parse(init.body));

jest.setTimeout(15000);

describe('MemoriWidget credits check', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    Element.prototype.scrollTo = jest.fn();
    mockEngine.pwlGetCurrentUser.mockResolvedValue({
      resultCode: 0,
      resultMessage: 'Ok',
      user: { userID: 'visitor-1', userName: 'mario', pAndCUAccepted: true },
    });
    mockEngine.deleteSession.mockResolvedValue({ resultCode: 0 });
    mockEngine.initSession.mockResolvedValue(openedSession);
  });

  it('verifies by engineMemoriID when the owner user ID is unknown', async () => {
    mockVerifyTokens({ ok: true, body: { enough: true, required: 1 } });

    render(<Widget />);

    await waitFor(() => expect(mockEngine.initSession).toHaveBeenCalled());
    const bodies = verifyTokensBodies();
    expect(bodies.length).toBeGreaterThan(0);
    bodies.forEach(body => {
      expect(body.engineMemoriID).toBe(ENGINE_MEMORI_ID);
      expect(body.userID).toBeUndefined();
    });
  });

  it.each([
    ['the check is rejected', { ok: false, status: 400 }, 'creditsCheckFailed'],
    [
      'credits are not enough',
      { ok: true, body: { enough: false, required: 1 } },
      'notEnoughCredits',
    ],
  ])(
    'keeps the start panel visible with a notice when %s',
    async (_, response, message) => {
      mockVerifyTokens(response);

      const { container } = render(<Widget />);

      const notice = await waitFor(() => {
        const el = container.querySelector('.memori--start-credits-notice');
        expect(el).not.toBeNull();
        return el as HTMLElement;
      });
      expect(notice).toHaveTextContent(message);
      expect(container.querySelector('.memori-widget')).not.toHaveClass(
        'memori--auto-start'
      );
      expect(
        container.querySelector('.memori--start-actions__start')
      ).toBeDisabled();
      expect(mockEngine.initSession).not.toHaveBeenCalled();
    }
  );

  it('lets the session start when the check fails on the server', async () => {
    mockVerifyTokens({ ok: false, status: 500 });

    render(<Widget />);

    await waitFor(() => expect(mockEngine.initSession).toHaveBeenCalled());
    expect(screen.queryByText('creditsCheckFailed')).toBeNull();
  });
});
