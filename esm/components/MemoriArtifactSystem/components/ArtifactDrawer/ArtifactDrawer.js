import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Transition, Menu } from '@headlessui/react';
import Button from '../../../ui/Button';
import Close from '../../../icons/Close';
import ArtifactActions from '../ArtifactActions/ArtifactActions';
import { useArtifact } from '../../context/ArtifactContext';
import ArtifactPreview from '../ArtifactPreview/ArtifactPreview';
import cx from 'classnames';
import Drawer from '../../../ui/Drawer';
import MenuVertical from '../../../icons/MenuVertical';
import Download from '../../../icons/Download';
import Link from '../../../icons/Link';
import PrintIcon from '../../../icons/Print';
import { useCopyArtifact } from '../ArtifactActions/hooks/useCopyArtifact';
import TabSwitch from './components/TabSwitch';
const ArtifactDrawer = ({ isChatLogPanel = false, }) => {
    const { state, closeArtifact, toggleFullscreen } = useArtifact();
    const { t } = useTranslation();
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState('preview');
    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
    }, [activeTab]);
    const { copyState, formats, handleCopy: handleCopyFormat, handleCopyClick, } = useCopyArtifact(state.currentArtifact || { content: '', mimeType: 'text/plain' }, () => console.log('Copy completed'), () => console.log('Download completed'), () => console.log('Print completed'));
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const handleCopy = useCallback(async () => {
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
    const handleToggleFullscreen = useCallback(() => {
        if (toggleFullscreen) {
            toggleFullscreen();
        }
    }, [toggleFullscreen]);
    const handleClose = useCallback(() => {
        closeArtifact();
    }, [closeArtifact]);
    if (!state.currentArtifact) {
        return null;
    }
    const hasPreview = state.currentArtifact.mimeType === 'html' ||
        state.currentArtifact.mimeType === 'markdown';
    const ContentContainer = useCallback(({ children }) => {
        if (isChatLogPanel) {
            return (_jsx("div", { style: { minHeight: '75vh', maxHeight: '75vh' }, className: "memori-artifact-panel", children: children }));
        }
        else {
            return (_jsx(Drawer, { open: state.isDrawerOpen, onClose: handleClose, placement: "right", width: "50%", className: state.isFullscreen
                    ? 'memori-artifact-panel-drawer-fullscreen'
                    : 'memori-artifact-panel-drawer', widthMd: "100%", widthLg: "50%", closable: false, animated: true, enterDuration: isMobile ? 'duration-500' : 'duration-300', leaveDuration: isMobile ? 'duration-400' : 'duration-200', showBackdrop: false, preventBackdropClose: true, confirmDialogTitle: t('artifact.confirmDialogTitle') ||
                    'Are you sure you want to close this artifact?', confirmDialogMessage: t('artifact.confirmDialogMessage') ||
                    'This action cannot be undone.', children: children }));
        }
    }, [isChatLogPanel, handleClose, state.isDrawerOpen, state.isFullscreen, isMobile]);
    const getMimeTypeString = useCallback((mimeType) => {
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
    const handleOpenExternal = useCallback((artifact) => {
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
    return (_jsxs(ContentContainer, { children: [_jsx("div", { className: cx('memori-artifact-drawer-container-actions', {
                    'memori-artifact-drawer-container-actions--no-preview': !hasPreview,
                    'memori-artifact-drawer-container-actions--chatlog': isChatLogPanel,
                }), children: !isMobile && (_jsxs(_Fragment, { children: [hasPreview && (_jsx(TabSwitch, { activeTab: activeTab, onTabChange: handleTabChange, hasPreview: hasPreview })), _jsx(ArtifactActions, { artifact: state.currentArtifact, onCopy: handleCopy, loading: false, isMobile: isMobile }), _jsx(Button, { onClick: closeArtifact, className: cx('memori-artifact-drawer--close', 'memori-button--icon-only', {
                                'memori-artifact-drawer--close-desktop': !hasPreview,
                            }), ghost: true, title: t('artifact.close') || 'Close', children: _jsx(Close, { className: "memori-artifact-panel--close-icon" }) })] })) }), _jsxs("div", { className: cx('memori-artifact-drawer-top-right', {
                    'memori-artifact-drawer-top-right--no-preview': !hasPreview,
                    'memori-artifact-drawer-top-right--chatlog': isChatLogPanel,
                }), children: [isMobile && (_jsxs(_Fragment, { children: [hasPreview && (_jsx(TabSwitch, { activeTab: activeTab, onTabChange: handleTabChange, hasPreview: hasPreview })), _jsxs(Menu, { as: "div", className: "memori-mobile-actions-menu", children: [_jsx(Menu.Button, { as: "div", className: "memori-mobile-actions-trigger", children: _jsx(Button, { className: cx('memori-button', 'memori-button--more-options', 'memori-button--icon-only'), ghost: true, title: t('artifact.actions') || 'Actions', children: _jsx(MenuVertical, { className: "memori-artifact-action-icon" }) }) }), _jsx(Transition, { as: React.Fragment, enter: "memori-mobile-dropdown-enter", enterFrom: "memori-mobile-dropdown-enter-from", enterTo: "memori-mobile-dropdown-enter-to", leave: "memori-mobile-dropdown-leave", leaveFrom: "memori-mobile-dropdown-leave-from", leaveTo: "memori-mobile-dropdown-leave-to", children: _jsx(Menu.Items, { className: "memori-mobile-dropdown", children: _jsxs("div", { className: "memori-mobile-dropdown-list", children: [_jsx(Button, { onClick: handleCopy, disabled: false, className: "memori-artifact-action-btn", ghost: true, title: t('artifact.copy') || 'Copy', children: _jsx("span", { className: "memori-artifact-action-text", children: t('artifact.copy') || 'Copy' }) }), formats.map(format => {
                                                        const getIcon = () => {
                                                            switch (format.action) {
                                                                case 'copy':
                                                                    return (_jsx(Link, { className: "memori-artifact-action-icon" }));
                                                                case 'download':
                                                                    return (_jsx(Download, { className: "memori-artifact-action-icon" }));
                                                                case 'print':
                                                                case 'pdf':
                                                                    return (_jsx(PrintIcon, { className: "memori-artifact-action-icon" }));
                                                                default:
                                                                    return (_jsx(Link, { className: "memori-artifact-action-icon" }));
                                                            }
                                                        };
                                                        return (_jsx(Button, { onClick: () => handleCopyFormat(format), disabled: copyState.loading &&
                                                                copyState.activeFormat === format.id, className: "memori-artifact-action-btn", ghost: true, icon: getIcon(), title: format.label, children: _jsx("span", { className: "memori-artifact-action-text", children: format.label }) }, format.id));
                                                    }), _jsx(Button, { onClick: () => {
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
                                                        }, disabled: false, className: "memori-artifact-action-btn", ghost: true, icon: _jsx(Link, { className: "memori-artifact-action-icon" }), title: t('artifact.external') || 'External', children: _jsx("span", { className: "memori-artifact-action-text", children: t('artifact.external') || 'External' }) })] }) }) })] })] })), isMobile && (_jsx(Button, { onClick: closeArtifact, className: cx('memori-artifact-drawer--close', 'memori-button--icon-only'), ghost: true, title: t('artifact.close') || 'Close', children: _jsx(Close, { className: "memori-artifact-panel--close-icon" }) }))] }), _jsx("div", { className: "memori-artifact-panel--header" }), _jsx("div", { className: "memori-artifact-panel--content", children: _jsx("div", { className: "memori-artifact-panel--main", children: _jsx(ArtifactPreview, { artifact: state.currentArtifact, activeTab: activeTab }) }) })] }));
};
export default ArtifactDrawer;
//# sourceMappingURL=ArtifactDrawer.js.map