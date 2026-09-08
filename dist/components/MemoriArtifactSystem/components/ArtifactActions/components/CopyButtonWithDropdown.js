"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = tslib_1.__importStar(require("react"));
const react_2 = require("@headlessui/react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const useCopyArtifact_1 = require("../hooks/useCopyArtifact");
const CopyMenuItem_1 = tslib_1.__importDefault(require("./CopyMenuItem"));
const Button_1 = tslib_1.__importDefault(require("../../../../ui/Button"));
const Copy_1 = tslib_1.__importDefault(require("../../../../icons/Copy"));
const ChevronDown_1 = tslib_1.__importDefault(require("../../../../icons/ChevronDown"));
const ThumbUp_1 = tslib_1.__importDefault(require("../../../../icons/ThumbUp"));
const Alert_1 = tslib_1.__importDefault(require("../../../../icons/Alert"));
const react_i18next_1 = require("react-i18next");
const marked_1 = require("marked");
const dompurify_1 = tslib_1.__importDefault(require("dompurify"));
const CopyButtonWithDropdown = ({ artifact, onCopy, onDownload, onPrint, onOpenExternal, loading = false, className, disabled = false, }) => {
    const { copyState, formats, handleCopy, handleCopyClick } = (0, useCopyArtifact_1.useCopyArtifact)(artifact, onCopy, onDownload, onPrint);
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleFormatSelect = async (format) => {
        await handleCopy(format);
    };
    const renderMarkdownToHtml = (0, react_1.useCallback)((markdown) => {
        try {
            marked_1.marked.use({
                async: false,
                gfm: true,
                pedantic: false,
                renderer: {
                    link: ({ href, title, text }) => {
                        if (!href)
                            return text;
                        const cleanHref = href.startsWith('http') ? href : `https://${href}`;
                        return `<a href="${cleanHref}" target="_blank" rel="noopener noreferrer"${title ? ` title="${title}"` : ''}>${text}</a>`;
                    },
                },
            });
            const htmlContent = marked_1.marked.parse(markdown).toString().trim();
            const sanitizedHtml = dompurify_1.default.sanitize(htmlContent, {
                ADD_ATTR: ['target', 'rel'],
                ALLOWED_TAGS: [
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'p', 'br', 'strong', 'em', 'u', 's',
                    'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
                    'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
                    'div', 'span'
                ],
                ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt', 'class', 'id']
            });
            return sanitizedHtml;
        }
        catch (error) {
            console.error('Error rendering markdown:', error);
            return markdown
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br>');
        }
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
    const getButtonContent = () => {
        if (copyState.success) {
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ThumbUp_1.default, { className: "memori-copy-button-icon memori-copy-button-icon--success" }), (0, jsx_runtime_1.jsx)("span", { className: "memori-copy-button-text", children: t('artifact.copied') || 'Copied!' })] }));
        }
        if (copyState.error) {
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Alert_1.default, { className: "memori-copy-button-icon memori-copy-button-icon--error" }), (0, jsx_runtime_1.jsx)("span", { className: "memori-copy-button-text", children: t('artifact.error') || 'Error' })] }));
        }
        if (copyState.loading) {
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-copy-button-loading", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-copy-button-spinner" }) }), (0, jsx_runtime_1.jsx)("span", { className: "memori-copy-button-text", children: copyState.activeFormat === 'pdf'
                            ? t('artifact.generatingPdf') || 'Generating PDF...'
                            : t('artifact.copying') || 'Copying...' })] }));
        }
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Copy_1.default, { className: "memori-copy-button-icon" }), (0, jsx_runtime_1.jsx)("span", { className: "memori-copy-button-text", children: t('artifact.copy') || 'Copy' })] }));
    };
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
            let content = artifact.content;
            let mimeType = getMimeTypeString(artifact.mimeType);
            if (artifact.mimeType === 'markdown') {
                const renderedHtml = renderMarkdownToHtml(artifact.content);
                content = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${artifact.title || 'Artifact'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #2c3e50;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    h1 { border-bottom: 2px solid #eee; padding-bottom: 10px; }
    h2 { border-bottom: 1px solid #eee; padding-bottom: 5px; }
    code {
      background-color: #f4f4f4;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    }
    pre {
      background-color: #f8f8f8;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      border: 1px solid #e1e1e1;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #ddd;
      margin: 0;
      padding-left: 20px;
      color: #666;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
    a {
      color: #007acc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    ul, ol {
      padding-left: 20px;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  ${renderedHtml}
</body>
</html>`;
                mimeType = 'text/html';
            }
            const blob = new Blob([content], { type: mimeType });
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
    }, [artifact, getMimeTypeString, renderMarkdownToHtml, onOpenExternal]);
    const getButtonTitle = () => {
        if (copyState.success) {
            return 'Copied successfully!';
        }
        if (copyState.error) {
            return `Error: ${copyState.error}`;
        }
        if (copyState.loading) {
            return copyState.activeFormat === 'pdf'
                ? 'Generating PDF...'
                : 'Copying...';
        }
        if (formats.length > 0) {
            return `Copy as ${formats[0].label}`;
        }
        return 'Copy';
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "memori-copy-button-wrapper", children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-copy-button-group", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { onClick: handleCopyClick, disabled: disabled || loading || copyState.loading, className: (0, classnames_1.default)('memori-copy-button memori-copy-button--main ', {
                        'memori-copy-button--success': copyState.success,
                        'memori-copy-button--error': copyState.error,
                        'memori-copy-button--loading': copyState.loading,
                    }, className), ghost: true, title: getButtonTitle(), children: getButtonContent() }), formats.length > 0 && ((0, jsx_runtime_1.jsx)(react_2.Menu, { as: "div", className: "memori-copy-menu-wrapper", children: () => ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_2.Menu.Button, { as: "div", className: "memori-copy-button-trigger", children: (0, jsx_runtime_1.jsx)(Button_1.default, { disabled: disabled || loading || copyState.loading, className: "memori-copy-button--dropdown", ghost: true, title: "More copy options", children: (0, jsx_runtime_1.jsx)(ChevronDown_1.default, { className: "memori-copy-button-chevron" }) }) }), (0, jsx_runtime_1.jsx)(react_2.Transition, { as: react_1.default.Fragment, enter: "memori-copy-dropdown-enter", enterFrom: "memori-copy-dropdown-enter-from", enterTo: "memori-copy-dropdown-enter-to", leave: "memori-copy-dropdown-leave", leaveFrom: "memori-copy-dropdown-leave-from", leaveTo: "memori-copy-dropdown-leave-to", children: (0, jsx_runtime_1.jsx)(react_2.Menu.Items, { className: "memori-copy-dropdown", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-copy-dropdown-content", children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-copy-dropdown-list", children: [formats.map(format => ((0, jsx_runtime_1.jsx)(react_2.Menu.Item, { children: ({ active }) => ((0, jsx_runtime_1.jsx)(CopyMenuItem_1.default, { format: format, onClick: handleFormatSelect, loading: copyState.loading, active: active })) }, format.id))), (0, jsx_runtime_1.jsx)(CopyMenuItem_1.default, { format: {
                                                        id: 'external',
                                                        label: t('artifact.external') || 'External',
                                                        action: 'link',
                                                        mimeType: artifact.mimeType,
                                                    }, onClick: handleOpenExternal, loading: copyState.loading, active: false }), (0, jsx_runtime_1.jsx)(CopyMenuItem_1.default, { format: {
                                                        id: 'print',
                                                        label: t('artifact.print') || 'Print',
                                                        action: 'print',
                                                        mimeType: artifact.mimeType,
                                                    }, onClick: handlePrint, loading: copyState.loading, active: false })] }) }) }) })] })) }))] }) }));
};
exports.default = CopyButtonWithDropdown;
//# sourceMappingURL=CopyButtonWithDropdown.js.map