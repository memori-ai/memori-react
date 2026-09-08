import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState, memo, useRef, } from 'react';
import { getResourceUrl } from '../../helpers/media';
import { stripHTML, stripDocumentAttachmentTags, isAssetOnlyDocumentAttachment, getDocumentAttachmentAssetUrl, } from '../../helpers/utils';
import { getTranslation } from '../../helpers/translations';
import { prismSyntaxLangs } from '../../helpers/constants';
import ModelViewer from '../CustomGLBModelViewer/ModelViewer';
import Snippet from '../Snippet/Snippet';
import Card from '../ui/Card';
import File from '../icons/File';
import { Transition } from '@headlessui/react';
import cx from 'classnames';
import Sound from '../icons/Sound';
import Link from '../icons/Link';
import { ellipsis } from 'ellipsed';
import { formatBytes, getFileExtensionFromUrl, getDocumentBadgeLabel, countLines, shouldUseDarkFileCard, fetchLinkPreview, getContentSize, normalizeUrl, getImageDisplaySource, FALLBACK_IMAGE_BASE64, TEXT_FILE_EXTENSIONS, IMAGE_MIME_TYPES, } from './MediaItemWidget.utils';
import { DocumentCard } from './DocumentCard';
import { MediaPreviewModal } from './MediaPreviewModal';
const CODE_MIME_TYPES = prismSyntaxLangs.map(l => l.mimeType);
const IMAGE_MODAL_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',
];
function isImageMime(mimeType) {
    return IMAGE_MODAL_MIME_TYPES.includes(mimeType);
}
export const RenderMediaItem = memo(function RenderMediaItem({ isChild: _isChild = false, item, sessionID, tenantID, preview = false, baseURL, apiURL, onClick: _onClick, customMediaRenderer, descriptionOneLine = false, onLinkPreviewInfo, }) {
    var _a, _b, _c, _d;
    const [copyNotification, setCopyNotification] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [link, setLink] = useState(null);
    const onLinkPreviewInfoRef = useRef(onLinkPreviewInfo);
    onLinkPreviewInfoRef.current = onLinkPreviewInfo;
    const resourceUrl = getResourceUrl({
        resourceURI: item.url,
        sessionID,
        tenantID,
        baseURL,
        apiURL,
    });
    const normURL = normalizeUrl(item.url);
    useEffect(() => {
        if (item.mimeType !== 'text/html' ||
            !normURL ||
            normURL === (link === null || link === void 0 ? void 0 : link.urlKey) ||
            !baseURL) {
            return;
        }
        let cancelled = false;
        fetchLinkPreview(normURL, baseURL).then(siteInfo => {
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
    const imageDisplay = getImageDisplaySource(item, resourceUrl);
    const { src: imageSrc, isRgb: isImageRGB } = imageDisplay;
    const linkTitle = item.title && item.title.length > 0 ? item.title : link === null || link === void 0 ? void 0 : link.title;
    const linkDescription = link === null || link === void 0 ? void 0 : link.description;
    const linkVideo = link === null || link === void 0 ? void 0 : link.video;
    const linkImage = (_c = link === null || link === void 0 ? void 0 : link.image) !== null && _c !== void 0 ? _c : (_d = link === null || link === void 0 ? void 0 : link.images) === null || _d === void 0 ? void 0 : _d[0];
    const renderMediaContent = useCallback((medium) => {
        const url = getResourceUrl({
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
                return isImageRGB ? (_jsx("picture", { className: "memori-media-item--figure", children: _jsx("div", { className: "memori-media-item--rgb-item", style: { backgroundColor: medium.url } }) })) : (_jsxs("picture", { className: "memori-media-item--figure", children: [!preview && imageSrc && (_jsx("source", { srcSet: imageSrc, type: medium.mimeType })), _jsx("img", { alt: medium.title, src: imageError || !imageSrc ? FALLBACK_IMAGE_BASE64 : imageSrc, onError: () => setImageError(true) })] }));
            case 'video/mp4':
            case 'video/quicktime':
            case 'video/avi':
            case 'video/mpeg':
                return (_jsxs("div", { className: "memori-media-item--video-container", children: [_jsxs("video", { className: "memori-media-item--video-player", controls: true, src: url, title: medium.title, children: [medium.mimeType === 'video/quicktime' && (_jsx("source", { src: medium.url, type: "video/mp4" })), _jsx("source", { src: medium.url, type: medium.mimeType }), "Your browser does not support this video format."] }), _jsx("div", { className: "memori-media-item--video-overlay hidden", children: _jsx("svg", { className: "memori-media-item--play-icon", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M8 5v14l11-7z" }) }) })] }));
            case 'audio/mpeg3':
            case 'audio/wav':
            case 'audio/mpeg':
                return (_jsxs("div", { className: "memori-media-item--audio-container", children: [_jsx("div", { className: "memori-media-item--audio-icon", children: _jsx(Sound, {}) }), _jsx("audio", { className: "memori-media-item--audio-player", controls: true, src: url })] }));
            case 'model/gltf-binary':
                return (_jsx("div", { className: "memori-media-item--model-container", children: _jsx("div", { className: "memori-media-item--model-viewer", children: _jsx(ModelViewer, { src: url, alt: "", poster: "data:image/png;base64,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" }) }) }));
            case 'text/plain':
                return medium.content ? (_jsx(Snippet, { preview: true, medium: medium })) : (_jsx(DocumentCard, { title: medium.title || 'File', badge: getDocumentBadgeLabel(medium.mimeType, medium.title), meta: (() => {
                        const size = getContentSize(medium);
                        return size != null && size > 0 ? formatBytes(size) : null;
                    })(), icon: _jsx(File, { className: "memori-media-item--document-icon-svg" }) }));
            case 'text/html':
                return (_jsx(DocumentCard, { title: medium.title || 'File', badge: getDocumentBadgeLabel(medium.mimeType, medium.title), meta: (() => {
                        const size = getContentSize(medium);
                        return size != null && size > 0 ? formatBytes(size) : null;
                    })(), icon: _jsx(Link, { className: "memori-media-item--document-icon-svg" }) }));
            default:
                return (_jsx(DocumentCard, { title: medium.title || 'File', badge: getDocumentBadgeLabel(medium.mimeType, medium.title), meta: (() => {
                        const size = getContentSize(medium);
                        return size != null && size > 0 ? formatBytes(size) : null;
                    })(), icon: _jsx(File, { className: "memori-media-item--document-icon-svg" }) }));
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
    const fileExtensionFromUrl = getFileExtensionFromUrl(normURL || item.url);
    const fileExtension = getDocumentBadgeLabel(item.mimeType, item.title, normURL || item.url);
    const isFile = shouldUseDarkFileCard(item, fileExtensionFromUrl, item.mimeType);
    const isTextFile = TEXT_FILE_EXTENSIONS.includes(fileExtension || '');
    const lineCount = isTextFile && item.content ? countLines(item.content) : null;
    const lineText = lineCount !== null
        ? lineCount === 1
            ? '1 line'
            : `${lineCount} lines`
        : null;
    if (isFile && !isCodeSnippet) {
        const contentSize = getContentSize(item);
        const sizeText = contentSize != null && contentSize > 0 ? formatBytes(contentSize) : null;
        const displayName = item.title || linkTitle || 'File';
        const metaParts = [lineText, sizeText].filter(Boolean);
        const metaLine = metaParts.length > 0 ? metaParts.join(' · ') : null;
        const isAssetOnlyAttachment = isAssetOnlyDocumentAttachment(item);
        if ((isDocumentAttachment || isAttachedFile) &&
            item.mediumID &&
            _onClick &&
            !isAssetOnlyAttachment) {
            return (_jsx("div", { onClick: () => _onClick(item), className: "memori-media-item--link memori-media-item--document-link", style: { cursor: 'pointer' }, title: displayName, role: "button", tabIndex: 0, onKeyDown: e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        _onClick(item);
                    }
                }, children: _jsx(DocumentCard, { title: displayName, badge: item.mimeType === 'text/html' && !!item.url
                        ? 'Link'
                        : fileExtension, meta: metaLine, icon: item.mimeType === 'text/html' ? (_jsx(Link, { className: "memori-media-item--document-icon-svg" })) : (_jsx(File, { className: "memori-media-item--document-icon-svg" })) }) }));
        }
        const getFileCardHref = () => {
            var _a;
            const assetUrl = getDocumentAttachmentAssetUrl(item);
            if (assetUrl) {
                return (getResourceUrl({
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
                        htmlContent = stripHTML(htmlContent) || htmlContent;
                    }
                    htmlContent = stripDocumentAttachmentTags(htmlContent);
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
        return (_jsx("a", { href: hrefUrl, target: "_blank", rel: "noopener noreferrer", className: "memori-media-item--link memori-media-item--document-link", title: displayName, children: _jsx(DocumentCard, { title: displayName, badge: item.mimeType === 'text/html' && !!item.url ? 'Link' : fileExtension, meta: metaLine, icon: item.mimeType === 'text/html' ? (_jsx(Link, { className: "memori-media-item--document-icon-svg" })) : (_jsx(File, { className: "memori-media-item--document-icon-svg" })) }) }));
    }
    const isPreviewableText = (isCodeSnippet || item.mimeType === 'text/plain') && !!item.content;
    if (isPreviewableText && item.mediumID && _onClick) {
        return (_jsx("div", { className: "memori-media-item--link", style: { cursor: 'pointer' }, onClick: () => _onClick(item), title: item.title, role: "button", tabIndex: 0, onKeyDown: e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    _onClick(item);
                }
            }, children: _jsx(Card, { hoverable: true, cover: renderMediaContent(item), title: item.title }) }));
    }
    if (isHTML && (linkImage || linkVideo || linkDescription)) {
        const coverSrc = (linkImage === null || linkImage === void 0 ? void 0 : linkImage.includes('data:image')) === true
            ? undefined
            : (linkImage === null || linkImage === void 0 ? void 0 : linkImage.startsWith('https'))
                ? linkImage
                : linkImage
                    ? `https://${linkImage.replace('http://', '')}`
                    : undefined;
        return (_jsx("a", { href: item.url || '#', target: "_blank", rel: "noopener noreferrer", className: "memori-media-item--link", title: linkTitle, children: _jsx(Card, { hoverable: true, className: cx('memori-media-item--card', {
                    'memori-media-item--card-description-oneline': descriptionOneLine,
                    'memori-media-item--card-has-image': !!linkImage,
                    'memori-media-item--card-has-video': !!linkVideo,
                }), cover: linkVideo ? (_jsx("iframe", { width: "100%", height: "100%", src: linkVideo, title: "Video player", frameBorder: "0", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true })) : linkImage ? (_jsx("img", { className: "memori-media-item--card-cover-img", src: coverSrc, alt: linkTitle })) : (_jsx("div", { className: "memori-media-item--card-cover-icon", children: _jsx(Link, { className: "memori-media-item--icon" }) })), title: linkTitle, description: linkDescription }) }));
    }
    useEffect(() => {
        if (!linkDescription)
            return;
        const t = setTimeout(() => {
            ellipsis('.memori-media-item--card .memori-card--description', 3, {
                responsive: true,
            });
        }, 300);
        return () => clearTimeout(t);
    }, [linkDescription, item.mediumID]);
    if (isImageMime(item.mimeType)) {
        if (isImageRGB) {
            return (_jsx(Card, { hoverable: true, className: "memori-media-item--card memori-media-item--image", cover: renderMediaContent(item) }));
        }
        if (item.mediumID && _onClick) {
            return (_jsx("div", { onClick: () => _onClick(item), className: "memori-media-item--link memori-media-item--image-link", style: { cursor: 'pointer' }, title: item.title, role: "button", tabIndex: 0, onKeyDown: e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        _onClick(item);
                    }
                }, children: _jsx(Card, { hoverable: true, className: "memori-media-item--card memori-media-item--image", cover: renderMediaContent(item) }) }));
        }
        return (_jsx(Card, { hoverable: true, className: "memori-media-item--card memori-media-item--image", cover: renderMediaContent(item) }));
    }
    switch (item.mimeType) {
        case 'video/mp4':
        case 'video/quicktime':
        case 'video/avi':
        case 'video/mpeg':
            return (_jsx("a", { className: "memori-media-item--link", href: resourceUrl || '#', target: "_blank", rel: "noopener noreferrer", title: item.title, children: renderMediaContent(item) }));
        case 'audio/mpeg3':
        case 'audio/wav':
        case 'audio/mpeg':
        case 'model/gltf-binary':
            if (resourceUrl) {
                return (_jsx("a", { className: "memori-media-item--link", href: resourceUrl, target: "_blank", rel: "noopener noreferrer", title: item.title, children: renderMediaContent(item) }));
            }
            return renderMediaContent(item);
        default:
            return (_jsx("a", { className: "memori-media-item--link", href: resourceUrl || '#', target: "_blank", rel: "noopener noreferrer", title: item.title, children: renderMediaContent(item) }));
    }
});
export const RenderSnippetItem = memo(function RenderSnippetItem({ item, onClick: _onClick, sessionID, tenantID, baseURL, apiURL, }) {
    var _a, _b;
    void _onClick;
    const resourceUrl = getResourceUrl({
        resourceURI: item.url,
        sessionID,
        tenantID,
        baseURL,
        apiURL,
    });
    const hasUrl = !!(resourceUrl && resourceUrl !== '#');
    const lineCount = countLines(item.content);
    const contentLength = (_b = (_a = item.content) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    const isShortSnippet = lineCount <= 5 && contentLength <= 200;
    const lineText = lineCount === 1 ? '1 riga' : `${lineCount} righe`;
    if (isShortSnippet) {
        return (_jsx("div", { className: "memori-media-item--snippet-direct", children: _jsx(Card, { className: "memori-media-item--card memori-media-item--snippet", children: _jsxs("div", { className: "memori-media-item--snippet-body", children: [_jsx("div", { className: "memori-media-item--snippet-title", children: item.title }), _jsx("div", { className: "memori-media-item--snippet-preview", children: _jsx(Snippet, { showCopyButton: true, preview: false, medium: item }) }), _jsx("div", { className: "memori-media-item--snippet-header", children: _jsx("span", { className: "memori-media-item--snippet-meta", children: lineText }) })] }) }) }));
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
    return (_jsx("div", { onClick: () => {
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
        }, className: "memori-media-item--link", title: item.title, children: _jsx(Card, { hoverable: true, className: "memori-media-item--card memori-media-item--snippet", children: _jsxs("div", { className: "memori-media-item--snippet-body", children: [_jsx("div", { className: "memori-media-item--snippet-title", children: item.title }), _jsx("div", { className: "memori-media-item--snippet-preview", children: _jsx(Snippet, { showCopyButton: false, preview: true, medium: item }) }), _jsx("div", { className: "memori-media-item--snippet-header", children: _jsx("span", { className: "memori-media-item--snippet-meta", children: lineText }) })] }) }) }));
});
const MediaItemWidget = ({ items, sessionID, tenantID, translateTo, baseURL, apiURL, customMediaRenderer, fromUser = false, descriptionOneLine = false, onLinkPreviewInfo, }) => {
    const [media, setMedia] = useState(items);
    const [openModalMedium, setOpenModalMedium] = useState();
    useEffect(() => {
        setMedia(items);
    }, [items]);
    const translateMediaCaptions = useCallback(async () => {
        if (!translateTo)
            return;
        const translated = await Promise.all((items !== null && items !== void 0 ? items : []).map(async (m) => {
            var _a;
            if (!m.title)
                return m;
            try {
                const t = await getTranslation(m.title, translateTo);
                return { ...m, title: (_a = t.text) !== null && _a !== void 0 ? _a : m.title };
            }
            catch (e) {
                console.error(e);
                return m;
            }
        }));
        setMedia(translated);
    }, [translateTo, items]);
    useEffect(() => {
        if (translateTo)
            translateMediaCaptions();
    }, [translateTo, translateMediaCaptions]);
    const nonCodeDisplayMedia = useMemo(() => media
        .filter(m => { var _a; return !((_a = m.properties) === null || _a === void 0 ? void 0 : _a.executable) && !CODE_MIME_TYPES.includes(m.mimeType); })
        .sort((a, b) => {
        var _a, _b;
        const at = (_a = a.creationTimestamp) !== null && _a !== void 0 ? _a : 0;
        const bt = (_b = b.creationTimestamp) !== null && _b !== void 0 ? _b : 0;
        return at > bt ? 1 : at < bt ? -1 : 0;
    }), [media]);
    const codeSnippets = useMemo(() => media.filter(m => { var _a; return !((_a = m.properties) === null || _a === void 0 ? void 0 : _a.executable) && CODE_MIME_TYPES.includes(m.mimeType); }), [media]);
    const cssExecutableCode = useMemo(() => media.filter(m => { var _a; return m.mimeType === 'text/css' && !!((_a = m.properties) === null || _a === void 0 ? void 0 : _a.executable); }), [media]);
    const imageCount = useMemo(() => nonCodeDisplayMedia.filter(m => IMAGE_MIME_TYPES.includes(m.mimeType)).length, [nonCodeDisplayMedia]);
    const handleMediaItemClick = useCallback((item) => {
        setOpenModalMedium(item);
    }, []);
    const handleSnippetClick = useCallback((item) => {
        setOpenModalMedium(item);
    }, []);
    const handleCloseModal = useCallback(() => {
        setOpenModalMedium(undefined);
    }, []);
    const handleModalNavigate = useCallback((mediumID) => {
        setOpenModalMedium(media.find(m => m.mediumID === mediumID));
    }, [media]);
    return (_jsxs(Transition, { appear: true, show: true, as: "div", className: "memori-media-items", children: [nonCodeDisplayMedia.length > 0 && (_jsx("div", { className: cx('memori-media-items--grid memori-chat-scroll-item', {
                    'memori-media-items--user': fromUser,
                    'memori-media-items--agent': !fromUser,
                    'memori-media-items--single': imageCount === 1,
                    'memori-media-items--few': imageCount >= 2 && imageCount <= 4,
                    'memori-media-items--many': imageCount >= 5,
                }), children: nonCodeDisplayMedia.map((item, index) => {
                    var _a, _b;
                    return (_jsx(Transition.Child, { as: "div", className: "memori-media-item", enter: `ease-out duration-500 delay-${index * 100}`, enterFrom: "opacity-0 scale-95", enterTo: "opacity-1 scale-100", leave: "ease-in duration-300", leaveFrom: "opacity-1 scale-100", leaveTo: "opacity-0 scale-95", children: _jsx(RenderMediaItem, { isChild: true, sessionID: sessionID, tenantID: tenantID, baseURL: baseURL, apiURL: apiURL, onClick: handleMediaItemClick, item: {
                                ...item,
                                title: item.title,
                                url: item.url,
                                content: item.content,
                                type: 'document',
                            }, customMediaRenderer: customMediaRenderer, descriptionOneLine: descriptionOneLine, onLinkPreviewInfo: onLinkPreviewInfo }) }, `media-${index}-${(_b = (_a = item.mediumID) !== null && _a !== void 0 ? _a : item.url) !== null && _b !== void 0 ? _b : 'n'}`));
                }) })), codeSnippets.length > 0 && (_jsx("div", { className: cx('memori-media-items--grid memori-chat-scroll-item', {
                    'memori-media-items--user': fromUser,
                    'memori-media-items--agent': !fromUser,
                }), children: codeSnippets.map((item, index) => {
                    var _a, _b;
                    return (_jsx(Transition.Child, { as: "div", className: "memori-media-item", enter: `ease-out duration-500 delay-${index * 100}`, enterFrom: "opacity-0 scale-95", enterTo: "opacity-1 scale-100", leave: "ease-in duration-300", leaveFrom: "opacity-1 scale-100", leaveTo: "opacity-0 scale-95", children: _jsx(RenderSnippetItem, { sessionID: sessionID, tenantID: tenantID, baseURL: baseURL, apiURL: apiURL, onClick: handleSnippetClick, item: {
                                ...item,
                                title: item.title,
                                url: item.url,
                                content: item.content,
                                type: 'document',
                            } }) }, `snippet-${index}-${(_b = (_a = item.mediumID) !== null && _a !== void 0 ? _a : item.url) !== null && _b !== void 0 ? _b : 'n'}`));
                }) })), cssExecutableCode.map(m => (_jsx("style", { dangerouslySetInnerHTML: { __html: m.content || '' } }, m.mediumID))), openModalMedium && (_jsx(MediaPreviewModal, { medium: openModalMedium, onClose: handleCloseModal, sessionID: sessionID, tenantID: tenantID, baseURL: baseURL, apiURL: apiURL, customMediaRenderer: customMediaRenderer, descriptionOneLine: descriptionOneLine, onLinkPreviewInfo: onLinkPreviewInfo, onMediumClick: handleModalNavigate }))] }));
};
export default memo(MediaItemWidget);
//# sourceMappingURL=MediaItemWidget.js.map