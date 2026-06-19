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
  /**
   * JetStream stream that stores session events. When set, the client consumes
   * via JetStream instead of core NATS subscribe.
   */
  stream?: string;
  /**
   * Optional durable consumer name. When omitted, an ordered ephemeral consumer
   * filtered to the session subject is used.
   */
  consumer?: string;
  /**
   * Subject to subscribe or filter on. Defaults to the session UUID when omitted.
   */
  subject?: string;
}

function readStringField(
  raw: Record<string, unknown>,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

function readBooleanField(
  raw: Record<string, unknown>,
  ...keys: string[]
): boolean | undefined {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === 'boolean') {
      return value;
    }
  }
  return undefined;
}

/**
 * Normalizes raw `/api/nats` payloads (camelCase or snake_case) into {@link NatsConfig}.
 */
export function parseNatsConfig(raw: Record<string, unknown>): NatsConfig {
  const url = readStringField(raw, 'url');
  const token = readStringField(raw, 'token');

  if (!url || !token) {
    throw new Error('Invalid response from NATS config service');
  }

  const useJetStream = readBooleanField(raw, 'useJetStream', 'use_jetstream');
  const stream = readStringField(raw, 'stream', 'streamName', 'stream_name');
  const consumer = readStringField(
    raw,
    'consumer',
    'consumerName',
    'consumer_name',
    'durableName',
    'durable_name'
  );
  const subject = readStringField(
    raw,
    'subject',
    'filterSubject',
    'filter_subject'
  );

  if (useJetStream && !stream) {
    throw new Error('Invalid response from NATS config service: JetStream enabled but stream missing');
  }

  return {
    url,
    token,
    ...(stream ? { stream } : {}),
    ...(consumer ? { consumer } : {}),
    ...(subject ? { subject } : {}),
  };
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

  const data = (await response.json()) as Record<string, unknown>;
  return parseNatsConfig(data);
}
