function readStringField(raw, ...keys) {
    for (const key of keys) {
        const value = raw[key];
        if (typeof value === 'string' && value.length > 0) {
            return value;
        }
    }
    return undefined;
}
function readBooleanField(raw, ...keys) {
    for (const key of keys) {
        const value = raw[key];
        if (typeof value === 'boolean') {
            return value;
        }
    }
    return undefined;
}
export function parseNatsConfig(raw) {
    const url = readStringField(raw, 'url');
    const token = readStringField(raw, 'token');
    if (!url || !token) {
        throw new Error('Invalid response from NATS config service');
    }
    const useJetStream = readBooleanField(raw, 'useJetStream', 'use_jetstream');
    const stream = readStringField(raw, 'stream', 'streamName', 'stream_name');
    const consumer = readStringField(raw, 'consumer', 'consumerName', 'consumer_name', 'durableName', 'durable_name');
    const subject = readStringField(raw, 'subject', 'filterSubject', 'filter_subject');
    if (useJetStream && !stream) {
        throw new Error('Invalid response from NATS config service: JetStream enabled but stream missing');
    }
    return {
        url,
        token,
        ...(stream ? { stream } : {}),
        ...(consumer ? { consumer } : {}),
        ...(subject ? { subject } : {}),
    };
}
export async function getNatsConfig(baseUrl, sessionId, signal) {
    if (!sessionId) {
        throw new Error('Missing sessionId for NATS config request');
    }
    const response = await fetch(`${baseUrl}/api/nats?sessionId=${encodeURIComponent(sessionId)}`, { signal });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        switch (response.status) {
            case 400:
                throw new Error(errorData.error || 'NATS config error: missing sessionId');
            case 404:
                throw new Error(errorData.error || 'NATS config error: invalid session');
            case 500:
                throw new Error(errorData.error || 'NATS config error: NATS configuration missing');
            default:
                throw new Error(errorData.error || `NATS config error: ${response.status}`);
        }
    }
    const data = (await response.json());
    return parseNatsConfig(data);
}
//# sourceMappingURL=getNatsConfig.js.map