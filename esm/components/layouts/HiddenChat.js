import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import Spin from '../ui/Spin';
import { useTranslation } from 'react-i18next';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';
import QuestionHelp from '../icons/QuestionHelp';
import Close from '../icons/Close';
const HiddenChatLayout = ({ Header, headerProps, Chat, chatProps, startPanelProps, sessionId, hasUserActivatedSpeak, autoStart, StartPanel, onSidebarToggle, }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const [hasTriggeredAutostart, setHasTriggeredAutostart] = useState(false);
    const { state, closeArtifact } = useArtifact();
    const { onClickStart, hasInitialSession } = startPanelProps || {};
    const originalSidebarStyles = useRef({
        right: '',
        width: '',
        backgroundColor: '',
    });
    useEffect(() => {
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
    useEffect(() => {
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
    return (_jsxs(_Fragment, { children: [_jsx("input", { type: "checkbox", id: "memori-sidebar-toggle", className: `memori-sidebar-toggle ${state.isDrawerOpen ? 'memori-sidebar-toggle-artifact' : ''}`, checked: isOpen, onChange: handleSidebarToggle }), _jsxs("div", { className: "memori-sidebar-container", children: [_jsx("label", { htmlFor: "memori-sidebar-toggle", className: "memori-sidebar-toggle-label memori-open-label", children: _jsx(QuestionHelp, { className: "memori-icon", "aria-label": t('expand') }) }), _jsxs("aside", { className: `memori-sidebar ${fullScreen ? 'memori-sidebar-fullscreen' : ''}`, children: [_jsx("label", { htmlFor: "memori-sidebar-toggle", className: "memori-sidebar-toggle-label memori-close-label", children: _jsx("span", { children: _jsx(Close, { className: "memori-icon-close", "aria-label": t('collapse') }) }) }), _jsx("div", { className: "memori-sidebar-content", children: _jsx("div", { className: "memori-hidden-chat-layout--header", children: Header && headerProps && (_jsx(Header, { position: {
                                            latitude: 0,
                                            longitude: 0,
                                            placeName: '',
                                        }, ...headerProps, className: "memori-hidden-chat-layout-header--layout", fullScreenHandler: handleFullscreenToggle })) }) }), _jsx("div", { id: "extension" }), _jsx("div", { className: "memori-hidden-chat-layout--controls", children: sessionId && hasUserActivatedSpeak && Chat && chatProps ? (_jsx(Chat, { ...chatProps })) : !autoStart && startPanelProps ? (_jsx("div", { className: "memori-loading", children: _jsx(StartPanel, { ...startPanelProps }) })) : (_jsx("div", { className: "memori-loading", children: _jsx(Spin, {}) })) })] })] })] }));
};
export default HiddenChatLayout;
//# sourceMappingURL=HiddenChat.js.map