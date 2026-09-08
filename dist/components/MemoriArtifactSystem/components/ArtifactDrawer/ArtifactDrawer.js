"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = tslib_1.__importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_2 = require("@headlessui/react");
const Button_1 = tslib_1.__importDefault(require("../../../ui/Button"));
const Close_1 = tslib_1.__importDefault(require("../../../icons/Close"));
const ArtifactActions_1 = tslib_1.__importDefault(require("../ArtifactActions/ArtifactActions"));
const ArtifactContext_1 = require("../../context/ArtifactContext");
const ArtifactPreview_1 = tslib_1.__importDefault(require("../ArtifactPreview/ArtifactPreview"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Drawer_1 = tslib_1.__importDefault(require("../../../ui/Drawer"));
const MenuVertical_1 = tslib_1.__importDefault(require("../../../icons/MenuVertical"));
const Download_1 = tslib_1.__importDefault(require("../../../icons/Download"));
const Link_1 = tslib_1.__importDefault(require("../../../icons/Link"));
const Print_1 = tslib_1.__importDefault(require("../../../icons/Print"));
const useCopyArtifact_1 = require("../ArtifactActions/hooks/useCopyArtifact");
const TabSwitch_1 = tslib_1.__importDefault(require("./components/TabSwitch"));
const ArtifactDrawer = ({ isChatLogPanel = false, }) => {
    const { state, closeArtifact, toggleFullscreen } = (0, ArtifactContext_1.useArtifact)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const [isMobile, setIsMobile] = (0, react_1.useState)(false);
    const [activeTab, setActiveTab] = (0, react_1.useState)('preview');
    const handleTabChange = (0, react_1.useCallback)((tab) => {
        setActiveTab(tab);
    }, [activeTab]);
    const { copyState, formats, handleCopy: handleCopyFormat, handleCopyClick, } = (0, useCopyArtifact_1.useCopyArtifact)(state.currentArtifact || { content: '', mimeType: 'text/plain' }, () => console.log('Copy completed'), () => console.log('Download completed'), () => console.log('Print completed'));
    (0, react_1.useEffect)(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const handleCopy = (0, react_1.useCallback)(async () => {
        if (!state.currentArtifact)
            return;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(state.currentArtifact.content);
            }
            else {
                const textArea = document.createElement('textarea');
                textArea.value = state.currentArtifact.content;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
        }
        catch (error) {
            console.error('Copy failed:', error);
            throw error;
        }
    }, [state.currentArtifact]);
    const handleToggleFullscreen = (0, react_1.useCallback)(() => {
        if (toggleFullscreen) {
            toggleFullscreen();
        }
    }, [toggleFullscreen]);
    const handleClose = (0, react_1.useCallback)(() => {
        closeArtifact();
    }, [closeArtifact]);
    if (!state.currentArtifact) {
        return null;
    }
    const hasPreview = state.currentArtifact.mimeType === 'html' ||
        state.currentArtifact.mimeType === 'markdown';
    const ContentContainer = (0, react_1.useCallback)(({ children }) => {
        if (isChatLogPanel) {
            return ((0, jsx_runtime_1.jsx)("div", { style: { minHeight: '75vh', maxHeight: '75vh' }, className: "memori-artifact-panel", children: children }));
        }
        else {
            return ((0, jsx_runtime_1.jsx)(Drawer_1.default, { open: state.isDrawerOpen, onClose: handleClose, placement: "right", width: "50%", className: state.isFullscreen
                    ? 'memori-artifact-panel-drawer-fullscreen'
                    : 'memori-artifact-panel-drawer', widthMd: "100%", widthLg: "50%", closable: false, animated: true, enterDuration: isMobile ? 'duration-500' : 'duration-300', leaveDuration: isMobile ? 'duration-400' : 'duration-200', showBackdrop: false, preventBackdropClose: true, confirmDialogTitle: t('artifact.confirmDialogTitle') ||
                    'Are you sure you want to close this artifact?', confirmDialogMessage: t('artifact.confirmDialogMessage') ||
                    'This action cannot be undone.', children: children }));
        }
    }, [isChatLogPanel, handleClose, state.isDrawerOpen, state.isFullscreen, isMobile]);
    const getMimeTypeString = (0, react_1.useCallback)((mimeType) => {
        const mimeTypes = {
            html: 'text/html',
            json: 'application/json',
            markdown: 'text/markdown',
            css: 'text/css',
            javascript: 'text/javascript',
            typescript: 'text/typescript',
            svg: 'image/svg+xml',
            xml: 'text/xml',
            text: 'text/plain',
            python: 'text/x-python',
            java: 'text/x-java',
            cpp: 'text/x-c++',
            csharp: 'text/x-csharp',
            php: 'text/x-php',
            ruby: 'text/x-ruby',
            go: 'text/x-go',
            rust: 'text/x-rust',
            yaml: 'text/yaml',
            sql: 'text/x-sql',
        };
        return mimeTypes[mimeType] || 'text/plain';
    }, []);
    const handleOpenExternal = (0, react_1.useCallback)((artifact) => {
        try {
            const mimeType = getMimeTypeString(artifact.mimeType);
            const blob = new Blob([artifact.content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const externalWindow = window.open(url, '_blank');
            if (!externalWindow) {
                alert('Popup blocked! Please enable popups to open the artifact in a new window.');
                return;
            }
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 60000);
        }
        catch (error) {
            console.error('External open failed:', error);
        }
    }, []);
    return ((0, jsx_runtime_1.jsxs)(ContentContainer, { children: [(0, jsx_runtime_1.jsx)("div", { className: (0, classnames_1.default)('memori-artifact-drawer-container-actions', {
                    'memori-artifact-drawer-container-actions--no-preview': !hasPreview,
                    'memori-artifact-drawer-container-actions--chatlog': isChatLogPanel,
                }), children: !isMobile && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [hasPreview && ((0, jsx_runtime_1.jsx)(TabSwitch_1.default, { activeTab: activeTab, onTabChange: handleTabChange, hasPreview: hasPreview })), (0, jsx_runtime_1.jsx)(ArtifactActions_1.default, { artifact: state.currentArtifact, onCopy: handleCopy, loading: false, isMobile: isMobile }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: closeArtifact, className: (0, classnames_1.default)('memori-artifact-drawer--close', 'memori-button--icon-only', {
                                'memori-artifact-drawer--close-desktop': !hasPreview,
                            }), ghost: true, title: t('artifact.close') || 'Close', children: (0, jsx_runtime_1.jsx)(Close_1.default, { className: "memori-artifact-panel--close-icon" }) })] })) }), (0, jsx_runtime_1.jsxs)("div", { className: (0, classnames_1.default)('memori-artifact-drawer-top-right', {
                    'memori-artifact-drawer-top-right--no-preview': !hasPreview,
                    'memori-artifact-drawer-top-right--chatlog': isChatLogPanel,
                }), children: [isMobile && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [hasPreview && ((0, jsx_runtime_1.jsx)(TabSwitch_1.default, { activeTab: activeTab, onTabChange: handleTabChange, hasPreview: hasPreview })), (0, jsx_runtime_1.jsxs)(react_2.Menu, { as: "div", className: "memori-mobile-actions-menu", children: [(0, jsx_runtime_1.jsx)(react_2.Menu.Button, { as: "div", className: "memori-mobile-actions-trigger", children: (0, jsx_runtime_1.jsx)(Button_1.default, { className: (0, classnames_1.default)('memori-button', 'memori-button--more-options', 'memori-button--icon-only'), ghost: true, title: t('artifact.actions') || 'Actions', children: (0, jsx_runtime_1.jsx)(MenuVertical_1.default, { className: "memori-artifact-action-icon" }) }) }), (0, jsx_runtime_1.jsx)(react_2.Transition, { as: react_1.default.Fragment, enter: "memori-mobile-dropdown-enter", enterFrom: "memori-mobile-dropdown-enter-from", enterTo: "memori-mobile-dropdown-enter-to", leave: "memori-mobile-dropdown-leave", leaveFrom: "memori-mobile-dropdown-leave-from", leaveTo: "memori-mobile-dropdown-leave-to", children: (0, jsx_runtime_1.jsx)(react_2.Menu.Items, { className: "memori-mobile-dropdown", children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-mobile-dropdown-list", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { onClick: handleCopy, disabled: false, className: "memori-artifact-action-btn", ghost: true, title: t('artifact.copy') || 'Copy', children: (0, jsx_runtime_1.jsx)("span", { className: "memori-artifact-action-text", children: t('artifact.copy') || 'Copy' }) }), formats.map(format => {
                                                        const getIcon = () => {
                                                            switch (format.action) {
                                                                case 'copy':
                                                                    return ((0, jsx_runtime_1.jsx)(Link_1.default, { className: "memori-artifact-action-icon" }));
                                                                case 'download':
                                                                    return ((0, jsx_runtime_1.jsx)(Download_1.default, { className: "memori-artifact-action-icon" }));
                                                                case 'print':
                                                                case 'pdf':
                                                                    return ((0, jsx_runtime_1.jsx)(Print_1.default, { className: "memori-artifact-action-icon" }));
                                                                default:
                                                                    return ((0, jsx_runtime_1.jsx)(Link_1.default, { className: "memori-artifact-action-icon" }));
                                                            }
                                                        };
                                                        return ((0, jsx_runtime_1.jsx)(Button_1.default, { onClick: () => handleCopyFormat(format), disabled: copyState.loading &&
                                                                copyState.activeFormat === format.id, className: "memori-artifact-action-btn", ghost: true, icon: getIcon(), title: format.label, children: (0, jsx_runtime_1.jsx)("span", { className: "memori-artifact-action-text", children: format.label }) }, format.id));
                                                    }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: () => {
                                                            var _a;
                                                            return handleOpenExternal((_a = state.currentArtifact) !== null && _a !== void 0 ? _a : {
                                                                content: '',
                                                                mimeType: '',
                                                                title: '',
                                                                timestamp: new Date(),
                                                                size: 0,
                                                                id: '',
                                                                artifactId: '',
                                                            });
                                                        }, disabled: false, className: "memori-artifact-action-btn", ghost: true, icon: (0, jsx_runtime_1.jsx)(Link_1.default, { className: "memori-artifact-action-icon" }), title: t('artifact.external') || 'External', children: (0, jsx_runtime_1.jsx)("span", { className: "memori-artifact-action-text", children: t('artifact.external') || 'External' }) })] }) }) })] })] })), isMobile && ((0, jsx_runtime_1.jsx)(Button_1.default, { onClick: closeArtifact, className: (0, classnames_1.default)('memori-artifact-drawer--close', 'memori-button--icon-only'), ghost: true, title: t('artifact.close') || 'Close', children: (0, jsx_runtime_1.jsx)(Close_1.default, { className: "memori-artifact-panel--close-icon" }) }))] }), (0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-panel--header" }), (0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-panel--content", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-panel--main", children: (0, jsx_runtime_1.jsx)(ArtifactPreview_1.default, { artifact: state.currentArtifact, activeTab: activeTab }) }) })] }));
};
exports.default = ArtifactDrawer;
//# sourceMappingURL=ArtifactDrawer.js.map