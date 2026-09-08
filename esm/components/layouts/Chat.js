import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Spin from '../ui/Spin';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';
const ChatLayout = ({ Header, headerProps, Chat, chatProps, StartPanel, startPanelProps, integrationStyle, integrationBackground, sessionId, hasUserActivatedSpeak, loading = false, poweredBy, }) => {
    const { state } = useArtifact();
    return (_jsxs(_Fragment, { children: [integrationStyle, integrationBackground, _jsxs(Spin, { spinning: loading, className: "memori-chat-layout", children: [poweredBy, _jsx("div", { className: `memori-chat-layout--header ${state.isDrawerOpen ? 'memori-chat-layout--header-with-artifact' : ''}`, children: Header && headerProps && _jsx(Header, { ...headerProps }) }), _jsx("div", { id: "extension" }), _jsx("div", { className: `memori-chat-layout--main ${state.isDrawerOpen ? 'memori-chat-layout--main-with-artifact' : ''}`, children: _jsx("div", { className: state.isFullscreen
                                ? `memori-chat-layout-controls-hide`
                                : `memori-chat-layout--controls ${state.isDrawerOpen
                                    ? 'memori-chat-layout--controls-with-artifact'
                                    : ''}`, children: sessionId && hasUserActivatedSpeak && Chat && chatProps ? (_jsx(Chat, { ...chatProps })) : startPanelProps ? (_jsx(StartPanel, { ...startPanelProps })) : null }) })] })] }));
};
export default ChatLayout;
//# sourceMappingURL=Chat.js.map