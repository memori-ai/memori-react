import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import { Button } from '@memori.ai/ui';
import { Maximize2, Minimize } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isMobileOrTablet } from '../../helpers/utils';

export interface Props {
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  onPressEnter?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  onExpandedChange?: (expanded: boolean) => void;
  /** When set, shows a character counter (e.g. "0 / 500") above the textarea and enforces the max length. */
  maxTextareaCharacters?: number;
}

const ChatTextArea: React.FC<Props> = ({
  disabled = false,
  value,
  onChange,
  onPressEnter,
  onPaste,
  onFocus,
  onBlur,
  onExpandedChange,
  maxTextareaCharacters,
}) => {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const MIN_HEIGHT = 36;
  const MAX_HEIGHT = 208;

  // Auto-expand textarea based on content (only when not manually expanded)
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
        //reset the padding bottom of the chat
        const chat = document.getElementsByClassName('memori-chat--content');
        if (chat) {
          const lastChild = chat[chat.length - 1];
          if (lastChild) {
            (lastChild as HTMLElement).style.paddingBottom = '0px';
          }
        }
      } else {
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const newHeight = Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
        textarea.style.height = `${newHeight}px`;
        inner.style.height = `${newHeight}px`;

        //set the padding bottom to the chat in order to keep the whole chat visible
        // take last child of chat wrapper and set the padding bottom to the height of the textarea
        const chat = document.getElementsByClassName('memori-chat--content');
        if (chat) {
        const lastChild = chat[chat.length - 1];
          if (lastChild) {
            // (lastChild as HTMLElement).style.paddingBottom = `${newHeight}px`;
            //then scroll to the bottom of the chat
            (chat[0] as HTMLElement).scrollTo({
              top: (chat[0] as HTMLElement).scrollHeight,
              behavior: 'smooth'
            });
          }
        }
      }
    }
  }, [value]);

  const displayValue =
    maxTextareaCharacters != null
      ? value.slice(0, maxTextareaCharacters)
      : value;

  // Keep parent state in sync when value exceeds limit (e.g. paste or prop change)
  useEffect(() => {
    if (
      maxTextareaCharacters != null &&
      value.length > maxTextareaCharacters
    ) {
      onChange(value.slice(0, maxTextareaCharacters));
    }
  }, [maxTextareaCharacters, value, onChange]);

  return (
    <div
      data-testid="chat-textarea"
      className={cx('memori-chat-textarea', {
        'memori-chat-textarea--disabled': disabled,
        'memori-chat-textarea--with-counter': maxTextareaCharacters != null,
      })}
    >
      {maxTextareaCharacters != null && (
        <div className="memori-chat-textarea--counter" aria-live="polite">
          {displayValue.length} / {maxTextareaCharacters}
        </div>
      )}
      <div ref={innerRef} className="memori-chat-textarea--inner">
        <textarea
          ref={textareaRef}
          className="memori-chat-textarea--input"
          disabled={disabled}
          value={displayValue}
          placeholder={t('placeholder', 'Ask a question') || 'Ask a question'}
          onChange={e => {
            const next = e.target.value;
            if (maxTextareaCharacters != null) {
              onChange(next.slice(0, maxTextareaCharacters));
            } else {
              onChange(next);
            }
          }}
          onKeyDownCapture={e => {
            // On mobile/tablet only: Enter creates a new line instead of sending.
            // Touch laptops (e.g. Surface) keep desktop behavior: Enter = send, Alt/Shift+Enter = new line.
            const isMobile = isMobileOrTablet();
            // Alt/Option+Enter should always create a newline (do not send).
            // We insert it manually because this is a controlled textarea and
            // some browser/keyboard combos won't trigger an input event as expected.
            if (e.key === 'Enter' && e.altKey && !e.shiftKey && !isMobile) {
              e.preventDefault();

              const el = textareaRef.current;
              const start = el?.selectionStart ?? displayValue.length;
              const end = el?.selectionEnd ?? displayValue.length;
              let nextValue = `${displayValue.slice(0, start)}\n${displayValue.slice(end)}`;
              if (maxTextareaCharacters != null) {
                nextValue = nextValue.slice(0, maxTextareaCharacters);
              }
              onChange(nextValue);

              // Restore caret right after the inserted newline
              requestAnimationFrame(() => {
                if (!el) return;
                const caret = start + 1;
                el.selectionStart = caret;
                el.selectionEnd = caret;
              });

              return;
            }

            if (e.key === 'Enter' && !e.shiftKey && onPressEnter && !isMobile) {
              onPressEnter(e);
            }
          }}
          onPaste={onPaste}
          onFocus={onFocus}
          onBlur={onBlur}
          maxLength={maxTextareaCharacters ?? 100000}
        />
      </div>
    </div>
  );
};

export default ChatTextArea;
