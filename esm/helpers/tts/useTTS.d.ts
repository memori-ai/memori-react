/// <reference types="react" />
export interface TTSConfig {
    provider: 'azure' | 'openai';
    voice?: string;
    model?: string;
    region?: string;
    tenant?: string;
    layout?: 'DEFAULT' | 'ZOOMED_FULL_BODY' | 'FULLPAGE' | 'TOTEM';
}
export interface UseTTSOptions {
    apiUrl?: string;
    continuousSpeech?: boolean;
    onEndSpeakStartListen?: () => void;
    preview?: boolean;
    disableSpeaker?: boolean;
}
export declare function useTTS(config: TTSConfig, options?: UseTTSOptions, autoStart?: boolean, defaultEnableAudio?: boolean, defaultSpeakerActive?: boolean): {
    speak: (text: string) => Promise<void>;
    stop: () => void;
    isPlaying: boolean;
    speakerMuted: boolean;
    toggleMute: (mute?: boolean) => void;
    hasUserActivatedSpeak: boolean;
    setHasUserActivatedSpeak: import("react").Dispatch<import("react").SetStateAction<boolean>>;
};
