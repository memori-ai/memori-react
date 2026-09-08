import type { NatsDialogResponseEvent, NatsErrorEvent } from './useNatsSession';
export declare function isSessionExpiredNatsError(event: NatsErrorEvent): boolean;
export declare function isSessionExpiredNatsResponse(event: NatsDialogResponseEvent): boolean;
