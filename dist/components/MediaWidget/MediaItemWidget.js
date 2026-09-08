"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderSnippetItem = exports.RenderMediaItem = void 0;
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const media_1 = require("../../helpers/media");
const utils_1 = require("../../helpers/utils");
const translations_1 = require("../../helpers/translations");
const constants_1 = require("../../helpers/constants");
const ModelViewer_1 = tslib_1.__importDefault(require("../CustomGLBModelViewer/ModelViewer"));
const Snippet_1 = tslib_1.__importDefault(require("../Snippet/Snippet"));
const Card_1 = tslib_1.__importDefault(require("../ui/Card"));
const File_1 = tslib_1.__importDefault(require("../icons/File"));
const react_2 = require("@headlessui/react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Sound_1 = tslib_1.__importDefault(require("../icons/Sound"));
const Link_1 = tslib_1.__importDefault(require("../icons/Link"));
const ellipsed_1 = require("ellipsed");
const MediaItemWidget_utils_1 = require("./MediaItemWidget.utils");
const DocumentCard_1 = require("./DocumentCard");
const MediaPreviewModal_1 = require("./MediaPreviewModal");
const CODE_MIME_TYPES = constants_1.prismSyntaxLangs.map(l => l.mimeType);
const IMAGE_MODAL_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',
];
function isImageMime(mimeType) {
    return IMAGE_MODAL_MIME_TYPES.includes(mimeType);
}
exports.RenderMediaItem = (0, react_1.memo)(function RenderMediaItem({ isChild: _isChild = false, item, sessionID, tenantID, preview = false, baseURL, apiURL, onClick: _onClick, customMediaRenderer, descriptionOneLine = false, onLinkPreviewInfo, }) {
    var _a, _b, _c, _d;
    const [copyNotification, setCopyNotification] = (0, react_1.useState)(false);
    const [imageError, setImageError] = (0, react_1.useState)(false);
    const [link, setLink] = (0, react_1.useState)(null);
    const onLinkPreviewInfoRef = (0, react_1.useRef)(onLinkPreviewInfo);
    onLinkPreviewInfoRef.current = onLinkPreviewInfo;
    const resourceUrl = (0, media_1.getResourceUrl)({
        resourceURI: item.url,
        sessionID,
        tenantID,
        baseURL,
        apiURL,
    });
    const normURL = (0, MediaItemWidget_utils_1.normalizeUrl)(item.url);
    (0, react_1.useEffect)(() => {
        if (item.mimeType !== 'text/html' ||
            !normURL ||
            normURL === (link === null || link === void 0 ? void 0 : link.urlKey) ||
            !baseURL) {
            return;
        }
        let cancelled = false;
        (0, MediaItemWidget_utils_1.fetchLinkPreview)(normURL, baseURL).then(siteInfo => {
            if (cancelled)
                return;
            setLink(siteInfo
                ? { ...siteInfo, urlKey: normURL }
                : null);
            if (siteInfo && onLinkPreviewInfoRef.current) {
                onLinkPreviewInfoRef.current(siteInfo);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [item === null || item === void 0 ? void 0 : item.url, baseURL, item.mimeType, normURL, link === null || link === void 0 ? void 0 : link.urlKey]);
    const customRenderer = customMediaRenderer === null || customMediaRenderer === void 0 ? void 0 : customMediaRenderer(item.mimeType);
    if (customRenderer) {
        return customRenderer;
    }
    const isCodeSnippet = CODE_MIME_TYPES.includes(item.mimeType);
    const isHTML = item.mimeType === 'text/html';
    const isDocumentAttachment = ((_a = item.properties) === null || _a === void 0 ? void 0 : _a.isDocumentAttachment) === true;
    const isAttachedFile = ((_b = item.properties) === null || _b === void 0 ? void 0 : _b.isAttachedFile) === true;
    const imageDisplay = (0, MediaItemWidget_utils_1.getImageDisplaySource)(item, resourceUrl);
    const { src: imageSrc, isRgb: isImageRGB } = imageDisplay;
    const linkTitle = item.title && item.title.length > 0 ? item.title : link === null || link === void 0 ? void 0 : link.title;
    const linkDescription = link === null || link === void 0 ? void 0 : link.description;
    const linkVideo = link === null || link === void 0 ? void 0 : link.video;
    const linkImage = (_c = link === null || link === void 0 ? void 0 : link.image) !== null && _c !== void 0 ? _c : (_d = link === null || link === void 0 ? void 0 : link.images) === null || _d === void 0 ? void 0 : _d[0];
    const renderMediaContent = (0, react_1.useCallback)((medium) => {
        const url = (0, media_1.getResourceUrl)({
            resourceURI: medium.url,
            sessionID,
            tenantID,
            baseURL,
            apiURL,
        });
        switch (medium.mimeType) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/jpg':
            case 'image/gif':
                return isImageRGB ? ((0, jsx_runtime_1.jsx)("picture", { className: "memori-media-item--figure", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--rgb-item", style: { backgroundColor: medium.url } }) })) : ((0, jsx_runtime_1.jsxs)("picture", { className: "memori-media-item--figure", children: [!preview && imageSrc && ((0, jsx_runtime_1.jsx)("source", { srcSet: imageSrc, type: medium.mimeType })), (0, jsx_runtime_1.jsx)("img", { alt: medium.title, src: imageError || !imageSrc ? MediaItemWidget_utils_1.FALLBACK_IMAGE_BASE64 : imageSrc, onError: () => setImageError(true) })] }));
            case 'video/mp4':
            case 'video/quicktime':
            case 'video/avi':
            case 'video/mpeg':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "memori-media-item--video-container", children: [(0, jsx_runtime_1.jsxs)("video", { className: "memori-media-item--video-player", controls: true, src: url, title: medium.title, children: [medium.mimeType === 'video/quicktime' && ((0, jsx_runtime_1.jsx)("source", { src: medium.url, type: "video/mp4" })), (0, jsx_runtime_1.jsx)("source", { src: medium.url, type: medium.mimeType }), "Your browser does not support this video format."] }), (0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--video-overlay hidden", children: (0, jsx_runtime_1.jsx)("svg", { className: "memori-media-item--play-icon", viewBox: "0 0 24 24", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { d: "M8 5v14l11-7z" }) }) })] }));
            case 'audio/mpeg3':
            case 'audio/wav':
            case 'audio/mpeg':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "memori-media-item--audio-container", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--audio-icon", children: (0, jsx_runtime_1.jsx)(Sound_1.default, {}) }), (0, jsx_runtime_1.jsx)("audio", { className: "memori-media-item--audio-player", controls: true, src: url })] }));
            case 'model/gltf-binary':
                return ((0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--model-container", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--model-viewer", children: (0, jsx_runtime_1.jsx)(ModelViewer_1.default, { src: url, alt: "", poster: "data:image/png;base64,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" }) }) }));
            case 'text/plain':
                return medium.content ? ((0, jsx_runtime_1.jsx)(Snippet_1.default, { preview: true, medium: medium })) : ((0, jsx_runtime_1.jsx)(DocumentCard_1.DocumentCard, { title: medium.title || 'File', badge: (0, MediaItemWidget_utils_1.getDocumentBadgeLabel)(medium.mimeType, medium.title), meta: (() => {
                        const size = (0, MediaItemWidget_utils_1.getContentSize)(medium);
                        return size != null && size > 0 ? (0, MediaItemWidget_utils_1.formatBytes)(size) : null;
                    })(), icon: (0, jsx_runtime_1.jsx)(File_1.default, { className: "memori-media-item--document-icon-svg" }) }));
            case 'text/html':
                return ((0, jsx_runtime_1.jsx)(DocumentCard_1.DocumentCard, { title: medium.title || 'File', badge: (0, MediaItemWidget_utils_1.getDocumentBadgeLabel)(medium.mimeType, medium.title), meta: (() => {
                        const size = (0, MediaItemWidget_utils_1.getContentSize)(medium);
                        return size != null && size > 0 ? (0, MediaItemWidget_utils_1.formatBytes)(size) : null;
                    })(), icon: (0, jsx_runtime_1.jsx)(Link_1.default, { className: "memori-media-item--document-icon-svg" }) }));
            default:
                return ((0, jsx_runtime_1.jsx)(DocumentCard_1.DocumentCard, { title: medium.title || 'File', badge: (0, MediaItemWidget_utils_1.getDocumentBadgeLabel)(medium.mimeType, medium.title), meta: (() => {
                        const size = (0, MediaItemWidget_utils_1.getContentSize)(medium);
                        return size != null && size > 0 ? (0, MediaItemWidget_utils_1.formatBytes)(size) : null;
                    })(), icon: (0, jsx_runtime_1.jsx)(File_1.default, { className: "memori-media-item--document-icon-svg" }) }));
        }
    }, [
        sessionID,
        tenantID,
        baseURL,
        apiURL,
        preview,
        imageSrc,
        imageError,
        isImageRGB,
        linkImage,
        linkVideo,
    ]);
    const fileExtensionFromUrl = (0, MediaItemWidget_utils_1.getFileExtensionFromUrl)(normURL || item.url);
    const fileExtension = (0, MediaItemWidget_utils_1.getDocumentBadgeLabel)(item.mimeType, item.title, normURL || item.url);
    const isFile = (0, MediaItemWidget_utils_1.shouldUseDarkFileCard)(item, fileExtensionFromUrl, item.mimeType);
    const isTextFile = MediaItemWidget_utils_1.TEXT_FILE_EXTENSIONS.includes(fileExtension || '');
    const lineCount = isTextFile && item.content ? (0, MediaItemWidget_utils_1.countLines)(item.content) : null;
    const lineText = lineCount !== null
        ? lineCount === 1
            ? '1 line'
            : `${lineCount} lines`
        : null;
    if (isFile && !isCodeSnippet) {
        const contentSize = (0, MediaItemWidget_utils_1.getContentSize)(item);
        const sizeText = contentSize != null && contentSize > 0 ? (0, MediaItemWidget_utils_1.formatBytes)(contentSize) : null;
        const displayName = item.title || linkTitle || 'File';
        const metaParts = [lineText, sizeText].filter(Boolean);
        const metaLine = metaParts.length > 0 ? metaParts.join(' · ') : null;
        const isAssetOnlyAttachment = (0, utils_1.isAssetOnlyDocumentAttachment)(item);
        if ((isDocumentAttachment || isAttachedFile) &&
            item.mediumID &&
            _onClick &&
            !isAssetOnlyAttachment) {
            return ((0, jsx_runtime_1.jsx)("div", { onClick: () => _onClick(item), className: "memori-media-item--link memori-media-item--document-link", style: { cursor: 'pointer' }, title: displayName, role: "button", tabIndex: 0, onKeyDown: e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        _onClick(item);
                    }
                }, children: (0, jsx_runtime_1.jsx)(DocumentCard_1.DocumentCard, { title: displayName, badge: item.mimeType === 'text/html' && !!item.url
                        ? 'Link'
                        : fileExtension, meta: metaLine, icon: item.mimeType === 'text/html' ? ((0, jsx_runtime_1.jsx)(Link_1.default, { className: "memori-media-item--document-icon-svg" })) : ((0, jsx_runtime_1.jsx)(File_1.default, { className: "memori-media-item--document-icon-svg" })) }) }));
        }
        const getFileCardHref = () => {
            var _a;
            const assetUrl = (0, utils_1.getDocumentAttachmentAssetUrl)(item);
            if (assetUrl) {
                return ((0, media_1.getResourceUrl)({
                    resourceURI: assetUrl,
                    sessionID,
                    tenantID,
                    baseURL,
                    apiURL,
                }) ||
                    assetUrl ||
                    '#');
            }
            if (isHTML && item.content) {
                let htmlContent = item.content;
                if (((_a = item.properties) === null || _a === void 0 ? void 0 : _a.isDocumentAttachment) ||
                    htmlContent.includes('document_attachment') ||
                    htmlContent.includes('<document_attachment')) {
                    if (htmlContent.includes('&lt;') || htmlContent.includes('&quot;')) {
                        htmlContent = (0, utils_1.stripHTML)(htmlContent) || htmlContent;
                    }
                    htmlContent = (0, utils_1.stripDocumentAttachmentTags)(htmlContent);
                }
                const blob = new Blob([htmlContent], { type: 'text/html' });
                return URL.createObjectURL(blob);
            }
            if (item.content) {
                const blob = new Blob([item.content], {
                    type: item.mimeType || 'text/plain',
                });
                return URL.createObjectURL(blob);
            }
            return '#';
        };
        const hrefUrl = getFileCardHref();
        return ((0, jsx_runtime_1.jsx)("a", { href: hrefUrl, target: "_blank", rel: "noopener noreferrer", className: "memori-media-item--link memori-media-item--document-link", title: displayName, children: (0, jsx_runtime_1.jsx)(DocumentCard_1.DocumentCard, { title: displayName, badge: item.mimeType === 'text/html' && !!item.url ? 'Link' : fileExtension, meta: metaLine, icon: item.mimeType === 'text/html' ? ((0, jsx_runtime_1.jsx)(Link_1.default, { className: "memori-media-item--document-icon-svg" })) : ((0, jsx_runtime_1.jsx)(File_1.default, { className: "memori-media-item--document-icon-svg" })) }) }));
    }
    const isPreviewableText = (isCodeSnippet || item.mimeType === 'text/plain') && !!item.content;
    if (isPreviewableText && item.mediumID && _onClick) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--link", style: { cursor: 'pointer' }, onClick: () => _onClick(item), title: item.title, role: "button", tabIndex: 0, onKeyDown: e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    _onClick(item);
                }
            }, children: (0, jsx_runtime_1.jsx)(Card_1.default, { hoverable: true, cover: renderMediaContent(item), title: item.title }) }));
    }
    if (isHTML && (linkImage || linkVideo || linkDescription)) {
        const coverSrc = (linkImage === null || linkImage === void 0 ? void 0 : linkImage.includes('data:image')) === true
            ? undefined
            : (linkImage === null || linkImage === void 0 ? void 0 : linkImage.startsWith('https'))
                ? linkImage
                : linkImage
                    ? `https://${linkImage.replace('http://', '')}`
                    : undefined;
        return ((0, jsx_runtime_1.jsx)("a", { href: item.url || '#', target: "_blank", rel: "noopener noreferrer", className: "memori-media-item--link", title: linkTitle, children: (0, jsx_runtime_1.jsx)(Card_1.default, { hoverable: true, className: (0, classnames_1.default)('memori-media-item--card', {
                    'memori-media-item--card-description-oneline': descriptionOneLine,
                    'memori-media-item--card-has-image': !!linkImage,
                    'memori-media-item--card-has-video': !!linkVideo,
                }), cover: linkVideo ? ((0, jsx_runtime_1.jsx)("iframe", { width: "100%", height: "100%", src: linkVideo, title: "Video player", frameBorder: "0", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true })) : linkImage ? ((0, jsx_runtime_1.jsx)("img", { className: "memori-media-item--card-cover-img", src: coverSrc, alt: linkTitle })) : ((0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--card-cover-icon", children: (0, jsx_runtime_1.jsx)(Link_1.default, { className: "memori-media-item--icon" }) })), title: linkTitle, description: linkDescription }) }));
    }
    (0, react_1.useEffect)(() => {
        if (!linkDescription)
            return;
        const t = setTimeout(() => {
            (0, ellipsed_1.ellipsis)('.memori-media-item--card .memori-card--description', 3, {
                responsive: true,
            });
        }, 300);
        return () => clearTimeout(t);
    }, [linkDescription, item.mediumID]);
    if (isImageMime(item.mimeType)) {
        if (isImageRGB) {
            return ((0, jsx_runtime_1.jsx)(Card_1.default, { hoverable: true, className: "memori-media-item--card memori-media-item--image", cover: renderMediaContent(item) }));
        }
        if (item.mediumID && _onClick) {
            return ((0, jsx_runtime_1.jsx)("div", { onClick: () => _onClick(item), className: "memori-media-item--link memori-media-item--image-link", style: { cursor: 'pointer' }, title: item.title, role: "button", tabIndex: 0, onKeyDown: e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        _onClick(item);
                    }
                }, children: (0, jsx_runtime_1.jsx)(Card_1.default, { hoverable: true, className: "memori-media-item--card memori-media-item--image", cover: renderMediaContent(item) }) }));
        }
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { hoverable: true, className: "memori-media-item--card memori-media-item--image", cover: renderMediaContent(item) }));
    }
    switch (item.mimeType) {
        case 'video/mp4':
        case 'video/quicktime':
        case 'video/avi':
        case 'video/mpeg':
            return ((0, jsx_runtime_1.jsx)("a", { className: "memori-media-item--link", href: resourceUrl || '#', target: "_blank", rel: "noopener noreferrer", title: item.title, children: renderMediaContent(item) }));
        case 'audio/mpeg3':
        case 'audio/wav':
        case 'audio/mpeg':
        case 'model/gltf-binary':
            if (resourceUrl) {
                return ((0, jsx_runtime_1.jsx)("a", { className: "memori-media-item--link", href: resourceUrl, target: "_blank", rel: "noopener noreferrer", title: item.title, children: renderMediaContent(item) }));
            }
            return renderMediaContent(item);
        default:
            return ((0, jsx_runtime_1.jsx)("a", { className: "memori-media-item--link", href: resourceUrl || '#', target: "_blank", rel: "noopener noreferrer", title: item.title, children: renderMediaContent(item) }));
    }
});
exports.RenderSnippetItem = (0, react_1.memo)(function RenderSnippetItem({ item, onClick: _onClick, sessionID, tenantID, baseURL, apiURL, }) {
    var _a, _b;
    void _onClick;
    const resourceUrl = (0, media_1.getResourceUrl)({
        resourceURI: item.url,
        sessionID,
        tenantID,
        baseURL,
        apiURL,
    });
    const hasUrl = !!(resourceUrl && resourceUrl !== '#');
    const lineCount = (0, MediaItemWidget_utils_1.countLines)(item.content);
    const contentLength = (_b = (_a = item.content) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    const isShortSnippet = lineCount <= 5 && contentLength <= 200;
    const lineText = lineCount === 1 ? '1 riga' : `${lineCount} righe`;
    if (isShortSnippet) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--snippet-direct", children: (0, jsx_runtime_1.jsx)(Card_1.default, { className: "memori-media-item--card memori-media-item--snippet", children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-media-item--snippet-body", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--snippet-title", children: item.title }), (0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--snippet-preview", children: (0, jsx_runtime_1.jsx)(Snippet_1.default, { showCopyButton: true, preview: false, medium: item }) }), (0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--snippet-header", children: (0, jsx_runtime_1.jsx)("span", { className: "memori-media-item--snippet-meta", children: lineText }) })] }) }) }));
    }
    const snippetHref = hasUrl
        ? resourceUrl
        : item.content
            ? (() => {
                const blob = new Blob([item.content], {
                    type: item.mimeType || 'text/plain',
                });
                return URL.createObjectURL(blob);
            })()
            : '#';
    return ((0, jsx_runtime_1.jsx)("div", { onClick: () => {
            if (item.mediumID && _onClick) {
                _onClick(item);
            }
        }, style: { cursor: 'pointer' }, role: "button", tabIndex: 0, onKeyDown: e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (item.mediumID && _onClick) {
                    _onClick(item);
                }
            }
        }, className: "memori-media-item--link", title: item.title, children: (0, jsx_runtime_1.jsx)(Card_1.default, { hoverable: true, className: "memori-media-item--card memori-media-item--snippet", children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-media-item--snippet-body", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--snippet-title", children: item.title }), (0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--snippet-preview", children: (0, jsx_runtime_1.jsx)(Snippet_1.default, { showCopyButton: false, preview: true, medium: item }) }), (0, jsx_runtime_1.jsx)("div", { className: "memori-media-item--snippet-header", children: (0, jsx_runtime_1.jsx)("span", { className: "memori-media-item--snippet-meta", children: lineText }) })] }) }) }));
});
const MediaItemWidget = ({ items, sessionID, tenantID, translateTo, baseURL, apiURL, customMediaRenderer, fromUser = false, descriptionOneLine = false, onLinkPreviewInfo, }) => {
    const [media, setMedia] = (0, react_1.useState)(items);
    const [openModalMedium, setOpenModalMedium] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        setMedia(items);
    }, [items]);
    const translateMediaCaptions = (0, react_1.useCallback)(async () => {
        if (!translateTo)
            return;
        const translated = await Promise.all((items !== null && items !== void 0 ? items : []).map(async (m) => {
            var _a;
            if (!m.title)
                return m;
            try {
                const t = await (0, translations_1.getTranslation)(m.title, translateTo);
                return { ...m, title: (_a = t.text) !== null && _a !== void 0 ? _a : m.title };
            }
            catch (e) {
                console.error(e);
                return m;
            }
        }));
        setMedia(translated);
    }, [translateTo, items]);
    (0, react_1.useEffect)(() => {
        if (translateTo)
            translateMediaCaptions();
    }, [translateTo, translateMediaCaptions]);
    const nonCodeDisplayMedia = (0, react_1.useMemo)(() => media
        .filter(m => { var _a; return !((_a = m.properties) === null || _a === void 0 ? void 0 : _a.executable) && !CODE_MIME_TYPES.includes(m.mimeType); })
        .sort((a, b) => {
        var _a, _b;
        const at = (_a = a.creationTimestamp) !== null && _a !== void 0 ? _a : 0;
        const bt = (_b = b.creationTimestamp) !== null && _b !== void 0 ? _b : 0;
        return at > bt ? 1 : at < bt ? -1 : 0;
    }), [media]);
    const codeSnippets = (0, react_1.useMemo)(() => media.filter(m => { var _a; return !((_a = m.properties) === null || _a === void 0 ? void 0 : _a.executable) && CODE_MIME_TYPES.includes(m.mimeType); }), [media]);
    const cssExecutableCode = (0, react_1.useMemo)(() => media.filter(m => { var _a; return m.mimeType === 'text/css' && !!((_a = m.properties) === null || _a === void 0 ? void 0 : _a.executable); }), [media]);
    const imageCount = (0, react_1.useMemo)(() => nonCodeDisplayMedia.filter(m => MediaItemWidget_utils_1.IMAGE_MIME_TYPES.includes(m.mimeType)).length, [nonCodeDisplayMedia]);
    const handleMediaItemClick = (0, react_1.useCallback)((item) => {
        setOpenModalMedium(item);
    }, []);
    const handleSnippetClick = (0, react_1.useCallback)((item) => {
        setOpenModalMedium(item);
    }, []);
    const handleCloseModal = (0, react_1.useCallback)(() => {
        setOpenModalMedium(undefined);
    }, []);
    const handleModalNavigate = (0, react_1.useCallback)((mediumID) => {
        setOpenModalMedium(media.find(m => m.mediumID === mediumID));
    }, [media]);
    return ((0, jsx_runtime_1.jsxs)(react_2.Transition, { appear: true, show: true, as: "div", className: "memori-media-items", children: [nonCodeDisplayMedia.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: (0, classnames_1.default)('memori-media-items--grid memori-chat-scroll-item', {
                    'memori-media-items--user': fromUser,
                    'memori-media-items--agent': !fromUser,
                    'memori-media-items--single': imageCount === 1,
                    'memori-media-items--few': imageCount >= 2 && imageCount <= 4,
                    'memori-media-items--many': imageCount >= 5,
                }), children: nonCodeDisplayMedia.map((item, index) => {
                    var _a, _b;
                    return ((0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: "div", className: "memori-media-item", enter: `ease-out duration-500 delay-${index * 100}`, enterFrom: "opacity-0 scale-95", enterTo: "opacity-1 scale-100", leave: "ease-in duration-300", leaveFrom: "opacity-1 scale-100", leaveTo: "opacity-0 scale-95", children: (0, jsx_runtime_1.jsx)(exports.RenderMediaItem, { isChild: true, sessionID: sessionID, tenantID: tenantID, baseURL: baseURL, apiURL: apiURL, onClick: handleMediaItemClick, item: {
                                ...item,
                                title: item.title,
                                url: item.url,
                                content: item.content,
                                type: 'document',
                            }, customMediaRenderer: customMediaRenderer, descriptionOneLine: descriptionOneLine, onLinkPreviewInfo: onLinkPreviewInfo }) }, `media-${index}-${(_b = (_a = item.mediumID) !== null && _a !== void 0 ? _a : item.url) !== null && _b !== void 0 ? _b : 'n'}`));
                }) })), codeSnippets.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: (0, classnames_1.default)('memori-media-items--grid memori-chat-scroll-item', {
                    'memori-media-items--user': fromUser,
                    'memori-media-items--agent': !fromUser,
                }), children: codeSnippets.map((item, index) => {
                    var _a, _b;
                    return ((0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: "div", className: "memori-media-item", enter: `ease-out duration-500 delay-${index * 100}`, enterFrom: "opacity-0 scale-95", enterTo: "opacity-1 scale-100", leave: "ease-in duration-300", leaveFrom: "opacity-1 scale-100", leaveTo: "opacity-0 scale-95", children: (0, jsx_runtime_1.jsx)(exports.RenderSnippetItem, { sessionID: sessionID, tenantID: tenantID, baseURL: baseURL, apiURL: apiURL, onClick: handleSnippetClick, item: {
                                ...item,
                                title: item.title,
                                url: item.url,
                                content: item.content,
                                type: 'document',
                            } }) }, `snippet-${index}-${(_b = (_a = item.mediumID) !== null && _a !== void 0 ? _a : item.url) !== null && _b !== void 0 ? _b : 'n'}`));
                }) })), cssExecutableCode.map(m => ((0, jsx_runtime_1.jsx)("style", { dangerouslySetInnerHTML: { __html: m.content || '' } }, m.mediumID))), openModalMedium && ((0, jsx_runtime_1.jsx)(MediaPreviewModal_1.MediaPreviewModal, { medium: openModalMedium, onClose: handleCloseModal, sessionID: sessionID, tenantID: tenantID, baseURL: baseURL, apiURL: apiURL, customMediaRenderer: customMediaRenderer, descriptionOneLine: descriptionOneLine, onLinkPreviewInfo: onLinkPreviewInfo, onMediumClick: handleModalNavigate }))] }));
};
exports.default = (0, react_1.memo)(MediaItemWidget);
//# sourceMappingURL=MediaItemWidget.js.map