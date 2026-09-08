import { act, renderHook, waitFor } from '@testing-library/react';
import { getNatsConfig } from './getNatsConfig';
import { useNats } from './useNats';
import { NatsSessionLifecycle, useNatsSession } from './useNatsSession';

jest.mock('./getNatsConfig', () => ({
  getNatsConfig: jest.fn(),
}));

jest.mock('./useNatsSession', () => ({
  useNatsSession: jest.fn(),
}));

const mockGetNatsConfig = getNatsConfig as jest.MockedFunction<
  typeof getNatsConfig
>;
const mockUseNatsSession = useNatsSession as jest.MockedFunction<
  typeof useNatsSession
>;

function latestLifecycle(): NatsSessionLifecycle {
  return mockUseNatsSession.mock.calls.at(-1)?.[3] ?? {};
}

describe('useNats credential lifecycle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetNatsConfig.mockResolvedValue({
      url: 'wss://nats.example.test',
      token: 'fresh-jwt',
    });
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    });
  });

  it('refreshes the JWT on resume and catches up after reconnecting', async () => {
    const onCatchUp = jest.fn();
    renderHook(() =>
      useNats({
        baseUrl: 'https://dashboard.example.test',
        sessionId: 'session-a',
        onCatchUp,
      })
    );

    await waitFor(() => expect(mockGetNatsConfig).toHaveBeenCalledTimes(1));

    act(() => {
      (document.dispatchEvent as (event: Event) => boolean)(
        new Event('visibilitychange')
      );
    });
    await waitFor(() => expect(mockGetNatsConfig).toHaveBeenCalledTimes(2));

    act(() => latestLifecycle().onConnected?.());
    expect(onCatchUp).toHaveBeenCalledTimes(1);
  });

  it('refreshes the JWT after an authorization error', async () => {
    const onCatchUp = jest.fn();
    renderHook(() =>
      useNats({
        baseUrl: 'https://dashboard.example.test',
        sessionId: 'session-a',
        onCatchUp,
      })
    );

    await waitFor(() => expect(mockGetNatsConfig).toHaveBeenCalledTimes(1));

    act(() => {
      latestLifecycle().onAuthError?.(new Error('Authorization Violation'));
    });
    await waitFor(() => expect(mockGetNatsConfig).toHaveBeenCalledTimes(2));

    act(() => latestLifecycle().onConnected?.());
    expect(onCatchUp).toHaveBeenCalledTimes(1);
  });
});
