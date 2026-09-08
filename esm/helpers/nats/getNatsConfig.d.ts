export interface NatsConfig {
    url: string;
    token: string;
    stream?: string;
    consumer?: string;
    subject?: string;
}
export declare function parseNatsConfig(raw: Record<string, unknown>): NatsConfig;
export declare function getNatsConfig(baseUrl: string, sessionId: string, signal?: AbortSignal): Promise<NatsConfig>;
