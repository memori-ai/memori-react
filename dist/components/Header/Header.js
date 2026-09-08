"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const Dropdown_1 = tslib_1.__importDefault(require("../ui/Dropdown"));
const MapMarker_1 = tslib_1.__importDefault(require("../icons/MapMarker"));
const SoundDeactivated_1 = tslib_1.__importDefault(require("../icons/SoundDeactivated"));
const Sound_1 = tslib_1.__importDefault(require("../icons/Sound"));
const react_i18next_1 = require("react-i18next");
const Setting_1 = tslib_1.__importDefault(require("../icons/Setting"));
const ShareButton_1 = tslib_1.__importDefault(require("../ShareButton/ShareButton"));
const FullscreenExit_1 = tslib_1.__importDefault(require("../icons/FullscreenExit"));
const Fullscreen_1 = tslib_1.__importDefault(require("../icons/Fullscreen"));
const Refresh_1 = tslib_1.__importDefault(require("../icons/Refresh"));
const Clear_1 = tslib_1.__importDefault(require("../icons/Clear"));
const DeepThought_1 = tslib_1.__importDefault(require("../icons/DeepThought"));
const Group_1 = tslib_1.__importDefault(require("../icons/Group"));
const User_1 = tslib_1.__importDefault(require("../icons/User"));
const Message_1 = tslib_1.__importDefault(require("../icons/Message"));
const Logout_1 = tslib_1.__importDefault(require("../icons/Logout"));
const error_1 = require("../../helpers/error");
const react_hot_toast_1 = tslib_1.__importDefault(require("react-hot-toast"));
const ChatConsumptionDropdown_1 = tslib_1.__importDefault(require("./ChatConsumptionDropdown"));
const imgMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
const Header = ({ className, memori, tenant, history, position, setShowPositionDrawer, setShowSettingsDrawer, setShowChatHistoryDrawer, setShowKnownFactsDrawer, setShowExpertsDrawer, enableAudio = true, speakerMuted, setSpeakerMuted, hasUserActivatedSpeak = false, showShare = true, showSettings = true, showReload = false, showClear = false, showLogin = true, setShowLoginDrawer, clearHistory, loginToken, user, sessionID, showChatHistory = true, fullScreenHandler, baseUrl, onLogout, apiClient, layout, additionalSettings, showMessageConsumption = false, }) => {
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const { uploadAsset, pwlUpdateUser } = apiClient.backend;
    const [fullScreenAvailable, setFullScreenAvailable] = (0, react_1.useState)(false);
    const [fullScreen, setFullScreen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (document.fullscreenEnabled) {
            setFullScreenAvailable(true);
        }
    }, []);
    const hasSettingsContent = (0, react_1.useCallback)((layout, additionalSettings) => {
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
                        react_hot_toast_1.default.error(t((0, error_1.getErrori18nKey)(resp.resultCode)));
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
                        react_hot_toast_1.default.error(err.message);
                }
            };
            reader.readAsDataURL(avatar);
        }
        else {
            console.error('[updateAvatar] Missing avatar or login token', {
                avatar,
                loginToken,
            });
            react_hot_toast_1.default.error(t('login.avatarUploadError'));
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, classnames_1.default)('memori-header', hasSpacedButtons && 'memori-header--spaced', className), children: [memori.needsPosition && position && ((0, jsx_runtime_1.jsxs)("div", { className: "memori-header--position", children: [position.latitude !== 0 && position.longitude !== 0 && ((0, jsx_runtime_1.jsx)("span", { className: "memori-header--position-placeName", children: position.placeName })), (0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, shape: "circle", className: (0, classnames_1.default)('memori-header--button', 'memori-header--button--position', hasSpacedButtons && 'memori-header--button-spaced'), title: t('widget.position') || 'Position', icon: (0, jsx_runtime_1.jsx)(MapMarker_1.default, {}), onClick: () => setShowPositionDrawer(true) })] })), showReload && ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, shape: "circle", className: (0, classnames_1.default)('memori-header--button', 'memori-header--button--reload', hasSpacedButtons && 'memori-header--button-spaced'), title: t('reload') || 'Reload', icon: (0, jsx_runtime_1.jsx)(Refresh_1.default, {}), onClick: () => {
                    window.location.reload();
                } })), showClear && ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, shape: "circle", className: (0, classnames_1.default)('memori-header--button', 'memori-header--button--clear', hasSpacedButtons && 'memori-header--button-spaced'), title: t('clearHistory') || 'Clear chat', icon: (0, jsx_runtime_1.jsx)(Clear_1.default, {}), onClick: clearHistory })), showChatHistory && !!loginToken && ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, disabled: !loginToken, shape: "circle", className: (0, classnames_1.default)('memori-header--button', 'memori-header--button--chat-history', hasSpacedButtons && 'memori-header--button-spaced'), title: t('write_and_speak.chatHistory') || 'Chat history', icon: (0, jsx_runtime_1.jsx)(Message_1.default, {}), onClick: () => setShowChatHistoryDrawer(true) })), showMessageConsumption && ((0, jsx_runtime_1.jsx)(ChatConsumptionDropdown_1.default, { history: history, hasSpacedButtons: hasSpacedButtons })), fullScreenAvailable && ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, shape: "circle", className: (0, classnames_1.default)('memori-header--button', 'memori-header--button--fullscreen', hasSpacedButtons && 'memori-header--button-spaced'), title: fullScreen
                    ? t('fullscreenExit') || 'Exit fullscreen'
                    : t('fullscreenEnter') || 'Enter fullscreen', icon: fullScreen ? (0, jsx_runtime_1.jsx)(FullscreenExit_1.default, {}) : (0, jsx_runtime_1.jsx)(Fullscreen_1.default, {}), onClick: fullScreenHandler ||
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
                    }) })), memori.enableDeepThought && !!loginToken && (user === null || user === void 0 ? void 0 : user.pAndCUAccepted) && ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: !!sessionID && !!hasUserActivatedSpeak, shape: "circle", icon: (0, jsx_runtime_1.jsx)(DeepThought_1.default, {}), className: (0, classnames_1.default)('memori-header--button', 'memori-header--button--knownfacts', hasSpacedButtons && 'memori-header--button-spaced'), disabled: !hasUserActivatedSpeak || !sessionID, onClick: () => setShowKnownFactsDrawer(true), title: t('knownFacts.title') || 'Known facts' })), memori.enableBoardOfExperts && ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, shape: "circle", icon: (0, jsx_runtime_1.jsx)(Group_1.default, {}), className: (0, classnames_1.default)('memori-header--button', 'memori-header--button--experts', hasSpacedButtons && 'memori-header--button-spaced'), disabled: !hasUserActivatedSpeak || !sessionID, onClick: () => setShowExpertsDrawer(true), title: t('widget.showExpertsInTheBoard') || 'Experts in this board' })), enableAudio && ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, shape: "circle", className: (0, classnames_1.default)('memori-header--button', 'memori-header--button--speaker', hasSpacedButtons && 'memori-header--button-spaced', { 'memori-header--button--speaker-muted': speakerMuted }), icon: speakerMuted ? (0, jsx_runtime_1.jsx)(SoundDeactivated_1.default, {}) : (0, jsx_runtime_1.jsx)(Sound_1.default, {}), onClick: () => setSpeakerMuted(!speakerMuted), title: t('widget.sound') || 'Sound' })), showSettings &&
                hasSettingsContent(layout, additionalSettings) && ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, shape: "circle", className: (0, classnames_1.default)('memori-header--button', 'memori-header--button-settings', hasSpacedButtons && 'memori-header--button-spaced'), icon: (0, jsx_runtime_1.jsx)(Setting_1.default, {}), onClick: () => setShowSettingsDrawer(true), title: t('widget.settings') || 'Settings' })), showShare && ((0, jsx_runtime_1.jsx)(ShareButton_1.default, { className: (0, classnames_1.default)('memori-header--button', 'memori-header--button-share', hasSpacedButtons && 'memori-header--button-spaced'), title: memori.name, memori: memori, sessionID: sessionID, tenant: tenant, showQrCode: true, align: "left", baseUrl: baseUrl, history: history })), showLogin && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: loginToken && user ? ((0, jsx_runtime_1.jsxs)(Dropdown_1.default, { placement: "bottom-right", trigger: (0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, shape: "circle", className: (0, classnames_1.default)('memori-header--button', 'memori-header--button-login', hasSpacedButtons && 'memori-header--button-spaced'), icon: (0, jsx_runtime_1.jsx)(User_1.default, {}), title: t('login.user') || 'User' }), children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-dropdown--user-profile", children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-dropdown--user-info", children: [user.avatarURL ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("img", { src: user.avatarURL, alt: user.userName || user.eMail, className: "memori-dropdown--avatar" }), (0, jsx_runtime_1.jsx)("input", { type: "file", name: "avatar", id: "avatar", className: "memori-dropdown--avatar-input", onChange: e => {
                                                    var _a, _b;
                                                    return updateAvatar((_b = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null);
                                                }, accept: imgMimeTypes.join(', ') })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "memori-dropdown--avatar-placeholder", children: [(0, jsx_runtime_1.jsx)("span", { children: (user.userName || user.eMail || 'U')
                                                    .charAt(0)
                                                    .toUpperCase() }), (0, jsx_runtime_1.jsx)("input", { type: "file", name: "avatar", id: "avatar", className: "memori-dropdown--avatar-input", onChange: e => {
                                                    var _a, _b;
                                                    return updateAvatar((_b = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null);
                                                }, accept: imgMimeTypes.join(', ') })] })), (0, jsx_runtime_1.jsxs)("div", { className: "memori-dropdown--user-details", children: [(0, jsx_runtime_1.jsx)("h3", { className: "memori-dropdown--user-name", children: user.userName || t('login.welcomeUser') }), (0, jsx_runtime_1.jsx)("p", { className: "memori-dropdown--user-email", children: user.eMail }), (0, jsx_runtime_1.jsx)("div", { className: "memori-dropdown--user-badge", children: user.birthDate
                                                    ? new Date(user.birthDate).toLocaleDateString()
                                                    : t('login.notSet') })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "memori-dropdown--actions", children: (0, jsx_runtime_1.jsxs)("button", { className: "memori-dropdown--action-button memori-dropdown--action-button--logout", onClick: onLogout, children: [(0, jsx_runtime_1.jsx)(Logout_1.default, { className: "memori-dropdown--action-icon" }), t('login.logout') || 'Logout'] }) })] })) : ((0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, shape: "circle", className: (0, classnames_1.default)('memori-header--button', 'memori-header--button-login', hasSpacedButtons && 'memori-header--button-spaced'), icon: (0, jsx_runtime_1.jsx)(User_1.default, {}), onClick: () => setShowLoginDrawer(true), title: t('login.login') || 'Login' })) }))] }));
};
exports.default = Header;
//# sourceMappingURL=Header.js.map