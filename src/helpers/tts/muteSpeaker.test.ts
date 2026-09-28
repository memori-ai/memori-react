import { isSpeakerEffectivelyMuted, shouldPlayTtsAudio } from './muteSpeaker';

describe('isSpeakerEffectivelyMuted', () => {
  it('mutes when autoStart left the speaker muted even if storage is unset', () => {
    expect(
      isSpeakerEffectivelyMuted({
        defaultEnableAudio: true,
        defaultSpeakerActive: true,
        autoStart: true,
        speakerMuted: true,
        storedMute: undefined,
      })
    ).toBe(true);
  });

  it('mutes when audio is disabled even if storage says unmuted', () => {
    expect(
      isSpeakerEffectivelyMuted({
        defaultEnableAudio: false,
        defaultSpeakerActive: true,
        autoStart: true,
        speakerMuted: false,
        storedMute: false,
      })
    ).toBe(true);
  });

  it('mutes when UI speaker is muted even if storage says unmuted', () => {
    expect(
      isSpeakerEffectivelyMuted({
        defaultEnableAudio: true,
        defaultSpeakerActive: true,
        autoStart: true,
        speakerMuted: true,
        storedMute: false,
      })
    ).toBe(true);
  });

  it('does not mute when the user unmuted and audio is enabled', () => {
    expect(
      isSpeakerEffectivelyMuted({
        defaultEnableAudio: true,
        defaultSpeakerActive: true,
        autoStart: false,
        speakerMuted: false,
        storedMute: false,
      })
    ).toBe(false);
  });
});

describe('shouldPlayTtsAudio', () => {
  it('does not play the autostart greeting when audio is muted', () => {
    expect(
      shouldPlayTtsAudio({
        text: 'Ciao',
        preview: false,
        defaultEnableAudio: true,
        defaultSpeakerActive: true,
        autoStart: true,
        speakerMuted: true,
        storedMute: undefined,
      })
    ).toBe(false);
  });

  it('plays when audio is enabled and the speaker is unmuted', () => {
    expect(
      shouldPlayTtsAudio({
        text: 'Ciao',
        preview: false,
        defaultEnableAudio: true,
        defaultSpeakerActive: true,
        autoStart: false,
        speakerMuted: false,
        storedMute: false,
      })
    ).toBe(true);
  });
});
