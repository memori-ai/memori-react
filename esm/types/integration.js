export const is3dAvatarWithUrl = (avatar, avatarURL) => !!avatarURL &&
    (avatar === 'readyplayerme' ||
        avatar === 'readyplayerme-full' ||
        avatar === 'customglb' ||
        avatar === 'customrpm' ||
        avatar === 'avatar-configurator');
export const usesRpmAvatarView = (avatar) => avatar === 'readyplayerme' ||
    avatar === 'readyplayerme-full' ||
    avatar === 'customrpm' ||
    avatar === 'avatar-configurator';
//# sourceMappingURL=integration.js.map