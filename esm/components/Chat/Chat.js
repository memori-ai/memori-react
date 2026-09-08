import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect, memo, useMemo, useRef, useState, } from 'react';
import cx from 'classnames';
import { hasTouchscreen, parseDocumentAttachmentsFromMessage, } from '../../helpers/utils';
import { getResourceUrl } from '../../helpers/media';
import ChatBubble from '../ChatBubble/ChatBubble';
import MediaWidget from '../MediaWidget/MediaWidget';
import ChatInputs from '../ChatInputs/ChatInputs';
import Typing from '../Typing/Typing';
import { boardOfExpertsLoadingSentences } from '../../helpers/constants';
import ArtifactHandler from '../MemoriArtifactSystem/components/ArtifactHandler/ArtifactHandler';
import { DocumentIcon } from '../icons/Document';
import { useTranslation } from 'react-i18next';
import { maxDocumentsPerMessage, maxDocumentContentLength, pasteAsCardLineThreshold, pasteAsCardCharThreshold } from '../../helpers/constants';
import Modal from '../ui/Modal';
import Tooltip from '../ui/Tooltip';
import { BADGE_EMOJI, buildLlmUsageHtml, formatImpactWithApiUnit, formatIntegerValue, getImpactComparison, getMetricValue, } from '../../helpers/llmUsage';
const Chat = ({ memori, tenant, sessionID, baseUrl, apiUrl, client, translateTo, memoriTyping, typingText, showTypingText = false, history = [], authToken, dialogState, simulateUserPrompt, showDates = false, showContextPerLine = false, showAIicon = true, showWhyThisAnswer = true, showCopyButton = true, showTranslationOriginal = false, showReasoning = false, showMessageConsumption = false, preview = false, instruct = false, showInputs = true, showMicrophone = false, microphoneMode = 'HOLD_TO_TALK', sendOnEnter, setSendOnEnter, attachmentsMenuOpen, setAttachmentsMenuOpen, userMessage = '', onChangeUserMessage, sendMessage, listening, setEnableFocusChatInput, isPlayingAudio, stopAudio, startListening, stopListening, customMediaRenderer, user, userAvatar, showUpload = false, experts, useMathFormatting = false, isHistoryView = false, isChatlogPanel = false, showFunctionCache = false, maxTotalMessagePayload, maxTextareaCharacters, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
    const [isTextareaExpanded, setIsTextareaExpanded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [activeUsageBadge, setActiveUsageBadge] = useState(null);
    const chatWrapperRef = useRef(null);
    const { t } = useTranslation();
    const locale = (translateTo || memori.culture || 'it-IT').replace('_', '-');
    const llmUsageLabels = useMemo(() => ({
        llm: t('chatLogs.llm', { defaultValue: 'LLM' }),
        model: t('chatLogs.model', { defaultValue: 'Model' }),
        provider: t('chatLogs.provider', { defaultValue: 'Provider' }),
        tokens: t('chatLogs.tokens', { defaultValue: 'Tokens' }),
        input: t('chatLogs.input', { defaultValue: 'Input' }),
        output: t('chatLogs.output', { defaultValue: 'Output' }),
        cacheRead: t('chatLogs.cacheRead', { defaultValue: 'Cache read' }),
        cacheWrite: t('chatLogs.cacheWrite', { defaultValue: 'Cache write' }),
        duration: t('chatLogs.duration', { defaultValue: 'Duration' }),
        energy: t('chatLogs.energy', { defaultValue: 'Energy' }),
        co2: t('chatLogs.co2', { defaultValue: 'CO2' }),
        water: t('chatLogs.water', { defaultValue: 'Water' }),
        usageBadgesHint: t('chatLogs.usageBadgesHint', {
            defaultValue: 'Click one of these buttons to show more information',
        }),
    }), [t]);
    const usageHtmlByIndex = useMemo(() => history.map((message, index) => {
        const messageWithUsage = message;
        return showMessageConsumption &&
            !message.fromUser &&
            messageWithUsage.llmUsage
            ? buildLlmUsageHtml(messageWithUsage.llmUsage, llmUsageLabels, index, locale)
            : '';
    }), [history, llmUsageLabels, locale, showMessageConsumption]);
    const scrollToBottom = useCallback(() => {
        if (isHistoryView)
            return;
        setTimeout(() => {
            var _a, _b;
            let userMsgs = document.querySelectorAll('.memori-chat-scroll-item');
            (_b = (_a = userMsgs[userMsgs.length - 1]) === null || _a === void 0 ? void 0 : _a.scrollIntoView) === null || _b === void 0 ? void 0 : _b.call(_a);
        }, 200);
    }, [isHistoryView]);
    const lastAutoscrollSignatureRef = useRef(null);
    const lastMessage = history === null || history === void 0 ? void 0 : history[history.length - 1];
    const lastMessageSignature = `${(_a = history === null || history === void 0 ? void 0 : history.length) !== null && _a !== void 0 ? _a : 0}|${(_b = lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.timestamp) !== null && _b !== void 0 ? _b : ''}|${(lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.fromUser) ? 'u' : 'm'}|${(_d = (_c = lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.text) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0}|${(_f = (_e = lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.translatedText) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0}`;
    useEffect(() => {
        if (preview || isHistoryView)
            return;
        if (lastAutoscrollSignatureRef.current === lastMessageSignature)
            return;
        lastAutoscrollSignatureRef.current = lastMessageSignature;
        scrollToBottom();
    }, [preview, isHistoryView, lastMessageSignature, scrollToBottom]);
    const onTextareaFocus = () => {
        stopListening();
        const hasTouch = hasTouchscreen();
        if (hasTouch)
            setEnableFocusChatInput(true);
    };
    const onTextareaBlur = () => {
        var _a, _b, _c, _d, _e;
        if ((_b = (_a = document
            .getElementById('chat-wrapper')) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.contains('chat-focused')) {
            (_c = document.getElementById('chat-wrapper')) === null || _c === void 0 ? void 0 : _c.classList.remove('chat-focused');
            (_e = (_d = document
                .querySelector('.memori.memori-widget')) === null || _d === void 0 ? void 0 : _d.classList) === null || _e === void 0 ? void 0 : _e.remove('chat-focused');
            scrollToBottom();
        }
    };
    const onTextareaExpanded = (expanded) => {
        setIsTextareaExpanded(expanded);
    };
    useEffect(() => {
        if (!showUpload)
            return;
        let dragCounter = 0;
        const chatWrapper = document.getElementById('chat-wrapper');
        const handleDragEnter = (e) => {
            var _a;
            if ((_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.types.includes('Files')) {
                dragCounter++;
                if (dragCounter === 1) {
                    setIsDragging(true);
                }
            }
        };
        const handleDragLeave = (e) => {
            var _a;
            if ((_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.types.includes('Files')) {
                dragCounter--;
                if (dragCounter === 0) {
                    setIsDragging(false);
                }
            }
        };
        const handleDragOver = (e) => {
            var _a;
            if ((_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.types.includes('Files')) {
                e.preventDefault();
            }
        };
        const handleDrop = (e) => {
            var _a;
            if ((_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.types.includes('Files')) {
                dragCounter = 0;
                setIsDragging(false);
            }
        };
        if (chatWrapper) {
            chatWrapper.addEventListener('dragenter', handleDragEnter);
            chatWrapper.addEventListener('dragleave', handleDragLeave);
            chatWrapper.addEventListener('dragover', handleDragOver);
            chatWrapper.addEventListener('drop', handleDrop);
        }
        return () => {
            if (chatWrapper) {
                chatWrapper.removeEventListener('dragenter', handleDragEnter);
                chatWrapper.removeEventListener('dragleave', handleDragLeave);
                chatWrapper.removeEventListener('dragover', handleDragOver);
                chatWrapper.removeEventListener('drop', handleDrop);
            }
        };
    }, [showUpload]);
    useEffect(() => {
        const wrapper = chatWrapperRef.current;
        if (!wrapper || !showMessageConsumption)
            return;
        const handleUsageBadgeClick = (event) => {
            var _a;
            const target = event.target;
            const button = target === null || target === void 0 ? void 0 : target.closest('[data-llm-badge-type][data-line-index]');
            if (!button)
                return;
            const lineIndex = Number(button.dataset.lineIndex);
            const badgeType = button.dataset.llmBadgeType;
            if (!Number.isInteger(lineIndex) || !badgeType)
                return;
            const line = (_a = history === null || history === void 0 ? void 0 : history[lineIndex]) !== null && _a !== void 0 ? _a : null;
            if (!(line === null || line === void 0 ? void 0 : line.llmUsage))
                return;
            event.preventDefault();
            setActiveUsageBadge({
                type: badgeType,
                usage: line.llmUsage,
            });
        };
        wrapper.addEventListener('click', handleUsageBadgeClick);
        return () => {
            wrapper.removeEventListener('click', handleUsageBadgeClick);
        };
    }, [history, showMessageConsumption]);
    return (_jsxs("div", { ref: chatWrapperRef, className: cx('memori-chat--wrapper', {
            'memori-chat-wrapper--translate': translateTo,
            'memori-chat-wrapper--expanded': isTextareaExpanded,
            'memori-chat-wrapper--dragging': isDragging,
        }), id: "chat-wrapper", lang: translateTo === null || translateTo === void 0 ? void 0 : translateTo.toUpperCase(), "data-memori-lang": (_k = (_j = (_h = (_g = memori.culture) === null || _g === void 0 ? void 0 : _g.split('-')) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.toUpperCase()) !== null && _k !== void 0 ? _k : 'EN', children: [isDragging && (_jsxs("div", { className: "memori-chat--drag-overlay", children: [_jsx(DocumentIcon, { className: "memori-chat--drag-overlay-icon" }), _jsx("span", { className: "memori-chat--drag-overlay-text", children: (_l = t('upload.dragAndDropFiles')) !== null && _l !== void 0 ? _l : 'Drag and drop files here to add them to the chat' })] })), _jsx("div", { className: cx('memori-chat--history', {
                    'memori-chat--history-touch': hasTouchscreen(),
                }), children: _jsxs("div", { className: cx('memori-chat--content', {
                        'memori-chat--content-touch': hasTouchscreen(),
                    }), children: [_jsx("div", { className: cx('memori-chat--cover'), style: {
                                backgroundImage: `url("${getResourceUrl({
                                    type: 'cover',
                                    tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                    resourceURI: memori.coverURL,
                                    baseURL: baseUrl,
                                    apiURL: apiUrl,
                                })}"), url("${getResourceUrl({
                                    type: 'cover',
                                    tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                                    baseURL: baseUrl || 'https://www.aisuru.com',
                                    apiURL: apiUrl,
                                })}")`,
                            } }), history.map((message, index) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h;
                            return (_jsxs(React.Fragment, { children: [_jsx(MediaWidget, { simulateUserPrompt: simulateUserPrompt, links: (((_b = (_a = message === null || message === void 0 ? void 0 : message.media) === null || _a === void 0 ? void 0 : _a.filter(m => { var _a; return !((_a = m.properties) === null || _a === void 0 ? void 0 : _a.functionSignature); })) === null || _b === void 0 ? void 0 : _b.filter(m => m.mimeType === 'text/html' && !!m.url)) ||
                                            []), media: [
                                            ...(((_d = (_c = message === null || message === void 0 ? void 0 : message.media) === null || _c === void 0 ? void 0 : _c.filter(m => { var _a; return !((_a = m.properties) === null || _a === void 0 ? void 0 : _a.functionSignature); })) === null || _d === void 0 ? void 0 : _d.filter(m => !(m.mimeType === 'text/html' && !!m.url))) ||
                                                []),
                                            ...parseDocumentAttachmentsFromMessage(message.text || '').map((attachment, attachmentIndex) => ({
                                                mediumID: `doc_${Date.now()}_${attachmentIndex}_${Math.random()
                                                    .toString(36)
                                                    .substr(2, 9)}`,
                                                url: attachment.url,
                                                mimeType: attachment.type,
                                                title: attachment.filename,
                                                content: attachment.content,
                                                properties: { isDocumentAttachment: true },
                                                type: 'document',
                                            })),
                                        ], sessionID: sessionID, baseUrl: baseUrl, apiUrl: apiUrl, translateTo: translateTo, customMediaRenderer: customMediaRenderer, fromUser: message.fromUser }), _jsx(ChatBubble, { isFirst: index === 0, message: message, memori: memori, tenant: tenant, client: client, baseUrl: baseUrl, apiUrl: apiUrl, sessionID: sessionID, simulateUserPrompt: simulateUserPrompt, showAIicon: showAIicon, showWhyThisAnswer: showWhyThisAnswer, showTranslationOriginal: showTranslationOriginal, showFeedback: index === history.length - 1 &&
                                            !message.fromUser &&
                                            (dialogState === null || dialogState === void 0 ? void 0 : dialogState.acceptsFeedback), user: user, userAvatar: userAvatar, experts: experts, showCopyButton: showCopyButton, useMathFormatting: useMathFormatting, showFunctionCache: showFunctionCache, showReasoning: showReasoning, usageHtml: usageHtmlByIndex[index] }, `chatbubble-${index}-${((_e = message.text) === null || _e === void 0 ? void 0 : _e.includes('<document_attachment'))
                                        ? 'has-attachments'
                                        : 'no-attachments'}-${message.timestamp}`), showDates && !!message.timestamp && (_jsx("small", { className: `memori-chat--timestamp ${message.fromUser ? 'text-right' : 'text-left'}`, children: new Intl.DateTimeFormat('it', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                        }).format(new Date(message.timestamp.endsWith('Z')
                                            ? message.timestamp
                                            : `${message.timestamp}Z`)) })), showContextPerLine &&
                                        !!Object.keys((_f = message.contextVars) !== null && _f !== void 0 ? _f : {}).length && (_jsx("div", { className: "memori-chat--context-vars", children: Object.keys((_g = message.contextVars) !== null && _g !== void 0 ? _g : {}).map(key => {
                                            var _a, _b, _c;
                                            return ((_a = message.contextVars) === null || _a === void 0 ? void 0 : _a[key]) === '-' ? (_jsx("div", { className: `memori-chat--context-tag memori-chat--context-tag-canceled`, children: _jsx("span", { className: "memori-chat--context-tag-text", children: key }) }, key)) : ((_b = message.contextVars) === null || _b === void 0 ? void 0 : _b[key]) === '✔️' ? (_jsx("div", { className: "memori-chat--context-tag", children: _jsx("span", { className: "memori-chat--context-tag-text", children: key }) }, key)) : (_jsx("div", { className: "memori-chat--context-tag", children: _jsxs("span", { className: "memori-chat--context-tag-text", children: [key, ": ", (_c = message.contextVars) === null || _c === void 0 ? void 0 : _c[key]] }) }, key));
                                        }) })), !isHistoryView && !message.fromUser && (_jsx(ArtifactHandler, { isChatlogPanel: isChatlogPanel, message: message }))] }, `${index}-${((_h = message.text) === null || _h === void 0 ? void 0 : _h.includes('<document_attachment'))
                                ? 'has-attachments'
                                : 'no-attachments'}-${message.timestamp}`));
                        }), (dialogState === null || dialogState === void 0 ? void 0 : dialogState.hints) &&
                            dialogState.hints.length > 0 &&
                            !memoriTyping && (_jsx(MediaWidget, { simulateUserPrompt: simulateUserPrompt, hints: dialogState.translatedHints
                                ? dialogState.translatedHints
                                : dialogState.hints.map(h => ({
                                    text: h,
                                    originalText: h,
                                })) })), !!memoriTyping && (_jsx(Typing, { useDefaultSentences: showTypingText, lang: translateTo
                                ? translateTo.toLowerCase() === 'it'
                                    ? 'it'
                                    : 'en'
                                : ((_p = (_o = (_m = memori.culture) === null || _m === void 0 ? void 0 : _m.split('-')) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.toLowerCase()) === 'it'
                                    ? 'it'
                                    : 'en', sentence: typingText, sentences: memori.enableBoardOfExperts
                                ? boardOfExpertsLoadingSentences
                                : undefined }, typingText)), _jsx("div", { id: "end-messages-ref" })] }) }), showInputs && (_jsx(ChatInputs, { userMessage: userMessage, onChangeUserMessage: onChangeUserMessage, dialogState: dialogState, instruct: instruct, authToken: authToken, sendMessage: sendMessage, isTyping: memoriTyping, microphoneMode: microphoneMode, sendOnEnter: sendOnEnter, setSendOnEnter: setSendOnEnter, client: client, sessionID: sessionID, baseUrl: baseUrl, showUpload: showUpload, attachmentsMenuOpen: attachmentsMenuOpen, setAttachmentsMenuOpen: setAttachmentsMenuOpen, onTextareaFocus: onTextareaFocus, onTextareaBlur: onTextareaBlur, onTextareaExpanded: onTextareaExpanded, startListening: startListening, stopListening: stopListening, stopAudio: stopAudio, listening: listening, isPlayingAudio: isPlayingAudio, showMicrophone: showMicrophone, memoriID: memori === null || memori === void 0 ? void 0 : memori.memoriID, maxTotalMessagePayload: maxTotalMessagePayload, maxTextareaCharacters: maxTextareaCharacters, maxDocumentsPerMessage: maxDocumentsPerMessage, maxDocumentContentLength: maxDocumentContentLength, pasteAsCardLineThreshold: pasteAsCardLineThreshold, pasteAsCardCharThreshold: pasteAsCardCharThreshold })), _jsxs(Modal, { open: !!activeUsageBadge, onClose: () => setActiveUsageBadge(null), title: (activeUsageBadge === null || activeUsageBadge === void 0 ? void 0 : activeUsageBadge.type)
                    ? `${BADGE_EMOJI[activeUsageBadge.type]} ${llmUsageLabels[activeUsageBadge.type]}`
                    : undefined, className: "memori-chat--usage-modal", children: [(activeUsageBadge === null || activeUsageBadge === void 0 ? void 0 : activeUsageBadge.type) === 'llm' && (_jsxs("dl", { className: "memori-chat--usage-details", children: [_jsxs("div", { children: [_jsx("dt", { children: llmUsageLabels.provider }), _jsx("dd", { children: (_q = activeUsageBadge.usage.provider) !== null && _q !== void 0 ? _q : '—' })] }), _jsxs("div", { children: [_jsx("dt", { children: llmUsageLabels.model }), _jsx("dd", { children: (_r = activeUsageBadge.usage.model) !== null && _r !== void 0 ? _r : '—' })] }), _jsxs("div", { children: [_jsxs("dt", { children: [llmUsageLabels.tokens, " ", llmUsageLabels.input] }), _jsx("dd", { children: formatIntegerValue((_s = activeUsageBadge.usage.totalInputTokens) !== null && _s !== void 0 ? _s : 0, locale) })] }), _jsxs("div", { children: [_jsxs("dt", { children: [llmUsageLabels.tokens, " ", llmUsageLabels.output] }), _jsx("dd", { children: formatIntegerValue((_t = activeUsageBadge.usage.outputTokens) !== null && _t !== void 0 ? _t : 0, locale) })] })] })), (activeUsageBadge === null || activeUsageBadge === void 0 ? void 0 : activeUsageBadge.type) === 'energy' && (_jsxs("div", { className: "memori-chat--usage-educational-content", children: [_jsx("strong", { className: "memori-chat--usage-metric-value", children: formatImpactWithApiUnit((_v = getMetricValue((_u = activeUsageBadge.usage.energyImpact) === null || _u === void 0 ? void 0 : _u.energy)) !== null && _v !== void 0 ? _v : 0, (_w = activeUsageBadge.usage.energyImpact) === null || _w === void 0 ? void 0 : _w.energyUnit, 'kWh', 'energy', locale) }), _jsx(Tooltip, { content: t('chatLogs.approximateValuesTooltip', {
                                    defaultValue: 'These values are approximate.',
                                }), children: _jsx("p", { className: "memori-chat--usage-comparable", children: getImpactComparison((_y = getMetricValue((_x = activeUsageBadge.usage.energyImpact) === null || _x === void 0 ? void 0 : _x.energy)) !== null && _y !== void 0 ? _y : 0, 'energy', locale, t) }) }), _jsx("p", { children: t('chatLogs.energyImpactDescription') })] })), (activeUsageBadge === null || activeUsageBadge === void 0 ? void 0 : activeUsageBadge.type) === 'co2' && (_jsxs("div", { className: "memori-chat--usage-educational-content", children: [_jsx("strong", { className: "memori-chat--usage-metric-value", children: formatImpactWithApiUnit((_0 = getMetricValue((_z = activeUsageBadge.usage.energyImpact) === null || _z === void 0 ? void 0 : _z.gwp)) !== null && _0 !== void 0 ? _0 : 0, (_1 = activeUsageBadge.usage.energyImpact) === null || _1 === void 0 ? void 0 : _1.gwpUnit, 'kgCO2eq', 'co2', locale) }), _jsx(Tooltip, { content: t('chatLogs.approximateValuesTooltip', {
                                    defaultValue: 'These values are approximate.',
                                }), children: _jsx("p", { className: "memori-chat--usage-comparable", children: getImpactComparison((_3 = getMetricValue((_2 = activeUsageBadge.usage.energyImpact) === null || _2 === void 0 ? void 0 : _2.gwp)) !== null && _3 !== void 0 ? _3 : 0, 'co2', locale, t) }) }), _jsx("p", { children: t('chatLogs.co2ImpactDescription') })] })), (activeUsageBadge === null || activeUsageBadge === void 0 ? void 0 : activeUsageBadge.type) === 'water' && (_jsxs("div", { className: "memori-chat--usage-educational-content", children: [_jsx("strong", { className: "memori-chat--usage-metric-value", children: formatImpactWithApiUnit((_5 = getMetricValue((_4 = activeUsageBadge.usage.energyImpact) === null || _4 === void 0 ? void 0 : _4.wcf)) !== null && _5 !== void 0 ? _5 : 0, (_6 = activeUsageBadge.usage.energyImpact) === null || _6 === void 0 ? void 0 : _6.wcfUnit, 'L', 'water', locale) }), _jsx(Tooltip, { content: t('chatLogs.approximateValuesTooltip', {
                                    defaultValue: 'These values are approximate.',
                                }), children: _jsx("p", { className: "memori-chat--usage-comparable", children: getImpactComparison((_8 = getMetricValue((_7 = activeUsageBadge.usage.energyImpact) === null || _7 === void 0 ? void 0 : _7.wcf)) !== null && _8 !== void 0 ? _8 : 0, 'water', locale, t) }) }), _jsx("p", { children: t('chatLogs.waterImpactDescription') })] }))] })] }));
};
export default memo(Chat);
//# sourceMappingURL=Chat.js.map