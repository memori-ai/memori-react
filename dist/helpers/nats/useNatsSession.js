"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNatsSession = exports.normalizeNatsEvent = exports.isNatsAuthError = void 0;
const react_1 = require("react");
const nats_core_1 = require("@nats-io/nats-core");
const jetstream_1 = require("@nats-io/jetstream");
function isNatsAuthError(error) {
    return (error instanceof nats_core_1.AuthorizationError ||
        error instanceof nats_core_1.UserAuthenticationExpiredError ||
        (error instanceof Error &&
            /authorization violation|authentication expired|user authentication expired/i.test(error.message)));
}
exports.isNatsAuthError = isNatsAuthError;
function readString(raw, camelKey, snakeKey) {
    var _a;
    const value = (_a = raw[camelKey]) !== null && _a !== void 0 ? _a : raw[snakeKey];
    return typeof value === 'string' ? value : undefined;
}
function readNumber(raw, camelKey, snakeKey) {
    var _a;
    const value = (_a = raw[camelKey]) !== null && _a !== void 0 ? _a : raw[snakeKey];
    return typeof value === 'number' ? value : undefined;
}
function unwrapDialogState(value) {
    if (value &&
        typeof value === 'object' &&
        'currentState' in value) {
        return value.currentState;
    }
    return value;
}
function normalizeNatsEvent(raw) {
    var _a, _b, _c;
    const eventType = ((_a = readString(raw, 'eventType', 'event_type')) !== null && _a !== void 0 ? _a : 'unknown');
    const correlationID = (_b = readString(raw, 'correlationID', 'correlation_id')) !== null && _b !== void 0 ? _b : readString(raw, 'correlationId', 'correlation_id');
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
            requestID: typeof raw.requestID === 'string' ? raw.requestID : undefined,
            resultCode: typeof raw.resultCode === 'number' ? raw.resultCode : undefined,
            resultMessage: typeof raw.resultMessage === 'string' ? raw.resultMessage : undefined,
            currentState: unwrapDialogState(raw.currentState),
            correlationID,
        };
    }
    if (eventType === 'error') {
        return {
            eventType: 'error',
            errorCode: ((_c = raw.errorCode) !== null && _c !== void 0 ? _c : raw.error_code),
            errorMessage: readString(raw, 'errorMessage', 'error_message'),
            backtrace: typeof raw.backtrace === 'string' ? raw.backtrace : undefined,
            correlationID,
        };
    }
    return {
        eventType,
        correlationID,
    };
}
exports.normalizeNatsEvent = normalizeNatsEvent;
function decodeMessage(subject, received, raw, onMessage) {
    const payload = normalizeNatsEvent(raw);
    console.debug(`[NATS] message #${received} on ${subject} (eventType=${payload.eventType})`, payload);
    onMessage(payload);
}
async function consumeCoreSubscription(nc, subject, onMessage, onReady) {
    const sub = nc.subscribe(subject);
    console.info('[NATS] subscribed to subject', subject);
    onReady();
    let received = 0;
    for await (const msg of sub) {
        received += 1;
        try {
            decodeMessage(subject, received, msg.json(), onMessage);
        }
        catch (err) {
            console.error('[NATS] message decode error', err);
        }
    }
    console.info(`[NATS] subscription on ${subject} closed (received ${received} messages)`);
}
async function consumeJetStream(nc, config, subject, mode, onMessage, setConsumerMessages, onReady) {
    const js = (0, jetstream_1.jetstream)(nc);
    const consumer = config.consumer
        ? await js.consumers.get(config.stream, config.consumer)
        : await js.consumers.get(config.stream, {
            filter_subjects: [subject],
            deliver_policy: mode === 'catch-up'
                ? jetstream_1.DeliverPolicy.LastPerSubject
                : jetstream_1.DeliverPolicy.New,
        });
    console.info('[NATS] JetStream consumer ready', config.consumer
        ? { stream: config.stream, consumer: config.consumer, subject, mode }
        : { stream: config.stream, subject, mode });
    const messages = await consumer.consume();
    setConsumerMessages(messages);
    onReady();
    let received = 0;
    for await (const msg of messages) {
        received += 1;
        try {
            decodeMessage(subject, received, msg.json(), onMessage);
        }
        catch (err) {
            console.error('[NATS] message decode error', err);
        }
    }
    console.info(`[NATS] JetStream consumer on ${subject} closed (received ${received} messages)`);
}
function closeNatsSession(consumerMessagesRef, connRef) {
    var _a, _b;
    (_a = consumerMessagesRef.current) === null || _a === void 0 ? void 0 : _a.stop();
    consumerMessagesRef.current = null;
    (_b = connRef.current) === null || _b === void 0 ? void 0 : _b.close();
    connRef.current = null;
}
function useNatsSession(sessionId, config, onMessage, lifecycle = {}) {
    const connRef = (0, react_1.useRef)(null);
    const consumerMessagesRef = (0, react_1.useRef)(null);
    const onMessageRef = (0, react_1.useRef)(onMessage);
    const lifecycleRef = (0, react_1.useRef)(lifecycle);
    const wasHiddenRef = (0, react_1.useRef)(false);
    const [resumeGeneration, setResumeGeneration] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);
    (0, react_1.useEffect)(() => {
        lifecycleRef.current = lifecycle;
    }, [lifecycle]);
    (0, react_1.useEffect)(() => {
        if (!sessionId || !(config === null || config === void 0 ? void 0 : config.stream)) {
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
        const onPageShow = (event) => {
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
    }, [sessionId, config === null || config === void 0 ? void 0 : config.stream]);
    (0, react_1.useEffect)(() => {
        var _a;
        if (!sessionId || !(config === null || config === void 0 ? void 0 : config.url) || !config.token) {
            console.debug('[NATS] subscription skipped (missing sessionId/url/token)', {
                sessionId,
                hasUrl: !!(config === null || config === void 0 ? void 0 : config.url),
                hasToken: !!(config === null || config === void 0 ? void 0 : config.token),
            });
            return;
        }
        let closed = false;
        const subject = (_a = config.subject) !== null && _a !== void 0 ? _a : `sessions.${sessionId}`;
        const useJetStream = !!config.stream;
        const jetStreamMode = useJetStream && resumeGeneration > 0 ? 'catch-up' : 'live';
        (async () => {
            console.info('[NATS] connecting to', config.url, 'for session', sessionId, useJetStream ? `(JetStream/${jetStreamMode})` : '(core)');
            const nc = await (0, nats_core_1.wsconnect)({
                servers: [config.url],
                authenticator: (0, nats_core_1.jwtAuthenticator)(config.token),
            });
            if (closed) {
                console.debug('[NATS] connection established after cleanup, closing immediately');
                await nc.close();
                return;
            }
            connRef.current = nc;
            console.info('[NATS] connected to', nc.getServer());
            const dispatch = (event) => {
                onMessageRef.current(event);
            };
            const ready = () => { var _a, _b; return (_b = (_a = lifecycleRef.current).onConnected) === null || _b === void 0 ? void 0 : _b.call(_a); };
            let authRefreshRequested = false;
            const requestAuthRefresh = (error) => {
                var _a, _b;
                if (closed || authRefreshRequested)
                    return;
                authRefreshRequested = true;
                (_b = (_a = lifecycleRef.current).onAuthError) === null || _b === void 0 ? void 0 : _b.call(_a, error);
            };
            void (async () => {
                for await (const status of nc.status()) {
                    if (status.type === 'error' && isNatsAuthError(status.error)) {
                        requestAuthRefresh(status.error);
                        return;
                    }
                }
            })();
            void nc.closed().then(error => {
                if (error && isNatsAuthError(error)) {
                    requestAuthRefresh(error);
                }
            });
            if (useJetStream) {
                await consumeJetStream(nc, config, subject, jetStreamMode, dispatch, messages => {
                    consumerMessagesRef.current = messages;
                }, ready);
            }
            else {
                await consumeCoreSubscription(nc, subject, dispatch, ready);
            }
        })().catch(err => {
            var _a, _b;
            console.error('[NATS] connection error', err);
            if (!closed && isNatsAuthError(err)) {
                (_b = (_a = lifecycleRef.current).onAuthError) === null || _b === void 0 ? void 0 : _b.call(_a, err);
            }
        });
        return () => {
            console.info('[NATS] cleanup: closing connection for subject', subject);
            closed = true;
            closeNatsSession(consumerMessagesRef, connRef);
        };
    }, [sessionId, config, resumeGeneration]);
    (0, react_1.useEffect)(() => {
        setResumeGeneration(0);
    }, [sessionId]);
}
exports.useNatsSession = useNatsSession;
//# sourceMappingURL=useNatsSession.js.map