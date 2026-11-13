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
  /**
   * Reconcile a pending turn from the engine after a resumed or reauthenticated
   * subscription is installed.
   */
  onCatchUp?: () => void | Promise<void>;
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
  onCatchUp,
}: UseNatsOptions) {
  const [config, setConfig] = useState<NatsConfig | null>(null);
  const [configError, setConfigError] = useState<Error | null>(null);

  // Keep callbacks in refs so the dispatcher identity stays stable.
  const onProgressRef = useRef(onProgress);
  const onDialogResponseRef = useRef(onDialogResponse);
  const onErrorRef = useRef(onError);
  const onCatchUpRef = useRef(onCatchUp);
  const abortRef = useRef<AbortController | null>(null);
  const catchUpAfterConnectRef = useRef(false);
  const refreshInFlightRef = useRef(false);
  const lastAuthRefreshRef = useRef(0);
  useEffect(() => {
    onProgressRef.current = onProgress;
    onDialogResponseRef.current = onDialogResponse;
    onErrorRef.current = onError;
    onCatchUpRef.current = onCatchUp;
  }, [onProgress, onDialogResponse, onError, onCatchUp]);

  const refreshConfig = useCallback(
    async (reason: 'initial' | 'resume' | 'auth') => {
      if (!sessionId || refreshInFlightRef.current) return;
      if (reason === 'auth' && Date.now() - lastAuthRefreshRef.current < 5000) {
        return;
      }

      refreshInFlightRef.current = true;
      if (reason === 'auth') lastAuthRefreshRef.current = Date.now();
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      console.info(
        '[NATS] fetching config from',
        `${baseUrl}/api/nats`,
        'for session',
        sessionId,
        `(${reason})`
      );
      try {
        const cfg = await getNatsConfig(baseUrl, sessionId, controller.signal);
        if (!controller.signal.aborted) {
          catchUpAfterConnectRef.current = reason !== 'initial';
          console.info('[NATS] config received', {
            url: cfg.url,
            jetStream: !!cfg.stream,
            stream: cfg.stream,
          });
          setConfig(cfg);
          setConfigError(null);
        }
      } catch (err: any) {
        if (!controller.signal.aborted && err?.name !== 'AbortError') {
          console.error('[NATS] config error', err);
          setConfig(null);
          setConfigError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
          refreshInFlightRef.current = false;
        }
      }
    },
    [baseUrl, sessionId]
  );

  // Fetch connection config whenever the active session changes.
  useEffect(() => {
    if (!sessionId) {
      console.debug('[NATS] no sessionId, skipping config fetch');
      setConfig(null);
      setConfigError(null);
      return;
    }

    void refreshConfig('initial');
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
      refreshInFlightRef.current = false;
    };
  }, [sessionId, refreshConfig]);

  // A suspended browser may lose core NATS messages. Refresh the short-lived
  // JWT, reconnect, then reconcile the pending turn from the engine.
  useEffect(() => {
    if (!sessionId) return;

    const requestResume = () => {
      if (document.visibilityState === 'visible') {
        void refreshConfig('resume');
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') requestResume();
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) requestResume();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('online', requestResume);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('online', requestResume);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [sessionId, refreshConfig]);

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

  const handleConnected = useCallback(() => {
    if (!catchUpAfterConnectRef.current) return;
    catchUpAfterConnectRef.current = false;
    void onCatchUpRef.current?.();
  }, []);

  const handleAuthError = useCallback(
    (error: Error) => {
      console.warn(
        '[NATS] JWT rejected or expired; refreshing credentials',
        error
      );
      void refreshConfig('auth');
    },
    [refreshConfig]
  );

  useNatsSession(sessionId, config ?? undefined, handleMessage, {
    onConnected: handleConnected,
    onAuthError: handleAuthError,
  });

  return {
    /** True once connection config has been retrieved. */
    connected: !!config,
    /** Last config-retrieval error, if any. */
    configError,
  };
}
