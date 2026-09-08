"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ErrorBoundary_1 = tslib_1.__importDefault(require("../ErrorBoundary/ErrorBoundary"));
const Tooltip_1 = tslib_1.__importDefault(require("../ui/Tooltip"));
const media_1 = require("../../helpers/media");
const Blob_1 = tslib_1.__importDefault(require("../Blob/Blob"));
const ModelViewer_1 = tslib_1.__importDefault(require("../CustomGLBModelViewer/ModelViewer"));
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const react_i18next_1 = require("react-i18next");
const Eye_1 = tslib_1.__importDefault(require("../icons/Eye"));
const EyeInvisible_1 = tslib_1.__importDefault(require("../icons/EyeInvisible"));
const Edit_1 = tslib_1.__importDefault(require("../icons/Edit"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const AvatarView_1 = tslib_1.__importDefault(require("./AvatarView"));
const visemeContext_1 = require("../../context/visemeContext");
const integration_1 = require("../../types/integration");
const Avatar = ({ memori, integration, integrationConfig, tenant, instruct = false, avatar3dVisible = false, setAvatar3dVisible, hasUserActivatedSpeak = false, isPlayingAudio = false, loading = false, baseUrl, apiUrl, animation, isZoomed = false, chatProps, avatarType = null, enablePositionControls, setEnablePositionControls, isTotem = false, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [isClient, setIsClient] = (0, react_1.useState)(false);
    const { stopProcessing, updateCurrentViseme, resetVisemeQueue } = (0, visemeContext_1.useViseme)();
    (0, react_1.useEffect)(() => {
        setIsClient(true);
    }, []);
    const getAvatarUrl = () => {
        if ((integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.avatar) === 'userAvatar' &&
            memori.avatarURL &&
            memori.avatarURL.length > 0) {
            return (0, media_1.getResourceUrl)({
                type: 'avatar',
                tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                resourceURI: memori.avatarURL,
                baseURL: baseUrl,
                apiURL: apiUrl,
            });
        }
        return undefined;
    };
    const renderAvatar = () => {
        if ((0, integration_1.is3dAvatarWithUrl)(integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.avatar, integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.avatarURL) &&
            avatarType &&
            avatarType !== 'blob') {
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: (0, classnames_1.default)('memori--avatar-wrapper', `memori--avatar-${(integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.avatar) || 'default'}`, {
                            hidden: !avatar3dVisible,
                        }), children: renderAvatarContent() }), renderAvatarToggle()] }));
        }
        return ((0, jsx_runtime_1.jsx)("div", { className: "memori--blob-container", children: isClient && (0, jsx_runtime_1.jsx)(Blob_1.default, { speaking: isPlayingAudio, avatar: getAvatarUrl() }) }));
    };
    const renderAvatarContent = () => {
        var _a;
        if (!isClient || !integrationConfig)
            return null;
        if ((0, integration_1.usesRpmAvatarView)(integrationConfig.avatar)) {
            return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.default, { fallback: (0, jsx_runtime_1.jsx)("div", { className: "memori--blob-container", children: isClient && ((0, jsx_runtime_1.jsx)(Blob_1.default, { speaking: isPlayingAudio, avatar: getAvatarUrl() })) }), children: (0, jsx_runtime_1.jsx)(AvatarView_1.default, { enablePositionControls: enablePositionControls, updateCurrentViseme: updateCurrentViseme, url: integrationConfig.avatarURL, sex: memori.voiceType === 'FEMALE' ? 'FEMALE' : 'MALE', fallbackImg: getAvatarUrl(), headMovement: true, eyeBlink: true, animation: animation, halfBody: integrationConfig.avatar === 'readyplayerme', speaking: isPlayingAudio, loading: loading, style: getAvatarStyle(), stopProcessing: stopProcessing, resetVisemeQueue: resetVisemeQueue, isZoomed: isZoomed, isTotem: isTotem, chatEmission: (_a = chatProps === null || chatProps === void 0 ? void 0 : chatProps.dialogState) === null || _a === void 0 ? void 0 : _a.emission, setEnablePositionControls: setEnablePositionControls }) }));
        }
        if (integrationConfig.avatar === 'customglb') {
            return ((0, jsx_runtime_1.jsx)(ModelViewer_1.default, { poster: getAvatarUrl() || '', src: integrationConfig.avatarURL, alt: "" }));
        }
        return null;
    };
    const renderAvatarToggle = () => ((0, jsx_runtime_1.jsx)("div", { className: "memori--avatar-toggle", children: (0, jsx_runtime_1.jsx)(Button_1.default, { ghost: true, onClick: () => setAvatar3dVisible(!avatar3dVisible), icon: avatar3dVisible ? (0, jsx_runtime_1.jsx)(EyeInvisible_1.default, {}) : (0, jsx_runtime_1.jsx)(Eye_1.default, {}), children: (0, jsx_runtime_1.jsx)("span", { className: "memori--avatar-toggle-text", children: avatar3dVisible ? t('hide') : t('show') }) }) }));
    const getAvatarStyle = () => {
        if ((integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.avatar) === 'readyplayerme') {
            return {
                width: '100%',
                height: '100%',
                backgroundColor: 'none',
                boxShadow: 'none',
            };
        }
        return {
            width: '100%',
            height: '100%',
            backgroundColor: 'none',
        };
    };
    const renderIntegrationsLink = () => {
        if (!(instruct && !hasUserActivatedSpeak && memori.isGiver && (tenant === null || tenant === void 0 ? void 0 : tenant.name)))
            return null;
        const href = `https://${tenant.name}/${memori.culture === 'it-IT' ? 'it' : 'en'}/${memori.ownerUserName}/${memori.name}/integrations${(integration === null || integration === void 0 ? void 0 : integration.integrationID)
            ? `?integration=${integration.integrationID}&openAvatarModal=true`
            : ''}`;
        return ((0, jsx_runtime_1.jsx)("div", { className: "memori--avatar-link-to-integrations", children: (0, jsx_runtime_1.jsx)("a", { className: "memori-button memori-button--circle memori-button--outlined", href: href, children: (0, jsx_runtime_1.jsx)(Tooltip_1.default, { content: t('widgetgoToIntegrationsToCustomizeAvatar'), children: (0, jsx_runtime_1.jsx)("span", { className: "memori-button--icon", children: (0, jsx_runtime_1.jsx)(Edit_1.default, {}) }) }) }) }));
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [renderAvatar(), renderIntegrationsLink()] }));
};
exports.default = (0, react_1.memo)(Avatar, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});
//# sourceMappingURL=Avatar.js.map