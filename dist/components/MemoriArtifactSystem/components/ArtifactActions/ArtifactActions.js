"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = tslib_1.__importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Button_1 = tslib_1.__importDefault(require("../../../ui/Button"));
const Link_1 = tslib_1.__importDefault(require("../../../icons/Link"));
const Print_1 = tslib_1.__importDefault(require("../../../icons/Print"));
const _1 = require("./");
const react_2 = require("@headlessui/react");
const MenuVertical_1 = tslib_1.__importDefault(require("../../../icons/MenuVertical"));
const ArtifactActions = ({ artifact, onCopy, onDownload, onPrint, onOpenExternal, loading = false, isMobile = false, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const getFileExtension = (0, react_1.useCallback)((mimeType) => {
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
    const handlePrint = (0, react_1.useCallback)(() => {
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
    const handleOpenExternal = (0, react_1.useCallback)(() => {
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
    return ((0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-actions", children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-artifact-actions-row", children: [(0, jsx_runtime_1.jsx)(_1.CopyButtonWithDropdown, { artifact: artifact, onCopy: onCopy, onDownload: onDownload, onPrint: onPrint, loading: loading, className: "memori-artifact-action-btn" }), isMobile && (0, jsx_runtime_1.jsxs)(react_2.Menu, { as: "div", className: "memori-copy-menu-wrapper", children: [(0, jsx_runtime_1.jsx)(react_2.Menu.Button, { as: "div", className: "memori-copy-button-trigger", children: (0, jsx_runtime_1.jsx)(Button_1.default, { disabled: loading, className: (0, classnames_1.default)('memori-button', 'memori-button--more-options', 'memori-button--icon-only'), ghost: true, title: "More copy options", children: (0, jsx_runtime_1.jsx)(MenuVertical_1.default, { className: "memori-artifact-action-icon" }) }) }), (0, jsx_runtime_1.jsx)(react_2.Transition, { as: react_1.default.Fragment, enter: "memori-copy-dropdown-enter", enterFrom: "memori-copy-dropdown-enter-from", enterTo: "memori-copy-dropdown-enter-to", leave: "memori-copy-dropdown-leave", leaveFrom: "memori-copy-dropdown-leave-from", leaveTo: "memori-copy-dropdown-leave-to", children: (0, jsx_runtime_1.jsx)(react_2.Menu.Items, { className: "memori-copy-dropdown", style: { minWidth: '200px' }, children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-copy-dropdown-list", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { onClick: handlePrint, disabled: loading, className: "memori-artifact-action-btn memori-artifact-action-btn--print", ghost: true, icon: (0, jsx_runtime_1.jsx)(Print_1.default, { className: "memori-artifact-action-icon" }), title: t('artifact.print') || 'Print', children: (0, jsx_runtime_1.jsx)("span", { className: "memori-artifact-action-text", children: t('artifact.print') || 'Print' }) }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: handleOpenExternal, disabled: loading, className: "memori-artifact-action-btn memori-artifact-action-btn--external", ghost: true, icon: (0, jsx_runtime_1.jsx)(Link_1.default, { className: "memori-artifact-action-icon" }), title: t('artifact.external') || 'External', children: (0, jsx_runtime_1.jsx)("span", { className: "memori-artifact-action-text", children: t('artifact.external') || 'External' }) })] }) }) })] })] }) }));
};
exports.default = ArtifactActions;
//# sourceMappingURL=ArtifactActions.js.map