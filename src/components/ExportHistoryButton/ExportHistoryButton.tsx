import React from 'react';
import { Memori, Message } from '@memori.ai/memori-api-client/dist/types';
import { useTranslation } from 'react-i18next';
import { Popover } from '@headlessui/react';
import Button from '../ui/Button';
import MessageIcon from '../icons/Message';
import cx from 'classnames';

export interface Props {
  history: Message[];
  memori: Memori;
  icon?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  align?: 'left' | 'right';
  disabled?: boolean;
  filename?: string;
}

const downloadFile = (text: string, filename = 'export-chat.txt') => {
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

const ExportHistoryButton = ({
  history,
  memori,
  className,
  buttonClassName,
  icon,
  disabled = false,
  align = 'right',
  filename,
}: Props) => {
  const { t } = useTranslation();

  const text = `${t(
    'write_and_speak.conversationStartedLabel'
  )} ${new Intl.DateTimeFormat('it', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date())}\n\n`.concat(
    history
      .map(m => `${m.fromUser ? 'YOU' : memori.name}: ${m.text}`)
      .join('\n')
  );

  return (
    <Popover
      title={t('write_and_speak.exportChatHistoryMessage')}
      className={cx('memori-export-history-button', className, {
        'memori-export-history-button--align-left': align === 'left',
      })}
    >
      {({ close }) => (
        <>
          <Popover.Button
            disabled={disabled}
            className={cx(
              'memori-button',
              'memori-button--circle',
              'memori-button--icon-only',
              buttonClassName,
              {
                'memori-button--disabled': disabled,
                'memori-button--primary': !disabled,
              }
            )}
          >
            <div className="memori-button--icon">{icon || <MessageIcon />}</div>
          </Popover.Button>

          <Popover.Panel className="memori-export-history-button--panel">
            <p>{t('write_and_speak.exportChatHistory')}</p>
            <Button
              primary
              onClick={() =>
                downloadFile(
                  text,
                  filename ||
                    `${memori.name.replace(/\W+/g, '-')}-export-chat.txt`
                )
              }
            >
              {t('yes') || 'Yes'}
            </Button>
            <Button onClick={() => close()}>{t('no') || 'No'}</Button>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default ExportHistoryButton;
