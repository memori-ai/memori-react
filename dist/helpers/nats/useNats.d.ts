import { NatsProgressEvent, NatsDialogResponseEvent, NatsErrorEvent } from './useNatsSession';
export interface UseNatsOptions {
    baseUrl: string;
    sessionId?: string;
    onProgress?: (event: NatsProgressEvent) => void;
    onDialogResponse?: (event: NatsDialogResponseEvent) => void;
    onError?: (event: NatsErrorEvent) => void;
    onCatchUp?: () => void | Promise<void>;
}
export declare function useNats({ baseUrl, sessionId, onProgress, onDialogResponse, onError, onCatchUp, }: UseNatsOptions): {
    connected: boolean;
    configError: Error | null;
};
