"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNats = void 0;
const react_1 = require("react");
const getNatsConfig_1 = require("./getNatsConfig");
const useNatsSession_1 = require("./useNatsSession");
function useNats({ baseUrl, sessionId, onProgress, onDialogResponse, onError, onCatchUp, }) {
    const [config, setConfig] = (0, react_1.useState)(null);
    const [configError, setConfigError] = (0, react_1.useState)(null);
    const onProgressRef = (0, react_1.useRef)(onProgress);
    const onDialogResponseRef = (0, react_1.useRef)(onDialogResponse);
    const onErrorRef = (0, react_1.useRef)(onError);
    const onCatchUpRef = (0, react_1.useRef)(onCatchUp);
    const abortRef = (0, react_1.useRef)(null);
    const catchUpAfterConnectRef = (0, react_1.useRef)(false);
    const refreshInFlightRef = (0, react_1.useRef)(false);
    const lastAuthRefreshRef = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => {
        onProgressRef.current = onProgress;
        onDialogResponseRef.current = onDialogResponse;
        onErrorRef.current = onError;
        onCatchUpRef.current = onCatchUp;
    }, [onProgress, onDialogResponse, onError, onCatchUp]);
    const refreshConfig = (0, react_1.useCallback)(async (reason) => {
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
            const cfg = await (0, getNatsConfig_1.getNatsConfig)(baseUrl, sessionId, controller.signal);
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
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
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
    const handleMessage = (0, react_1.useCallback)((event) => {
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
    const handleConnected = (0, react_1.useCallback)(() => {
        var _a;
        if (!catchUpAfterConnectRef.current)
            return;
        catchUpAfterConnectRef.current = false;
        void ((_a = onCatchUpRef.current) === null || _a === void 0 ? void 0 : _a.call(onCatchUpRef));
    }, []);
    const handleAuthError = (0, react_1.useCallback)((error) => {
        console.warn('[NATS] JWT rejected or expired; refreshing credentials', error);
        void refreshConfig('auth');
    }, [refreshConfig]);
    (0, useNatsSession_1.useNatsSession)(sessionId, config !== null && config !== void 0 ? config : undefined, handleMessage, {
        onConnected: handleConnected,
        onAuthError: handleAuthError,
    });
    return {
        connected: !!config,
        configError,
    };
}
exports.useNats = useNats;
//# sourceMappingURL=useNats.js.map