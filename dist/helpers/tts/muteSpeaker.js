"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMuteSpeakerFallback = getMuteSpeakerFallback;
exports.isSpeakerEffectivelyMuted = isSpeakerEffectivelyMuted;
exports.shouldPlayTtsAudio = shouldPlayTtsAudio;
function getMuteSpeakerFallback(defaultEnableAudio, defaultSpeakerActive, autoStart) {
    return !defaultEnableAudio || !defaultSpeakerActive || autoStart;
}
function isSpeakerEffectivelyMuted({ defaultEnableAudio, defaultSpeakerActive, autoStart, speakerMuted, storedMute, }) {
    if (!defaultEnableAudio)
        return true;
    if (speakerMuted)
        return true;
    if (storedMute === true)
        return true;
    if (storedMute === false)
        return false;
    return getMuteSpeakerFallback(defaultEnableAudio, defaultSpeakerActive, autoStart);
}
function shouldPlayTtsAudio({ text, preview = false, ...muteOptions }) {
    return !!(text &&
        text.trim() &&
        !preview &&
        !isSpeakerEffectivelyMuted(muteOptions));
}
//# sourceMappingURL=muteSpeaker.js.map