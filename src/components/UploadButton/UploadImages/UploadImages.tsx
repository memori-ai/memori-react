import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import Spin from '../../ui/Spin';
import Alert from '../../ui/Alert';
import { ImageIcon } from '../../icons/Image';
import Modal from '../../ui/Modal';
import memoriApiClient from '@memori.ai/memori-api-client';
import { Asset, Medium } from '@memori.ai/memori-api-client/dist/types';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';

// Types
type UploadError = {
  message: string;
  severity: 'error' | 'warning' | 'info';
  fileId?: string;
};

type PreviewFile = {
  name: string;
  id: string;
  content: string;
  type: 'image';
  previewUrl?: string;
  uploaded?: boolean;
  file?: File;
  error?: boolean;
  title?: string;
};

// Constants
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Props interface
interface UploadImagesProps {
  authToken?: string;
  apiUrl?: string;
  sessionID?: string;
  isMediaAccepted?: boolean;
  setDocumentPreviewFiles: any;
  documentPreviewFiles: any;
  onLoadingChange?: (loading: boolean) => void;
  maxImages?: number;
  memoriID?: string;
}

const ALLOWED_FILE_TYPES = ['.jpg', '.jpeg', '.png'];

const UploadImages: React.FC<UploadImagesProps> = ({
  authToken = '',
  apiUrl = '',
  sessionID = '',
  isMediaAccepted = false,
  setDocumentPreviewFiles,
  documentPreviewFiles,
  onLoadingChange,
  maxImages = 5,
  memoriID = '',
}) => {
  const { t, i18n } = useTranslation();
  // Client
  const client = apiUrl ? memoriApiClient(apiUrl) : null;
  const { backend, dialog } = client || {
    backend: { uploadAsset: null, uploadAssetUnlogged: null },
    dialog: { postMediumSelectedEvent: null, postMediumDeselectedEvent: null },
  };

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<UploadError[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [imageTitle, setImageTitle] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Refs
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Update loading state in parent component
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  // Error handling
  const clearErrors = () => setErrors([]);

  const removeError = (errorMessage: string) => {
    setErrors(prev => prev.filter(e => e.message !== errorMessage));
  };

  const addError = (error: UploadError) => {
    setErrors(prev => [...prev, error]);
    setTimeout(() => removeError(error.message), 5000);
  };

  // Check current image count
  const currentImageCount = documentPreviewFiles.filter(
    (file: any) => file.type === 'image'
  ).length;

  // Image upload
  const validateImageFile = (file: File): boolean => {
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;

    if (
      !ALLOWED_FILE_TYPES.includes(fileExt) &&
      !file.type.startsWith('image/')
    ) {
      addError({
        message: `File type "${fileExt}" is not supported. Please use: ${ALLOWED_FILE_TYPES.join(
          ', '
        )}`,
        severity: 'error',
        fileId: file.name,
      });
      return false;
    }

    if (file.size > DEFAULT_MAX_FILE_SIZE) {
      addError({
        message: `File "${file.name}" exceeds ${
          DEFAULT_MAX_FILE_SIZE / 1024 / 1024
        }MB limit`,
        severity: 'error',
        fileId: file.name,
      });
      return false;
    }

    return true;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding this file would exceed the limit
    if (currentImageCount >= maxImages) {
      addError({
        message:
          t('upload.maxImagesReached') ??
          `Maximum ${maxImages} images allowed.`,
        severity: 'error',
      });
      return;
    }

    clearErrors();

    const file = files[0]; // Only handle the first file

    if (!validateImageFile(file)) {
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      return;
    }

    // Set file and create preview
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));

    // Set initial title as filename without extension
    const fileName = file.name.split('.').slice(0, -1).join('.');
    setImageTitle(fileName);

    // Show upload modal with preview
    setShowUploadModal(true);

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleTitleSubmit = async () => {
    if (!selectedFile || !imageTitle.trim()) return;

    setIsLoading(true);
    setShowUploadModal(false);

    try {
      const reader = new FileReader();

      reader.onload = async e => {
        const fileDataUrl = e.target?.result as string;
        const fileId = Math.random().toString(36).substr(2, 9);

        if (apiUrl) {
          try {
            let asset: Asset;
            let response;

            if (authToken && backend?.uploadAsset) {
              response = await backend.uploadAsset(
                selectedFile.name,
                fileDataUrl,
                authToken
              );
            } else if (memoriID && sessionID && backend?.uploadAssetUnlogged) {
              response = await backend.uploadAssetUnlogged(
                selectedFile.name,
                fileDataUrl,
                memoriID,
                sessionID
              );

              if (!response) {
                throw new Error('Upload failed');
              }
            } else {
              throw new Error('Missing required parameters for upload');
            }

            asset = response.asset;
            if (response.resultCode !== 0) {
              throw new Error(response.resultMessage || 'Upload failed');
            }

            let medium: any = null;
            if (dialog?.postMediumSelectedEvent && sessionID) {
              medium = await dialog.postMediumSelectedEvent(sessionID, {
                url: asset.assetURL,
                mimeType: asset.mimeType,
              } as Medium);
            }

            let finalMediumID: string | undefined = undefined;
            if (medium?.currentState?.currentMedia) {
              const existingMediumIDs = new Set(
                documentPreviewFiles.map((file: any) => file.mediumID)
              );

              finalMediumID = medium.currentState.currentMedia.find(
                (media: any) => !existingMediumIDs.has(media.mediumID)
              )?.mediumID;
            }

            setDocumentPreviewFiles(
              (
                prevFiles: {
                  name: string;
                  id: string;
                  content: string;
                  type: string;
                  mediumID: string | undefined;
                  url: string;
                  mimeType: string;
                }[]
              ) => [
                ...prevFiles,
                {
                  name: imageTitle,
                  id: fileId,
                  url: asset.assetURL,
                  content: asset.assetURL,
                  type: 'image',
                  mediumID: finalMediumID,
                  mimeType: asset.mimeType,
                },
              ]
            );
          } catch (error) {
            addError({
              message: t('upload.uploadFailed') ?? 'Upload failed',
              severity: 'error',
              fileId: selectedFile.name,
            });
          }
        } else {
          addError({
            message:
              t('upload.apiClientNotConfigured') ??
              'API client not configured properly for media upload',
            severity: 'warning',
          });
        }

        setIsLoading(false);
      };

      reader.onerror = () => {
        addError({
          message: t('upload.fileReadingFailed') ?? 'File reading failed',
          severity: 'error',
          fileId: selectedFile.name,
        });
        setIsLoading(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      addError({
        message: t('upload.uploadFailed') ?? 'Upload failed',
        severity: 'error',
        fileId: selectedFile.name,
      });
      setIsLoading(false);
    }
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setFilePreview(null);
    setImageTitle('');
  };

  return (
    <div className="memori--image-upload-wrapper">
      {/* Hidden file input */}
      <input
        ref={imageInputRef}
        type="file"
        accept={ALLOWED_FILE_TYPES.join(',')}
        className="memori--upload-file-input"
        onChange={handleImageUpload}
        disabled={
          isLoading || !isMediaAccepted || currentImageCount >= maxImages
        }
      />

      {/* Upload image button */}
      <button
        className={cx(
          'memori-button',
          'memori-button--circle',
          'memori-button--icon-only',
          'memori-share-button--button',
          'memori--conversation-button',
          'memori--image-upload-button'
        )}
        onClick={() => imageInputRef.current?.click()}
        disabled={
          isLoading || !isMediaAccepted || currentImageCount >= maxImages
        }
      >
        {isLoading ? (
          <Spin spinning className="memori--upload-icon" />
        ) : (
          <ImageIcon className="memori--upload-icon" />
        )}
      </button>

      {/* Upload Modal with Title Input */}
      <Modal
        width="80%"
        widthMd="80%"
        open={showUploadModal && !!selectedFile}
        className="memori--modal-preview-file"
        onClose={handleCancelUpload}
        closable
        title={t('upload.titleImage', { title: imageTitle })}
        // description={t('upload.imageTitleDescription')}
      >
        <div
          className="memori--preview-content"
          style={{
            maxHeight: '70vh',
            overflowY: 'auto',
            textAlign: 'center',
          }}
        >
          {filePreview && (
            <img
              src={filePreview}
              alt={selectedFile?.name || 'Preview'}
              style={{
                maxWidth: '100%',
                maxHeight: '40vh',
                marginBottom: '20px',
              }}
            />
          )}

          <div
            style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}
          >
            <p style={{ marginBottom: '10px', color: '#666' }}>
              {t('upload.titleHelp')}
            </p>
            <input
              value={imageTitle}
              onChange={e => setImageTitle(e.target.value)}
              placeholder={t('upload.titlePlaceholder') ?? 'Enter image title'}
              style={{ width: '90%', marginBottom: '20px' }}
              className="memori--upload-title-input"
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                onClick={handleTitleSubmit}
                disabled={!selectedFile || !imageTitle.trim()}
                className="memori-button memori-button--primary"
              >
                {t('confirm') ?? 'Confirm'}
              </Button>
              <Button
                onClick={handleCancelUpload}
                className="memori-button memori-button--primary"
              >
                {t('cancel') ?? 'Cancel'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Error messages container */}
      <div className="memori--error-message-container">
        {errors.map((error, index) => (
          <Alert
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

export default UploadImages;
