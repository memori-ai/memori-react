"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = require("react");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_2 = require("react");
const ui_1 = require("@memori.ai/ui");
const Blob_1 = tslib_1.__importDefault(require("../../Blob/Blob"));
const lucide_react_1 = require("lucide-react");
const react_i18next_1 = require("react-i18next");
const ArtifactContext_1 = require("../../MemoriArtifactSystem/context/ArtifactContext");
const ArtifactDrawer_1 = tslib_1.__importDefault(require("../../MemoriArtifactSystem/components/ArtifactDrawer/ArtifactDrawer"));
const media_1 = require("../../../helpers/media");
const WebsiteAssistantLayout = ({ Header, headerProps, Avatar, avatarProps, Chat, chatProps, StartPanel, startPanelProps, integrationStyle, sessionId, hasUserActivatedSpeak, loading = false, avatar3dHidden, }) => {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { state: artifactState } = (0, ArtifactContext_1.useArtifact)();
    const useSideArtifactChrome = artifactState.isDrawerOpen && !artifactState.isChatLogPanelPresentation;
    const [collapsed, _setCollapsed] = (0, react_2.useState)(true);
    const [expandedKey, setExpandedKey] = (0, react_2.useState)();
    const stopAudio = (0, react_2.useMemo)(() => chatProps === null || chatProps === void 0 ? void 0 : chatProps.stopAudio, [chatProps === null || chatProps === void 0 ? void 0 : chatProps.stopAudio]);
    const memori = headerProps === null || headerProps === void 0 ? void 0 : headerProps.memori;
    const tenant = headerProps === null || headerProps === void 0 ? void 0 : headerProps.tenant;
    const baseUrl = headerProps === null || headerProps === void 0 ? void 0 : headerProps.baseUrl;
    const isSessionStarted = Boolean(sessionId && hasUserActivatedSpeak);
    const brandAvatarSrc = memori
        ? memori.avatarURL && memori.avatarURL.length > 0
            ? (0, media_1.getResourceUrl)({
                type: 'avatar',
                tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                resourceURI: memori.avatarURL,
                baseURL: baseUrl,
                apiURL: '',
            })
            : (0, media_1.getResourceUrl)({
                type: 'avatar',
                tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                baseURL: baseUrl,
                apiURL: '',
            })
        : undefined;
    const setCollapsed = (collapsed) => {
        _setCollapsed(collapsed);
        setExpandedKey(collapsed ? undefined : new Date().toISOString());
        try {
            stopAudio === null || stopAudio === void 0 ? void 0 : stopAudio();
        }
        catch (e) {
            console.log(e);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [collapsed && ((0, jsx_runtime_1.jsx)("div", { className: "memori-website_assistant--trigger", children: (0, jsx_runtime_1.jsx)(ui_1.Button, { className: "memori-website_assistant--trigger-button", variant: "ghost", shape: "circle", onClick: () => setCollapsed(false), "aria-label": t('expand') || 'Expand', "aria-expanded": false, title: t('expand') || 'Expand', children: (0, jsx_runtime_1.jsx)(Blob_1.default, { avatar: avatarProps === null || avatarProps === void 0 ? void 0 : avatarProps.memori.avatarURL }) }) })), (0, jsx_runtime_1.jsx)("div", { className: `memori-website_assistant--${collapsed ? 'collapsed' : 'expanded'}${useSideArtifactChrome
                    ? ' memori-website_assistant--artifact-open'
                    : ''}`, children: !collapsed && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [integrationStyle, (0, jsx_runtime_1.jsxs)(ui_1.Spin, { spinning: loading, className: "memori-website_assistant-layout", children: [(0, jsx_runtime_1.jsxs)("div", { className: "memori-website_assistant-layout--header-row", children: [memori && brandAvatarSrc && ((0, jsx_runtime_1.jsxs)("div", { className: "memori-chat-layout--brand", children: [(0, jsx_runtime_1.jsx)("img", { className: "memori-chat-layout--brand-avatar", src: brandAvatarSrc, alt: "", role: "presentation" }), (0, jsx_runtime_1.jsx)("div", { className: "memori-chat-layout--brand-text", children: isSessionStarted && ((0, jsx_runtime_1.jsx)("span", { className: "memori-chat-layout--brand-name", title: memori.name, children: memori.name })) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "memori-website_assistant-layout--header-actions", children: [Header && headerProps && ((0, jsx_runtime_1.jsx)(Header, { buttonVariant: "outline", ...headerProps, showSettings: false, showReload: false, showChatHistory: false })), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "memori-website_assistant--close-button", onClick: () => setCollapsed(true), "aria-label": t('collapse') || 'Close', title: t('collapse') || 'Close', children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "memori-icon-close", "aria-hidden": true }) })] })] }), !(avatar3dHidden === true || avatar3dHidden === 'true') && ((0, jsx_runtime_1.jsx)("div", { className: "memori-website_assistant-layout--avatar", children: Avatar && avatarProps && ((0, react_1.createElement)(Avatar, { ...avatarProps, integrationConfig: avatarProps.integrationConfig
                                            ? {
                                                ...avatarProps.integrationConfig,
                                                avatarURL: ((_a = avatarProps.integrationConfig) === null || _a === void 0 ? void 0 : _a.avatarURL)
                                                    ? `${(_b = avatarProps.integrationConfig) === null || _b === void 0 ? void 0 : _b.avatarURL.split('#')[0]}#${expandedKey}`
                                                    : undefined,
                                            }
                                            : {}, key: expandedKey })) })), (0, jsx_runtime_1.jsx)("div", { id: "extension" }), (0, jsx_runtime_1.jsx)("div", { className: "memori-website_assistant-layout--controls", children: sessionId && hasUserActivatedSpeak && Chat && chatProps ? ((0, jsx_runtime_1.jsx)(Chat, { ...chatProps })) : startPanelProps ? ((0, jsx_runtime_1.jsx)(StartPanel, { ...startPanelProps, showFullDescriptionOnMobile: true, showChatHistory: false })) : null })] })] })) }), useSideArtifactChrome && (0, jsx_runtime_1.jsx)(ArtifactDrawer_1.default, {})] }));
};
exports.default = WebsiteAssistantLayout;
//# sourceMappingURL=WebsiteAssistant.js.map