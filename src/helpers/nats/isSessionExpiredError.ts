import type {
  NatsDialogResponseEvent,
  NatsErrorEvent,
} from './useNatsSession';

/** Backend result codes for missing / expired sessions. */
const SESSION_NOT_FOUND = -101;
const SESSION_EXPIRED = -103;

const SESSION_NOT_FOUND_MESSAGE =
  /session\s+with\s+id\s+["']?[^"']+["']?\s+not\s+found/i;

function isExpiredResultCode(resultCode?: number): boolean {
  return (
    resultCode === 404 ||
    resultCode === SESSION_EXPIRED ||
    resultCode === SESSION_NOT_FOUND
  );
}

function isExpiredErrorMessage(message?: string): boolean {
  if (!message) return false;
  return SESSION_NOT_FOUND_MESSAGE.test(message);
}

/** True when a NATS `error` event indicates the active session is gone or expired. */
export function isSessionExpiredNatsError(event: NatsErrorEvent): boolean {
  if (isExpiredResultCode(event.errorCode as number | undefined)) {
    return true;
  }

  if (typeof event.errorCode === 'string') {
    const code = event.errorCode.toUpperCase();
    if (code.includes('SESSION_EXPIRED') || code.includes('SESSION_NOT_FOUND')) {
      return true;
    }
  }

  return isExpiredErrorMessage(event.errorMessage);
}

/** True when a NATS dialog response reports a missing or expired session. */
export function isSessionExpiredNatsResponse(
  event: NatsDialogResponseEvent
): boolean {
  if (isExpiredResultCode(event.resultCode)) {
    return true;
  }

  return isExpiredErrorMessage(event.resultMessage);
}
