import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import Spin from '../ui/Spin';
import Button from '../ui/Button';
import Blob from '../Blob/Blob';
import Close from '../icons/Close';
import { useTranslation } from 'react-i18next';
const WebsiteAssistantLayout = ({ Header, headerProps, Avatar, avatarProps, Chat, chatProps, StartPanel, startPanelProps, integrationStyle, sessionId, hasUserActivatedSpeak, loading = false, poweredBy, avatar3dHidden, }) => {
    var _a, _b;
    const { t } = useTranslation();
    const [collapsed, _setCollapsed] = useState(true);
    const [expandedKey, setExpandedKey] = useState();
    const stopAudio = useMemo(() => chatProps === null || chatProps === void 0 ? void 0 : chatProps.stopAudio, [chatProps === null || chatProps === void 0 ? void 0 : chatProps.stopAudio]);
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
    return (_jsxs(_Fragment, { children: [collapsed && (_jsx("div", { className: "memori-website_assistant--trigger", children: _jsx(Button, { className: "memori-website_assistant--trigger-button", ghost: true, shape: "circle", onClick: () => setCollapsed(false), title: t('expand') || 'Expand', children: _jsx(Blob, { avatar: avatarProps === null || avatarProps === void 0 ? void 0 : avatarProps.memori.avatarURL }) }) })), _jsx("div", { className: `memori-website_assistant--${collapsed ? 'collapsed' : 'expanded'}`, children: !collapsed && (_jsxs(_Fragment, { children: [integrationStyle, _jsxs(Spin, { spinning: loading, className: "memori-website_assistant-layout", children: [poweredBy, _jsx("div", { className: "memori-website_assistant--close-button-wrapper", children: _jsx(Button, { className: "memori-website_assistant--close-button", primary: true, shape: "circle", onClick: () => setCollapsed(true), icon: _jsx(Close, {}), title: t('close') || 'Close' }) }), Header && headerProps && (_jsx(Header, { ...headerProps, showSettings: false, showReload: false })), !(avatar3dHidden === true || avatar3dHidden === 'true') && (_jsx("div", { className: "memori-website_assistant-layout--avatar", children: Avatar && avatarProps && (_createElement(Avatar, { ...avatarProps, integrationConfig: avatarProps.integrationConfig
                                            ? {
                                                ...avatarProps.integrationConfig,
                                                avatarURL: ((_a = avatarProps.integrationConfig) === null || _a === void 0 ? void 0 : _a.avatarURL)
                                                    ? `${(_b = avatarProps.integrationConfig) === null || _b === void 0 ? void 0 : _b.avatarURL.split('#')[0]}#${expandedKey}`
                                                    : undefined,
                                            }
                                            : {}, key: expandedKey })) })), _jsx("div", { id: "extension" }), _jsx("div", { className: "memori-website_assistant-layout--controls", children: sessionId && hasUserActivatedSpeak && Chat && chatProps ? (_jsx(Chat, { ...chatProps })) : startPanelProps ? (_jsx(StartPanel, { ...startPanelProps })) : null })] })] })) })] }));
};
export default WebsiteAssistantLayout;
//# sourceMappingURL=WebsiteAssistant.js.map