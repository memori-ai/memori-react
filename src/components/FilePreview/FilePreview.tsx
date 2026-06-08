import React, { useEffect, useState } from 'react';
import File from '../icons/File';
import CloseIcon from '../icons/Close';
import Button from '../ui/Button';
import ContentPreviewModal from '../ContentPreviewModal';
import Snippet from '../Snippet/Snippet';
import {
  stripHTML,
  stripDocumentAttachmentTags,
  isOfficeNativeFilename,
  getDocumentAttachmentAssetUrl,
} from '../../helpers/utils';
import { getDocumentBadgeLabel } from '../MediaWidget/MediaItemWidget.utils';
import { useTranslation } from 'react-i18next';

type FilePreviewProps = {
  previewFiles: any;
  removeFile: (id: string, mediumID: string | undefined) => void;
  allowRemove?: boolean;
  showAnonymousRetentionNotice?: boolean;
  uploadingCount?: number;
};

const FilePreview = ({
  previewFiles,
  removeFile,
  allowRemove = true,
  showAnonymousRetentionNotice = false,
  uploadingCount = 0,
}: FilePreviewProps) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    id: string;
    content: string;
    type?: string;
  } | null>(null);

  const getFileType = (filename: string, type?: string) => {
    // If type is explicitly provided, use it first
    if (type === 'image') {
      const extension = filename.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'jpg':
        case 'jpeg':
          return 'JPEG';
        case 'png':
          return 'PNG';
        default:
          return 'Image';
      }
    }

    // Otherwise use extension
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'PDF';
      case 'txt':
        return 'Text';
      case 'json':
        return 'JSON';
      case 'xlsx':
        return 'Excel';
      case 'csv':
        return 'CSV';
      case 'html':
        return 'HTML';
      case 'doc':
      case 'docx':
        return 'Word';
      case 'xls':
      case 'xltx':
        return 'Excel';
      case 'potx':
        return 'PowerPoint';
      case 'jpg':
      case 'jpeg':
        return 'JPEG';
      case 'png':
        return 'PNG';
      default:
        return 'Document';
    }
  };

  useEffect(() => {
    const chat = document.getElementsByClassName('memori-chat--content');
    if (chat) {
      const lastChild = chat[chat.length - 1];
      if (lastChild) {
        //then scroll to the bottom of the chat
        (chat[0] as HTMLElement).scrollTo({
          top: (chat[0] as HTMLElement).scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [previewFiles]);
  // Detect if the file is HTML (by type or filename)
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

  // Get display content for non-image files (strip document_attachment for HTML, stripHTML for others)
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
        const div = document.createElement('div');
        div.innerHTML = htmlContent;
        htmlContent = div.textContent || div.innerText || htmlContent;
      }
      htmlContent = stripDocumentAttachmentTags(htmlContent);
      return htmlContent;
    }
    return stripHTML(stripDocumentAttachmentTags(content));
  };

  // Detect if the content is an image URL
  const isImageContent = (content: string, type?: string): boolean => {
    if (type === 'image') return true;

    // Check if the content has image file extension or is an image URL
    const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(content);
    const isImageUrl =
      content.startsWith('http') &&
      (content.includes('/image/') ||
        content.includes('/img/') ||
        hasImageExtension);

    return isImageUrl || hasImageExtension;
  };

  return (
    <>
      {(previewFiles.length > 0 || uploadingCount > 0) && (
        <div className="memori--preview-container">
          {showAnonymousRetentionNotice && (
            <small
              style={{
                color: 'rgb(138, 138, 138)',
                display: 'block',
                marginTop: '6px',
                marginBottom: '6px',
                fontSize: '0.7rem',
              }}
            >
              {t('upload.anonymousRetentionNotice', {
                defaultValue:
                  'Note: uploaded files are retained for a maximum of 24 hours.',
              })}
            </small>
          )}
          <div className="memori--preview-list">
            {previewFiles.map((file: any) => (
              <div
                key={file.id}
                className={`memori--preview-item ${
                  isImageContent(file.content, file.type)
                    ? 'memori--preview-item--image'
                    : 'memori--preview-item--document'
                }`}
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
              >
                {isImageContent(file.content, file.type) ? (
                  <div className="memori--preview-thumbnail">
                    <img src={file.content} alt={file.name} />
                  </div>
                ) : (
                  <File className="memori--preview-icon" />
                )}

                <div className="memori--preview-file-info">
                  <span className="memori--preview-filename">{file.name}</span>
                  <span className="memori--preview-filetype">
                    {file.mimeType
                      ? getDocumentBadgeLabel(file.mimeType, file.name)
                      : getFileType(file.name, file.type)}
                  </span>
                </div>

                {allowRemove && (
                  <Button
                    shape="rounded"
                    icon={<CloseIcon />}
                    danger
                    className="memori--remove-button"
                    onClick={e => {
                      e.stopPropagation();
                      removeFile(file.id, file?.mediumID);
                    }}
                  />
                )}
              </div>
            ))}

            {uploadingCount > 0 &&
              Array.from({ length: uploadingCount }, (_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="memori--preview-item memori--preview-item--document memori--preview-item--skeleton"
                >
                  <div className="memori--skeleton-icon" />
                  <div className="memori--preview-file-info">
                    <div className="memori--skeleton-line memori--skeleton-line--name" />
                    <div className="memori--skeleton-line memori--skeleton-line--type" />
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
            getDisplayContent(selectedFile)
          ))}
      </ContentPreviewModal>
    </>
  );
};

export default FilePreview;
