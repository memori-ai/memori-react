import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import MapMarker from '../icons/MapMarker';
import SoundDeactivated from '../icons/SoundDeactivated';
import Sound from '../icons/Sound';
import { useTranslation } from 'react-i18next';
import Setting from '../icons/Setting';
import ShareButton from '../ShareButton/ShareButton';
import FullscreenExit from '../icons/FullscreenExit';
import Fullscreen from '../icons/Fullscreen';
import Refresh from '../icons/Refresh';
import Clear from '../icons/Clear';
import DeepThought from '../icons/DeepThought';
import Group from '../icons/Group';
import UserIcon from '../icons/User';
import MessageIcon from '../icons/Message';
import Logout from '../icons/Logout';
import { getErrori18nKey } from '../../helpers/error';
import toast from 'react-hot-toast';
import ChatConsumptionDropdown from './ChatConsumptionDropdown';
const imgMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
const Header = ({ className, memori, tenant, history, position, setShowPositionDrawer, setShowSettingsDrawer, setShowChatHistoryDrawer, setShowKnownFactsDrawer, setShowExpertsDrawer, enableAudio = true, speakerMuted, setSpeakerMuted, hasUserActivatedSpeak = false, showShare = true, showSettings = true, showReload = false, showClear = false, showLogin = true, setShowLoginDrawer, clearHistory, loginToken, user, sessionID, showChatHistory = true, fullScreenHandler, baseUrl, onLogout, apiClient, layout, additionalSettings, showMessageConsumption = false, }) => {
    const { t, i18n } = useTranslation();
    const { uploadAsset, pwlUpdateUser } = apiClient.backend;
    const [fullScreenAvailable, setFullScreenAvailable] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    useEffect(() => {
        if (document.fullscreenEnabled) {
            setFullScreenAvailable(true);
        }
    }, []);
    const hasSettingsContent = useCallback((layout, additionalSettings) => {
        return (layout === 'TOTEM' ||
            (additionalSettings && Object.keys(additionalSettings).length > 0) || false);
    }, [layout, additionalSettings]);
    const hasSpacedButtons = layout === 'FULLPAGE' ||
        layout === 'CHAT' ||
        layout === 'ZOOMED_FULL_BODY';
    const updateAvatar = async (avatar) => {
        if (avatar && loginToken) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                var _a, _b, _c;
                try {
                    const { asset: avatarAsset, ...resp } = await uploadAsset((_a = avatar.name) !== null && _a !== void 0 ? _a : 'avatar', (_b = e.target) === null || _b === void 0 ? void 0 : _b.result, loginToken !== null && loginToken !== void 0 ? loginToken : '');
                    if (resp.resultCode !== 0) {
                        console.error('[updateAvatar] Upload failed:', resp);
                        toast.error(t(getErrori18nKey(resp.resultCode)));
                    }
                    else if (avatarAsset) {
                        let newUser = {
                            userID: user === null || user === void 0 ? void 0 : user.userID,
                            avatarURL: avatarAsset.assetURL,
                        };
                        const { user: patchedUser, ...resp } = await pwlUpdateUser(loginToken !== null && loginToken !== void 0 ? loginToken : '', (_c = user === null || user === void 0 ? void 0 : user.userID) !== null && _c !== void 0 ? _c : '', newUser);
                    }
                }
                catch (e) {
                    let err = e;
                    console.error('[updateAvatar] Error:', err);
                    if (err === null || err === void 0 ? void 0 : err.message)
                        toast.error(err.message);
                }
            };
            reader.readAsDataURL(avatar);
        }
        else {
            console.error('[updateAvatar] Missing avatar or login token', {
                avatar,
                loginToken,
            });
            toast.error(t('login.avatarUploadError'));
        }
    };
    return (_jsxs("div", { className: cx('memori-header', hasSpacedButtons && 'memori-header--spaced', className), children: [memori.needsPosition && position && (_jsxs("div", { className: "memori-header--position", children: [position.latitude !== 0 && position.longitude !== 0 && (_jsx("span", { className: "memori-header--position-placeName", children: position.placeName })), _jsx(Button, { primary: true, shape: "circle", className: cx('memori-header--button', 'memori-header--button--position', hasSpacedButtons && 'memori-header--button-spaced'), title: t('widget.position') || 'Position', icon: _jsx(MapMarker, {}), onClick: () => setShowPositionDrawer(true) })] })), showReload && (_jsx(Button, { primary: true, shape: "circle", className: cx('memori-header--button', 'memori-header--button--reload', hasSpacedButtons && 'memori-header--button-spaced'), title: t('reload') || 'Reload', icon: _jsx(Refresh, {}), onClick: () => {
                    window.location.reload();
                } })), showClear && (_jsx(Button, { primary: true, shape: "circle", className: cx('memori-header--button', 'memori-header--button--clear', hasSpacedButtons && 'memori-header--button-spaced'), title: t('clearHistory') || 'Clear chat', icon: _jsx(Clear, {}), onClick: clearHistory })), showChatHistory && !!loginToken && (_jsx(Button, { primary: true, disabled: !loginToken, shape: "circle", className: cx('memori-header--button', 'memori-header--button--chat-history', hasSpacedButtons && 'memori-header--button-spaced'), title: t('write_and_speak.chatHistory') || 'Chat history', icon: _jsx(MessageIcon, {}), onClick: () => setShowChatHistoryDrawer(true) })), showMessageConsumption && (_jsx(ChatConsumptionDropdown, { history: history, hasSpacedButtons: hasSpacedButtons })), fullScreenAvailable && (_jsx(Button, { primary: true, shape: "circle", className: cx('memori-header--button', 'memori-header--button--fullscreen', hasSpacedButtons && 'memori-header--button-spaced'), title: fullScreen
                    ? t('fullscreenExit') || 'Exit fullscreen'
                    : t('fullscreenEnter') || 'Enter fullscreen', icon: fullScreen ? _jsx(FullscreenExit, {}) : _jsx(Fullscreen, {}), onClick: fullScreenHandler ||
                    (() => {
                        if (!document.fullscreenElement) {
                            const body = layout !== 'HIDDEN_CHAT' && layout !== 'WEBSITE_ASSISTANT'
                                ? document.body
                                : document.querySelector('.memori-widget');
                            if (body) {
                                const memoriReact = document.querySelector('.memori-widget');
                                if (memoriReact) {
                                    memoriReact.style.backgroundColor =
                                        '#FFFFFF';
                                }
                                body
                                    .requestFullscreen()
                                    .then(() => setFullScreen(true))
                                    .catch(err => {
                                    console.warn('Error attempting to enable fullscreen:', err);
                                });
                            }
                        }
                        else {
                            if (document.exitFullscreen) {
                                document
                                    .exitFullscreen()
                                    .then(() => setFullScreen(false))
                                    .catch(err => {
                                    console.warn('Error attempting to exit fullscreen:', err);
                                });
                            }
                        }
                    }) })), memori.enableDeepThought && !!loginToken && (user === null || user === void 0 ? void 0 : user.pAndCUAccepted) && (_jsx(Button, { primary: !!sessionID && !!hasUserActivatedSpeak, shape: "circle", icon: _jsx(DeepThought, {}), className: cx('memori-header--button', 'memori-header--button--knownfacts', hasSpacedButtons && 'memori-header--button-spaced'), disabled: !hasUserActivatedSpeak || !sessionID, onClick: () => setShowKnownFactsDrawer(true), title: t('knownFacts.title') || 'Known facts' })), memori.enableBoardOfExperts && (_jsx(Button, { primary: true, shape: "circle", icon: _jsx(Group, {}), className: cx('memori-header--button', 'memori-header--button--experts', hasSpacedButtons && 'memori-header--button-spaced'), disabled: !hasUserActivatedSpeak || !sessionID, onClick: () => setShowExpertsDrawer(true), title: t('widget.showExpertsInTheBoard') || 'Experts in this board' })), enableAudio && (_jsx(Button, { primary: true, shape: "circle", className: cx('memori-header--button', 'memori-header--button--speaker', hasSpacedButtons && 'memori-header--button-spaced', { 'memori-header--button--speaker-muted': speakerMuted }), icon: speakerMuted ? _jsx(SoundDeactivated, {}) : _jsx(Sound, {}), onClick: () => setSpeakerMuted(!speakerMuted), title: t('widget.sound') || 'Sound' })), showSettings &&
                hasSettingsContent(layout, additionalSettings) && (_jsx(Button, { primary: true, shape: "circle", className: cx('memori-header--button', 'memori-header--button-settings', hasSpacedButtons && 'memori-header--button-spaced'), icon: _jsx(Setting, {}), onClick: () => setShowSettingsDrawer(true), title: t('widget.settings') || 'Settings' })), showShare && (_jsx(ShareButton, { className: cx('memori-header--button', 'memori-header--button-share', hasSpacedButtons && 'memori-header--button-spaced'), title: memori.name, memori: memori, sessionID: sessionID, tenant: tenant, showQrCode: true, align: "left", baseUrl: baseUrl, history: history })), showLogin && (_jsx(_Fragment, { children: loginToken && user ? (_jsxs(Dropdown, { placement: "bottom-right", trigger: _jsx(Button, { primary: true, shape: "circle", className: cx('memori-header--button', 'memori-header--button-login', hasSpacedButtons && 'memori-header--button-spaced'), icon: _jsx(UserIcon, {}), title: t('login.user') || 'User' }), children: [_jsx("div", { className: "memori-dropdown--user-profile", children: _jsxs("div", { className: "memori-dropdown--user-info", children: [user.avatarURL ? (_jsxs(_Fragment, { children: [_jsx("img", { src: user.avatarURL, alt: user.userName || user.eMail, className: "memori-dropdown--avatar" }), _jsx("input", { type: "file", name: "avatar", id: "avatar", className: "memori-dropdown--avatar-input", onChange: e => {
                                                    var _a, _b;
                                                    return updateAvatar((_b = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null);
                                                }, accept: imgMimeTypes.join(', ') })] })) : (_jsxs("div", { className: "memori-dropdown--avatar-placeholder", children: [_jsx("span", { children: (user.userName || user.eMail || 'U')
                                                    .charAt(0)
                                                    .toUpperCase() }), _jsx("input", { type: "file", name: "avatar", id: "avatar", className: "memori-dropdown--avatar-input", onChange: e => {
                                                    var _a, _b;
                                                    return updateAvatar((_b = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null);
                                                }, accept: imgMimeTypes.join(', ') })] })), _jsxs("div", { className: "memori-dropdown--user-details", children: [_jsx("h3", { className: "memori-dropdown--user-name", children: user.userName || t('login.welcomeUser') }), _jsx("p", { className: "memori-dropdown--user-email", children: user.eMail }), _jsx("div", { className: "memori-dropdown--user-badge", children: user.birthDate
                                                    ? new Date(user.birthDate).toLocaleDateString()
                                                    : t('login.notSet') })] })] }) }), _jsx("div", { className: "memori-dropdown--actions", children: _jsxs("button", { className: "memori-dropdown--action-button memori-dropdown--action-button--logout", onClick: onLogout, children: [_jsx(Logout, { className: "memori-dropdown--action-icon" }), t('login.logout') || 'Logout'] }) })] })) : (_jsx(Button, { primary: true, shape: "circle", className: cx('memori-header--button', 'memori-header--button-login', hasSpacedButtons && 'memori-header--button-spaced'), icon: _jsx(UserIcon, {}), onClick: () => setShowLoginDrawer(true), title: t('login.login') || 'Login' })) }))] }));
};
export default Header;
//# sourceMappingURL=Header.js.map