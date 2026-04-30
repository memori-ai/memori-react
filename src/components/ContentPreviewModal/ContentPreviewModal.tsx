import React, { FC } from 'react';
import { Modal } from '@memori.ai/ui';
import cx from 'classnames';

export interface ContentPreviewModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** When true, renders image with min 600px width; otherwise renders children in snippet-style area */
  isImage?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  /** Content for non-image preview (text, Snippet, iframe, etc.) */
  children?: React.ReactNode;
  className?: string;
}

const ContentPreviewModal: FC<ContentPreviewModalProps> = ({
  open,
  onClose,
  title,
  isImage = false,
  imageSrc,
  imageAlt = '',
  children,
  className,
}) => {
  const width = 'min(90vw, 800px)';

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      width={width}
      widthMd={width}
      className={cx('memori-content-preview-modal', className, {
        'memori-content-preview-modal--image': isImage,
      })}
      closable
      title={title}
      footer={null}
    >
      <div
        className={cx('memori-content-preview-modal--body', {
          'memori-content-preview-modal--body--image': isImage,
          'memori-content-preview-modal--body--content': !isImage,
        })}
      >
        {isImage && imageSrc ? (
          <div className="memori-content-preview-modal--image-wrap">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="memori-content-preview-modal--image"
            />
          </div>
        ) : (
          <div className="memori-content-preview-modal--snippet-wrap">
            {children}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ContentPreviewModal;
