export type MuteSpeakerOptions = {
  defaultEnableAudio: boolean;
  defaultSpeakerActive: boolean;
  autoStart: boolean;
  speakerMuted: boolean;
  storedMute?: boolean;
};

export function getMuteSpeakerFallback(
  defaultEnableAudio: boolean,
  defaultSpeakerActive: boolean,
  autoStart: boolean
): boolean {
  return !defaultEnableAudio || !defaultSpeakerActive || autoStart;
}

export function isSpeakerEffectivelyMuted({
  defaultEnableAudio,
  defaultSpeakerActive,
  autoStart,
  speakerMuted,
  storedMute,
}: MuteSpeakerOptions): boolean {
  if (!defaultEnableAudio) return true;
  if (speakerMuted) return true;
  if (storedMute === true) return true;
  if (storedMute === false) return false;
  return getMuteSpeakerFallback(
    defaultEnableAudio,
    defaultSpeakerActive,
    autoStart
  );
}

export function shouldPlayTtsAudio({
  text,
  preview = false,
  ...muteOptions
}: MuteSpeakerOptions & { text?: string; preview?: boolean }): boolean {
  return !!(
    text &&
    text.trim() &&
    !preview &&
    !isSpeakerEffectivelyMuted(muteOptions)
  );
}
