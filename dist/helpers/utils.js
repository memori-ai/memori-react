"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeParseJSON = exports.disposeObject = exports.isSkinnedMesh = exports.correctMaterials = exports.installMathJax = exports.installMathJaxScript = exports.mathJaxConfig = exports.cleanUrl = exports.difference = exports.stripObjNulls = exports.truncateMessage = exports.getFieldFromCustomData = exports.escapeHTML = exports.withLinksOpenInNewTab = exports.stripHTML = exports.stripReasoningTags = exports.stripOutputTags = exports.isAssetOnlyDocumentAttachment = exports.getDocumentAttachmentAssetUrl = exports.stripDocumentAttachmentTags = exports.extractAttachmentLink = exports.extractAttachmentLinks = exports.parseDocumentAttachmentsFromMessage = exports.isLocalTextFilename = exports.isOfficeNativeFilename = exports.OFFICE_NATIVE_EXTENSIONS = exports.stripMarkdown = exports.stripEmojis = exports.stripDuplicates = exports.useDebounceFn = exports.useDebounce = exports.isValidUrl = exports.validURLRegEx = exports.usernameRegEx = exports.mailRegEx = exports.pwdRegEx = exports.isSafariIOS = exports.isSafari = exports.isAndroid = exports.isiOS = exports.isMobileOrTablet = exports.hasTouchscreen = void 0;
const tslib_1 = require("tslib");
const react_1 = require("react");
const three_1 = require("three");
const THREE = tslib_1.__importStar(require("three"));
const constants_1 = require("./constants");
const hasTouchscreen = () => {
    let hasTouchScreen = false;
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return hasTouchScreen;
    }
    if ('maxTouchPoints' in navigator) {
        hasTouchScreen = navigator.maxTouchPoints > 0;
    }
    else if ('msMaxTouchPoints' in navigator) {
        hasTouchScreen = navigator.msMaxTouchPoints > 0;
    }
    else {
        const mQ = window && 'matchMedia' in window && matchMedia('(pointer:coarse)');
        if (mQ && mQ.media === '(pointer:coarse)') {
            hasTouchScreen = !!mQ.matches;
        }
        else if ('orientation' in window) {
            hasTouchScreen = true;
        }
        else {
            var UA = navigator === null || navigator === void 0 ? void 0 : navigator.userAgent;
            hasTouchScreen =
                /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
                    /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
        }
    }
    return hasTouchScreen;
};
exports.hasTouchscreen = hasTouchscreen;
const MOBILE_TABLET_VIEWPORT_MAX = 1024;
const isMobileOrTablet = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    if (!(0, exports.hasTouchscreen)()) {
        return false;
    }
    const ua = (navigator === null || navigator === void 0 ? void 0 : navigator.userAgent) || '';
    if (/\b(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)\b/i.test(ua)) {
        return true;
    }
    return window.innerWidth <= MOBILE_TABLET_VIEWPORT_MAX;
};
exports.isMobileOrTablet = isMobileOrTablet;
const isiOS = () => {
    var _a;
    let platform = ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.userAgentData) === null || _a === void 0 ? void 0 : _a.platform) ||
        (navigator === null || navigator === void 0 ? void 0 : navigator.platform) ||
        'unknown';
    let userAgent = (navigator === null || navigator === void 0 ? void 0 : navigator.userAgent) || 'unknown';
    let isIOS = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
    ].includes(platform) ||
        (userAgent.includes('Mac') && 'ontouchend' in document);
    return isIOS;
};
exports.isiOS = isiOS;
const isAndroid = () => {
    var _a;
    let platform = ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.userAgentData) === null || _a === void 0 ? void 0 : _a.platform) ||
        (navigator === null || navigator === void 0 ? void 0 : navigator.platform) ||
        'unknown';
    let isAndroid = platform.toLowerCase() === 'android' ||
        navigator.userAgent.includes('Android');
    return isAndroid;
};
exports.isAndroid = isAndroid;
const isSafari = () => {
    if (typeof navigator === 'undefined')
        return false;
    const userAgent = navigator.userAgent;
    const isSafariUA = userAgent.includes('Safari') && !userAgent.includes('Chrome');
    const isWebKit = 'WebKit' in window && !('Chrome' in window);
    return isSafariUA || isWebKit;
};
exports.isSafari = isSafari;
const isSafariIOS = () => {
    if (typeof navigator === 'undefined')
        return false;
    const userAgent = navigator.userAgent;
    return (userAgent.includes('Safari') &&
        !userAgent.includes('Chrome') &&
        /iPad|iPhone|iPod/.test(userAgent));
};
exports.isSafariIOS = isSafariIOS;
exports.pwdRegEx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$_:;|,~+=\{\}\[\]%^&*-]).{8,}$/;
exports.mailRegEx = /^\w+([.-]?[+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
exports.usernameRegEx = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.+-]{2,32}$/;
exports.validURLRegEx = /^(ftp|http|https):\/\/[^ "]+$/;
const isValidUrl = (url) => {
    try {
        return Boolean(new URL(url));
    }
    catch (e) {
        return false;
    }
};
exports.isValidUrl = isValidUrl;
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = (0, react_1.useState)(value);
    (0, react_1.useEffect)(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}
exports.useDebounce = useDebounce;
function useDebounceFn(fn, delay) {
    const timeoutId = (0, react_1.useRef)();
    const originalFn = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        originalFn.current = fn;
        return () => {
            originalFn.current = null;
        };
    }, [fn]);
    (0, react_1.useEffect)(() => {
        return () => {
            clearTimeout(timeoutId.current);
        };
    }, []);
    return (0, react_1.useMemo)(() => ((...args) => {
        clearTimeout(timeoutId.current);
        timeoutId.current = window.setTimeout(() => {
            if (originalFn.current) {
                originalFn.current(...args);
            }
        }, delay);
    }), [delay]);
}
exports.useDebounceFn = useDebounceFn;
const stripDuplicates = (text) => {
    if (text
        .slice(0, text.length / 2)
        .trim()
        .toLowerCase() ===
        text
            .slice(text.length / 2 + 1)
            .trim()
            .toLowerCase())
        return text.slice(0, text.length / 2);
    return text;
};
exports.stripDuplicates = stripDuplicates;
const stripEmojis = (text) => {
    return text.replaceAll(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '').trim();
};
exports.stripEmojis = stripEmojis;
const stripMarkdown = (text) => {
    text = text.replaceAll(/```*?```/g, '');
    text = text.replaceAll(/```[\s\S]*?```/g, '');
    text = text.replaceAll(/`[^`]*`/g, '');
    text = text.replaceAll(/!\[[^\]]*\]\([^)]*\)/g, '');
    text = text.replaceAll(/\[([^\]]*)\]\([^)]*\)/g, '$1');
    text = text.replaceAll(/^> /gm, '');
    text = text.replaceAll(/^#+ /gm, '');
    text = text.replaceAll(/[*_]/g, '');
    text = text.replaceAll(/---/g, '');
    text = text.replaceAll(/~~/g, '');
    text = text.replaceAll(/^\s*[-*+] /gm, '');
    text = text.replaceAll(/^\s*\d+\.\s+/gm, '');
    text = text.replaceAll(/^\|.*\|$/gm, '');
    text = text.replaceAll(/\$\$[\s\S]*?\$\$/g, '');
    text = text.replaceAll(/\$[\s\S]*?\$/g, '');
    text = text.replaceAll(/\\\([\s\S]*?\\\)/g, '');
    text = text.replaceAll(/\\\[[\s\S]*?\\\]/g, '');
    text = text.replaceAll(/\s+/g, ' ').trim();
    return text;
};
exports.stripMarkdown = stripMarkdown;
exports.OFFICE_NATIVE_EXTENSIONS = constants_1.officeNativeExtensions;
const isOfficeNativeFilename = (filename) => {
    var _a;
    const ext = `.${((_a = filename.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || ''}`;
    return constants_1.officeNativeExtensions.includes(ext);
};
exports.isOfficeNativeFilename = isOfficeNativeFilename;
const isLocalTextFilename = (filename) => {
    var _a;
    const ext = `.${((_a = filename.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || ''}`;
    return constants_1.localTextExtensions.includes(ext);
};
exports.isLocalTextFilename = isLocalTextFilename;
const DOCUMENT_ATTACHMENT_REGEX = /<document_attachment filename="([^"]+)" type="([^"]+)">([\s\S]*?)<\/document_attachment>/g;
const ATTACHMENT_LINK_AFTER_REGEX = /<attachment_link>\s*([\s\S]*?)\s*<\/attachment_link>/;
const parseDocumentAttachmentsFromMessage = (text) => {
    var _a;
    if (!text)
        return [];
    const attachments = [];
    const regex = new RegExp(DOCUMENT_ATTACHMENT_REGEX.source, 'g');
    let match;
    while ((match = regex.exec(text)) !== null) {
        const [, filename, type, content] = match;
        const afterTag = text.slice(match.index + match[0].length);
        const linkMatch = afterTag.match(ATTACHMENT_LINK_AFTER_REGEX);
        const rawUrl = ((_a = linkMatch === null || linkMatch === void 0 ? void 0 : linkMatch[1]) === null || _a === void 0 ? void 0 : _a.trim()) || '';
        const url = /^https?:\/\//.test(rawUrl) ? rawUrl : '';
        attachments.push({
            filename,
            type,
            content: content.trim(),
            url,
        });
    }
    return attachments;
};
exports.parseDocumentAttachmentsFromMessage = parseDocumentAttachmentsFromMessage;
const extractAttachmentLinks = (content) => {
    return (0, exports.parseDocumentAttachmentsFromMessage)(content).map(attachment => attachment.url);
};
exports.extractAttachmentLinks = extractAttachmentLinks;
const extractAttachmentLink = (content) => {
    var _a;
    const match = content === null || content === void 0 ? void 0 : content.match(/<attachment_link>\s*([\s\S]*?)\s*<\/attachment_link>/);
    const rawUrl = ((_a = match === null || match === void 0 ? void 0 : match[1]) === null || _a === void 0 ? void 0 : _a.trim()) || '';
    return /^https?:\/\//.test(rawUrl) ? rawUrl : null;
};
exports.extractAttachmentLink = extractAttachmentLink;
const stripDocumentAttachmentTags = (text) => {
    const documentAttachmentTagRegex = /<document_attachment filename="([^"]+)" type="([^"]+)">([\s\S]*?)<\/document_attachment>/g;
    return text
        .replace(documentAttachmentTagRegex, '$3')
        .replace(/<attachment_source>\s*[\s\S]*?\s*<\/attachment_source>/g, '')
        .replace(/<attachment_link>\s*[\s\S]*?\s*<\/attachment_link>/g, '');
};
exports.stripDocumentAttachmentTags = stripDocumentAttachmentTags;
const getDocumentAttachmentAssetUrl = (attachment) => {
    var _a;
    return ((_a = attachment.url) === null || _a === void 0 ? void 0 : _a.trim()) ||
        (0, exports.extractAttachmentLink)(attachment.content || '') ||
        '';
};
exports.getDocumentAttachmentAssetUrl = getDocumentAttachmentAssetUrl;
const isAssetOnlyDocumentAttachment = (attachment) => {
    const filename = attachment.title || attachment.name || '';
    const assetUrl = (0, exports.getDocumentAttachmentAssetUrl)(attachment);
    if (!assetUrl)
        return false;
    if ((0, exports.isOfficeNativeFilename)(filename)) {
        return true;
    }
    const strippedContent = attachment.content
        ? (0, exports.stripDocumentAttachmentTags)(attachment.content).trim()
        : '';
    return !strippedContent;
};
exports.isAssetOnlyDocumentAttachment = isAssetOnlyDocumentAttachment;
const stripOutputTags = (text) => {
    const outputTagRegex = /<output.*?<\/output>/gs;
    if (!outputTagRegex.test(text)) {
        return text;
    }
    const strippedText = text.replace(outputTagRegex, '');
    return (0, exports.stripOutputTags)(strippedText);
};
exports.stripOutputTags = stripOutputTags;
const stripReasoningTags = (text) => {
    const reasoningTagRegex = /<think.*?<\/think>/gs;
    if (!reasoningTagRegex.test(text)) {
        return text;
    }
    const strippedText = text.replace(reasoningTagRegex, '');
    return strippedText;
};
exports.stripReasoningTags = stripReasoningTags;
const stripHTML = (text) => {
    if (typeof DOMParser !== 'undefined') {
        try {
            return (new DOMParser().parseFromString(text, 'text/html').body.textContent ||
                '');
        }
        catch (_a) {
        }
    }
    return text.replace(/<[^>]*>/g, '');
};
exports.stripHTML = stripHTML;
const withLinksOpenInNewTab = (html) => html.replace(/<a\s+/gi, '<a target="_blank" rel="noopener noreferrer" ');
exports.withLinksOpenInNewTab = withLinksOpenInNewTab;
const escapeHTML = (text) => {
    const el = document.createElement('textarea');
    el.textContent = text;
    return el.innerHTML;
};
exports.escapeHTML = escapeHTML;
const getFieldFromCustomData = (fieldName, data) => {
    try {
        if (data) {
            const jsonData = JSON.parse(data);
            return jsonData[fieldName];
        }
        return '';
    }
    catch (error) {
        return '';
    }
};
exports.getFieldFromCustomData = getFieldFromCustomData;
const MAX_MSG_CHARS = 4000;
const MAX_MSG_WORDS = 300;
const truncateMessage = (message) => {
    let truncatedMessage = message;
    if (message.length > MAX_MSG_CHARS) {
        truncatedMessage = `${message.slice(0, MAX_MSG_CHARS)}\n<br />...`;
    }
    if (truncatedMessage.split(' ').length > MAX_MSG_WORDS) {
        truncatedMessage = truncatedMessage
            .split(' ')
            .slice(0, MAX_MSG_WORDS)
            .join(' ')
            .concat('\n<br/>...');
    }
    return truncatedMessage;
};
exports.truncateMessage = truncateMessage;
const stripObjNulls = (obj) => {
    const newObj = { ...obj };
    Object.keys(newObj).forEach(key => {
        if (newObj[key] === null) {
            delete newObj[key];
        }
    });
    return newObj;
};
exports.stripObjNulls = stripObjNulls;
const difference = (origObj, newObj) => Object.keys(newObj).reduce((diffs, key) => {
    let diff = { ...diffs };
    if (origObj[key] !== newObj[key]) {
        diff[key] = newObj[key];
    }
    return diff;
}, {});
exports.difference = difference;
function cleanUrl(href) {
    try {
        href = encodeURI(href).replace(/%25/g, '%');
    }
    catch (e) {
        return null;
    }
    return href;
}
exports.cleanUrl = cleanUrl;
exports.mathJaxConfig = {
    startup: {
        elements: ['.memori-chat--bubble-content'],
    },
    options: {
        processHtmlClass: 'memori-chat--bubble-content',
    },
    tex: {
        inlineMath: [
            ['$', '$'],
            ['\\$', '\\$'],
        ],
        displayMath: [['$$', '$$']],
        processEscapes: true,
    },
    asciimath: {
        fixphi: true,
        displaystyle: true,
        decimalsign: '.',
    },
    skipStartupTypeset: true,
    chtml: {
        displayAlign: 'left',
    },
    svg: {
        fontCache: 'global',
    },
};
const installMathJaxScript = () => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    script.id = 'mathjax-script';
    document.head.appendChild(script);
};
exports.installMathJaxScript = installMathJaxScript;
const installMathJax = () => {
    window.MathJax = exports.mathJaxConfig;
    (0, exports.installMathJaxScript)();
};
exports.installMathJax = installMathJax;
function correctMaterials(materials) {
    Object.values(materials).forEach(material => {
        if (material instanceof three_1.MeshStandardMaterial) {
            material.roughness = 0.8;
            material.metalness = 0.1;
            material.shadowSide = 2;
            if (material.map) {
                material.map.anisotropy = 16;
            }
        }
    });
}
exports.correctMaterials = correctMaterials;
function isSkinnedMesh(object) {
    return object.isSkinnedMesh === true;
}
exports.isSkinnedMesh = isSkinnedMesh;
function disposeObject(object) {
    if ('geometry' in object && object.geometry instanceof THREE.BufferGeometry) {
        object.geometry.dispose();
    }
    if ('material' in object) {
        if (Array.isArray(object.material)) {
            if (Array.isArray(object.material)) {
                object.material.forEach((material) => {
                    if (material instanceof THREE.Material) {
                        material.dispose();
                    }
                });
            }
            else if (object && object.material instanceof THREE.Material) {
                object.material.dispose();
            }
        }
    }
    if (object.children) {
        object.children.forEach(disposeObject);
    }
}
exports.disposeObject = disposeObject;
const safeParseJSON = (jsonString, fallbackString = false) => {
    try {
        return JSON.parse(jsonString);
    }
    catch (error) {
        return fallbackString ? jsonString : null;
    }
};
exports.safeParseJSON = safeParseJSON;
//# sourceMappingURL=utils.js.map