import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import Snippet from '../../../Snippet/Snippet';
import { renderMsg, sanitizeMsg } from '../../../../helpers/message';
const ArtifactPreview = ({ artifact, activeTab }) => {
    const { t } = useTranslation();
    const renderPreview = useCallback(() => {
        switch (artifact.mimeType) {
            case 'html':
                return (_jsx("iframe", { className: "memori-artifact-preview-iframe", srcDoc: artifact.content, style: {
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '6px',
                    }, title: `${artifact.title} Preview`, scrolling: "auto" }));
            case 'markdown': {
                const { text: renderedMarkdown } = renderMsg(artifact.content, false, 'Reasoning...', false);
                return (_jsx("div", { className: "memori-artifact-preview-markdown", dangerouslySetInnerHTML: {
                        __html: renderedMarkdown,
                    } }));
            }
            default:
                return (_jsx("div", { className: "memori-artifact-preview-text", dangerouslySetInnerHTML: {
                        __html: sanitizeMsg(artifact.content),
                    } }));
        }
    }, [artifact]);
    const mapArtifactMimeTypeToSnippetMimeType = useCallback((mimeType) => {
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
    return (_jsx("div", { className: "memori-artifact-preview", children: _jsxs("div", { className: "memori-artifact-content", children: [_jsx("div", { className: cx('memori-artifact-tab-content', {
                        'memori-artifact-tab-content--active': activeTab === 'code' || !hasPreview,
                    }), children: _jsx("div", { className: "memori-artifact-code", children: _jsx(Snippet, { showCopyButton: false, medium: {
                                mediumID: artifact.id,
                                mimeType: mapArtifactMimeTypeToSnippetMimeType(artifact.mimeType),
                                content: artifact.content,
                                title: artifact.title,
                                creationTimestamp: artifact.timestamp.toISOString(),
                                creationName: 'System',
                                lastChangeTimestamp: artifact.timestamp.toISOString(),
                                lastChangeName: 'System',
                            } }) }) }), hasPreview && (_jsx("div", { className: cx('memori-artifact-tab-content', {
                        'memori-artifact-tab-content--active': activeTab === 'preview',
                    }), children: _jsx("div", { className: "memori-artifact-preview-content", children: renderPreview() }) }))] }) }));
};
export default ArtifactPreview;
//# sourceMappingURL=ArtifactPreview.js.map