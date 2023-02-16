import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RenderLinkItem } from '../MediaWidget/LinkItemWidget';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

export interface Props {
  visible: boolean;
  onCancel?: () => void;
  onOk: ({ url, title }: { url: string; title: string }) => void;
  apiURL?: string;
}

const AttachmentLinkModal = ({ visible, onCancel, onOk }: Props) => {
  const { t } = useTranslation();
  const [newLink, setNewLink] = useState<{ url: string; title: string }>({
    url: '',
    title: '',
  });

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (newLink?.url.length === 0 || newLink?.title.length === 0) return;

      let saveButton = document.getElementById(
        'save-link-button'
      ) as HTMLButtonElement | null;

      if (saveButton) {
        saveButton.click();
      }
    }
  };

  return (
    <Modal
      open={visible}
      title={t('media.addLinkLabel')}
      className="attachment-link-modal"
      closable
      width="100%"
      widthMd="80%"
      onClose={() => {
        if (onCancel) onCancel();
      }}
      footer={
        <>
          <Button onClick={onCancel}>{t('cancel')}</Button>
          <Button
            id="save-link-button"
            primary
            onClick={() => {
              if (newLink?.url.length === 0 || newLink?.title.length === 0)
                return;
              onOk(newLink);
              setNewLink({ url: '', title: '' });
            }}
            disabled={newLink?.url.length === 0 || newLink?.title.length === 0}
          >
            {t('confirm')}
          </Button>
        </>
      }
    >
      <div className="attachment-link-modal--row">
        <div className="attachment-link-modal--column">
          <label
            htmlFor="new-link-url"
            className="attachment-link-modal--label"
          >
            {t('media.linkKey')}:
          </label>
          <input
            type="url"
            className="attachment-link-modal--input              "
            onChange={e => {
              let value =
                e.target.value.startsWith('http') || e.target.value.length === 0
                  ? e.target.value
                  : `https://${e.target.value}`;
              setNewLink(l => ({ title: l?.title ?? '', url: value }));
            }}
            placeholder="https://memori.ai/..."
            value={newLink?.url}
            name="url"
            onKeyDown={onKeyPress}
          />
          <label
            htmlFor="new-link-title"
            className="attachment-link-modal--label"
          >
            {t('media.linkValue')}:
          </label>
          <input
            type="text"
            className="attachment-link-modal--input              "
            onChange={e =>
              setNewLink(l => ({ url: l?.url ?? '', title: e.target.value }))
            }
            value={newLink?.title}
            name="title"
            onKeyDown={onKeyPress}
          />
        </div>
        <div className="attachment-link-modal--column">
          <div className="attachment-link-modal--centered">
            <RenderLinkItem
              key={newLink?.url ?? ''}
              item={{
                title: newLink?.title ?? '',
                url: newLink?.url ?? '',
                mediumID: '',
                mimeType: 'text/html',
              }}
              onLinkPreviewInfo={data => {
                if (!newLink?.title?.length) {
                  setNewLink(l => ({
                    ...l,
                    title: data?.title ?? '',
                  }));
                }
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AttachmentLinkModal;
