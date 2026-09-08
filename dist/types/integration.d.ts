export type AvatarMode = 'readyplayerme' | 'readyplayerme-full' | 'customglb' | 'customrpm' | 'userAvatar' | 'avatar-configurator';
export declare const is3dAvatarWithUrl: (avatar: AvatarMode | string | undefined, avatarURL: string | undefined) => boolean;
export declare const usesRpmAvatarView: (avatar: AvatarMode | string | undefined) => boolean;
