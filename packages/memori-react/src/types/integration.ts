/**
 * Avatar mode stored in integration.customData.avatar.
 * `avatar-configurator` is used in admin/editor UI; at runtime it renders like `readyplayerme-full`.
 */
export type AvatarMode =
  | 'readyplayerme'
  | 'readyplayerme-full'
  | 'customglb'
  | 'customrpm'
  | 'userAvatar'
  | 'avatar-configurator';

export const is3dAvatarWithUrl = (
  avatar: AvatarMode | string | undefined,
  avatarURL: string | undefined
): boolean =>
  !!avatarURL &&
  (avatar === 'readyplayerme' ||
    avatar === 'readyplayerme-full' ||
    avatar === 'customglb' ||
    avatar === 'customrpm' ||
    avatar === 'avatar-configurator');

/** RPM-based 3D avatar view (ContainerAvatarView), including avatar-configurator exports. */
export const usesRpmAvatarView = (
  avatar: AvatarMode | string | undefined
): boolean =>
  avatar === 'readyplayerme' ||
  avatar === 'readyplayerme-full' ||
  avatar === 'customrpm' ||
  avatar === 'avatar-configurator';
