import React, { useState } from 'react';
import { File, X } from 'lucide-react';
import { Button } from '@memori.ai/ui';
import ContentPreviewModal, {
  DocumentMarkdown,
} from '../ContentPreviewModal';
import Snippet from '../Snippet/Snippet';
import {
  stripHTML,
  stripDocumentAttachmentTags,
  isOfficeNativeFilename,
  getDocumentAttachmentAssetUrl,
} from '../../helpers/utils';
import { getDocumentBadgeLabel } from '../MediaWidget/MediaItemWidget.utils';
import { DocumentCard } from '../MediaWidget/DocumentCard';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { maxDocumentsPerMessage as defaultMaxDocumentsPerMessage } from '../../helpers/constants';

type FilePreviewProps = {
  previewFiles: any;
  removeFile: (id: string, mediumID: string | undefined) => void;
  allowRemove?: boolean;
  showAnonymousRetentionNotice?: boolean;
  uploadingCount?: number;
  maxDocumentsPerMessage?: number;
};

const FilePreview = ({
  previewFiles,
  removeFile,
  allowRemove = true,
  showAnonymousRetentionNotice = false,
  uploadingCount = 0,
  maxDocumentsPerMessage = defaultMaxDocumentsPerMessage,
}: FilePreviewProps) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    id: string;
    content: string;
    type?: string;
    mimeType?: string;
  } | null>(null);

  const isHtmlFile = (
    file: { name?: string; type?: string; mimeType?: string } | null
  ): boolean => {
    if (!file) return false;
    const ext = file.name?.split('.').pop()?.toLowerCase();
    return (
      (file.type === 'document' &&
        (ext === 'html' || file.mimeType === 'text/html')) ||
      ext === 'html' ||
      file.mimeType === 'text/html'
    );
  };

  const getDisplayContent = (
    file: {
      content?: string;
      name?: string;
      type?: string;
      mimeType?: string;
    } | null
  ): string => {
    if (!file?.content) return '';
    const content = file.content;
    if (isHtmlFile(file)) {
      let htmlContent = content;
      if (htmlContent.includes('&lt;') || htmlContent.includes('&quot;')) {
        htmlContent = stripHTML(htmlContent) || htmlContent;
      }
      htmlContent = stripDocumentAttachmentTags(htmlContent);
      return htmlContent;
    }
    return stripHTML(stripDocumentAttachmentTags(content));
  };

  const isImageContent = (content: string, type?: string): boolean => {
    if (type === 'image') return true;

    const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(content);
    const isImageUrl =
      content.startsWith('http') &&
      (content.includes('/image/') ||
        content.includes('/img/') ||
        hasImageExtension);

    return isImageUrl || hasImageExtension;
  };

  const getBadge = (file: {
    name?: string;
    type?: string;
    mimeType?: string;
  }) =>
    file.mimeType
      ? getDocumentBadgeLabel(file.mimeType, file.name)
      : getDocumentBadgeLabel('application/octet-stream', file.name);

  return (
    <>
      {(previewFiles.length > 0 || uploadingCount > 0) && (
        <div className="memori--preview-container">
          {previewFiles.length > 0 && (
            <div
              className={cx('memori--document-count', {
                'memori--document-count-full':
                  previewFiles.length >= maxDocumentsPerMessage,
              })}
            >
              {previewFiles.length}/{maxDocumentsPerMessage}
            </div>
          )}
          {showAnonymousRetentionNotice && (
            <small className="memori--preview-retention-notice">
              {t('upload.anonymousRetentionNotice', {
                defaultValue:
                  'Note: uploaded files are retained for a maximum of 24 hours.',
              })}
            </small>
          )}
          <div className="memori--preview-list">
            {previewFiles.map((file: any) => {
              const isImage = isImageContent(file.content, file.type);
              return (
                <div
                  key={file.id}
                  className={cx('memori--preview-item', {
                    'memori--preview-item--image': isImage,
                    'memori--preview-item--document': !isImage,
                  })}
                >
                  <button
                    type="button"
                    className="memori--preview-item-trigger"
                    onClick={() => {
                      if (isOfficeNativeFilename(file.name || '')) {
                        const url = getDocumentAttachmentAssetUrl(file);
                        if (url) {
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }
                      } else {
                        setSelectedFile(file);
                      }
                    }}
                    aria-label={file.name}
                  >
                    {isImage ? (
                      <div className="memori--preview-thumbnail memori-media-item--image">
                        <img src={file.content} alt="" />
                      </div>
                    ) : (
                      <DocumentCard
                        title={file.name || 'File'}
                        badge={getBadge(file)}
                        icon={
                          <File className="memori-media-item--document-icon-svg" />
                        }
                      />
                    )}
                  </button>

                  {allowRemove && (
                    <Button
                      shape="circle"
                      variant="ghost"
                      size="sm"
                      icon={<X aria-hidden />}
                      className="memori--remove-button"
                      aria-label={String(
                        t('upload.removeFile', {
                          defaultValue: 'Remove {{name}}',
                          name: file.name,
                        })
                      )}
                      onClick={() => removeFile(file.id, file?.mediumID)}
                    />
                  )}
                </div>
              );
            })}

            {uploadingCount > 0 &&
              Array.from({ length: uploadingCount }, (_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="memori--preview-item memori--preview-item--document memori--preview-item--skeleton"
                >
                  <div className="memori-media-item--document">
                    <div className="memori-media-item--document-header">
                      <div className="memori--skeleton-icon" />
                      <div className="memori--preview-file-info">
                        <div className="memori--skeleton-line memori--skeleton-line--name" />
                        <div className="memori--skeleton-line memori--skeleton-line--type" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <ContentPreviewModal
        open={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        title={selectedFile?.name}
        description={selectedFile ? getBadge(selectedFile) : undefined}
        headerIcon={
          selectedFile &&
          !isImageContent(selectedFile.content, selectedFile.type) ? (
            <File aria-hidden />
          ) : undefined
        }
        className="memori-file-preview-modal"
        contentKind={
          selectedFile &&
          !isImageContent(selectedFile.content, selectedFile.type) &&
          !isHtmlFile(selectedFile)
            ? 'document'
            : 'snippet'
        }
        isImage={
          !!selectedFile &&
          isImageContent(selectedFile.content, selectedFile.type)
        }
        imageSrc={
          selectedFile &&
          isImageContent(selectedFile.content, selectedFile.type)
            ? selectedFile.content
            : undefined
        }
        imageAlt={selectedFile?.name ?? ''}
      >
        {selectedFile &&
          !isImageContent(selectedFile.content, selectedFile.type) &&
          (isHtmlFile(selectedFile) ? (
            <Snippet
              preview={false}
              medium={{
                mediumID: selectedFile.id,
                mimeType: 'application/xml',
                content: getDisplayContent(selectedFile),
                title: selectedFile.name,
              }}
            />
          ) : (
            <DocumentMarkdown content={selectedFile.content} />
          ))}
      </ContentPreviewModal>
    </>
  );
};

export default FilePreview;
