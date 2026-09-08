import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Spin from '../ui/Spin';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';
const ZoomedFullBodyLayout = ({ Header, headerProps, Avatar, avatarProps, Chat, chatProps, StartPanel, startPanelProps, integrationStyle, integrationBackground, sessionId, hasUserActivatedSpeak, loading = false, poweredBy, }) => {
    const { state } = useArtifact();
    const hasArtifact = state.currentArtifact;
    return (_jsxs(_Fragment, { children: [integrationStyle, integrationBackground, _jsxs(Spin, { className: "memori-spin--zoomed-full-body", spinning: loading, children: [_jsx("div", { className: `memori-chat-layout--header ${state.isDrawerOpen ? 'memori-chat-layout--header-with-artifact' : ''}`, children: Header && headerProps && _jsx(Header, { ...headerProps }) }), _jsxs("div", { className: "memori--grid", children: [!state.isDrawerOpen && (_jsxs("div", { className: "memori--grid-column memori--grid-column-left", children: [Avatar && avatarProps && (_jsx(Avatar, { chatProps: chatProps, isZoomed: true, ...avatarProps })), _jsx("div", { id: "extension" })] })), _jsx("div", { className: `memori-chat-layout--main ${hasArtifact ? 'memori-chat-layout--main-with-artifact' : ''}`, children: _jsx("div", { className: state.isFullscreen
                                        ? `memori-chat-layout-controls-hide`
                                        : `memori-chat-layout--controls ${state.isDrawerOpen
                                            ? 'memori-chat-layout--controls-with-artifact'
                                            : ''}`, children: sessionId && hasUserActivatedSpeak && Chat && chatProps ? (_jsx(Chat, { ...chatProps })) : startPanelProps ? (_jsx(StartPanel, { ...startPanelProps })) : null }) }), poweredBy] })] })] }));
};
export default ZoomedFullBodyLayout;
//# sourceMappingURL=ZoomedFullBody.js.map