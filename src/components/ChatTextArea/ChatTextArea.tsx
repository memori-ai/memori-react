import React, { useState } from 'react';
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
}

const ChatTextArea: React.FC<Props> = ({
  disabled = false,
  value,
  onChange,
  onPressEnter,
  onFocus,
  onBlur,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      data-testid="chat-textarea"
      className={cx('memori-chat-textarea', {
        'memori-chat-textarea--expanded': expanded,
        'memori-chat-textarea--disabled': disabled,
      })}
    >
      <div className="memori-chat-textarea--inner">
        <textarea
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
        />
        <div className="memori-chat-textarea--expand">
          <Button
            className={cx('memori-chat-textarea--expand-button')}
            onClick={() => setExpanded(!expanded)}
            padded={false}
            ghost
            title={
              expanded ? t('collapse') || 'Collapse' : t('expand') || 'Expand'
            }
            icon={expanded ? <FullscreenExit /> : <Expand />}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatTextArea;
