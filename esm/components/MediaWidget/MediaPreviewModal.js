import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getResourceUrl } from '../../helpers/media';
import { prismSyntaxLangs } from '../../helpers/constants';
import { stripHTML, stripDocumentAttachmentTags } from '../../helpers/utils';
import Snippet from '../Snippet/Snippet';
import ContentPreviewModal from '../ContentPreviewModal';
import ModelViewer from '../CustomGLBModelViewer/ModelViewer';
import { IMAGE_MIME_TYPES, getImageDisplaySource, } from './MediaItemWidget.utils';
const CODE_MIME_TYPES = prismSyntaxLangs.map((l) => l.mimeType);
const MIME_PDF = 'application/pdf';
const MIME_EXCEL_XLS = 'application/vnd.ms-excel';
const MIME_EXCEL_XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const MIME_HTML = 'text/html';
const MIME_PLAIN = 'text/plain';
const MIME_CSV = 'text/csv';
const MIME_MARKDOWN = 'text/markdown';
const MIME_WORD_DOC = 'application/msword';
const MIME_WORD_DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const MIME_WORD_DOTX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.template';
const VIDEO_MIME_TYPES = [
    'video/mp4',
    'video/quicktime',
    'video/avi',
    'video/mpeg',
];
const AUDIO_MIME_TYPES = [
    'audio/mpeg3',
    'audio/wav',
    'audio/mpeg',
];
const MIME_3D_GLB = 'model/gltf-binary';
const DEFAULT_GLB_POSTER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlYiIvPjwvc3ZnPg==';
function isVideo(mimeType) {
    return VIDEO_MIME_TYPES.includes(mimeType);
}
function isAudio(mimeType) {
    return AUDIO_MIME_TYPES.includes(mimeType);
}
function isWordDoc(mimeType) {
    return (mimeType === MIME_WORD_DOC ||
        mimeType === MIME_WORD_DOCX ||
        mimeType === MIME_WORD_DOTX);
}
function isDocumentAttachmentContent(content) {
    if (!content || typeof content !== 'string')
        return false;
    const trimmed = content.trim();
    return (trimmed.includes('document_attachment') ||
        trimmed.includes('<document_attachment') ||
        trimmed.includes('</document_attachment>') ||
        trimmed.includes('&lt;document_attachment') ||
        trimmed.includes('&lt;/document_attachment&gt;') ||
        (trimmed.startsWith('<') && trimmed.includes('>') && trimmed.length < 10000));
}
export function MediaPreviewModal({ medium, onClose, sessionID, tenantID, baseURL, apiURL, customMediaRenderer: _customMediaRenderer, descriptionOneLine: _descriptionOneLine, onLinkPreviewInfo: _onLinkPreviewInfo, onMediumClick: _onMediumClick, }) {
    var _a, _b, _c, _d, _e, _f;
    const previewUrl = getResourceUrl({
        resourceURI: medium.url,
        sessionID,
        tenantID,
        baseURL,
        apiURL,
    });
    const isDocumentAttachment = ((_a = medium.properties) === null || _a === void 0 ? void 0 : _a.isDocumentAttachment) === true ||
        ((_b = medium.properties) === null || _b === void 0 ? void 0 : _b.isAttachedFile) === true ||
        isDocumentAttachmentContent(medium.content);
    const isImage = IMAGE_MIME_TYPES.includes(medium.mimeType);
    const isCode = CODE_MIME_TYPES.includes(medium.mimeType);
    const isPdf = medium.mimeType === MIME_PDF && !isDocumentAttachment;
    const isExcel = (medium.mimeType === MIME_EXCEL_XLS || medium.mimeType === MIME_EXCEL_XLSX) &&
        !isDocumentAttachment;
    const isHtmlWithContent = medium.mimeType === MIME_HTML && !!medium.content;
    const isHtmlLink = medium.mimeType === MIME_HTML && !!medium.url;
    const isVideoType = isVideo(medium.mimeType);
    const isAudioType = isAudio(medium.mimeType);
    const is3D = medium.mimeType === MIME_3D_GLB;
    const isCsv = medium.mimeType === MIME_CSV;
    const isPlainText = medium.mimeType === MIME_PLAIN || isDocumentAttachment || isCsv;
    const isMarkdown = medium.mimeType === MIME_MARKDOWN;
    const isWordType = isWordDoc(medium.mimeType);
    const mediaSrc = medium.content != null
        ? `data:${medium.mimeType};base64,${medium.content}`
        : previewUrl;
    const hasMediaSrc = !!mediaSrc;
    const glbSrc = medium.content != null
        ? `data:model/gltf-binary;base64,${medium.content}`
        : previewUrl;
    const imageDisplay = isImage
        ? getImageDisplaySource(medium, previewUrl)
        : { src: undefined, isRgb: false };
    const { src: imageSrc, isRgb: isImageRgb } = imageDisplay;
    const iframeSrcFromContent = medium.content
        ? `data:${medium.mimeType};base64,${medium.content}`
        : previewUrl;
    const htmlLinkSrc = !medium.url || medium.url.startsWith('http')
        ? medium.url
        : `https://${medium.url}`;
    const htmlAsTextMedium = {
        ...medium,
        mimeType: 'text/plain',
        content: stripHTML(medium.content || ''),
    };
    if (isImage) {
        if (isImageRgb && medium.url) {
            return (_jsx(ContentPreviewModal, { open: true, onClose: onClose, title: (_c = medium.title) !== null && _c !== void 0 ? _c : undefined, children: _jsx("div", { className: "memori-media-item-preview--content memori-media-item--modal-rgb", style: {
                        width: '100%',
                        minHeight: 200,
                        backgroundColor: medium.url,
                    } }) }));
        }
        if (imageSrc) {
            return (_jsx(ContentPreviewModal, { open: true, onClose: onClose, title: (_d = medium.title) !== null && _d !== void 0 ? _d : undefined, isImage: true, imageSrc: imageSrc, imageAlt: (_e = medium.title) !== null && _e !== void 0 ? _e : '' }));
        }
    }
    return (_jsx(ContentPreviewModal, { open: true, onClose: onClose, title: (_f = medium.title) !== null && _f !== void 0 ? _f : undefined, children: isCode ? (_jsx(Snippet, { preview: false, medium: medium })) : isDocumentAttachment && medium.content ? ((() => {
            const isHtmlDocumentAttachment = medium.mimeType === MIME_HTML && isDocumentAttachment;
            if (isHtmlDocumentAttachment) {
                let htmlContent = medium.content || '';
                if (htmlContent.includes('&lt;') || htmlContent.includes('&quot;')) {
                    htmlContent = stripHTML(htmlContent) || htmlContent;
                }
                else {
                    htmlContent = stripDocumentAttachmentTags(htmlContent);
                }
                const htmlMedium = {
                    ...medium,
                    mimeType: 'application/xml',
                    content: htmlContent,
                };
                return (_jsx(Snippet, { preview: false, medium: htmlMedium }));
            }
            else {
                let displayContent = medium.content;
                if (displayContent.includes('&lt;') || displayContent.includes('&quot;')) {
                    displayContent = stripHTML(displayContent) || displayContent;
                }
                else {
                    displayContent = stripDocumentAttachmentTags(displayContent);
                }
                displayContent = displayContent
                    .replace(/[ \t]+/g, ' ')
                    .replace(/\n{3,}/g, '\n\n')
                    .trim();
                return (_jsx(Snippet, { preview: false, medium: {
                        ...medium,
                        mimeType: 'text/plain',
                        content: displayContent,
                    } }));
            }
        })()) : isPdf && (previewUrl || medium.content) ? (_jsx("div", { className: "memori-media-item-preview--content memori-media-item--modal-iframe-wrap", children: _jsx("iframe", { title: medium.title || 'PDF preview', src: medium.content
                    ? `data:application/pdf;base64,${medium.content}`
                    : previewUrl, className: "memori-media-item--modal-iframe" }) })) : isExcel && (previewUrl || medium.content) ? (_jsx("div", { className: "memori-media-item-preview--content memori-media-item--modal-iframe-wrap", children: _jsx("iframe", { title: medium.title || 'Spreadsheet preview', src: iframeSrcFromContent, className: "memori-media-item--modal-iframe" }) })) : isHtmlWithContent && !isDocumentAttachment ? (_jsx(Snippet, { preview: false, medium: htmlAsTextMedium })) : isHtmlLink ? (_jsx("div", { className: "memori-media-item-preview--content memori-media-item--modal-iframe-wrap", children: _jsx("iframe", { title: medium.title || 'Link preview', src: htmlLinkSrc, className: "memori-media-item--modal-iframe" }) })) : isVideoType && hasMediaSrc ? (_jsx("div", { className: "memori-media-item-preview--content memori-media-item--modal-video-wrap", children: _jsxs("video", { className: "memori-media-item--modal-video", controls: true, src: mediaSrc, title: medium.title || 'Video preview', children: [medium.mimeType === 'video/quicktime' && (_jsx("source", { src: mediaSrc, type: "video/mp4" })), "Your browser does not support this video format."] }) })) : isAudioType && hasMediaSrc ? (_jsxs("div", { className: "memori-media-item-preview--content memori-media-item--modal-audio-wrap", children: [_jsx("p", { className: "memori-media-item--modal-audio-title", children: medium.title || 'Audio' }), _jsx("audio", { className: "memori-media-item--modal-audio", controls: true, src: mediaSrc, title: medium.title || 'Audio preview', children: "Your browser does not support this audio format." })] })) : is3D && glbSrc ? (_jsx("div", { className: "memori-media-item-preview--content memori-media-item--modal-3d-wrap", children: _jsx(ModelViewer, { src: glbSrc, poster: DEFAULT_GLB_POSTER, alt: medium.title || '3D model' }) })) : isPlainText && medium.content ? (_jsx(Snippet, { preview: false, medium: medium })) : isMarkdown && medium.content ? (_jsx(Snippet, { preview: false, medium: medium })) : (_jsxs("div", { className: "memori-media-item-preview--content memori-media-item--modal-fallback", children: [_jsx("p", { className: "memori-media-item--modal-fallback-message", children: isWordType
                        ? 'Preview not available for this document.'
                        : 'Preview not available for this file type.' }), _jsx("p", { className: "memori-media-item--modal-fallback-hint", children: "You can open it in a new tab or download it." }), previewUrl && (_jsxs("div", { className: "memori-media-item--modal-fallback-actions", children: [_jsx("a", { href: previewUrl, target: "_blank", rel: "noopener noreferrer", className: "memori-media-item--modal-fallback-link", children: "Open in new tab" }), _jsx("a", { href: previewUrl, download: medium.title || undefined, className: "memori-media-item--modal-fallback-link", children: "Download" })] }))] })) }));
}
//# sourceMappingURL=MediaPreviewModal.js.map