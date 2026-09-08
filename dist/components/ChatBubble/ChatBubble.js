"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_2 = require("@headlessui/react");
const media_1 = require("../../helpers/media");
const User_1 = tslib_1.__importDefault(require("../icons/User"));
const AI_1 = tslib_1.__importDefault(require("../icons/AI"));
const Translation_1 = tslib_1.__importDefault(require("../icons/Translation"));
const Tooltip_1 = tslib_1.__importDefault(require("../ui/Tooltip"));
const FeedbackButtons_1 = tslib_1.__importDefault(require("../FeedbackButtons/FeedbackButtons"));
const react_i18next_1 = require("react-i18next");
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const QuestionHelp_1 = tslib_1.__importDefault(require("../icons/QuestionHelp"));
const Copy_1 = tslib_1.__importDefault(require("../icons/Copy"));
const Code_1 = tslib_1.__importDefault(require("../icons/Code"));
const Bug_1 = tslib_1.__importDefault(require("../icons/Bug"));
const WhyThisAnswer_1 = tslib_1.__importDefault(require("../WhyThisAnswer/WhyThisAnswer"));
const utils_1 = require("../../helpers/utils");
const message_1 = require("../../helpers/message");
const Expandable_1 = tslib_1.__importDefault(require("../ui/Expandable"));
const Modal_1 = tslib_1.__importDefault(require("../ui/Modal"));
const utils_2 = require("../../helpers/utils");
const ChatBubble = ({ message, memori, tenant, baseUrl, apiUrl, client, sessionID, showFeedback, showWhyThisAnswer = true, showCopyButton = true, showTranslationOriginal = false, simulateUserPrompt, showAIicon = true, isFirst = false, useMathFormatting = false, user, userAvatar, experts, showFunctionCache = false, showReasoning = false, usageHtml = '', }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const lang = i18n.language || 'en';
    const [showingWhyThisAnswer, setShowingWhyThisAnswer] = (0, react_1.useState)(false);
    const [openFunctionCache, setOpenFunctionCache] = (0, react_1.useState)(false);
    const [copyFeedback, setCopyFeedback] = (0, react_1.useState)({
        plain: false,
        raw: false,
        functionCache: false,
    });
    const copyFeedbackTimers = (0, react_1.useRef)({
        plain: null,
        raw: null,
        functionCache: null,
    });
    (0, react_1.useEffect)(() => {
        if (typeof window !== 'undefined' && !window.MathJax) {
            (0, utils_2.installMathJax)();
        }
    }, []);
    const cleanText = (0, message_1.stripAttachmentTags)(message.translatedText || message.text);
    const { text: renderedText } = (0, message_1.renderMsg)(message.fromUser ? (0, message_1.truncateMessage)(cleanText) : cleanText, useMathFormatting, t('reasoning') || 'Reasoning...', showReasoning);
    const plainText = message.fromUser
        ? (0, message_1.sanitizeMsg)((0, message_1.truncateMessage)(cleanText))
        : (0, utils_1.stripHTML)((0, utils_1.stripOutputTags)(renderedText));
    const copyText = message.fromUser ? cleanText : plainText;
    const shouldShowCopyButtons = showCopyButton && (!!(plainText === null || plainText === void 0 ? void 0 : plainText.length) || !!((_a = message.text) === null || _a === void 0 ? void 0 : _a.length));
    const shouldShowCopyRawButton = shouldShowCopyButtons &&
        !!((_b = message.text) === null || _b === void 0 ? void 0 : _b.length) &&
        plainText !== message.text;
    const rawMessageText = (0, message_1.sanitizeMsg)((0, message_1.stripAllInternalTags)(message.fromUser
        ? message.text || ''
        : (message.text || '').replaceAll(/<think.*?>(.*?)<\/think>/gs, '')));
    const copiedLabel = t('copied') || 'Copied';
    const functionCacheData = (_c = message.media) === null || _c === void 0 ? void 0 : _c.filter(m => { var _a; return ((_a = m.properties) === null || _a === void 0 ? void 0 : _a.functionCache) === 'true'; });
    (0, react_1.useLayoutEffect)(() => {
        if (typeof window !== 'undefined' && !message.fromUser) {
            const timer = setTimeout(() => {
                if (window.MathJax && window.MathJax.typesetPromise) {
                    try {
                        const elements = document.querySelectorAll('.memori-chat--bubble-content');
                        if (elements.length > 0) {
                            const scrollContainer = document.querySelector('.memori-chat--history');
                            const currentScrollTop = (scrollContainer === null || scrollContainer === void 0 ? void 0 : scrollContainer.scrollTop) || 0;
                            const currentScrollHeight = (scrollContainer === null || scrollContainer === void 0 ? void 0 : scrollContainer.scrollHeight) || 0;
                            window.MathJax.typesetPromise(['.memori-chat--bubble-content'])
                                .then(() => {
                                if (scrollContainer) {
                                    const newScrollHeight = scrollContainer.scrollHeight;
                                    const heightDifference = newScrollHeight - currentScrollHeight;
                                    scrollContainer.scrollTop =
                                        currentScrollTop + heightDifference;
                                }
                            })
                                .catch(err => console.error('MathJax typesetting failed:', err));
                        }
                    }
                    catch (error) {
                        console.error('Error during MathJax typesetting:', error);
                    }
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [cleanText, message.fromUser, renderedText]);
    (0, react_1.useEffect)(() => {
        return () => {
            Object.keys(copyFeedbackTimers.current).forEach(key => {
                const timer = copyFeedbackTimers.current[key];
                if (timer) {
                    clearTimeout(timer);
                    copyFeedbackTimers.current[key] = null;
                }
            });
        };
    }, []);
    const functionCacheCopyText = (_d = functionCacheData === null || functionCacheData === void 0 ? void 0 : functionCacheData.map(f => `${f.title}\n\n${f.content}`).join('\n\n---\n\n')) !== null && _d !== void 0 ? _d : '';
    const triggerCopyFeedback = (type) => {
        setCopyFeedback(prev => ({ ...prev, [type]: true }));
        if (copyFeedbackTimers.current[type]) {
            clearTimeout(copyFeedbackTimers.current[type]);
        }
        copyFeedbackTimers.current[type] = setTimeout(() => {
            setCopyFeedback(prev => ({ ...prev, [type]: false }));
            copyFeedbackTimers.current[type] = null;
        }, 1500);
    };
    const handleCopyClick = (type, text) => {
        var _a;
        if (!(text === null || text === void 0 ? void 0 : text.length))
            return;
        if (typeof navigator !== 'undefined' && ((_a = navigator.clipboard) === null || _a === void 0 ? void 0 : _a.writeText)) {
            navigator.clipboard
                .writeText(text)
                .then(() => triggerCopyFeedback(type))
                .catch(err => {
                console.error('Copy failed', err);
            });
        }
        else {
            triggerCopyFeedback(type);
        }
    };
    const initialStatus = typeof message.initial === 'string' ? message.initial : null;
    const showInitialDivider = (message.initial === true || isFirst) && !initialStatus;
    const isSystemError = message.emitter === 'system';
    if (initialStatus) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "memori-chat--bubble-status-message", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-chat--bubble-status-message-content", children: initialStatus }) }));
    }
    if (isSystemError) {
        return ((0, jsx_runtime_1.jsxs)(react_2.Transition, { show: true, appear: true, as: "div", className: (0, classnames_1.default)('memori-chat--bubble-container memori-chat-scroll-item', {
                'memori-chat--bubble-from-user': false,
            }), children: [(0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: "picture", className: "memori-chat--bubble-avatar", enter: "transition ease-in-out duration-300", enterFrom: `opacity-0 scale-075 translate-x--15`, enterTo: "opacity-1 scale-1 translate-x-0", leave: "transition ease-in-out duration-300", leaveFrom: "opacity-1 scale-1 translate-x-0", leaveTo: `opacity-0 scale-075 translate-x--15`, title: !!((_e = message.emitter) === null || _e === void 0 ? void 0 : _e.length) && !!memori.enableBoardOfExperts
                        ? message.emitter
                        : memori.name, children: (0, jsx_runtime_1.jsx)("img", { className: "memori-chat--bubble-avatar-img", alt: !!((_f = message.emitter) === null || _f === void 0 ? void 0 : _f.length) && !!memori.enableBoardOfExperts
                            ? message.emitter
                            : memori.name, src: !!((_g = message.emitter) === null || _g === void 0 ? void 0 : _g.length) &&
                            !!memori.enableBoardOfExperts &&
                            (experts === null || experts === void 0 ? void 0 : experts.find(e => e.name === message.emitter))
                            ? `${new URL(apiUrl !== null && apiUrl !== void 0 ? apiUrl : '/').origin}/api/v1/memoriai/memori/avatar/${(_h = experts.find(e => e.name === message.emitter)) === null || _h === void 0 ? void 0 : _h.expertMemoriID}`
                            : memori.avatarURL && memori.avatarURL.length > 0
                                ? (0, media_1.getResourceUrl)({
                                    type: 'avatar',
                                    tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                    resourceURI: memori.avatarURL,
                                    baseURL: baseUrl,
                                    apiURL: apiUrl,
                                })
                                : (0, media_1.getResourceUrl)({
                                    tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                    type: 'avatar',
                                    baseURL: baseUrl || 'https://www.aisuru.com',
                                    apiURL: apiUrl,
                                }), onError: e => {
                            e.currentTarget.src =
                                memori.avatarURL && memori.avatarURL.length > 0
                                    ? (0, media_1.getResourceUrl)({
                                        type: 'avatar',
                                        tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                        resourceURI: memori.avatarURL,
                                        baseURL: baseUrl,
                                    })
                                    : (0, media_1.getResourceUrl)({
                                        tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                        type: 'avatar',
                                        baseURL: baseUrl,
                                    });
                            e.currentTarget.onerror = null;
                        } }) }), (0, jsx_runtime_1.jsx)("div", { className: "memori-chat--bubble memori-chat--bubble-status-message-error", children: (0, jsx_runtime_1.jsx)("div", { className: "memori-chat--bubble-message ", children: (0, message_1.sanitizeMsg)(cleanText) }) })] }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [showInitialDivider && (0, jsx_runtime_1.jsx)("div", { className: "memori-chat--bubble-initial" }), (0, jsx_runtime_1.jsxs)(react_2.Transition, { show: true, appear: true, as: "div", className: (0, classnames_1.default)('memori-chat--bubble-container memori-chat-scroll-item', {
                    'memori-chat--bubble-from-user': !!message.fromUser,
                    'memori-chat--with-addon': (message.generatedByAI && showAIicon) ||
                        (showFeedback && simulateUserPrompt),
                }), children: [!message.fromUser && ((0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: "picture", className: "memori-chat--bubble-avatar", enter: "transition ease-in-out duration-300", enterFrom: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, enterTo: "opacity-1 scale-1 translate-x-0", leave: "transition ease-in-out duration-300", leaveFrom: "opacity-1 scale-1 translate-x-0", leaveTo: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, title: !!((_j = message.emitter) === null || _j === void 0 ? void 0 : _j.length) && !!memori.enableBoardOfExperts
                            ? message.emitter
                            : memori.name, children: (0, jsx_runtime_1.jsx)("img", { className: "memori-chat--bubble-avatar-img", alt: !!((_k = message.emitter) === null || _k === void 0 ? void 0 : _k.length) && !!memori.enableBoardOfExperts
                                ? message.emitter
                                : memori.name, src: !!((_l = message.emitter) === null || _l === void 0 ? void 0 : _l.length) &&
                                !!memori.enableBoardOfExperts &&
                                (experts === null || experts === void 0 ? void 0 : experts.find(e => e.name === message.emitter))
                                ? `${new URL(apiUrl !== null && apiUrl !== void 0 ? apiUrl : '/').origin}/api/v1/memoriai/memori/avatar/${(_m = experts.find(e => e.name === message.emitter)) === null || _m === void 0 ? void 0 : _m.expertMemoriID}`
                                : memori.avatarURL && memori.avatarURL.length > 0
                                    ? (0, media_1.getResourceUrl)({
                                        type: 'avatar',
                                        tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                        resourceURI: memori.avatarURL,
                                        baseURL: baseUrl,
                                        apiURL: apiUrl,
                                    })
                                    : (0, media_1.getResourceUrl)({
                                        tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                        type: 'avatar',
                                        baseURL: baseUrl || 'https://www.aisuru.com',
                                        apiURL: apiUrl,
                                    }), onError: e => {
                                e.currentTarget.src =
                                    memori.avatarURL && memori.avatarURL.length > 0
                                        ? (0, media_1.getResourceUrl)({
                                            type: 'avatar',
                                            tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                            resourceURI: memori.avatarURL,
                                            baseURL: baseUrl,
                                        })
                                        : (0, media_1.getResourceUrl)({
                                            tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                            type: 'avatar',
                                            baseURL: baseUrl,
                                        });
                                e.currentTarget.onerror = null;
                            } }) })), (0, jsx_runtime_1.jsxs)(react_2.Transition.Child, { as: "div", className: (0, classnames_1.default)('memori-chat--bubble', {
                            'memori-chat--user-bubble': !!message.fromUser,
                            'memori-chat--with-addon': shouldShowCopyButtons ||
                                (message.generatedByAI && showAIicon) ||
                                (showFeedback && simulateUserPrompt),
                            'memori-chat--ai-generated': message.generatedByAI && showAIicon,
                            'memori-chat--with-feedback': showFeedback,
                        }), enter: "transition ease-in-out duration-300", enterFrom: `opacity-0 scale-09 translate-x-${message.fromUser ? '30' : '-30'}`, enterTo: "opacity-1 scale-1 translate-x-0", leave: "transition ease-in-out duration-300", leaveFrom: "opacity-1 scale-1 translate-x-0", leaveTo: `opacity-0 scale-09  translate-x-${message.fromUser ? '30' : '-30'}`, children: [message.fromUser ? ((0, jsx_runtime_1.jsx)(Expandable_1.default, { className: "memori-chat--bubble-content", mode: "characters", children: (0, jsx_runtime_1.jsx)("div", { dir: "auto", className: "memori-chat--bubble-content", dangerouslySetInnerHTML: { __html: (0, message_1.sanitizeMsg)(cleanText) } }) })) : ((0, jsx_runtime_1.jsx)("div", { dir: "auto", className: "memori-chat--bubble-content", dangerouslySetInnerHTML: { __html: renderedText } })), !!usageHtml && ((0, jsx_runtime_1.jsx)("div", { className: "memori-chat--usage-inside-bubble", dangerouslySetInnerHTML: { __html: usageHtml } })), (shouldShowCopyButtons ||
                                (message.generatedByAI && showAIicon) ||
                                (message.generatedByAI && showFunctionCache) ||
                                (showFeedback && simulateUserPrompt)) && ((0, jsx_runtime_1.jsxs)("div", { className: "memori-chat--bubble-addon", children: [shouldShowCopyButtons && ((0, jsx_runtime_1.jsx)(Button_1.default, { ghost: true, shape: "circle", title: copyFeedback.plain ? copiedLabel : t('copy') || 'Copy', className: (0, classnames_1.default)('memori-chat--bubble-action-icon', {
                                            'memori-chat--bubble-action-icon--from-user': message.fromUser,
                                            'memori-chat--bubble-action-icon--copied': copyFeedback.plain,
                                        }), icon: (0, jsx_runtime_1.jsx)(Copy_1.default, { "aria-label": copyFeedback.plain ? copiedLabel : t('copy') || 'Copy' }), onClick: () => handleCopyClick('plain', copyText) })), copyFeedback.plain && ((0, jsx_runtime_1.jsx)("span", { role: "status", "aria-live": "polite", className: (0, classnames_1.default)('memori-chat--bubble-action-feedback', {
                                            'memori-chat--bubble-action-feedback--from-user': message.fromUser,
                                        }), children: copiedLabel })), shouldShowCopyRawButton && ((0, jsx_runtime_1.jsx)(Button_1.default, { ghost: true, shape: "circle", title: copyFeedback.raw
                                            ? copiedLabel
                                            : t('copyRawCode') || 'Copy raw code', className: (0, classnames_1.default)('memori-chat--bubble-action-icon', {
                                            'memori-chat--bubble-action-icon--from-user': message.fromUser,
                                            'memori-chat--bubble-action-icon--copied': copyFeedback.raw,
                                        }), icon: (0, jsx_runtime_1.jsx)(Code_1.default, { "aria-label": copyFeedback.raw
                                                ? copiedLabel
                                                : t('copyRawCode') || 'Copy raw code' }), onClick: () => handleCopyClick('raw', rawMessageText) })), copyFeedback.raw && ((0, jsx_runtime_1.jsx)("span", { role: "status", "aria-live": "polite", className: (0, classnames_1.default)('memori-chat--bubble-action-feedback', {
                                            'memori-chat--bubble-action-feedback--from-user': message.fromUser,
                                        }), children: copiedLabel })), !message.fromUser &&
                                        showFunctionCache &&
                                        ((_o = message.media) === null || _o === void 0 ? void 0 : _o.some(m => {
                                            var _a, _b;
                                            return Boolean((_a = m.properties) === null || _a === void 0 ? void 0 : _a.functionCache) ||
                                                ((_b = m.properties) === null || _b === void 0 ? void 0 : _b.functionCache) === 'true';
                                        })) && ((0, jsx_runtime_1.jsx)(Button_1.default, { ghost: true, shape: "circle", title: "Debug", className: "memori-chat--bubble-action-icon memori-chat--bubble-action-icon--debug", icon: (0, jsx_runtime_1.jsx)(Bug_1.default, { "aria-label": "Debug" }), onClick: () => setOpenFunctionCache(true) })), showFeedback && !!simulateUserPrompt && ((0, jsx_runtime_1.jsx)(FeedbackButtons_1.default, { memori: memori, className: "memori-chat--bubble-feedback", dropdown: true, onNegativeClick: msg => {
                                            if (msg)
                                                simulateUserPrompt(msg);
                                        } })), message.generatedByAI && showAIicon && ((0, jsx_runtime_1.jsx)(Tooltip_1.default, { align: "right", content: t('generatedByAI') ||
                                            (lang === 'it'
                                                ? 'Risposta generata da IA, può talvolta generare informazioni non corrette'
                                                : 'Answer generated by AI, may occasionally generate incorrect informations'), className: "memori-chat--bubble-action-icon memori-chat--bubble-action-icon--ai", children: (0, jsx_runtime_1.jsx)("span", { children: (0, jsx_runtime_1.jsx)(AI_1.default, { title: t('generatedByAI') ||
                                                    (lang === 'it'
                                                        ? 'Risposta generata da IA, può talvolta generare informazioni non corrette'
                                                        : 'Answer generated by AI, may occasionally generate incorrect informations') }) }) })), showTranslationOriginal &&
                                        message.translatedText &&
                                        message.translatedText !== message.text && ((0, jsx_runtime_1.jsx)(Tooltip_1.default, { align: "right", content: `${lang === 'it' ? 'Testo originale' : 'Original text'}: ${(0, message_1.stripAllInternalTags)(message.text)}`, className: "memori-chat--bubble-action-icon memori-chat--bubble-action-icon--ai", children: (0, jsx_runtime_1.jsx)("span", { children: (0, jsx_runtime_1.jsx)(Translation_1.default, { "aria-label": lang === 'it' ? 'Testo originale' : 'Original text' }) }) })), !message.fromUser &&
                                        message.questionAnswered &&
                                        apiUrl &&
                                        showWhyThisAnswer && ((0, jsx_runtime_1.jsx)(Button_1.default, { ghost: true, shape: "circle", title: t('whyThisAnswer') || undefined, className: "memori-chat--bubble-action-icon", onClick: () => setShowingWhyThisAnswer(true), disabled: showingWhyThisAnswer, icon: (0, jsx_runtime_1.jsx)(QuestionHelp_1.default, { title: t('whyThisAnswer') || undefined }) }))] }))] }), message.fromUser && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (!!userAvatar && typeof userAvatar === 'string') ||
                            (!userAvatar && !!((_p = user === null || user === void 0 ? void 0 : user.avatarURL) === null || _p === void 0 ? void 0 : _p.length)) ? ((0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: "picture", className: "memori-chat--bubble-avatar", enter: "transition ease-in-out duration-300", enterFrom: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, enterTo: "opacity-1 scale-1 translate-x-0", leave: "transition ease-in-out duration-300", leaveFrom: "opacity-1 scale-1 translate-x-0", leaveTo: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, children: (0, jsx_runtime_1.jsx)("img", { className: "memori-chat--bubble-avatar-img", alt: (_q = user === null || user === void 0 ? void 0 : user.userName) !== null && _q !== void 0 ? _q : 'User', src: userAvatar !== null && userAvatar !== void 0 ? userAvatar : user === null || user === void 0 ? void 0 : user.avatarURL }) })) : !!userAvatar ? ((0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: "div", className: "memori-chat--bubble-avatar", enter: "transition ease-in-out duration-300", enterFrom: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, enterTo: "opacity-1 scale-1 translate-x-0", leave: "transition ease-in-out duration-300", leaveFrom: "opacity-1 scale-1 translate-x-0", leaveTo: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, children: userAvatar })) : ((0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: "div", className: "memori-chat--bubble-avatar", enter: "transition ease-in-out duration-300", enterFrom: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, enterTo: "opacity-1 scale-1 translate-x-0", leave: "transition ease-in-out duration-300", leaveFrom: "opacity-1 scale-1 translate-x-0", leaveTo: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, children: (0, jsx_runtime_1.jsx)(User_1.default, {}) })) }))] }), showingWhyThisAnswer && client && ((0, jsx_runtime_1.jsx)(WhyThisAnswer_1.default, { client: client, visible: showingWhyThisAnswer, message: message, closeDrawer: () => setShowingWhyThisAnswer(false), sessionID: sessionID })), (0, jsx_runtime_1.jsx)(Modal_1.default, { open: openFunctionCache, onClose: () => setOpenFunctionCache(false), className: "memori-chat--function-cache-modal", footer: (0, jsx_runtime_1.jsx)(Button_1.default, { icon: (0, jsx_runtime_1.jsx)(Copy_1.default, {}), onClick: () => handleCopyClick('functionCache', functionCacheCopyText), children: copyFeedback.functionCache
                        ? copiedLabel
                        : t('copy') || 'Copy' }), children: functionCacheData === null || functionCacheData === void 0 ? void 0 : functionCacheData.map((f, i) => ((0, jsx_runtime_1.jsxs)("div", { style: i > 0
                        ? {
                            marginTop: '1.5rem',
                            paddingTop: '1.5rem',
                            borderTop: '1px solid #e0e0e0',
                        }
                        : {
                            paddingTop: '1.5rem',
                        }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { marginTop: 0 }, children: f.title }), (0, jsx_runtime_1.jsx)("pre", { style: { whiteSpace: 'pre-wrap', wordWrap: 'break-word' }, children: f.content }, f.mediumID)] }, f.mediumID))) })] }));
};
exports.default = ChatBubble;
//# sourceMappingURL=ChatBubble.js.map