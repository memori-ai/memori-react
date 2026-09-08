"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const Spin_1 = tslib_1.__importDefault(require("../ui/Spin"));
const ArtifactContext_1 = require("../MemoriArtifactSystem/context/ArtifactContext");
const ChatLayout = ({ Header, headerProps, Chat, chatProps, StartPanel, startPanelProps, integrationStyle, integrationBackground, sessionId, hasUserActivatedSpeak, loading = false, poweredBy, }) => {
    const { state } = (0, ArtifactContext_1.useArtifact)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [integrationStyle, integrationBackground, (0, jsx_runtime_1.jsxs)(Spin_1.default, { spinning: loading, className: "memori-chat-layout", children: [poweredBy, (0, jsx_runtime_1.jsx)("div", { className: `memori-chat-layout--header ${state.isDrawerOpen ? 'memori-chat-layout--header-with-artifact' : ''}`, children: Header && headerProps && (0, jsx_runtime_1.jsx)(Header, { ...headerProps }) }), (0, jsx_runtime_1.jsx)("div", { id: "extension" }), (0, jsx_runtime_1.jsx)("div", { className: `memori-chat-layout--main ${state.isDrawerOpen ? 'memori-chat-layout--main-with-artifact' : ''}`, children: (0, jsx_runtime_1.jsx)("div", { className: state.isFullscreen
                                ? `memori-chat-layout-controls-hide`
                                : `memori-chat-layout--controls ${state.isDrawerOpen
                                    ? 'memori-chat-layout--controls-with-artifact'
                                    : ''}`, children: sessionId && hasUserActivatedSpeak && Chat && chatProps ? ((0, jsx_runtime_1.jsx)(Chat, { ...chatProps })) : startPanelProps ? ((0, jsx_runtime_1.jsx)(StartPanel, { ...startPanelProps })) : null }) })] })] }));
};
exports.default = ChatLayout;
//# sourceMappingURL=Chat.js.map