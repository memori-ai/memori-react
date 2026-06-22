// helpers/nats/useNatsSession.ts - Subscribe to a session's NATS channel.
//
// Opens a W3C WebSocket connection (via `wsconnect`), then either:
// - core NATS: subscribes to the session subject directly, or
// - JetStream: consumes from the configured stream (ordered consumer by default).
//
// When JetStream is enabled, reconnects on tab visibility / network resume and
// replays the last message per subject to recover events missed while Safari
// (or other browsers) suspend the WebSocket in background.
//
// The cleanup (`consumerMessages.stop()` + `nc.close()`) is essential: without
// it, every `sessionId` change would leave orphan connections / iterators.
import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { wsconnect, NatsConnection } from '@nats-io/nats-core';
import {
  jetstream,
  DeliverPolicy,
  type ConsumerMessages,
} from '@nats-io/jetstream';
import type { NatsConfig } from './getNatsConfig';

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

type JetStreamConsumeMode = 'live' | 'catch-up';

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
 * Unwraps the `currentState` of a `dialog_text_entered_response`.
 *
 * The async (NATS) response wraps the dialog state one level deeper than the
 * synchronous HTTP response: `currentState` is a `ResponseSpec` that *contains*
 * the actual `DialogState` under a nested `currentState` key. We unwrap it so
 * downstream consumers always receive the `DialogState` directly, while still
 * accepting the already-flat shape for backward compatibility.
 */
function unwrapDialogState(value: unknown): unknown {
  if (
    value &&
    typeof value === 'object' &&
    'currentState' in (value as Record<string, unknown>)
  ) {
    return (value as Record<string, unknown>).currentState;
  }
  return value;
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
      currentState: unwrapDialogState(raw.currentState),
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

function decodeMessage(
  subject: string,
  received: number,
  raw: Record<string, unknown>,
  onMessage: (event: NatsSessionEvent) => void
) {
  const payload = normalizeNatsEvent(raw);
  console.debug(
    `[NATS] message #${received} on ${subject} (eventType=${payload.eventType})`,
    payload
  );
  onMessage(payload);
}

async function consumeCoreSubscription(
  nc: NatsConnection,
  subject: string,
  onMessage: (event: NatsSessionEvent) => void
) {
  const sub = nc.subscribe(subject);
  console.info('[NATS] subscribed to subject', subject);
  let received = 0;
  for await (const msg of sub) {
    received += 1;
    try {
      decodeMessage(
        subject,
        received,
        msg.json<Record<string, unknown>>(),
        onMessage
      );
    } catch (err) {
      console.error('[NATS] message decode error', err);
    }
  }
  console.info(
    `[NATS] subscription on ${subject} closed (received ${received} messages)`
  );
}

async function consumeJetStream(
  nc: NatsConnection,
  config: Pick<NatsConfig, 'stream' | 'consumer'>,
  subject: string,
  mode: JetStreamConsumeMode,
  onMessage: (event: NatsSessionEvent) => void,
  setConsumerMessages: (messages: ConsumerMessages) => void
) {
  const js = jetstream(nc);
  const consumer = config.consumer
    ? await js.consumers.get(config.stream!, config.consumer)
    : await js.consumers.get(config.stream!, {
        filter_subjects: [subject],
        deliver_policy:
          mode === 'catch-up'
            ? DeliverPolicy.LastPerSubject
            : DeliverPolicy.New,
      });

  console.info(
    '[NATS] JetStream consumer ready',
    config.consumer
      ? { stream: config.stream, consumer: config.consumer, subject, mode }
      : { stream: config.stream, subject, mode }
  );

  const messages = await consumer.consume();
  setConsumerMessages(messages);
  let received = 0;
  for await (const msg of messages) {
    received += 1;
    try {
      decodeMessage(subject, received, msg.json(), onMessage);
    } catch (err) {
      console.error('[NATS] message decode error', err);
    }
  }
  console.info(
    `[NATS] JetStream consumer on ${subject} closed (received ${received} messages)`
  );
}

function closeNatsSession(
  consumerMessagesRef: MutableRefObject<ConsumerMessages | null>,
  connRef: MutableRefObject<NatsConnection | null>
) {
  consumerMessagesRef.current?.stop();
  consumerMessagesRef.current = null;
  connRef.current?.close();
  connRef.current = null;
}

/**
 * Open a NATS WebSocket connection, subscribe to the session subject and
 * forward decoded events to `onMessage`.
 *
 * `onMessage` is kept in a ref so callers do not need to memoize it: the
 * connection is only (re)opened when `sessionId`, `config` or `resumeGeneration`
 * change.
 *
 * @param sessionId Current session UUID (subscription is skipped when falsy).
 * @param config Connection config from `/api/nats` (url + token required).
 * @param onMessage Callback invoked for each decoded event.
 */
export function useNatsSession(
  sessionId: string | undefined,
  config: NatsConfig | undefined,
  onMessage: (event: NatsSessionEvent) => void
) {
  const connRef = useRef<NatsConnection | null>(null);
  const consumerMessagesRef = useRef<ConsumerMessages | null>(null);
  const onMessageRef = useRef(onMessage);
  const wasHiddenRef = useRef(false);
  const [resumeGeneration, setResumeGeneration] = useState(0);

  // Keep the latest callback without retriggering the connection effect.
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  // Reconnect when the tab returns from background or the network comes back.
  useEffect(() => {
    if (!sessionId || !config?.stream) {
      return;
    }

    const requestResume = () => {
      if (document.visibilityState !== 'visible') {
        return;
      }
      console.info('[NATS] resuming JetStream after visibility/network change');
      setResumeGeneration(generation => generation + 1);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        wasHiddenRef.current = true;
        return;
      }
      if (wasHiddenRef.current) {
        wasHiddenRef.current = false;
        requestResume();
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        requestResume();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('online', requestResume);
    window.addEventListener('pageshow', onPageShow);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('online', requestResume);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [sessionId, config?.stream]);

  useEffect(() => {
    if (!sessionId || !config?.url || !config.token) {
      console.debug(
        '[NATS] subscription skipped (missing sessionId/url/token)',
        {
          sessionId,
          hasUrl: !!config?.url,
          hasToken: !!config?.token,
        }
      );
      return;
    }

    let closed = false;
    const subject = config.subject ?? `sessions.${sessionId}`;
    const useJetStream = !!config.stream;
    const jetStreamMode: JetStreamConsumeMode =
      useJetStream && resumeGeneration > 0 ? 'catch-up' : 'live';

    (async () => {
      console.info(
        '[NATS] connecting to',
        config.url,
        'for session',
        sessionId,
        useJetStream ? `(JetStream/${jetStreamMode})` : '(core)'
      );
      const nc = await wsconnect({
        servers: [config.url],
        token: config.token,
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

      const dispatch = (event: NatsSessionEvent) => {
        onMessageRef.current(event);
      };

      if (useJetStream) {
        await consumeJetStream(
          nc,
          config,
          subject,
          jetStreamMode,
          dispatch,
          messages => {
            consumerMessagesRef.current = messages;
          }
        );
      } else {
        await consumeCoreSubscription(nc, subject, dispatch);
      }
    })().catch(err => console.error('[NATS] connection error', err));

    return () => {
      console.info('[NATS] cleanup: closing connection for subject', subject);
      closed = true;
      closeNatsSession(consumerMessagesRef, connRef);
    };
  }, [sessionId, config, resumeGeneration]);

  // Reset catch-up generation when the active session changes.
  useEffect(() => {
    setResumeGeneration(0);
  }, [sessionId]);
}
