"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_i18next_1 = require("react-i18next");
const utils_1 = require("../../helpers/utils");
const ChatTextArea = ({ disabled = false, value, onChange, onPressEnter, onPaste, onFocus, onBlur, onExpandedChange, maxTextareaCharacters, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const textareaRef = (0, react_1.useRef)(null);
    const innerRef = (0, react_1.useRef)(null);
    const MIN_HEIGHT = 36;
    const MAX_HEIGHT = 208;
    (0, react_1.useEffect)(() => {
        const textarea = textareaRef.current;
        const inner = innerRef.current;
        if (textarea && inner) {
            if (value.length === 0) {
                textarea.style.height = `${MIN_HEIGHT}px`;
                inner.style.height = `${MIN_HEIGHT}px`;
                if (onExpandedChange) {
                    onExpandedChange(false);
                }
                const chat = document.getElementsByClassName('memori-chat--content');
                if (chat) {
                    const lastChild = chat[chat.length - 1];
                    if (lastChild) {
                        lastChild.style.paddingBottom = '0px';
                    }
                }
            }
            else {
                textarea.style.height = 'auto';
                const scrollHeight = textarea.scrollHeight;
                const newHeight = Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
                textarea.style.height = `${newHeight}px`;
                inner.style.height = `${newHeight}px`;
                const chat = document.getElementsByClassName('memori-chat--content');
                if (chat) {
                    const lastChild = chat[chat.length - 1];
                    if (lastChild) {
                        chat[0].scrollTo({
                            top: chat[0].scrollHeight,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        }
    }, [value]);
    const displayValue = maxTextareaCharacters != null
        ? value.slice(0, maxTextareaCharacters)
        : value;
    (0, react_1.useEffect)(() => {
        if (maxTextareaCharacters != null &&
            value.length > maxTextareaCharacters) {
            onChange(value.slice(0, maxTextareaCharacters));
        }
    }, [maxTextareaCharacters, value, onChange]);
    return ((0, jsx_runtime_1.jsxs)("div", { "data-testid": "chat-textarea", className: (0, classnames_1.default)('memori-chat-textarea', {
            'memori-chat-textarea--disabled': disabled,
            'memori-chat-textarea--with-counter': maxTextareaCharacters != null,
        }), children: [maxTextareaCharacters != null && ((0, jsx_runtime_1.jsxs)("div", { className: "memori-chat-textarea--counter", "aria-live": "polite", children: [displayValue.length, " / ", maxTextareaCharacters] })), (0, jsx_runtime_1.jsx)("div", { ref: innerRef, className: "memori-chat-textarea--inner", children: (0, jsx_runtime_1.jsx)("textarea", { ref: textareaRef, className: "memori-chat-textarea--input", disabled: disabled, value: displayValue, placeholder: t('placeholder', 'Ask a question') || 'Ask a question', onChange: e => {
                        const next = e.target.value;
                        if (maxTextareaCharacters != null) {
                            onChange(next.slice(0, maxTextareaCharacters));
                        }
                        else {
                            onChange(next);
                        }
                    }, onKeyDownCapture: e => {
                        var _a, _b;
                        const isMobile = (0, utils_1.isMobileOrTablet)();
                        if (e.key === 'Enter' && e.altKey && !e.shiftKey && !isMobile) {
                            e.preventDefault();
                            const el = textareaRef.current;
                            const start = (_a = el === null || el === void 0 ? void 0 : el.selectionStart) !== null && _a !== void 0 ? _a : displayValue.length;
                            const end = (_b = el === null || el === void 0 ? void 0 : el.selectionEnd) !== null && _b !== void 0 ? _b : displayValue.length;
                            let nextValue = `${displayValue.slice(0, start)}\n${displayValue.slice(end)}`;
                            if (maxTextareaCharacters != null) {
                                nextValue = nextValue.slice(0, maxTextareaCharacters);
                            }
                            onChange(nextValue);
                            requestAnimationFrame(() => {
                                if (!el)
                                    return;
                                const caret = start + 1;
                                el.selectionStart = caret;
                                el.selectionEnd = caret;
                            });
                            return;
                        }
                        if (e.key === 'Enter' && !e.shiftKey && onPressEnter && !isMobile) {
                            onPressEnter(e);
                        }
                    }, onPaste: onPaste, onFocus: onFocus, onBlur: onBlur, maxLength: maxTextareaCharacters !== null && maxTextareaCharacters !== void 0 ? maxTextareaCharacters : 100000 }) })] }));
};
exports.default = ChatTextArea;
//# sourceMappingURL=ChatTextArea.js.map