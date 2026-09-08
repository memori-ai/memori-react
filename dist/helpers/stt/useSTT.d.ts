/// <reference types="react" />
export interface STTConfig {
    provider: 'azure' | 'openai';
    language?: string;
    model?: string;
    region?: string;
    tenant?: string;
}
export interface STTResult {
    text: string;
    confidence?: number;
    language?: string;
    duration?: number;
}
export interface UseSTTOptions {
    apiUrl?: string;
    onTranscriptionComplete?: (result: STTResult) => void;
    onError?: (error: Error) => void;
}
export type RecordingState = 'idle' | 'recording' | 'processing' | 'error';
export declare function useSTT(config: STTConfig, processSpeechAndSendMessage: (text: string) => void, options?: UseSTTOptions, defaultEnableAudio?: boolean): {
    recordingState: RecordingState;
    microphoneMuted: boolean;
    hasUserActivatedRecord: boolean;
    lastTranscription: STTResult | null;
    isListening: boolean;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    toggleRecording: () => Promise<void>;
    toggleMute: (mute?: boolean) => void;
    transcribeAudio: (audioBlob: Blob) => Promise<STTResult>;
    setHasUserActivatedRecord: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    cleanup: () => void;
};
