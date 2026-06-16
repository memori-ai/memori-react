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
  event_type: 'progress';
  job_id?: string;
  current_step?: number;
  final_step?: number;
  message?: string;
  starting_time?: string;
  /** Correlation field (to be confirmed with backend). */
  correlation_id?: string;
}

/**
 * `dialog.text_entered_response` event: same body returned by
 * `POST /memori/v2/TextEnteredEvent/{sessionId}`.
 */
export interface NatsDialogResponseEvent {
  event_type: 'dialog.text_entered_response';
  requestID?: string;
  resultCode?: number;
  resultMessage?: string;
  currentState?: any;
  /** Correlation field (to be confirmed with backend). */
  correlation_id?: string;
}

/**
 * `error` event.
 */
export interface NatsErrorEvent {
  event_type: 'error';
  error_code?: string | number;
  error_message?: string;
  backtrace?: string;
  /** Correlation field (to be confirmed with backend). */
  correlation_id?: string;
}

/**
 * Discriminated union of all events received on the session subject.
 */
export type NatsSessionEvent =
  | NatsProgressEvent
  | NatsDialogResponseEvent
  | NatsErrorEvent;

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
    const subject = `sessions.${sessionId}`;

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
          const payload = msg.json<NatsSessionEvent>();
          console.debug(
            `[NATS] message #${received} on ${subject} (event_type=${payload.event_type})`,
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
