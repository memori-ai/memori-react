export type SpeechErrorCode =
  | 'missing_session'
  | 'invalid_session'
  | 'tenant_mismatch'
  | 'rate_limited';

export class SpeechRequestError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'SpeechRequestError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Session id sent to `/api/tts` and `/api/stt`.
 * When `sessionIdRef` is set, it is the source of truth so a session opened
 * in the same turn is included before React re-renders.
 */
export function resolveSpeechSessionId(config: {
  sessionId?: string;
  sessionIdRef?: { current: string | undefined };
}): string {
  const raw = config.sessionIdRef
    ? config.sessionIdRef.current
    : config.sessionId;
  const sessionId = raw?.trim();
  if (!sessionId) {
    throw new SpeechRequestError(
      'Missing required parameter: sessionId',
      401,
      'missing_session'
    );
  }
  return sessionId;
}

const normalizeTenant = (value?: string | null): string => {
  if (!value) return '';
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split('/')[0]
    .split(':')[0];
};

const isLocalHostname = (hostname: string): boolean =>
  !hostname ||
  hostname === 'localhost' ||
  hostname === '127.0.0.1' ||
  hostname.endsWith('.localhost');

/**
 * Tenant field for `/api/tts` and `/api/stt`.
 * In production the API rejects a tenant that does not match the request host,
 * so a mismatch is omitted and the server uses the host. On localhost an
 * explicit tenant is still sent.
 */
export function speechTenantForRequest(
  apiUrl: string,
  tenant?: string,
  locationHref?: string
): string | undefined {
  const claimed = normalizeTenant(tenant);
  if (!claimed) return undefined;

  const base =
    locationHref ??
    (typeof window !== 'undefined' ? window.location.href : 'http://localhost');

  let hostname = '';
  try {
    hostname = new URL(apiUrl, base).hostname.toLowerCase();
  } catch {
    return claimed;
  }

  if (isLocalHostname(hostname)) return claimed;
  return claimed === hostname ? claimed : undefined;
}

export async function speechErrorFromResponse(
  response: Response
): Promise<SpeechRequestError> {
  const data = (await response.json().catch(() => ({}))) as {
    error?: unknown;
    code?: unknown;
  };
  const message =
    typeof data.error === 'string' && data.error.length > 0
      ? data.error
      : `API error: ${response.status}`;
  const code = typeof data.code === 'string' ? data.code : undefined;
  return new SpeechRequestError(message, response.status, code);
}

const SPEECH_ERROR_I18N: Record<string, string> = {
  missing_session: 'errors.speechMissingSession',
  invalid_session: 'errors.speechInvalidSession',
  tenant_mismatch: 'errors.speechTenantMismatch',
  rate_limited: 'errors.speechRateLimited',
};

export function speechErrorI18nKey(error: unknown): string | undefined {
  if (!(error instanceof SpeechRequestError) || !error.code) return undefined;
  return SPEECH_ERROR_I18N[error.code];
}
