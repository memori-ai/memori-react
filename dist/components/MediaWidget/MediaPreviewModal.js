"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaPreviewModal = void 0;
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const media_1 = require("../../helpers/media");
const constants_1 = require("../../helpers/constants");
const utils_1 = require("../../helpers/utils");
const Snippet_1 = tslib_1.__importDefault(require("../Snippet/Snippet"));
const ContentPreviewModal_1 = tslib_1.__importDefault(require("../ContentPreviewModal"));
const ModelViewer_1 = tslib_1.__importDefault(require("../CustomGLBModelViewer/ModelViewer"));
const MediaItemWidget_utils_1 = require("./MediaItemWidget.utils");
const CODE_MIME_TYPES = constants_1.prismSyntaxLangs.map((l) => l.mimeType);
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
function MediaPreviewModal({ medium, onClose, sessionID, tenantID, baseURL, apiURL, customMediaRenderer: _customMediaRenderer, descriptionOneLine: _descriptionOneLine, onLinkPreviewInfo: _onLinkPreviewInfo, onMediumClick: _onMediumClick, }) {
    var _a, _b, _c, _d, _e, _f;
    const previewUrl = (0, media_1.getResourceUrl)({
        resourceURI: medium.url,
        sessionID,
        tenantID,
        baseURL,
        apiURL,
    });
    const isDocumentAttachment = ((_a = medium.properties) === null || _a === void 0 ? void 0 : _a.isDocumentAttachment) === true ||
        ((_b = medium.properties) === null || _b === void 0 ? void 0 : _b.isAttachedFile) === true ||
        isDocumentAttachmentContent(medium.content);
    const isImage = MediaItemWidget_utils_1.IMAGE_MIME_TYPES.includes(medium.mimeType);
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
        ? (0, MediaItemWidget_utils_1.getImageDisplaySource)(medium, previewUrl)
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
        content: (0, utils_1.stripHTML)(medium.content || ''),
    };
    if (isImage) {
        if (isImageRgb && medium.url) {
            return ((0, jsx_runtime_1.jsx)(ContentPreviewModal_1.default, { open: true, onClose: onClose, title: (_c = medium.title) !== null && _c !== void 0 ? _c : undefined, children: (0, jsx_runtime_1.jsx)("div", { className: "memori-media-item-preview--content memori-media-item--modal-rgb", style: {
                        width: '100%',
                        minHeight: 200,
                        backgroundColor: medium.url,
                    } }) }));
        }
        if (imageSrc) {
            return ((0, jsx_runtime_1.jsx)(ContentPreviewModal_1.default, { open: true, onClose: onClose, title: (_d = medium.title) !== null && _d !== void 0 ? _d : undefined, isImage: true, imageSrc: imageSrc, imageAlt: (_e = medium.title) !== null && _e !== void 0 ? _e : '' }));
        }
    }
    return ((0, jsx_runtime_1.jsx)(ContentPreviewModal_1.default, { open: true, onClose: onClose, title: (_f = medium.title) !== null && _f !== void 0 ? _f : undefined, children: isCode ? ((0, jsx_runtime_1.jsx)(Snippet_1.default, { preview: false, medium: medium })) : isDocumentAttachment && medium.content ? ((() => {
            const isHtmlDocumentAttachment = medium.mimeType === MIME_HTML && isDocumentAttachment;
            if (isHtmlDocumentAttachment) {
                let htmlContent = medium.content || '';
                if (htmlContent.includes('&lt;') || htmlContent.includes('&quot;')) {
                    htmlContent = (0, utils_1.stripHTML)(htmlContent) || htmlContent;
                }
                else {
                    htmlContent = (0, utils_1.stripDocumentAttachmentTags)(htmlContent);
                }
                const htmlMedium = {
                    ...medium,
                    mimeType: 'application/xml',
                    content: htmlContent,
                };
                return ((0, jsx_runtime_1.jsx)(Snippet_1.default, { preview: false, medium: htmlMedium }));
            }
            else {
                let displayContent = medium.content;
                if (displayContent.includes('&lt;') || displayContent.includes('&quot;')) {
                    displayContent = (0, utils_1.stripHTML)(displayContent) || displayContent;
                }
                else {
                    displayContent = (0, utils_1.stripDocumentAttachmentTags)(displayContent);
                }
                displayContent = displayContent
                    .replace(/[ \t]+/g, ' ')
                    .replace(/\n{3,}/g, '\n\n')
                    .trim();
                return ((0, jsx_runtime_1.jsx)(Snippet_1.default, { preview: false, medium: {
                        ...medium,
                        mimeType: 'text/plain',
                        content: displayContent,
                    } }));
            }
        })()) : isPdf && (previewUrl || medium.content) ? ((0, jsx_runtime_1.jsx)("div", { className: "memori-media-item-preview--content memori-media-item--modal-iframe-wrap", children: (0, jsx_runtime_1.jsx)("iframe", { title: medium.title || 'PDF preview', src: medium.content
                    ? `data:application/pdf;base64,${medium.content}`
                    : previewUrl, className: "memori-media-item--modal-iframe" }) })) : isExcel && (previewUrl || medium.content) ? ((0, jsx_runtime_1.jsx)("div", { className: "memori-media-item-preview--content memori-media-item--modal-iframe-wrap", children: (0, jsx_runtime_1.jsx)("iframe", { title: medium.title || 'Spreadsheet preview', src: iframeSrcFromContent, className: "memori-media-item--modal-iframe" }) })) : isHtmlWithContent && !isDocumentAttachment ? ((0, jsx_runtime_1.jsx)(Snippet_1.default, { preview: false, medium: htmlAsTextMedium })) : isHtmlLink ? ((0, jsx_runtime_1.jsx)("div", { className: "memori-media-item-preview--content memori-media-item--modal-iframe-wrap", children: (0, jsx_runtime_1.jsx)("iframe", { title: medium.title || 'Link preview', src: htmlLinkSrc, className: "memori-media-item--modal-iframe" }) })) : isVideoType && hasMediaSrc ? ((0, jsx_runtime_1.jsx)("div", { className: "memori-media-item-preview--content memori-media-item--modal-video-wrap", children: (0, jsx_runtime_1.jsxs)("video", { className: "memori-media-item--modal-video", controls: true, src: mediaSrc, title: medium.title || 'Video preview', children: [medium.mimeType === 'video/quicktime' && ((0, jsx_runtime_1.jsx)("source", { src: mediaSrc, type: "video/mp4" })), "Your browser does not support this video format."] }) })) : isAudioType && hasMediaSrc ? ((0, jsx_runtime_1.jsxs)("div", { className: "memori-media-item-preview--content memori-media-item--modal-audio-wrap", children: [(0, jsx_runtime_1.jsx)("p", { className: "memori-media-item--modal-audio-title", children: medium.title || 'Audio' }), (0, jsx_runtime_1.jsx)("audio", { className: "memori-media-item--modal-audio", controls: true, src: mediaSrc, title: medium.title || 'Audio preview', children: "Your browser does not support this audio format." })] })) : is3D && glbSrc ? ((0, jsx_runtime_1.jsx)("div", { className: "memori-media-item-preview--content memori-media-item--modal-3d-wrap", children: (0, jsx_runtime_1.jsx)(ModelViewer_1.default, { src: glbSrc, poster: DEFAULT_GLB_POSTER, alt: medium.title || '3D model' }) })) : isPlainText && medium.content ? ((0, jsx_runtime_1.jsx)(Snippet_1.default, { preview: false, medium: medium })) : isMarkdown && medium.content ? ((0, jsx_runtime_1.jsx)(Snippet_1.default, { preview: false, medium: medium })) : ((0, jsx_runtime_1.jsxs)("div", { className: "memori-media-item-preview--content memori-media-item--modal-fallback", children: [(0, jsx_runtime_1.jsx)("p", { className: "memori-media-item--modal-fallback-message", children: isWordType
                        ? 'Preview not available for this document.'
                        : 'Preview not available for this file type.' }), (0, jsx_runtime_1.jsx)("p", { className: "memori-media-item--modal-fallback-hint", children: "You can open it in a new tab or download it." }), previewUrl && ((0, jsx_runtime_1.jsxs)("div", { className: "memori-media-item--modal-fallback-actions", children: [(0, jsx_runtime_1.jsx)("a", { href: previewUrl, target: "_blank", rel: "noopener noreferrer", className: "memori-media-item--modal-fallback-link", children: "Open in new tab" }), (0, jsx_runtime_1.jsx)("a", { href: previewUrl, download: medium.title || undefined, className: "memori-media-item--modal-fallback-link", children: "Download" })] }))] })) }));
}
exports.MediaPreviewModal = MediaPreviewModal;
//# sourceMappingURL=MediaPreviewModal.js.map