"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Snippet_1 = tslib_1.__importDefault(require("../../../Snippet/Snippet"));
const message_1 = require("../../../../helpers/message");
const ArtifactPreview = ({ artifact, activeTab }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const renderPreview = (0, react_1.useCallback)(() => {
        switch (artifact.mimeType) {
            case 'html':
                return ((0, jsx_runtime_1.jsx)("iframe", { className: "memori-artifact-preview-iframe", srcDoc: artifact.content, style: {
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '6px',
                    }, title: `${artifact.title} Preview`, scrolling: "auto" }));
            case 'markdown': {
                const { text: renderedMarkdown } = (0, message_1.renderMsg)(artifact.content, false, 'Reasoning...', false);
                return ((0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-preview-markdown", dangerouslySetInnerHTML: {
                        __html: renderedMarkdown,
                    } }));
            }
            default:
                return ((0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-preview-text", dangerouslySetInnerHTML: {
                        __html: (0, message_1.sanitizeMsg)(artifact.content),
                    } }));
        }
    }, [artifact]);
    const mapArtifactMimeTypeToSnippetMimeType = (0, react_1.useCallback)((mimeType) => {
        switch (mimeType) {
            case 'javascript':
                return 'text/javascript';
            case 'typescript':
                return 'text/ecmascript';
            case 'html':
                return 'application/xml';
            case 'css':
                return 'text/css';
            case 'json':
                return 'application/json';
            case 'python':
                return 'text/x-python';
            case 'bash':
                return 'application/x-sh';
            case 'cpp':
            case 'csharp':
                return 'text/x-c++src';
            case 'php':
                return 'application/x-php';
            case 'sql':
                return 'text/x-sql';
            case 'ruby':
                return 'text/x-ruby';
            default:
                return 'text/plain';
        }
    }, []);
    const hasPreview = artifact.mimeType === 'html' || artifact.mimeType === 'markdown' || artifact.mimeType === 'svg';
    return ((0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-preview", children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-artifact-content", children: [(0, jsx_runtime_1.jsx)("div", { className: (0, classnames_1.default)('memori-artifact-tab-content', {
                        'memori-artifact-tab-content--active': activeTab === 'code' || !hasPreview,
                    }), children: (0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-code", children: (0, jsx_runtime_1.jsx)(Snippet_1.default, { showCopyButton: false, medium: {
                                mediumID: artifact.id,
                                mimeType: mapArtifactMimeTypeToSnippetMimeType(artifact.mimeType),
                                content: artifact.content,
                                title: artifact.title,
                                creationTimestamp: artifact.timestamp.toISOString(),
                                creationName: 'System',
                                lastChangeTimestamp: artifact.timestamp.toISOString(),
                                lastChangeName: 'System',
                            } }) }) }), hasPreview && ((0, jsx_runtime_1.jsx)("div", { className: (0, classnames_1.default)('memori-artifact-tab-content', {
                        'memori-artifact-tab-content--active': activeTab === 'preview',
                    }), children: (0, jsx_runtime_1.jsx)("div", { className: "memori-artifact-preview-content", children: renderPreview() }) }))] }) }));
};
exports.default = ArtifactPreview;
//# sourceMappingURL=ArtifactPreview.js.map