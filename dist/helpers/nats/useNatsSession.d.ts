import type { NatsConfig } from './getNatsConfig';
export interface NatsProgressEvent {
    eventType: 'progress';
    jobId?: string;
    currentStep?: number;
    finalStep?: number;
    message?: string;
    startingTime?: string;
    correlationID?: string;
}
export interface NatsDialogResponseEvent {
    eventType: 'dialog_text_entered_response';
    requestID?: string;
    resultCode?: number;
    resultMessage?: string;
    currentState?: any;
    correlationID?: string;
}
export interface NatsErrorEvent {
    eventType: 'error';
    errorCode?: string | number;
    errorMessage?: string;
    backtrace?: string;
    correlationID?: string;
}
export type NatsSessionEvent = NatsProgressEvent | NatsDialogResponseEvent | NatsErrorEvent;
export interface NatsSessionLifecycle {
    onConnected?: () => void;
    onAuthError?: (error: Error) => void;
}
export declare function isNatsAuthError(error: unknown): error is Error;
export declare function normalizeNatsEvent(raw: Record<string, unknown>): NatsSessionEvent;
export declare function useNatsSession(sessionId: string | undefined, config: NatsConfig | undefined, onMessage: (event: NatsSessionEvent) => void, lifecycle?: NatsSessionLifecycle): void;
