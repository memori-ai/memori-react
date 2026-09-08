"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = require("react");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_2 = require("react");
const Spin_1 = tslib_1.__importDefault(require("../ui/Spin"));
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const Blob_1 = tslib_1.__importDefault(require("../Blob/Blob"));
const Close_1 = tslib_1.__importDefault(require("../icons/Close"));
const react_i18next_1 = require("react-i18next");
const WebsiteAssistantLayout = ({ Header, headerProps, Avatar, avatarProps, Chat, chatProps, StartPanel, startPanelProps, integrationStyle, sessionId, hasUserActivatedSpeak, loading = false, poweredBy, avatar3dHidden, }) => {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const [collapsed, _setCollapsed] = (0, react_2.useState)(true);
    const [expandedKey, setExpandedKey] = (0, react_2.useState)();
    const stopAudio = (0, react_2.useMemo)(() => chatProps === null || chatProps === void 0 ? void 0 : chatProps.stopAudio, [chatProps === null || chatProps === void 0 ? void 0 : chatProps.stopAudio]);
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
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [collapsed && ((0, jsx_runtime_1.jsx)("div", { className: "memori-website_assistant--trigger", children: (0, jsx_runtime_1.jsx)(Button_1.default, { className: "memori-website_assistant--trigger-button", ghost: true, shape: "circle", onClick: () => setCollapsed(false), title: t('expand') || 'Expand', children: (0, jsx_runtime_1.jsx)(Blob_1.default, { avatar: avatarProps === null || avatarProps === void 0 ? void 0 : avatarProps.memori.avatarURL }) }) })), (0, jsx_runtime_1.jsx)("div", { className: `memori-website_assistant--${collapsed ? 'collapsed' : 'expanded'}`, children: !collapsed && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [integrationStyle, (0, jsx_runtime_1.jsxs)(Spin_1.default, { spinning: loading, className: "memori-website_assistant-layout", children: [poweredBy, (0, jsx_runtime_1.jsx)("div", { className: "memori-website_assistant--close-button-wrapper", children: (0, jsx_runtime_1.jsx)(Button_1.default, { className: "memori-website_assistant--close-button", primary: true, shape: "circle", onClick: () => setCollapsed(true), icon: (0, jsx_runtime_1.jsx)(Close_1.default, {}), title: t('close') || 'Close' }) }), Header && headerProps && ((0, jsx_runtime_1.jsx)(Header, { ...headerProps, showSettings: false, showReload: false })), !(avatar3dHidden === true || avatar3dHidden === 'true') && ((0, jsx_runtime_1.jsx)("div", { className: "memori-website_assistant-layout--avatar", children: Avatar && avatarProps && ((0, react_1.createElement)(Avatar, { ...avatarProps, integrationConfig: avatarProps.integrationConfig
                                            ? {
                                                ...avatarProps.integrationConfig,
                                                avatarURL: ((_a = avatarProps.integrationConfig) === null || _a === void 0 ? void 0 : _a.avatarURL)
                                                    ? `${(_b = avatarProps.integrationConfig) === null || _b === void 0 ? void 0 : _b.avatarURL.split('#')[0]}#${expandedKey}`
                                                    : undefined,
                                            }
                                            : {}, key: expandedKey })) })), (0, jsx_runtime_1.jsx)("div", { id: "extension" }), (0, jsx_runtime_1.jsx)("div", { className: "memori-website_assistant-layout--controls", children: sessionId && hasUserActivatedSpeak && Chat && chatProps ? ((0, jsx_runtime_1.jsx)(Chat, { ...chatProps })) : startPanelProps ? ((0, jsx_runtime_1.jsx)(StartPanel, { ...startPanelProps })) : null })] })] })) })] }));
};
exports.default = WebsiteAssistantLayout;
//# sourceMappingURL=WebsiteAssistant.js.map