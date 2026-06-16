// helpers/nats/getNatsConfig.ts - Fetch NATS connection params (url + token)
// from the backend, using the same baseUrl already used for /api/tts and /api/stt.

/**
 * Connection parameters returned by `GET /api/nats?sessionId=<uuid>`.
 */
export interface NatsConfig {
  /** WebSocket URL of the NATS server (e.g. wss://nats.hz.slnode.net:8080). */
  url: string;
  /** Bearer token used to authenticate the WebSocket connection. */
  token: string;
}

/**
 * Fetch the NATS connection config for a given session.
 *
 * Mirrors the error-handling style of the tts/stt helpers: the backend may
 * answer with 400 (sessionId missing), 404 (invalid session) or 500 (NATS
 * config missing). Any non-ok response throws with a descriptive message.
 *
 * @param baseUrl Same baseUrl used for `/api/tts` and `/api/stt`.
 * @param sessionId Current session UUID.
 * @param signal Optional AbortSignal to cancel the request.
 */
export async function getNatsConfig(
  baseUrl: string,
  sessionId: string,
  signal?: AbortSignal
): Promise<NatsConfig> {
  if (!sessionId) {
    throw new Error('Missing sessionId for NATS config request');
  }

  const response = await fetch(
    `${baseUrl}/api/nats?sessionId=${encodeURIComponent(sessionId)}`,
    { signal }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({} as any));

    switch (response.status) {
      case 400:
        throw new Error(
          errorData.error || 'NATS config error: missing sessionId'
        );
      case 404:
        throw new Error(
          errorData.error || 'NATS config error: invalid session'
        );
      case 500:
        throw new Error(
          errorData.error || 'NATS config error: NATS configuration missing'
        );
      default:
        throw new Error(
          errorData.error || `NATS config error: ${response.status}`
        );
    }
  }

  const data = (await response.json()) as Partial<NatsConfig>;

  if (!data.url || !data.token) {
    throw new Error('Invalid response from NATS config service');
  }

  return { url: data.url, token: data.token };
}
