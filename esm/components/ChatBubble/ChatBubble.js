import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { Transition } from '@headlessui/react';
import { getResourceUrl } from '../../helpers/media';
import UserIcon from '../icons/User';
import AI from '../icons/AI';
import Translation from '../icons/Translation';
import Tooltip from '../ui/Tooltip';
import FeedbackButtons from '../FeedbackButtons/FeedbackButtons';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import QuestionHelp from '../icons/QuestionHelp';
import Copy from '../icons/Copy';
import Code from '../icons/Code';
import Bug from '../icons/Bug';
import WhyThisAnswer from '../WhyThisAnswer/WhyThisAnswer';
import { stripHTML, stripOutputTags } from '../../helpers/utils';
import { renderMsg, sanitizeMsg, stripAttachmentTags, stripAllInternalTags, truncateMessage, } from '../../helpers/message';
import Expandable from '../ui/Expandable';
import Modal from '../ui/Modal';
import { installMathJax } from '../../helpers/utils';
const ChatBubble = ({ message, memori, tenant, baseUrl, apiUrl, client, sessionID, showFeedback, showWhyThisAnswer = true, showCopyButton = true, showTranslationOriginal = false, simulateUserPrompt, showAIicon = true, isFirst = false, useMathFormatting = false, user, userAvatar, experts, showFunctionCache = false, showReasoning = false, usageHtml = '', }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const { t, i18n } = useTranslation();
    const lang = i18n.language || 'en';
    const [showingWhyThisAnswer, setShowingWhyThisAnswer] = useState(false);
    const [openFunctionCache, setOpenFunctionCache] = useState(false);
    const [copyFeedback, setCopyFeedback] = useState({
        plain: false,
        raw: false,
        functionCache: false,
    });
    const copyFeedbackTimers = useRef({
        plain: null,
        raw: null,
        functionCache: null,
    });
    useEffect(() => {
        if (typeof window !== 'undefined' && !window.MathJax) {
            installMathJax();
        }
    }, []);
    const cleanText = stripAttachmentTags(message.translatedText || message.text);
    const { text: renderedText } = renderMsg(message.fromUser ? truncateMessage(cleanText) : cleanText, useMathFormatting, t('reasoning') || 'Reasoning...', showReasoning);
    const plainText = message.fromUser
        ? sanitizeMsg(truncateMessage(cleanText))
        : stripHTML(stripOutputTags(renderedText));
    const copyText = message.fromUser ? cleanText : plainText;
    const shouldShowCopyButtons = showCopyButton && (!!(plainText === null || plainText === void 0 ? void 0 : plainText.length) || !!((_a = message.text) === null || _a === void 0 ? void 0 : _a.length));
    const shouldShowCopyRawButton = shouldShowCopyButtons &&
        !!((_b = message.text) === null || _b === void 0 ? void 0 : _b.length) &&
        plainText !== message.text;
    const rawMessageText = sanitizeMsg(stripAllInternalTags(message.fromUser
        ? message.text || ''
        : (message.text || '').replaceAll(/<think.*?>(.*?)<\/think>/gs, '')));
    const copiedLabel = t('copied') || 'Copied';
    const functionCacheData = (_c = message.media) === null || _c === void 0 ? void 0 : _c.filter(m => { var _a; return ((_a = m.properties) === null || _a === void 0 ? void 0 : _a.functionCache) === 'true'; });
    useLayoutEffect(() => {
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
    useEffect(() => {
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
        return (_jsx("div", { className: "memori-chat--bubble-status-message", children: _jsx("div", { className: "memori-chat--bubble-status-message-content", children: initialStatus }) }));
    }
    if (isSystemError) {
        return (_jsxs(Transition, { show: true, appear: true, as: "div", className: cx('memori-chat--bubble-container memori-chat-scroll-item', {
                'memori-chat--bubble-from-user': false,
            }), children: [_jsx(Transition.Child, { as: "picture", className: "memori-chat--bubble-avatar", enter: "transition ease-in-out duration-300", enterFrom: `opacity-0 scale-075 translate-x--15`, enterTo: "opacity-1 scale-1 translate-x-0", leave: "transition ease-in-out duration-300", leaveFrom: "opacity-1 scale-1 translate-x-0", leaveTo: `opacity-0 scale-075 translate-x--15`, title: !!((_e = message.emitter) === null || _e === void 0 ? void 0 : _e.length) && !!memori.enableBoardOfExperts
                        ? message.emitter
                        : memori.name, children: _jsx("img", { className: "memori-chat--bubble-avatar-img", alt: !!((_f = message.emitter) === null || _f === void 0 ? void 0 : _f.length) && !!memori.enableBoardOfExperts
                            ? message.emitter
                            : memori.name, src: !!((_g = message.emitter) === null || _g === void 0 ? void 0 : _g.length) &&
                            !!memori.enableBoardOfExperts &&
                            (experts === null || experts === void 0 ? void 0 : experts.find(e => e.name === message.emitter))
                            ? `${new URL(apiUrl !== null && apiUrl !== void 0 ? apiUrl : '/').origin}/api/v1/memoriai/memori/avatar/${(_h = experts.find(e => e.name === message.emitter)) === null || _h === void 0 ? void 0 : _h.expertMemoriID}`
                            : memori.avatarURL && memori.avatarURL.length > 0
                                ? getResourceUrl({
                                    type: 'avatar',
                                    tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                    resourceURI: memori.avatarURL,
                                    baseURL: baseUrl,
                                    apiURL: apiUrl,
                                })
                                : getResourceUrl({
                                    tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                    type: 'avatar',
                                    baseURL: baseUrl || 'https://www.aisuru.com',
                                    apiURL: apiUrl,
                                }), onError: e => {
                            e.currentTarget.src =
                                memori.avatarURL && memori.avatarURL.length > 0
                                    ? getResourceUrl({
                                        type: 'avatar',
                                        tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                        resourceURI: memori.avatarURL,
                                        baseURL: baseUrl,
                                    })
                                    : getResourceUrl({
                                        tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                        type: 'avatar',
                                        baseURL: baseUrl,
                                    });
                            e.currentTarget.onerror = null;
                        } }) }), _jsx("div", { className: "memori-chat--bubble memori-chat--bubble-status-message-error", children: _jsx("div", { className: "memori-chat--bubble-message ", children: sanitizeMsg(cleanText) }) })] }));
    }
    return (_jsxs(_Fragment, { children: [showInitialDivider && _jsx("div", { className: "memori-chat--bubble-initial" }), _jsxs(Transition, { show: true, appear: true, as: "div", className: cx('memori-chat--bubble-container memori-chat-scroll-item', {
                    'memori-chat--bubble-from-user': !!message.fromUser,
                    'memori-chat--with-addon': (message.generatedByAI && showAIicon) ||
                        (showFeedback && simulateUserPrompt),
                }), children: [!message.fromUser && (_jsx(Transition.Child, { as: "picture", className: "memori-chat--bubble-avatar", enter: "transition ease-in-out duration-300", enterFrom: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, enterTo: "opacity-1 scale-1 translate-x-0", leave: "transition ease-in-out duration-300", leaveFrom: "opacity-1 scale-1 translate-x-0", leaveTo: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, title: !!((_j = message.emitter) === null || _j === void 0 ? void 0 : _j.length) && !!memori.enableBoardOfExperts
                            ? message.emitter
                            : memori.name, children: _jsx("img", { className: "memori-chat--bubble-avatar-img", alt: !!((_k = message.emitter) === null || _k === void 0 ? void 0 : _k.length) && !!memori.enableBoardOfExperts
                                ? message.emitter
                                : memori.name, src: !!((_l = message.emitter) === null || _l === void 0 ? void 0 : _l.length) &&
                                !!memori.enableBoardOfExperts &&
                                (experts === null || experts === void 0 ? void 0 : experts.find(e => e.name === message.emitter))
                                ? `${new URL(apiUrl !== null && apiUrl !== void 0 ? apiUrl : '/').origin}/api/v1/memoriai/memori/avatar/${(_m = experts.find(e => e.name === message.emitter)) === null || _m === void 0 ? void 0 : _m.expertMemoriID}`
                                : memori.avatarURL && memori.avatarURL.length > 0
                                    ? getResourceUrl({
                                        type: 'avatar',
                                        tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                        resourceURI: memori.avatarURL,
                                        baseURL: baseUrl,
                                        apiURL: apiUrl,
                                    })
                                    : getResourceUrl({
                                        tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                        type: 'avatar',
                                        baseURL: baseUrl || 'https://www.aisuru.com',
                                        apiURL: apiUrl,
                                    }), onError: e => {
                                e.currentTarget.src =
                                    memori.avatarURL && memori.avatarURL.length > 0
                                        ? getResourceUrl({
                                            type: 'avatar',
                                            tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                            resourceURI: memori.avatarURL,
                                            baseURL: baseUrl,
                                        })
                                        : getResourceUrl({
                                            tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                            type: 'avatar',
                                            baseURL: baseUrl,
                                        });
                                e.currentTarget.onerror = null;
                            } }) })), _jsxs(Transition.Child, { as: "div", className: cx('memori-chat--bubble', {
                            'memori-chat--user-bubble': !!message.fromUser,
                            'memori-chat--with-addon': shouldShowCopyButtons ||
                                (message.generatedByAI && showAIicon) ||
                                (showFeedback && simulateUserPrompt),
                            'memori-chat--ai-generated': message.generatedByAI && showAIicon,
                            'memori-chat--with-feedback': showFeedback,
                        }), enter: "transition ease-in-out duration-300", enterFrom: `opacity-0 scale-09 translate-x-${message.fromUser ? '30' : '-30'}`, enterTo: "opacity-1 scale-1 translate-x-0", leave: "transition ease-in-out duration-300", leaveFrom: "opacity-1 scale-1 translate-x-0", leaveTo: `opacity-0 scale-09  translate-x-${message.fromUser ? '30' : '-30'}`, children: [message.fromUser ? (_jsx(Expandable, { className: "memori-chat--bubble-content", mode: "characters", children: _jsx("div", { dir: "auto", className: "memori-chat--bubble-content", dangerouslySetInnerHTML: { __html: sanitizeMsg(cleanText) } }) })) : (_jsx("div", { dir: "auto", className: "memori-chat--bubble-content", dangerouslySetInnerHTML: { __html: renderedText } })), !!usageHtml && (_jsx("div", { className: "memori-chat--usage-inside-bubble", dangerouslySetInnerHTML: { __html: usageHtml } })), (shouldShowCopyButtons ||
                                (message.generatedByAI && showAIicon) ||
                                (message.generatedByAI && showFunctionCache) ||
                                (showFeedback && simulateUserPrompt)) && (_jsxs("div", { className: "memori-chat--bubble-addon", children: [shouldShowCopyButtons && (_jsx(Button, { ghost: true, shape: "circle", title: copyFeedback.plain ? copiedLabel : t('copy') || 'Copy', className: cx('memori-chat--bubble-action-icon', {
                                            'memori-chat--bubble-action-icon--from-user': message.fromUser,
                                            'memori-chat--bubble-action-icon--copied': copyFeedback.plain,
                                        }), icon: _jsx(Copy, { "aria-label": copyFeedback.plain ? copiedLabel : t('copy') || 'Copy' }), onClick: () => handleCopyClick('plain', copyText) })), copyFeedback.plain && (_jsx("span", { role: "status", "aria-live": "polite", className: cx('memori-chat--bubble-action-feedback', {
                                            'memori-chat--bubble-action-feedback--from-user': message.fromUser,
                                        }), children: copiedLabel })), shouldShowCopyRawButton && (_jsx(Button, { ghost: true, shape: "circle", title: copyFeedback.raw
                                            ? copiedLabel
                                            : t('copyRawCode') || 'Copy raw code', className: cx('memori-chat--bubble-action-icon', {
                                            'memori-chat--bubble-action-icon--from-user': message.fromUser,
                                            'memori-chat--bubble-action-icon--copied': copyFeedback.raw,
                                        }), icon: _jsx(Code, { "aria-label": copyFeedback.raw
                                                ? copiedLabel
                                                : t('copyRawCode') || 'Copy raw code' }), onClick: () => handleCopyClick('raw', rawMessageText) })), copyFeedback.raw && (_jsx("span", { role: "status", "aria-live": "polite", className: cx('memori-chat--bubble-action-feedback', {
                                            'memori-chat--bubble-action-feedback--from-user': message.fromUser,
                                        }), children: copiedLabel })), !message.fromUser &&
                                        showFunctionCache &&
                                        ((_o = message.media) === null || _o === void 0 ? void 0 : _o.some(m => {
                                            var _a, _b;
                                            return Boolean((_a = m.properties) === null || _a === void 0 ? void 0 : _a.functionCache) ||
                                                ((_b = m.properties) === null || _b === void 0 ? void 0 : _b.functionCache) === 'true';
                                        })) && (_jsx(Button, { ghost: true, shape: "circle", title: "Debug", className: "memori-chat--bubble-action-icon memori-chat--bubble-action-icon--debug", icon: _jsx(Bug, { "aria-label": "Debug" }), onClick: () => setOpenFunctionCache(true) })), showFeedback && !!simulateUserPrompt && (_jsx(FeedbackButtons, { memori: memori, className: "memori-chat--bubble-feedback", dropdown: true, onNegativeClick: msg => {
                                            if (msg)
                                                simulateUserPrompt(msg);
                                        } })), message.generatedByAI && showAIicon && (_jsx(Tooltip, { align: "right", content: t('generatedByAI') ||
                                            (lang === 'it'
                                                ? 'Risposta generata da IA, può talvolta generare informazioni non corrette'
                                                : 'Answer generated by AI, may occasionally generate incorrect informations'), className: "memori-chat--bubble-action-icon memori-chat--bubble-action-icon--ai", children: _jsx("span", { children: _jsx(AI, { title: t('generatedByAI') ||
                                                    (lang === 'it'
                                                        ? 'Risposta generata da IA, può talvolta generare informazioni non corrette'
                                                        : 'Answer generated by AI, may occasionally generate incorrect informations') }) }) })), showTranslationOriginal &&
                                        message.translatedText &&
                                        message.translatedText !== message.text && (_jsx(Tooltip, { align: "right", content: `${lang === 'it' ? 'Testo originale' : 'Original text'}: ${stripAllInternalTags(message.text)}`, className: "memori-chat--bubble-action-icon memori-chat--bubble-action-icon--ai", children: _jsx("span", { children: _jsx(Translation, { "aria-label": lang === 'it' ? 'Testo originale' : 'Original text' }) }) })), !message.fromUser &&
                                        message.questionAnswered &&
                                        apiUrl &&
                                        showWhyThisAnswer && (_jsx(Button, { ghost: true, shape: "circle", title: t('whyThisAnswer') || undefined, className: "memori-chat--bubble-action-icon", onClick: () => setShowingWhyThisAnswer(true), disabled: showingWhyThisAnswer, icon: _jsx(QuestionHelp, { title: t('whyThisAnswer') || undefined }) }))] }))] }), message.fromUser && (_jsx(_Fragment, { children: (!!userAvatar && typeof userAvatar === 'string') ||
                            (!userAvatar && !!((_p = user === null || user === void 0 ? void 0 : user.avatarURL) === null || _p === void 0 ? void 0 : _p.length)) ? (_jsx(Transition.Child, { as: "picture", className: "memori-chat--bubble-avatar", enter: "transition ease-in-out duration-300", enterFrom: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, enterTo: "opacity-1 scale-1 translate-x-0", leave: "transition ease-in-out duration-300", leaveFrom: "opacity-1 scale-1 translate-x-0", leaveTo: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, children: _jsx("img", { className: "memori-chat--bubble-avatar-img", alt: (_q = user === null || user === void 0 ? void 0 : user.userName) !== null && _q !== void 0 ? _q : 'User', src: userAvatar !== null && userAvatar !== void 0 ? userAvatar : user === null || user === void 0 ? void 0 : user.avatarURL }) })) : !!userAvatar ? (_jsx(Transition.Child, { as: "div", className: "memori-chat--bubble-avatar", enter: "transition ease-in-out duration-300", enterFrom: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, enterTo: "opacity-1 scale-1 translate-x-0", leave: "transition ease-in-out duration-300", leaveFrom: "opacity-1 scale-1 translate-x-0", leaveTo: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, children: userAvatar })) : (_jsx(Transition.Child, { as: "div", className: "memori-chat--bubble-avatar", enter: "transition ease-in-out duration-300", enterFrom: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, enterTo: "opacity-1 scale-1 translate-x-0", leave: "transition ease-in-out duration-300", leaveFrom: "opacity-1 scale-1 translate-x-0", leaveTo: `opacity-0 scale-075 ${message.fromUser ? 'translate-x-15' : 'translate-x--15'}`, children: _jsx(UserIcon, {}) })) }))] }), showingWhyThisAnswer && client && (_jsx(WhyThisAnswer, { client: client, visible: showingWhyThisAnswer, message: message, closeDrawer: () => setShowingWhyThisAnswer(false), sessionID: sessionID })), _jsx(Modal, { open: openFunctionCache, onClose: () => setOpenFunctionCache(false), className: "memori-chat--function-cache-modal", footer: _jsx(Button, { icon: _jsx(Copy, {}), onClick: () => handleCopyClick('functionCache', functionCacheCopyText), children: copyFeedback.functionCache
                        ? copiedLabel
                        : t('copy') || 'Copy' }), children: functionCacheData === null || functionCacheData === void 0 ? void 0 : functionCacheData.map((f, i) => (_jsxs("div", { style: i > 0
                        ? {
                            marginTop: '1.5rem',
                            paddingTop: '1.5rem',
                            borderTop: '1px solid #e0e0e0',
                        }
                        : {
                            paddingTop: '1.5rem',
                        }, children: [_jsx("h3", { style: { marginTop: 0 }, children: f.title }), _jsx("pre", { style: { whiteSpace: 'pre-wrap', wordWrap: 'break-word' }, children: f.content }, f.mediumID)] }, f.mediumID))) })] }));
};
export default ChatBubble;
//# sourceMappingURL=ChatBubble.js.map