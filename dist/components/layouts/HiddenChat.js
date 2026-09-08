"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Spin_1 = tslib_1.__importDefault(require("../ui/Spin"));
const react_i18next_1 = require("react-i18next");
const ArtifactContext_1 = require("../MemoriArtifactSystem/context/ArtifactContext");
const QuestionHelp_1 = tslib_1.__importDefault(require("../icons/QuestionHelp"));
const Close_1 = tslib_1.__importDefault(require("../icons/Close"));
const HiddenChatLayout = ({ Header, headerProps, Chat, chatProps, startPanelProps, sessionId, hasUserActivatedSpeak, autoStart, StartPanel, onSidebarToggle, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [fullScreen, setFullScreen] = (0, react_1.useState)(false);
    const [hasTriggeredAutostart, setHasTriggeredAutostart] = (0, react_1.useState)(false);
    const { state, closeArtifact } = (0, ArtifactContext_1.useArtifact)();
    const { onClickStart, hasInitialSession } = startPanelProps || {};
    const originalSidebarStyles = (0, react_1.useRef)({
        right: '',
        width: '',
        backgroundColor: '',
    });
    (0, react_1.useEffect)(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && fullScreen) {
                restoreFromFullscreen();
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [fullScreen]);
    (0, react_1.useEffect)(() => {
        const mainDiv = document.body;
        if (isOpen) {
            if (!fullScreen) {
                mainDiv.style.width = 'calc(100% - 350px)';
                mainDiv.style.marginRight = '300px';
                mainDiv.style.transition = 'all 0.5s';
            }
            else {
                mainDiv.style.width = '100%';
                mainDiv.style.marginLeft = '0';
            }
        }
        else {
            mainDiv.style.width = '100%';
            mainDiv.style.marginRight = '0';
            mainDiv.style.marginLeft = '0';
            closeArtifact();
        }
    }, [isOpen, fullScreen]);
    const handleSidebarToggle = () => {
        if (!isOpen && !hasTriggeredAutostart && (autoStart || autoStart === undefined) && (!sessionId || hasInitialSession)) {
            setHasTriggeredAutostart(true);
            onClickStart === null || onClickStart === void 0 ? void 0 : onClickStart();
        }
        if (fullScreen && isOpen) {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(err => {
                    console.warn('[HiddenChatLayout] Error exiting fullscreen:', err);
                });
            }
            restoreFromFullscreen();
        }
        const newState = !isOpen;
        setIsOpen(newState);
        if (onSidebarToggle) {
            onSidebarToggle(newState);
        }
    };
    const restoreFromFullscreen = () => {
        const sidebarElement = document.querySelector('.memori-sidebar');
        if (sidebarElement) {
            const closeButton = document.querySelector('.memori-close-label');
            if (closeButton) {
                closeButton.style.display = 'flex';
            }
            const sidebar = sidebarElement;
            sidebar.style.right = originalSidebarStyles.current.right;
            sidebar.style.width = originalSidebarStyles.current.width;
            sidebar.style.backgroundColor =
                originalSidebarStyles.current.backgroundColor;
            sidebar.classList.remove('memori-sidebar-fullscreen');
        }
        setFullScreen(false);
    };
    const handleFullscreenToggle = () => {
        if (!document.fullscreenElement) {
            const sidebarElement = document.querySelector('.memori-sidebar');
            if (sidebarElement) {
                const sidebar = sidebarElement;
                const closeButton = document.querySelector('.memori-close-label');
                if (closeButton) {
                    closeButton.style.display = 'none';
                }
                originalSidebarStyles.current = {
                    right: sidebar.style.right,
                    width: sidebar.style.width,
                    backgroundColor: sidebar.style.backgroundColor,
                };
                sidebar.style.right = '0';
                sidebar.style.width = '100%';
                sidebar.style.backgroundColor = '#FFFFFF';
                sidebar.requestFullscreen().catch(err => {
                    console.warn('[HiddenChatLayout] Error enabling fullscreen:', err);
                });
            }
            setFullScreen(true);
        }
        else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(err => {
                    console.warn('[HiddenChatLayout] Error exiting fullscreen:', err);
                });
            }
            restoreFromFullscreen();
        }
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", id: "memori-sidebar-toggle", className: `memori-sidebar-toggle ${state.isDrawerOpen ? 'memori-sidebar-toggle-artifact' : ''}`, checked: isOpen, onChange: handleSidebarToggle }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-sidebar-container", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "memori-sidebar-toggle", className: "memori-sidebar-toggle-label memori-open-label", children: (0, jsx_runtime_1.jsx)(QuestionHelp_1.default, { className: "memori-icon", "aria-label": t('expand') }) }), (0, jsx_runtime_1.jsxs)("aside", { className: `memori-sidebar ${fullScreen ? 'memori-sidebar-fullscreen' : ''}`, children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "memori-sidebar-toggle", className: "memori-sidebar-toggle-label memori-close-label", children: (0, jsx_runtime_1.jsx)("span", { children: (0, jsx_runtime_1.jsx)(Close_1.default, { className: "memori-icon-close", "aria-label": t('collapse') }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "memori-sidebar-content", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-hidden-chat-layout--header", children: Header && headerProps && ((0, jsx_runtime_1.jsx)(Header, { position: {
                                            latitude: 0,
                                            longitude: 0,
                                            placeName: '',
                                        }, ...headerProps, className: "memori-hidden-chat-layout-header--layout", fullScreenHandler: handleFullscreenToggle })) }) }), (0, jsx_runtime_1.jsx)("div", { id: "extension" }), (0, jsx_runtime_1.jsx)("div", { className: "memori-hidden-chat-layout--controls", children: sessionId && hasUserActivatedSpeak && Chat && chatProps ? ((0, jsx_runtime_1.jsx)(Chat, { ...chatProps })) : !autoStart && startPanelProps ? ((0, jsx_runtime_1.jsx)("div", { className: "memori-loading", children: (0, jsx_runtime_1.jsx)(StartPanel, { ...startPanelProps }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "memori-loading", children: (0, jsx_runtime_1.jsx)(Spin_1.default, {}) })) })] })] })] }));
};
exports.default = HiddenChatLayout;
//# sourceMappingURL=HiddenChat.js.map