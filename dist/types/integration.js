"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usesRpmAvatarView = exports.is3dAvatarWithUrl = void 0;
const is3dAvatarWithUrl = (avatar, avatarURL) => !!avatarURL &&
    (avatar === 'readyplayerme' ||
        avatar === 'readyplayerme-full' ||
        avatar === 'customglb' ||
        avatar === 'customrpm' ||
        avatar === 'avatar-configurator');
exports.is3dAvatarWithUrl = is3dAvatarWithUrl;
const usesRpmAvatarView = (avatar) => avatar === 'readyplayerme' ||
    avatar === 'readyplayerme-full' ||
    avatar === 'customrpm' ||
    avatar === 'avatar-configurator';
exports.usesRpmAvatarView = usesRpmAvatarView;
//# sourceMappingURL=integration.js.map