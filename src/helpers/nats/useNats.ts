// helpers/nats/useNats.ts - Orchestrates NATS config retrieval + subscription.
//
// Additive to the existing HTTP flow: text is sent via `postEnterTextAsync`;
// this hook *receives* asynchronous events on the session channel (progress /
// dialog.text_entered_response / error).
import { useEffect, useRef, useState, useCallback } from 'react';
import { getNatsConfig, NatsConfig } from './getNatsConfig';
import {
  useNatsSession,
  NatsSessionEvent,
  NatsProgressEvent,
  NatsDialogResponseEvent,
  NatsErrorEvent,
} from './useNatsSession';

export interface UseNatsOptions {
  /** Same baseUrl used for /api/tts and /api/stt. */
  baseUrl: string;
  /** Current session UUID. Subscription is skipped while undefined. */
  sessionId?: string;
  /** `progress` events (e.g. to feed the typing indicator). */
  onProgress?: (event: NatsProgressEvent) => void;
  /** `dialog.text_entered_response` events (optional live updates). */
  onDialogResponse?: (event: NatsDialogResponseEvent) => void;
  /** `error` events (logging / user notification). */
  onError?: (event: NatsErrorEvent) => void;
}

/**
 * Subscribe to the NATS session channel and dispatch decoded events to the
 * provided callbacks. Config is fetched from `/api/nats`; the subscription
 * lifecycle (cleanup on unmount, reconnect on sessionId change) is handled by
 * `useNatsSession`.
 */
export function useNats({
  baseUrl,
  sessionId,
  onProgress,
  onDialogResponse,
  onError,
}: UseNatsOptions) {
  const [config, setConfig] = useState<NatsConfig | null>(null);
  const [configError, setConfigError] = useState<Error | null>(null);

  // Keep callbacks in refs so the dispatcher identity stays stable.
  const onProgressRef = useRef(onProgress);
  const onDialogResponseRef = useRef(onDialogResponse);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onProgressRef.current = onProgress;
    onDialogResponseRef.current = onDialogResponse;
    onErrorRef.current = onError;
  }, [onProgress, onDialogResponse, onError]);

  // Fetch connection config whenever the active session changes.
  useEffect(() => {
    if (!sessionId) {
      console.debug('[NATS] no sessionId, skipping config fetch');
      setConfig(null);
      setConfigError(null);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    console.info(
      '[NATS] fetching config from',
      `${baseUrl}/api/nats`,
      'for session',
      sessionId
    );
    getNatsConfig(baseUrl, sessionId, controller.signal)
      .then(cfg => {
        if (!cancelled) {
          console.info('[NATS] config received', {
            url: cfg.url,
            jetStream: !!cfg.stream,
            stream: cfg.stream,
          });
          setConfig(cfg);
          setConfigError(null);
        }
      })
      .catch(err => {
        if (!cancelled && err?.name !== 'AbortError') {
          console.error('[NATS] config error', err);
          setConfig(null);
          setConfigError(err instanceof Error ? err : new Error(String(err)));
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [baseUrl, sessionId]);

  const handleMessage = useCallback((event: NatsSessionEvent) => {
    console.debug('[NATS] dispatching event', { eventType: event.eventType });
    switch (event.eventType) {
      case 'progress':
        onProgressRef.current?.(event);
        break;
      case 'dialog_text_entered_response':
        onDialogResponseRef.current?.(event);
        break;
      case 'error':
        onErrorRef.current?.(event);
        break;
      default:
        console.warn('Unknown NATS event', event);
    }
  }, []);

  useNatsSession(sessionId, config ?? undefined, handleMessage);

  return {
    /** True once connection config has been retrieved. */
    connected: !!config,
    /** Last config-retrieval error, if any. */
    configError,
  };
}
