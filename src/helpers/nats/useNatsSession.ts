// helpers/nats/useNatsSession.ts - Subscribe to a session's NATS channel.
//
// Opens a W3C WebSocket connection (via `wsconnect`), subscribes to the
// session subject (`sessions.<sessionId>`) and forwards every decoded event to
// `onMessage`. The cleanup (`nc.close()`) is essential: without it, every
// `sessionId` change would leave orphan connections / iterators.
import { useEffect, useRef } from 'react';
import { wsconnect, NatsConnection } from '@nats-io/nats-core';

/**
 * `progress` event: job advancement updates.
 */
export interface NatsProgressEvent {
  eventType: 'progress';
  jobId?: string;
  currentStep?: number;
  finalStep?: number;
  message?: string;
  startingTime?: string;
  correlationID?: string;
}

/**
 * `dialog.text_entered_response` event: same body returned by
 * `POST /memori/v2/EnterTextAsync/{sessionId}` (via NATS).
 */
export interface NatsDialogResponseEvent {
  eventType: 'dialog_text_entered_response';
  requestID?: string;
  resultCode?: number;
  resultMessage?: string;
  currentState?: any;
  correlationID?: string;
}

/**
 * `error` event.
 */
export interface NatsErrorEvent {
  eventType: 'error';
  errorCode?: string | number;
  errorMessage?: string;
  backtrace?: string;
  correlationID?: string;
}

/**
 * Discriminated union of all events received on the session subject.
 */
export type NatsSessionEvent =
  | NatsProgressEvent
  | NatsDialogResponseEvent
  | NatsErrorEvent;

function readString(
  raw: Record<string, unknown>,
  camelKey: string,
  snakeKey: string
): string | undefined {
  const value = raw[camelKey] ?? raw[snakeKey];
  return typeof value === 'string' ? value : undefined;
}

function readNumber(
  raw: Record<string, unknown>,
  camelKey: string,
  snakeKey: string
): number | undefined {
  const value = raw[camelKey] ?? raw[snakeKey];
  return typeof value === 'number' ? value : undefined;
}

/**
 * Normalizes raw NATS payloads (snake_case or camelCase) into typed events.
 */
export function normalizeNatsEvent(raw: Record<string, unknown>): NatsSessionEvent {
  const eventType = (readString(raw, 'eventType', 'event_type') ??
    'unknown') as NatsSessionEvent['eventType'];

  const correlationID =
    readString(raw, 'correlationID', 'correlation_id') ??
    readString(raw, 'correlationId', 'correlation_id');

  if (eventType === 'progress') {
    return {
      eventType: 'progress',
      jobId: readString(raw, 'jobId', 'job_id'),
      currentStep: readNumber(raw, 'currentStep', 'current_step'),
      finalStep: readNumber(raw, 'finalStep', 'final_step'),
      message: typeof raw.message === 'string' ? raw.message : undefined,
      startingTime: readString(raw, 'startingTime', 'starting_time'),
      correlationID,
    };
  }

  if (eventType === 'dialog_text_entered_response') {
    return {
      eventType: 'dialog_text_entered_response',
      requestID:
        typeof raw.requestID === 'string' ? raw.requestID : undefined,
      resultCode:
        typeof raw.resultCode === 'number' ? raw.resultCode : undefined,
      resultMessage:
        typeof raw.resultMessage === 'string' ? raw.resultMessage : undefined,
      currentState: raw.currentState,
      correlationID,
    };
  }

  if (eventType === 'error') {
    return {
      eventType: 'error',
      errorCode: (raw.errorCode ?? raw.error_code) as string | number | undefined,
      errorMessage: readString(raw, 'errorMessage', 'error_message'),
      backtrace: typeof raw.backtrace === 'string' ? raw.backtrace : undefined,
      correlationID,
    };
  }

  return {
    eventType,
    correlationID,
  } as NatsSessionEvent;
}

/**
 * Open a NATS WebSocket connection, subscribe to the session subject and
 * forward decoded events to `onMessage`.
 *
 * `onMessage` is kept in a ref so callers do not need to memoize it: the
 * connection is only (re)opened when `sessionId`, `natsWsUrl` or `natsToken`
 * change.
 *
 * @param sessionId Current session UUID (subscription is skipped when falsy).
 * @param natsWsUrl WebSocket URL of the NATS server.
 * @param natsToken Bearer token for authentication.
 * @param onMessage Callback invoked for each decoded event.
 */
export function useNatsSession(
  sessionId: string | undefined,
  natsWsUrl: string | undefined,
  natsToken: string | undefined,
  onMessage: (event: NatsSessionEvent) => void
) {
  const connRef = useRef<NatsConnection | null>(null);
  const onMessageRef = useRef(onMessage);

  // Keep the latest callback without retriggering the connection effect.
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!sessionId || !natsWsUrl || !natsToken) {
      console.debug(
        '[NATS] subscription skipped (missing sessionId/url/token)',
        { sessionId, hasUrl: !!natsWsUrl, hasToken: !!natsToken }
      );
      return;
    }
    let closed = false;
    const subject = sessionId;

    (async () => {
      console.info('[NATS] connecting to', natsWsUrl, 'for session', sessionId);
      const nc = await wsconnect({
        servers: [natsWsUrl],
        token: natsToken,
      });
      if (closed) {
        console.debug(
          '[NATS] connection established after cleanup, closing immediately'
        );
        await nc.close();
        return;
      }
      connRef.current = nc;
      console.info('[NATS] connected to', nc.getServer());

      const sub = nc.subscribe(subject);
      console.info('[NATS] subscribed to subject', subject);
      let received = 0;
      for await (const msg of sub) {
        received += 1;
        try {
          const payload = normalizeNatsEvent(
            msg.json<Record<string, unknown>>()
          );
          console.debug(
            `[NATS] message #${received} on ${subject} (eventType=${payload.eventType})`,
            payload
          );
          onMessageRef.current(payload);
        } catch (err) {
          console.error('[NATS] message decode error', err);
        }
      }
      console.info(
        `[NATS] subscription on ${subject} closed (received ${received} messages)`
      );
    })().catch(err => console.error('[NATS] connection error', err));

    return () => {
      console.info('[NATS] cleanup: closing connection for subject', subject);
      closed = true;
      connRef.current?.close();
      connRef.current = null;
    };
  }, [sessionId, natsWsUrl, natsToken]);
}
