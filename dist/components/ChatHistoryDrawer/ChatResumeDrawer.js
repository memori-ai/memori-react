"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ui_1 = require("@memori.ai/ui");
const lucide_react_1 = require("lucide-react");
const react_i18next_1 = require("react-i18next");
const utils_1 = require("../../helpers/utils");
const Chat_1 = tslib_1.__importDefault(require("../Chat/Chat"));
const ANIMATION_DURATION_MS = 280;
const EMPTY_MEMORI = {
    memoriID: 'chat-resume-drawer',
    name: 'AI',
    culture: 'it-IT',
    coverURL: '',
    avatarURL: '',
    enableBoardOfExperts: false,
};
const NOOP = () => { };
const stripMarkdownChars = (value) => {
    return value
        .replace(/[#*_`~>\-[\]()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};
const escapeAttachmentAttr = (value) => value.replaceAll('"', '&quot;');
const ChatResumeDrawer = ({ isOpen, onClose, onBack, embedded = false, session, onResume, isLoading = false, onExportChat, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dialogRef = (0, react_1.useRef)(null);
    const panelRef = (0, react_1.useRef)(null);
    const backButtonRef = (0, react_1.useRef)(null);
    const titleId = 'chat-resume-drawer-title';
    const [shouldRender, setShouldRender] = (0, react_1.useState)(isOpen);
    const [isVisible, setIsVisible] = (0, react_1.useState)(isOpen);
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            setShouldRender(true);
            requestAnimationFrame(() => setIsVisible(true));
            return;
        }
        setIsVisible(false);
        const timeout = window.setTimeout(() => {
            setShouldRender(false);
        }, ANIMATION_DURATION_MS);
        return () => window.clearTimeout(timeout);
    }, [isOpen]);
    (0, react_1.useEffect)(() => {
        var _a;
        if (!isOpen)
            return;
        (_a = backButtonRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }, [isOpen]);
    (0, react_1.useEffect)(() => {
        if (!isOpen || embedded)
            return;
        const previouslyFocused = document.activeElement;
        const root = dialogRef.current;
        if (!root)
            return;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }
            if (event.key !== 'Tab')
                return;
            const focusableElements = root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (!focusableElements.length)
                return;
            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];
            const active = document.activeElement;
            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            }
            else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            previouslyFocused === null || previouslyFocused === void 0 ? void 0 : previouslyFocused.focus();
        };
    }, [embedded, isOpen, onClose]);
    const safeTitle = (0, react_1.useMemo)(() => {
        const cleaned = stripMarkdownChars((0, utils_1.stripHTML)(session.title || ''));
        return cleaned || 'Conversazione';
    }, [session.title]);
    const history = (0, react_1.useMemo)(() => session.messages.map(message => {
        const attachmentTag = message.attachment
            ? `<document_attachment filename="${escapeAttachmentAttr(message.attachment.name)}" type="${escapeAttachmentAttr(message.attachment.type)}"></document_attachment>`
            : '';
        const interruptedText = message.role === 'assistant' && message.status === 'interrupted'
            ? 'Risposta interrotta - sessione in pausa'
            : message.content;
        return {
            fromUser: message.role === 'user',
            text: `${interruptedText}${attachmentTag}`,
            timestamp: message.timestamp,
            media: message.media || [],
        };
    }), [session.messages]);
    if (!embedded && !shouldRender)
        return null;
    const content = ((0, jsx_runtime_1.jsxs)("div", { ref: panelRef, className: `memori-chat-resume-drawer--panel ${embedded ? 'memori-chat-resume-drawer--panel-embedded' : ''}`, onClick: event => event.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("header", { className: "memori-chat-resume-drawer--header", children: [(0, jsx_runtime_1.jsx)(ui_1.Button, { ref: backButtonRef, variant: "ghost", type: "button", className: "memori-chat-resume-drawer--header-icon-button", onClick: onBack || onClose, "aria-label": String(t('back', { defaultValue: 'Back' })), children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { size: 16, "aria-hidden": true }) }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-chat-resume-drawer--header-main", children: [(0, jsx_runtime_1.jsx)("h2", { id: titleId, className: "memori-chat-resume-drawer--title", title: safeTitle, children: safeTitle }), (0, jsx_runtime_1.jsx)("p", { className: "memori-chat-resume-drawer--subtitle", children: session.subtitle })] }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "ghost", size: "sm", className: "memori-chat-history-drawer--header-download-button", "aria-label": String(t('download', { defaultValue: 'Download' })), title: String(t('download', { defaultValue: 'Download' })), icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Download, { "aria-hidden": true }), onClick: onExportChat })] }), (0, jsx_runtime_1.jsxs)("div", { className: "memori-chat-resume-drawer--thread", children: [isLoading && ((0, jsx_runtime_1.jsx)("div", { className: "memori-chat-resume-drawer--skeletons", children: [0, 1, 2].map(item => ((0, jsx_runtime_1.jsx)("div", { className: "memori-chat-resume-drawer--skeleton-bubble" }, item))) })), !isLoading && ((0, jsx_runtime_1.jsx)("div", { className: "memori-chat-resume-drawer--embedded-chat", children: (0, jsx_runtime_1.jsx)(Chat_1.default, { memori: EMPTY_MEMORI, sessionID: "chat-resume-drawer", history: history, pushMessage: NOOP, simulateUserPrompt: NOOP, setSendOnEnter: NOOP, setAttachmentsMenuOpen: NOOP, onChangeUserMessage: NOOP, sendMessage: NOOP, setEnableFocusChatInput: NOOP, stopAudio: NOOP, startListening: NOOP, stopListening: NOOP, showInputs: false, showAIicon: true, showCopyButton: true, isHistoryView: true, isChatlogPanel: true }) }))] }), (0, jsx_runtime_1.jsx)("footer", { className: "memori-chat-resume-drawer--actions", children: (0, jsx_runtime_1.jsxs)(ui_1.Button, { className: "memori-chat-resume-drawer--resume-cta", variant: "primary", onClick: () => onResume(), children: [t('chatResume.resume', { defaultValue: 'Resume conversation' }), ' ', (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUpRight, { size: 16, "aria-hidden": true })] }) })] }));
    if (embedded) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "memori-chat-resume-drawer--embedded-shell", children: content }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { ref: dialogRef, className: `memori-chat-resume-drawer ${isVisible ? 'memori-chat-resume-drawer--open' : ''}`, role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, children: [(0, jsx_runtime_1.jsx)(ui_1.Button, { className: "memori-chat-resume-drawer--backdrop", type: "button", "aria-label": String(t('close', { defaultValue: 'Close' })), onClick: onClose }), content] }));
};
exports.default = ChatResumeDrawer;
//# sourceMappingURL=ChatResumeDrawer.js.map