import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import Button from '../ui/Button';
import Expand from '../icons/Expand';
import FullscreenExit from '../icons/FullscreenExit';
import { useTranslation } from 'react-i18next';

export interface Props {
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  onPressEnter?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  onExpandedChange?: (expanded: boolean) => void;
}

const ChatTextArea: React.FC<Props> = ({
  disabled = false,
  value,
  onChange,
  onPressEnter,
  onFocus,
  onBlur,
  onExpandedChange,
}) => {
  const { t } = useTranslation();
  const [manuallyExpanded, setManuallyExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const MIN_HEIGHT = 40;
  const MAX_HEIGHT = 300;

  // Auto-expand textarea based on content (only when not manually expanded)
  useEffect(() => {
    const textarea = textareaRef.current;
    const inner = innerRef.current;

    if (textarea && inner) {
      if (value.length === 0) {
        textarea.style.height = '30px';
        inner.style.height = '30px';
        if (onExpandedChange) {
          onExpandedChange(false);
        }
      } else {
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const newHeight = Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
        textarea.style.height = `${newHeight}px`;
        inner.style.height = `${newHeight}px`;

        const isAutoExpanded = scrollHeight > MIN_HEIGHT;
        if (onExpandedChange) {
          onExpandedChange(isAutoExpanded);
        }
      }
    }
  }, [value]);

  return (
    <div
      data-testid="chat-textarea"
      className={cx('memori-chat-textarea', {
        'memori-chat-textarea--disabled': disabled,
      })}
    >
      <div ref={innerRef} className="memori-chat-textarea--inner">
        <textarea
          ref={textareaRef}
          className="memori-chat-textarea--input"
          disabled={disabled}
          value={value}
          onChange={e => {
            onChange(e.target.value);
          }}
          onKeyDownCapture={e => {
            if (e.key === 'Enter' && !e.shiftKey && onPressEnter) {
              onPressEnter(e);
            }
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          maxLength={100000}
        />
      </div>
    </div>
  );
};

export default ChatTextArea;
