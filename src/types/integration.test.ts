import {
  is3dAvatarWithUrl,
  usesRpmAvatarView,
} from './integration';

describe('integration avatar helpers', () => {
  const avatarURL = 'https://example.com/avatar.glb';

  describe('is3dAvatarWithUrl', () => {
    it('returns true for avatar-configurator with avatarURL', () => {
      expect(is3dAvatarWithUrl('avatar-configurator', avatarURL)).toBe(true);
    });

    it('returns false for avatar-configurator without avatarURL', () => {
      expect(is3dAvatarWithUrl('avatar-configurator', undefined)).toBe(false);
    });
  });

  describe('usesRpmAvatarView', () => {
    it('returns true for avatar-configurator', () => {
      expect(usesRpmAvatarView('avatar-configurator')).toBe(true);
    });

    it('returns true for readyplayerme-full', () => {
      expect(usesRpmAvatarView('readyplayerme-full')).toBe(true);
    });

    it('returns false for customglb', () => {
      expect(usesRpmAvatarView('customglb')).toBe(false);
    });
  });
});
