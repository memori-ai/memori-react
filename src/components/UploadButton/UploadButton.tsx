import React, { useState, useRef, useEffect } from 'react';
import { DocumentIcon } from '../icons/Document';
import { ImageIcon } from '../icons/Image';
import { UploadIcon } from '../icons/Upload';
import Spin from '../ui/Spin';
import Alert from '../ui/Alert';
import cx from 'classnames';
import UploadDocuments from './UploadDocuments/UploadDocuments';
import UploadImages from './UploadImages/UploadImages';
import { useTranslation } from 'react-i18next';
import memoriApiClient from '@memori.ai/memori-api-client';

// Constants
const MAX_IMAGES = 5;
const MAX_DOCUMENTS = 5;

// Props interface
interface UploadManagerProps {
  authToken?: string;
  client?: ReturnType<typeof memoriApiClient>;
  sessionID?: string;
  isMediaAccepted?: boolean;
  setDocumentPreviewFiles: any;
  documentPreviewFiles: {
    name: string;
    id: string;
    content: string;
    mediumID?: string;
    type?: string;
  }[];
  memoriID?: string;
}

const UploadButton: React.FC<UploadManagerProps> = ({
  authToken = '',
  client,
  sessionID = '',
  isMediaAccepted = false,
  setDocumentPreviewFiles,
  documentPreviewFiles,
  memoriID = '',
}) => {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [errors, setErrors] = useState<
    { message: string; severity: 'error' | 'warning' | 'info' }[]
  >([]);
  const { t, i18n } = useTranslation();

  // Refs
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Calculate image count and remaining slots
  const currentImageCount = documentPreviewFiles.filter(
    file => file.type === 'image'
  ).length;
  const remainingSlots = MAX_IMAGES - currentImageCount;
  const currentDocumentCount = documentPreviewFiles.filter(
    file => file.type === 'document'
  ).length;
  const remainingDocumentSlots = MAX_DOCUMENTS - currentDocumentCount;
  const hasReachedImageLimit = remainingSlots <= 0;
  const hasReachedDocumentLimit = remainingDocumentSlots <= 0;

  // Error handling
  const removeError = (errorMessage: string) => {
    setErrors(prev => prev.filter(e => e.message !== errorMessage));
  };

  const addError = (error: {
    message: string;
    severity: 'error' | 'warning' | 'info';
  }) => {
    setErrors(prev => [...prev, error]);
    setTimeout(() => removeError(error.message), 5000);
  };

  // Menu handling
  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handler for document files - now supports multiple documents
  const handleDocumentFiles = (
    files: { name: string; id: string; content: string; mimeType: string }[]
  ) => {
    if (files.length === 0) return;

    // Funzione helper per fare escape dell'HTML nei valori degli attributi
    const escapeAttributeValue = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };

    // Process each document file
    const processedDocuments = files.map(file => {
      const escapedFileName = escapeAttributeValue(file.name);
      const formattedContent = `<document_attachment filename="${escapedFileName}" type="${file.mimeType}">

${file.content}

</document_attachment>`;

      return {
        name: file.name,
        id: file.id,
        content: formattedContent,
        type: 'document',
        mimeType: file.mimeType,
      };
    });

    // Keep existing images and add new documents
    const imageFiles = documentPreviewFiles.filter(
      (file: any) => file.type === 'image'
    );

    setDocumentPreviewFiles([...processedDocuments, ...imageFiles]);

    setIsLoading(false);
  };

  // Document validation and error handling
  const validateDocumentFile = (file: File): boolean => {
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const ALLOWED_FILE_TYPES = [
      '.pdf',
      '.txt',
      '.json',
      '.xlsx',
      '.csv',
      '.md',
    ];
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    if (!ALLOWED_FILE_TYPES.includes(fileExt)) {
      addError({
        message: `File type "${fileExt}" is not supported. Please use: ${ALLOWED_FILE_TYPES.join(
          ', '
        )}`,
        severity: 'error',
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      addError({
        message: `File "${file.name}" exceeds ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB limit`,
        severity: 'error',
      });
      return false;
    }

    return true;
  };

  // Validate total payload size
  const validatePayloadSize = (
    newDocuments: {
      name: string;
      id: string;
      content: string;
      mimeType: string;
    }[]
  ): boolean => {
    const { MAX_TOTAL_MESSAGE_PAYLOAD } = require('../../helpers/constants');

    const existingDocuments = documentPreviewFiles.filter(
      (file: any) => file.type === 'document'
    );

    const allDocuments = [...existingDocuments, ...newDocuments];
    const totalPayloadSize = allDocuments.reduce(
      (total, doc) => total + doc.content.length,
      0
    );

    if (totalPayloadSize > MAX_TOTAL_MESSAGE_PAYLOAD) {
      addError({
        message: `Total document content exceeds ${MAX_TOTAL_MESSAGE_PAYLOAD} characters limit. Please remove some documents.`,
        severity: 'error',
      });
      return false;
    }

    return true;
  };

  // Handle document upload errors
  const handleDocumentError = (error: {
    message: string;
    severity: 'error' | 'warning' | 'info';
  }) => {
    addError(error);
  };

  // Image validation and error handling
  const validateImageFile = (file: File): boolean => {
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const ALLOWED_FILE_TYPES = ['.jpg', '.jpeg', '.png'];
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    if (
      !ALLOWED_FILE_TYPES.includes(fileExt) &&
      !file.type.startsWith('image/')
    ) {
      addError({
        message: `File type "${fileExt}" is not supported. Please use: ${ALLOWED_FILE_TYPES.join(
          ', '
        )}`,
        severity: 'error',
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      addError({
        message: `File "${file.name}" exceeds ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB limit`,
        severity: 'error',
      });
      return false;
    }

    return true;
  };

  // Handle image upload errors
  const handleImageError = (error: {
    message: string;
    severity: 'error' | 'warning' | 'info';
  }) => {
    addError(error);
  };

  // When document option is clicked
  const handleDocumentClick = () => {
    // Check if document limit has been reached
    if (hasReachedDocumentLimit) {
      addError({
        message: `Maximum ${MAX_DOCUMENTS} documents allowed.`,
        severity: 'error',
      });
      closeMenu();
      return;
    }

    // Find the actual button in the UploadDocuments component and click it
    const documentButtonElement = documentRef.current?.querySelector('button');
    if (documentButtonElement) {
      documentButtonElement.click();
    }
    closeMenu();
  };

  // When image option is clicked
  const handleImageClick = () => {
    if (!isMediaAccepted) {
      addError({
        message:
          t('upload.mediaNotAccepted') ?? 'Media uploads are not accepted',
        severity: 'info',
      });
      closeMenu();
      return;
    }

    if (hasReachedImageLimit) {
      addError({
        message:
          t('upload.maxImagesReached', { max: MAX_IMAGES }) ??
          `Maximum ${MAX_IMAGES} images already uploaded`,
        severity: 'warning',
      });
      closeMenu();
      return;
    }

    // If all checks pass, click the button in UploadImages component
    const imageButtonElement = imageRef.current?.querySelector('button');
    if (imageButtonElement) {
      imageButtonElement.click();
    }
    closeMenu();
  };

  // Set loading state for child components
  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="memori--unified-upload-wrapper">
      {/* Main upload button */}
      <button
        ref={buttonRef}
        className={cx(
          'memori-button',
          'memori-button--circle',
          'memori-button--icon-only',
          'memori-share-button--button',
          'memori--conversation-button',
          'memori--unified-upload-button',
          { 'memori--error': errors.length > 0 }
        )}
        onClick={toggleMenu}
        disabled={isLoading}
        title={t('upload.uploadFiles') ?? 'Upload files'}
      >
        {isLoading ? (
          <Spin spinning className="memori--upload-icon" />
        ) : (
          <UploadIcon className="memori--upload-icon" />
        )}
      </button>

      {/* Image count indicator - moved here from UploadImages */}
      {currentImageCount > 0 && (
        <div
          className={cx('memori--image-count', {
            'memori--image-count-full': hasReachedImageLimit,
          })}
        >
          {currentImageCount}/{MAX_IMAGES}
        </div>
      )}

      {/* Document count indicator */}
      {currentDocumentCount > 0 && (
        <div
          className={cx('memori--document-count', {
            'memori--document-count-full': hasReachedDocumentLimit,
          })}
        >
          {currentDocumentCount}/{MAX_DOCUMENTS}
        </div>
      )}

      {/* Floating menu */}
      {menuOpen && (
        <div className="memori--upload-menu" ref={menuRef}>
          <div
            className={cx('memori--upload-menu-item', {
              'memori--upload-menu-item--disabled': hasReachedDocumentLimit,
            })}
            onClick={handleDocumentClick}
        title={
          hasReachedDocumentLimit
            ? t('upload.maxDocumentsReached', { max: MAX_DOCUMENTS }) ??
              `Maximum ${MAX_DOCUMENTS} documents already uploaded`
            : remainingDocumentSlots === 1
            ? t('upload.lastDocumentSlot') ?? 'Upload last document'
            : t('upload.uploadDocuments', {
                remaining: remainingDocumentSlots,
              }) ?? `Upload documents (${remainingDocumentSlots} remaining)`
        }
          >
            <DocumentIcon className="memori--upload-menu-icon" />
            <span>
              {t('upload.uploadDocuments') ?? 'Upload documents'}
              {/* {currentDocumentCount > 0 && (
                <span className="memori--upload-slots-info">
                  {hasReachedDocumentLimit
                    ? ` (${t('upload.maxReached') ?? 'Max reached'})`
                    : ` (${remainingDocumentSlots} ${
                        t('upload.remaining') ?? 'remaining'
                      })`}
                </span>
              )} */}
            </span>
          </div>

          <div
            className={cx('memori--upload-menu-item', {
              'memori--upload-menu-item--disabled':
                !isMediaAccepted || hasReachedImageLimit,
            })}
            onClick={handleImageClick}
        title={
          !isMediaAccepted
            ? t('upload.mediaNotAccepted') ?? 'Media uploads not accepted'
            : hasReachedImageLimit
            ? t('upload.maxImagesReached', { max: MAX_IMAGES }) ??
              `Maximum ${MAX_IMAGES} images already uploaded`
            : remainingSlots === 1
            ? t('upload.lastImageSlot') ?? 'Upload last image'
            : t('upload.uploadImages', { remaining: remainingSlots }) ??
              `Upload images (${remainingSlots} remaining)`
        }
          >
            <ImageIcon className="memori--upload-menu-icon-image" />
            <span>
              {t('upload.uploadImages') ?? 'Upload images'}
              {/* {currentImageCount > 0 && (
                <span className="memori--upload-slots-info">
                  {hasReachedImageLimit
                    ? ` (${t('upload.maxReached') ?? 'Max reached'})`
                    : ` (${remainingSlots} ${
                        t('upload.remaining') ?? 'remaining'
                      })`}
                </span>
              )} */}
            </span>
          </div>
        </div>
      )}

      {/* Hidden components */}
      <div className="memori--hidden-uploader" ref={documentRef}>
        <UploadDocuments
          setDocumentPreviewFiles={handleDocumentFiles}
          maxDocuments={MAX_DOCUMENTS}
          documentPreviewFiles={documentPreviewFiles}
          onLoadingChange={handleLoadingChange}
          onDocumentError={handleDocumentError}
          onValidateFile={validateDocumentFile}
          onValidatePayloadSize={validatePayloadSize}
        />
      </div>

      <div className="memori--hidden-uploader" ref={imageRef}>
        <UploadImages
          authToken={authToken}
          client={client}
          setDocumentPreviewFiles={setDocumentPreviewFiles}
          sessionID={sessionID}
          documentPreviewFiles={documentPreviewFiles}
          isMediaAccepted={isMediaAccepted}
          onLoadingChange={handleLoadingChange}
          maxImages={MAX_IMAGES}
          memoriID={memoriID}
          onImageError={handleImageError}
          onValidateImageFile={validateImageFile}
        />
      </div>

      {/* Error messages container */}
      <div className="memori--error-message-container">
        {errors.map((error, index) => (
          <Alert
            className="memori--error-message-alert"
            key={`${error.message}-${index}`}
            open={true}
            type={error.severity}
            title={'Upload notification'}
            description={error.message}
            onClose={() => removeError(error.message)}
            width="350px"
          />
        ))}
      </div>
    </div>
  );
};

export default UploadButton;
