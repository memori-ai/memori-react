import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Drawer from '../ui/Drawer';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState, useCallback, } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ChatRound from '../icons/Chat';
import { stripHTML } from '../../helpers/utils';
import { stripAllInternalTags } from '../../helpers/message';
import { Dialog } from '@headlessui/react';
import debounce from 'lodash/debounce';
import Spin from '../ui/Spin';
import Chat from '../Chat/Chat';
import Download from '../icons/Download';
import Select from '../ui/Select';
import ChevronLeft from '../icons/ChevronLeft';
import { getTranslation } from '../../helpers/translations';
const ITEMS_PER_PAGE = 8;
const DEBOUNCE_DELAY = 300;
const calculateTitle = (lines) => {
    const userMessages = lines.filter(line => line.inbound);
    if (userMessages.length === 0)
        return '';
    const insignificantPhrases = [
        'hello',
        'hi',
        'hey',
        'good morning',
        'good afternoon',
        'good evening',
        'thanks',
        'thank you',
        'thx',
        'tnx',
        'ty',
        'thanks!',
        'thank you!',
        'ok',
        'okay',
        'k',
        'yes',
        'no',
        'yep',
        'nope',
        'yeah',
        'nah',
        'good',
        'great',
        'nice',
        'cool',
        'awesome',
        'perfect',
        'excellent',
        'bye',
        'goodbye',
        'see you',
        'see ya',
        'later',
        'good night',
        'how are you',
        'how are you doing',
        "what's up",
        'sup',
        'please',
        'pls',
        'sorry',
        'excuse me',
        'pardon',
        'i see',
        'i understand',
        'got it',
        'gotcha',
        'understood',
        'continue',
        'go on',
        'tell me more',
        'more',
        'next',
        'start',
        'begin',
        "let's start",
        "let's begin",
        'help',
        'can you help',
        'i need help',
        'test',
        'testing',
        'test message',
        '?',
        '??',
        '???',
        '!',
        '!!',
        '!!!',
        '...',
        '..',
        '.',
        'a',
        'an',
        'the',
        'and',
        'or',
        'but',
        'in',
        'on',
        'at',
        'to',
        'for',
        'of',
        'with',
        'by',
        'ciao',
        'salve',
        'buongiorno',
        'buonasera',
        'buonanotte',
        'grazie',
        'grazie mille',
        'grazie!',
        'grazie mille!',
        'thx',
        'tnx',
        'ok',
        'va bene',
        'va bene così',
        'perfetto',
        'ottimo',
        'bene',
        'sì',
        'si',
        'no',
        'certo',
        'certamente',
        'assolutamente',
        'arrivederci',
        'a presto',
        'a dopo',
        'ci vediamo',
        'addio',
        'come stai',
        'come va',
        'tutto bene',
        'che succede',
        'per favore',
        'per piacere',
        'scusa',
        'scusami',
        'mi dispiace',
        'capisco',
        'ho capito',
        'capito',
        'perfetto',
        'continua',
        'vai avanti',
        'dimmi di più',
        'altro',
        'altro ancora',
        'inizia',
        'iniziamo',
        'comincia',
        'cominciamo',
        'aiuto',
        'puoi aiutarmi',
        'ho bisogno di aiuto',
        'test',
        'prova',
        'messaggio di prova',
        '?',
        '??',
        '???',
        '!',
        '!!',
        '!!!',
        '...',
        '..',
        '.',
        'un',
        'una',
        'il',
        'la',
        'gli',
        'le',
        'e',
        'o',
        'ma',
        'in',
        'su',
        'a',
        'per',
        'di',
        'con',
        'da',
    ];
    const calculateSignificanceScore = (message) => {
        const cleanMessage = message.toLowerCase().trim();
        if (insignificantPhrases.includes(cleanMessage)) {
            return 0;
        }
        const wordCount = cleanMessage
            .split(/\s+/)
            .filter(word => word.length > 0).length;
        if (wordCount < 3) {
            return 0.1;
        }
        if (cleanMessage.length < 5) {
            return 0.1;
        }
        const isQuestion = /\?$/.test(cleanMessage) ||
            /^(what|how|why|when|where|who|which|can|could|would|will|do|does|did|is|are|was|were)/.test(cleanMessage) ||
            /^(cosa|come|perché|perche|quando|dove|chi|quale|quali|può|puo|potrebbe|vorrebbe|sarà|sara|fa|fai|fanno|è|e|sono|era|erano)/.test(cleanMessage);
        let score = 0.5;
        if (isQuestion)
            score += 0.3;
        if (wordCount > 5)
            score += 0.2;
        if (wordCount > 10)
            score += 0.2;
        if (wordCount > 20)
            score -= 0.1;
        if (/\d/.test(cleanMessage))
            score += 0.1;
        if (/[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ][a-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]+/.test(message))
            score += 0.1;
        return Math.min(score, 1.0);
    };
    const scoredMessages = userMessages.map((msg, index) => {
        const cleanText = stripHTML(stripAllInternalTags(msg.text || ''));
        const score = calculateSignificanceScore(cleanText);
        return {
            text: cleanText,
            score,
            index,
            originalIndex: index,
        };
    });
    scoredMessages.sort((a, b) => {
        if (Math.abs(a.score - b.score) < 0.1) {
            return a.index - b.index;
        }
        return b.score - a.score;
    });
    let bestMessage = scoredMessages[0];
    if (bestMessage.score < 0.3) {
        const betterMessage = scoredMessages.find(msg => msg.score > 0.1);
        if (betterMessage) {
            bestMessage = betterMessage;
        }
    }
    if (bestMessage.score < 0.2) {
        const meaningfulMessages = scoredMessages
            .filter(msg => msg.score > 0.1)
            .slice(0, 3)
            .sort((a, b) => a.index - b.index);
        if (meaningfulMessages.length > 1) {
            const combinedText = meaningfulMessages
                .map(msg => msg.text)
                .join(' - ')
                .substring(0, 80);
            return combinedText.length > 80 ? `${combinedText}...` : combinedText;
        }
    }
    const title = bestMessage.text;
    const maxLength = 100;
    if (title.length > maxLength) {
        const truncated = title.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > maxLength * 0.7) {
            return `${truncated.substring(0, lastSpace)}...`;
        }
        return `${truncated}...`;
    }
    return title;
};
const translateChatLogs = async (chatLogs, fromLanguage, toLanguage, baseUrl) => {
    try {
        const translatedChatLogs = await Promise.all(chatLogs.map(async (chatLog) => {
            const translatedLines = await Promise.all(chatLog.lines.map(async (line) => {
                if (!line.text)
                    return line;
                try {
                    const translation = await getTranslation(line.text, toLanguage, fromLanguage, baseUrl);
                    return {
                        ...line,
                        originalText: line.text,
                        text: translation.text,
                    };
                }
                catch (e) {
                    console.error('Error translating line:', e);
                    return line;
                }
            }));
            return {
                ...chatLog,
                lines: translatedLines,
            };
        }));
        return translatedChatLogs;
    }
    catch (e) {
        console.error('Error translating chat logs:', e);
        return chatLogs;
    }
};
const downloadFile = (text, filename) => {
    const data = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(data);
    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};
const ChatHistoryDrawer = ({ open, onClose, apiClient, sessionId, memori, resumeSession, baseUrl, apiUrl, history, loginToken, language, userLang, isMultilanguageEnabled = false, }) => {
    var _a, _b, _c, _d;
    const { t } = useTranslation();
    const { getUserChatLogsByTokenPaged } = apiClient.chatLogs;
    const textCurrentChat = `${t('write_and_speak.conversationStartedLabel')} ${new Intl.DateTimeFormat('it', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date())}\n\n`.concat(history
        .map(m => `${m.fromUser ? 'YOU' : memori.name}: ${stripAllInternalTags(m.text)}`)
        .join('\n'));
    const [chatLogs, setChatLogs] = useState([]);
    const [selectedChatLog, setSelectedChatLog] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [indexPage, setIndexPage] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc');
    const [dateRange, setDateRange] = useState('all');
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isViewingChatDetail, setIsViewingChatDetail] = useState(false);
    const [minimumMessagesPerChat, setMinimumMessagesPerChat] = useState(3);
    const [customMinimumMessages, setCustomMinimumMessages] = useState(1);
    const formatDateForAPI = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
    };
    const formatDateRangeForAPI = (dateRange) => {
        if (dateRange === 'today') {
            const now = new Date();
            const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            const dateFrom = formatDateForAPI(yesterday);
            const dateTo = formatDateForAPI(now);
            return { dateFrom, dateTo };
        }
        if (dateRange === 'yesterday') {
            const now = new Date();
            const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            const dayBeforeYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() - 2);
            const dateFrom = formatDateForAPI(dayBeforeYesterday);
            const dateTo = formatDateForAPI(yesterday);
            return { dateFrom, dateTo };
        }
        if (dateRange === 'last_7_days') {
            const now = new Date();
            const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
            const dateFrom = formatDateForAPI(sevenDaysAgo);
            const dateTo = formatDateForAPI(now);
            return { dateFrom, dateTo };
        }
        if (dateRange === 'last_30_days') {
            const now = new Date();
            const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
            const dateFrom = formatDateForAPI(thirtyDaysAgo);
            const dateTo = formatDateForAPI(now);
            return { dateFrom, dateTo };
        }
    };
    const fetchChatLogs = useCallback(async (dateRangeValue = 'all') => {
        var _a;
        if (!loginToken) {
            setError(t('errorFetchingSession') ||
                'Login token required to fetch chat history');
            return;
        }
        const calculatedIndex = ITEMS_PER_PAGE * (currentPage - 1);
        setIndexPage(calculatedIndex);
        setIsLoading(true);
        setError(null);
        let response;
        let filters = {
            loginToken: loginToken,
            memoriID: memori.engineMemoriID,
            dateFrom: undefined,
            dateTo: undefined,
            from: calculatedIndex,
            howMany: ITEMS_PER_PAGE,
            minimumMessagesPerChat: minimumMessagesPerChat === 0
                ? customMinimumMessages
                : minimumMessagesPerChat,
        };
        try {
            if (dateRangeValue === 'all') {
                response = await getUserChatLogsByTokenPaged(filters);
            }
            else {
                const { dateFrom, dateTo } = (_a = formatDateRangeForAPI(dateRangeValue)) !== null && _a !== void 0 ? _a : {};
                response = await getUserChatLogsByTokenPaged({
                    ...filters,
                    dateFrom: dateFrom !== null && dateFrom !== void 0 ? dateFrom : undefined,
                    dateTo: dateTo !== null && dateTo !== void 0 ? dateTo : undefined,
                });
            }
            const res = response;
            let sortedChatLogs = res.chatLogs.sort((a, b) => {
                const dateA = Math.max(...a.lines.map((l) => new Date(l.timestamp).getTime()));
                const dateB = Math.max(...b.lines.map((l) => new Date(l.timestamp).getTime()));
                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            });
            if (language.toUpperCase() !== userLang.toUpperCase() &&
                isMultilanguageEnabled) {
                sortedChatLogs = await translateChatLogs(sortedChatLogs, language, userLang, baseUrl);
            }
            setChatLogs(sortedChatLogs);
            setTotalItems(res.count || sortedChatLogs.length);
            setTotalPages(Math.ceil((res.count || sortedChatLogs.length) / ITEMS_PER_PAGE));
        }
        catch (err) {
            setError(t('errorFetchingSession') || 'Error loading chat history');
            console.error('Error fetching chat logs:', err);
        }
        finally {
            setIsLoading(false);
        }
    }, [
        loginToken,
        memori.engineMemoriID,
        currentPage,
        sortOrder,
        apiUrl,
        minimumMessagesPerChat,
        customMinimumMessages,
    ]);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    useEffect(() => {
        if (open) {
            setCurrentPage(1);
            setIndexPage(0);
            setIsViewingChatDetail(false);
            setSelectedChatLog(null);
        }
    }, [open]);
    useEffect(() => {
        if (open) {
            setCurrentPage(1);
            setIndexPage(0);
        }
    }, [sortOrder, dateRange, minimumMessagesPerChat, customMinimumMessages, open]);
    useEffect(() => {
        if (open && currentPage > 0) {
            fetchChatLogs(dateRange);
        }
    }, [currentPage, dateRange, minimumMessagesPerChat, customMinimumMessages, fetchChatLogs, open]);
    const debouncedSearch = useMemo(() => debounce((value) => setSearchText(value), DEBOUNCE_DELAY), []);
    const paginatedChatLogs = chatLogs;
    const handleResumeChat = async () => {
        if (selectedChatLog) {
            resumeSession(selectedChatLog);
            onClose();
        }
    };
    const handleExportChat = (chatLog, e) => {
        e.stopPropagation();
        const text = `${t('write_and_speak.conversationStartedLabel')} ${new Intl.DateTimeFormat(navigator.language, {
            dateStyle: 'short',
            timeStyle: 'short',
        }).format(new Date())}\n\n`.concat(chatLog.lines
            .map(line => `${line.inbound ? 'YOU' : memori.name}: ${stripAllInternalTags(line.text)}`)
            .join('\n'));
        downloadFile(text, `${memori.name.replace(/\W+/g, '-')}-chat-${chatLog.chatLogID.substring(0, 4)}.txt`);
    };
    const formatDate = (timestamp) => {
        return new Intl.DateTimeFormat(navigator.language, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(timestamp));
    };
    const escapeUnderScore = (value) => {
        return value.replace(/_/g, ' ');
    };
    const renderContent = () => {
        if (isLoading) {
            return (_jsxs("div", { className: "memori-chat-history-drawer--loading", children: [_jsx(Spin, { spinning: true, primary: true, className: "memori-chat-history-drawer--loading--spinner" }), _jsx("p", { className: "memori-chat-history-drawer--loading--text", children: t('write_and_speak.loadingChatHistory') ||
                            'Loading chat history...' })] }));
        }
        if (error) {
            return (_jsx("div", { className: "memori-chat-history-drawer--error", children: _jsx("p", { children: error }) }));
        }
        if (!chatLogs.length) {
            return (_jsxs("div", { className: "memori-chat-history-drawer--empty", children: [_jsx(ChatRound, { className: "memori-chat-history-drawer--empty--icon" }), _jsx("p", { className: "memori-chat-history-drawer--empty--text", children: t('write_and_speak.noChatHistoryAvailable') ||
                            'No chat history available' })] }));
        }
        if (chatLogs.length === 0) {
            return (_jsx("div", { className: "memori-chat-history-drawer--no-results", children: _jsx("p", { children: t('write_and_speak.noResultsFound', {
                        searchText: searchText || '',
                    }) || 'No results found' }) }));
        }
        return (_jsxs(_Fragment, { children: [_jsx("ul", { className: "memori-chat-history-drawer--list", children: paginatedChatLogs.map((chatLog) => {
                        const lastMessageDate = Math.max(...chatLog.lines.map(line => new Date(line.timestamp).getTime()));
                        return (_jsx(Card, { hoverable: (chatLog === null || chatLog === void 0 ? void 0 : chatLog.sessionID) !== sessionId, onClick: async () => {
                                if ((chatLog === null || chatLog === void 0 ? void 0 : chatLog.sessionID) === sessionId) {
                                    return;
                                }
                                if ((selectedChatLog === null || selectedChatLog === void 0 ? void 0 : selectedChatLog.chatLogID) === chatLog.chatLogID) {
                                    setSelectedChatLog(null);
                                    if (isMobile) {
                                        setIsViewingChatDetail(false);
                                    }
                                    return;
                                }
                                setSelectedChatLog(chatLog);
                                setIsViewingChatDetail(true);
                            }, className: `memori-chat-history-drawer--card ${(selectedChatLog === null || selectedChatLog === void 0 ? void 0 : selectedChatLog.chatLogID) === chatLog.chatLogID
                                ? 'memori-chat-history-drawer--card--selected'
                                : ''} ${(chatLog === null || chatLog === void 0 ? void 0 : chatLog.sessionID) === sessionId
                                ? 'memori-chat-history-drawer--card--disabled'
                                : 'memori-chat-history-drawer--card--hoverable'}`, children: _jsxs(_Fragment, { children: [_jsx("div", { className: "memori-chat-history-drawer--card--header", children: _jsx("div", { className: "memori-chat-history-drawer--card--header--content", children: _jsx("div", { className: "memori-chat-history-drawer--card--header--info", children: _jsxs("div", { className: "memori-chat-history-drawer--card--header--title-wrapper", children: [_jsx(Dialog.Title, { as: "h3", className: "memori-chat-history-drawer--card--header--title", children: calculateTitle(chatLog.lines) ||
                                                                'Chat-' + chatLog.chatLogID.substring(0, 4) }), chatLog.boardOfExperts && (_jsx("div", { className: "memori-chat-history-drawer--card--header--badge", children: "BOE" }))] }) }) }) }), _jsxs("div", { className: "memori-chat-history-drawer--card--header--meta", children: [_jsx("time", { className: "memori-chat-history-drawer--card--header--meta--time", dateTime: new Date(lastMessageDate).toISOString(), children: formatDate(new Date(lastMessageDate).toISOString()) }), chatLog.lines.some(line => line.media &&
                                                line.media.filter(m => m.mimeType !== 'text/html' &&
                                                    m.mimeType !== 'text/plain').length > 0) && (_jsxs("span", { className: "memori-chat-history-drawer--card--header--meta--messages", children: [_jsx("svg", { className: "memori-chat-history-drawer--card--header--meta--icon", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), chatLog.lines.reduce((acc, line) => {
                                                        var _a;
                                                        return acc +
                                                            (((_a = line.media) === null || _a === void 0 ? void 0 : _a.filter(m => m.mimeType !== 'text/html' &&
                                                                m.mimeType !== 'text/plain').length) || 0);
                                                    }, 0)] })), _jsxs("span", { className: "memori-chat-history-drawer--card--header--meta--messages", children: [_jsx("svg", { className: "memori-chat-history-drawer--card--header--meta--icon", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) }), chatLog.lines.length] }), !isMobile && (_jsx("div", { className: "memori-chat-history-drawer--card--content--header", children: _jsx(Button, { className: "memori-chat-history-drawer--card--content--export-button", onClick: e => handleExportChat(chatLog, e), disabled: (chatLog === null || chatLog === void 0 ? void 0 : chatLog.sessionID) === sessionId, children: _jsx("div", { className: "memori-chat-history-drawer--card--content--export-button--content", children: _jsx(Download, { className: "memori-chat-history-drawer--card--content--export-button--icon" }) }) }) }))] })] }) }, chatLog.chatLogID));
                    }) }), totalPages > 1 && (_jsxs("div", { className: "memori-chat-history-drawer--pagination", children: [_jsx(Button, { primary: true, onClick: () => {
                                setCurrentPage(p => Math.max(1, p - 1));
                            }, disabled: currentPage === 1, className: "memori-chat-history-drawer--pagination--button", children: t('previous') || 'Previous' }), _jsx("span", { className: "memori-chat-history-drawer--pagination--info", children: t('write_and_speak.page', {
                                current: currentPage,
                                total: totalPages,
                            }) }), _jsx(Button, { primary: true, onClick: () => {
                                setCurrentPage(p => Math.min(totalPages, p + 1));
                            }, disabled: currentPage === totalPages, className: "memori-chat-history-drawer--pagination--button", children: t('next') || 'Next' })] }))] }));
    };
    const renderChatDetailView = () => {
        if (!selectedChatLog)
            return null;
        const lastMessageDate = Math.max(...selectedChatLog.lines.map(line => new Date(line.timestamp).getTime()));
        const chatDate = formatDate(new Date(lastMessageDate).toISOString());
        return (_jsxs("div", { className: "memori-chat-history-drawer--detail-view", children: [_jsxs("div", { className: "memori-chat-history-drawer--detail-view--header", children: [_jsx(Button, { className: "memori-chat-history-drawer--detail-view--back-button", onClick: () => {
                                setIsViewingChatDetail(false);
                                setSelectedChatLog(null);
                            }, icon: _jsx(ChevronLeft, {}) }), _jsxs("div", { className: "memori-chat-history-drawer--detail-view--header--title-wrapper", children: [_jsx("div", { className: "memori-chat-history-drawer--detail-view--header--title", children: calculateTitle(selectedChatLog.lines) ||
                                        'Chat-' + selectedChatLog.chatLogID.substring(0, 4) }), _jsx("div", { className: "memori-chat-history-drawer--detail-view--header--date", children: chatDate })] })] }), _jsxs("div", { className: "memori-chat-history-drawer--detail-view--content", children: [_jsx("div", { className: "memori-chat-history-drawer--detail-view--messages", children: _jsx(Chat, { baseUrl: baseUrl, apiUrl: apiUrl, memoriTyping: false, showTypingText: false, showAIicon: true, showTranslationOriginal: false, showWhyThisAnswer: false, showCopyButton: false, isChatlogPanel: true, showInputs: false, history: selectedChatLog.lines.map(line => ({
                                    text: line.text,
                                    contextVars: line.contextVars,
                                    media: line.media,
                                    fromUser: line.inbound,
                                    timestamp: line.timestamp,
                                })), memori: memori, sessionID: sessionId, pushMessage: () => { }, simulateUserPrompt: () => { }, setSendOnEnter: () => { }, attachmentsMenuOpen: undefined, setAttachmentsMenuOpen: () => { }, userMessage: '', onChangeUserMessage: () => { }, sendMessage: () => { }, startListening: () => { }, stopListening: () => { }, listening: false, setEnableFocusChatInput: () => { }, stopAudio: () => { }, isHistoryView: true }, `${selectedChatLog.chatLogID}-${selectedChatLog.lines.length}`) }), _jsx("div", { className: "memori-chat-history-drawer--detail-view--actions", children: _jsx(Button, { className: "memori-chat-history-drawer--detail-view--resume-button", primary: true, onClick: handleResumeChat, children: _jsx("div", { className: "memori-chat-history-drawer--detail-view--resume-button--content", children: _jsx("span", { className: "memori-chat-history-drawer--detail-view--resume-button--text", children: t('write_and_speak.resumeButton') || 'Resume chat' }) }) }) })] })] }));
    };
    return (_jsx(Drawer, { className: "memori-chat-history-drawer", open: open, onClose: onClose, titleWithClosable: {
            title: t('write_and_speak.chatHistory') || 'Chat History',
            actions: [
                {
                    icon: _jsx(Download, {}),
                    visible: isViewingChatDetail,
                    onClick: () => {
                        const fileName = `${memori.name.replace(/\W+/g, '-')}-chat-${new Date().toISOString().split('T')[0]}.txt`;
                        const text = (selectedChatLog === null || selectedChatLog === void 0 ? void 0 : selectedChatLog.lines.map(line => `${line.inbound ? 'YOU' : memori.name}: ${stripAllInternalTags(line.text)}`).join('\n').replaceAll(/<think.*?>(.*?)<\/think>/gs, '').replaceAll(/<output.*?<\/output>/gsi, '').replaceAll(/```markdown([^```]+)```/g, '$1').replaceAll('($', '( $').replaceAll(':$', ': $').replaceAll('\frac', '\\frac').replaceAll('\beta', '\\beta').replaceAll('cdot', '\\cdot')) || 'No chat history available';
                        downloadFile(text, fileName);
                    },
                },
            ],
            showClosable: true,
        }, title: _jsx("div", { className: "memori-chat-history-drawer--title-wrapper", style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
            }, children: _jsx("span", { children: t('write_and_speak.chatHistory') || 'Chat History' }) }), description: !isViewingChatDetail
            ? t('write_and_speak.chatHistoryDescription')
            : undefined, children: isViewingChatDetail ? (renderChatDetailView()) : (_jsxs("div", { className: "memori-chat-history-drawer--content", children: [_jsxs("div", { className: "memori-chat-history-drawer--toolbar", children: [_jsxs("div", { className: "memori-chat-history-drawer--toolbar--min-messages-filter", children: [_jsx(Select, { displayValue: minimumMessagesPerChat === 0
                                        ? (_a = (t('chatLogs.customMinimumMessages') ||
                                            'Customize the number of messages')) !== null && _a !== void 0 ? _a : 'Customize the number of messages'
                                        : minimumMessagesPerChat === 1
                                            ? (_b = (t('chatLogs.anyMessage') || 'Any message')) !== null && _b !== void 0 ? _b : 'Any message'
                                            : (_c = t('chatLogs.atLeast', {
                                                count: minimumMessagesPerChat,
                                            })) !== null && _c !== void 0 ? _c : `At least ${minimumMessagesPerChat} messages`, placeholder: (_d = (t('chatLogs.customMinimumMessages') ||
                                        'Customize the number of messages')) !== null && _d !== void 0 ? _d : 'Customize the number of messages', value: minimumMessagesPerChat, onChange: value => {
                                        setMinimumMessagesPerChat(value);
                                    }, className: "memori-chat-history-drawer--toolbar--min-messages-filter--select", options: [
                                        {
                                            value: 1,
                                            label: t('chatLogs.anyMessage') || 'Any message',
                                        },
                                        {
                                            value: 2,
                                            label: t('chatLogs.atLeast2') || 'At least 2 messages',
                                        },
                                        {
                                            value: 3,
                                            label: t('chatLogs.atLeast3') || 'At least 3 messages',
                                        },
                                        {
                                            value: 5,
                                            label: t('chatLogs.atLeast5') || 'At least 5 messages',
                                        },
                                        {
                                            value: 10,
                                            label: t('chatLogs.atLeast10') || 'At least 10 messages',
                                        },
                                        {
                                            value: 15,
                                            label: t('chatLogs.atLeast15') || 'At least 15 messages',
                                        },
                                        {
                                            value: 20,
                                            label: t('chatLogs.atLeast20') || 'At least 20 messages',
                                        },
                                        {
                                            value: 0,
                                            label: t('chatLogs.customMinimumMessages') ||
                                                'Customize the number of messages',
                                        },
                                    ] }), minimumMessagesPerChat === 0 && (_jsx("input", { type: "number", min: 1, value: customMinimumMessages, onChange: (e) => {
                                        const value = parseInt(e.target.value, 10);
                                        setCustomMinimumMessages(value);
                                    }, style: { minWidth: 50 }, className: "memori-chat-history-drawer--toolbar--min-messages-filter--input-number" }))] }), _jsx("div", { className: "memori-chat-history-drawer--toolbar--actions", children: _jsx(Select, { options: [
                                    {
                                        label: t('all') || 'All',
                                        value: 'all',
                                    },
                                    {
                                        label: t('today') || 'Today',
                                        value: 'today',
                                    },
                                    {
                                        label: t('yesterday') || 'Yesterday',
                                        value: 'yesterday',
                                    },
                                    {
                                        label: t('last_7_days') || 'Last 7 days',
                                        value: 'last_7_days',
                                    },
                                    {
                                        label: t('last_30_days') || 'Last 30 days',
                                        value: 'last_30_days',
                                    },
                                ], value: t(dateRange) || 'All', className: "memori-chat-history-drawer--toolbar--actions--select", onChange: (value) => {
                                    setDateRange(value);
                                    setCurrentPage(1);
                                } }) })] }), renderContent()] })) }));
};
export default ChatHistoryDrawer;
//# sourceMappingURL=ChatHistory.js.map