import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import Button from '../../../ui/Button';
import Link from '../../../icons/Link';
import PrintIcon from '../../../icons/Print';
import { CopyButtonWithDropdown } from './';
import { Menu, Transition } from '@headlessui/react';
import MenuVertical from '../../../icons/MenuVertical';
const ArtifactActions = ({ artifact, onCopy, onDownload, onPrint, onOpenExternal, loading = false, isMobile = false, }) => {
    const { t } = useTranslation();
    const getFileExtension = useCallback((mimeType) => {
        const extensions = {
            html: 'html',
            json: 'json',
            markdown: 'md',
            css: 'css',
            javascript: 'js',
            typescript: 'ts',
            svg: 'svg',
            xml: 'xml',
            text: 'txt',
            python: 'py',
            java: 'java',
            cpp: 'cpp',
            csharp: 'cs',
            php: 'php',
            ruby: 'rb',
            go: 'go',
            rust: 'rs',
            yaml: 'yml',
            sql: 'sql',
        };
        return extensions[mimeType] || 'txt';
    }, []);
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
    const handlePrint = useCallback(() => {
        try {
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert('Popup blocked! Please enable popups to print the artifact.');
                return;
            }
            let printContent;
            if (artifact.mimeType === 'html') {
                printContent = artifact.content;
            }
            else {
                printContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Artifact - ${artifact.mimeType.toUpperCase()}</title>
            <style>
              body { 
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; 
                white-space: pre-wrap; 
                margin: 20px; 
                line-height: 1.4;
              }
              @media print { 
                body { margin: 0; } 
              }
            </style>
          </head>
          <body>${artifact.content
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')}</body>
          </html>
        `;
            }
            printWindow.document.write(printContent);
            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
            onPrint === null || onPrint === void 0 ? void 0 : onPrint();
        }
        catch (error) {
            console.error('Print failed:', error);
        }
    }, [artifact, onPrint]);
    const handleOpenExternal = useCallback(() => {
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
            onOpenExternal === null || onOpenExternal === void 0 ? void 0 : onOpenExternal();
        }
        catch (error) {
            console.error('External open failed:', error);
        }
    }, [artifact, getMimeTypeString, onOpenExternal]);
    return (_jsx("div", { className: "memori-artifact-actions", children: _jsxs("div", { className: "memori-artifact-actions-row", children: [_jsx(CopyButtonWithDropdown, { artifact: artifact, onCopy: onCopy, onDownload: onDownload, onPrint: onPrint, loading: loading, className: "memori-artifact-action-btn" }), isMobile && _jsxs(Menu, { as: "div", className: "memori-copy-menu-wrapper", children: [_jsx(Menu.Button, { as: "div", className: "memori-copy-button-trigger", children: _jsx(Button, { disabled: loading, className: cx('memori-button', 'memori-button--more-options', 'memori-button--icon-only'), ghost: true, title: "More copy options", children: _jsx(MenuVertical, { className: "memori-artifact-action-icon" }) }) }), _jsx(Transition, { as: React.Fragment, enter: "memori-copy-dropdown-enter", enterFrom: "memori-copy-dropdown-enter-from", enterTo: "memori-copy-dropdown-enter-to", leave: "memori-copy-dropdown-leave", leaveFrom: "memori-copy-dropdown-leave-from", leaveTo: "memori-copy-dropdown-leave-to", children: _jsx(Menu.Items, { className: "memori-copy-dropdown", style: { minWidth: '200px' }, children: _jsxs("div", { className: "memori-copy-dropdown-list", children: [_jsx(Button, { onClick: handlePrint, disabled: loading, className: "memori-artifact-action-btn memori-artifact-action-btn--print", ghost: true, icon: _jsx(PrintIcon, { className: "memori-artifact-action-icon" }), title: t('artifact.print') || 'Print', children: _jsx("span", { className: "memori-artifact-action-text", children: t('artifact.print') || 'Print' }) }), _jsx(Button, { onClick: handleOpenExternal, disabled: loading, className: "memori-artifact-action-btn memori-artifact-action-btn--external", ghost: true, icon: _jsx(Link, { className: "memori-artifact-action-icon" }), title: t('artifact.external') || 'External', children: _jsx("span", { className: "memori-artifact-action-text", children: t('artifact.external') || 'External' }) })] }) }) })] })] }) }));
};
export default ArtifactActions;
//# sourceMappingURL=ArtifactActions.js.map