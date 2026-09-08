export type MuteSpeakerOptions = {
    defaultEnableAudio: boolean;
    defaultSpeakerActive: boolean;
    autoStart: boolean;
    speakerMuted: boolean;
    storedMute?: boolean;
};
export declare function getMuteSpeakerFallback(defaultEnableAudio: boolean, defaultSpeakerActive: boolean, autoStart: boolean): boolean;
export declare function isSpeakerEffectivelyMuted({ defaultEnableAudio, defaultSpeakerActive, autoStart, speakerMuted, storedMute, }: MuteSpeakerOptions): boolean;
export declare function shouldPlayTtsAudio({ text, preview, ...muteOptions }: MuteSpeakerOptions & {
    text?: string;
    preview?: boolean;
}): boolean;
