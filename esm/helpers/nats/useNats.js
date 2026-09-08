import { useEffect, useRef, useState, useCallback } from 'react';
import { getNatsConfig } from './getNatsConfig';
import { useNatsSession, } from './useNatsSession';
export function useNats({ baseUrl, sessionId, onProgress, onDialogResponse, onError, onCatchUp, }) {
    const [config, setConfig] = useState(null);
    const [configError, setConfigError] = useState(null);
    const onProgressRef = useRef(onProgress);
    const onDialogResponseRef = useRef(onDialogResponse);
    const onErrorRef = useRef(onError);
    const onCatchUpRef = useRef(onCatchUp);
    const abortRef = useRef(null);
    const catchUpAfterConnectRef = useRef(false);
    const refreshInFlightRef = useRef(false);
    const lastAuthRefreshRef = useRef(0);
    useEffect(() => {
        onProgressRef.current = onProgress;
        onDialogResponseRef.current = onDialogResponse;
        onErrorRef.current = onError;
        onCatchUpRef.current = onCatchUp;
    }, [onProgress, onDialogResponse, onError, onCatchUp]);
    const refreshConfig = useCallback(async (reason) => {
        var _a;
        if (!sessionId || refreshInFlightRef.current)
            return;
        if (reason === 'auth' && Date.now() - lastAuthRefreshRef.current < 5000) {
            return;
        }
        refreshInFlightRef.current = true;
        if (reason === 'auth')
            lastAuthRefreshRef.current = Date.now();
        (_a = abortRef.current) === null || _a === void 0 ? void 0 : _a.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        console.info('[NATS] fetching config from', `${baseUrl}/api/nats`, 'for session', sessionId, `(${reason})`);
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
        }
        catch (err) {
            if (!controller.signal.aborted && (err === null || err === void 0 ? void 0 : err.name) !== 'AbortError') {
                console.error('[NATS] config error', err);
                setConfig(null);
                setConfigError(err instanceof Error ? err : new Error(String(err)));
            }
        }
        finally {
            if (abortRef.current === controller) {
                abortRef.current = null;
                refreshInFlightRef.current = false;
            }
        }
    }, [baseUrl, sessionId]);
    useEffect(() => {
        if (!sessionId) {
            console.debug('[NATS] no sessionId, skipping config fetch');
            setConfig(null);
            setConfigError(null);
            return;
        }
        void refreshConfig('initial');
        return () => {
            var _a;
            (_a = abortRef.current) === null || _a === void 0 ? void 0 : _a.abort();
            abortRef.current = null;
            refreshInFlightRef.current = false;
        };
    }, [sessionId, refreshConfig]);
    useEffect(() => {
        if (!sessionId)
            return;
        const requestResume = () => {
            if (document.visibilityState === 'visible') {
                void refreshConfig('resume');
            }
        };
        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible')
                requestResume();
        };
        const onPageShow = (event) => {
            if (event.persisted)
                requestResume();
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
    const handleMessage = useCallback((event) => {
        var _a, _b, _c;
        console.debug('[NATS] dispatching event', { eventType: event.eventType });
        switch (event.eventType) {
            case 'progress':
                (_a = onProgressRef.current) === null || _a === void 0 ? void 0 : _a.call(onProgressRef, event);
                break;
            case 'dialog_text_entered_response':
                (_b = onDialogResponseRef.current) === null || _b === void 0 ? void 0 : _b.call(onDialogResponseRef, event);
                break;
            case 'error':
                (_c = onErrorRef.current) === null || _c === void 0 ? void 0 : _c.call(onErrorRef, event);
                break;
            default:
                console.warn('Unknown NATS event', event);
        }
    }, []);
    const handleConnected = useCallback(() => {
        var _a;
        if (!catchUpAfterConnectRef.current)
            return;
        catchUpAfterConnectRef.current = false;
        void ((_a = onCatchUpRef.current) === null || _a === void 0 ? void 0 : _a.call(onCatchUpRef));
    }, []);
    const handleAuthError = useCallback((error) => {
        console.warn('[NATS] JWT rejected or expired; refreshing credentials', error);
        void refreshConfig('auth');
    }, [refreshConfig]);
    useNatsSession(sessionId, config !== null && config !== void 0 ? config : undefined, handleMessage, {
        onConnected: handleConnected,
        onAuthError: handleAuthError,
    });
    return {
        connected: !!config,
        configError,
    };
}
//# sourceMappingURL=useNats.js.map