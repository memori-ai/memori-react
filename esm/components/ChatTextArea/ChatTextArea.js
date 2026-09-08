import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { isMobileOrTablet } from '../../helpers/utils';
const ChatTextArea = ({ disabled = false, value, onChange, onPressEnter, onPaste, onFocus, onBlur, onExpandedChange, maxTextareaCharacters, }) => {
    const { t } = useTranslation();
    const textareaRef = useRef(null);
    const innerRef = useRef(null);
    const MIN_HEIGHT = 36;
    const MAX_HEIGHT = 208;
    useEffect(() => {
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
    useEffect(() => {
        if (maxTextareaCharacters != null &&
            value.length > maxTextareaCharacters) {
            onChange(value.slice(0, maxTextareaCharacters));
        }
    }, [maxTextareaCharacters, value, onChange]);
    return (_jsxs("div", { "data-testid": "chat-textarea", className: cx('memori-chat-textarea', {
            'memori-chat-textarea--disabled': disabled,
            'memori-chat-textarea--with-counter': maxTextareaCharacters != null,
        }), children: [maxTextareaCharacters != null && (_jsxs("div", { className: "memori-chat-textarea--counter", "aria-live": "polite", children: [displayValue.length, " / ", maxTextareaCharacters] })), _jsx("div", { ref: innerRef, className: "memori-chat-textarea--inner", children: _jsx("textarea", { ref: textareaRef, className: "memori-chat-textarea--input", disabled: disabled, value: displayValue, placeholder: t('placeholder', 'Ask a question') || 'Ask a question', onChange: e => {
                        const next = e.target.value;
                        if (maxTextareaCharacters != null) {
                            onChange(next.slice(0, maxTextareaCharacters));
                        }
                        else {
                            onChange(next);
                        }
                    }, onKeyDownCapture: e => {
                        var _a, _b;
                        const isMobile = isMobileOrTablet();
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
export default ChatTextArea;
//# sourceMappingURL=ChatTextArea.js.map