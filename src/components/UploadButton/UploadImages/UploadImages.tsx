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

// Props interface
interface UploadImagesProps {
  authToken?: string;
  client?: ReturnType<typeof memoriApiClient>;
  sessionID?: string;
  isMediaAccepted?: boolean;
  setDocumentPreviewFiles: any;
  documentPreviewFiles: any;
  onLoadingChange?: (loading: boolean) => void;
  maxImages?: number;
  memoriID?: string;
  onImageError?: (error: { message: string; severity: 'error' | 'warning' | 'info' }) => void;
  onValidateImageFile?: (file: File) => boolean;
}

const UploadImages: React.FC<UploadImagesProps> = ({
  authToken = '',
  sessionID = '',
  client,
  isMediaAccepted = false,
  setDocumentPreviewFiles,
  documentPreviewFiles,
  onLoadingChange,
  maxImages = 5,
  memoriID = '',
  onImageError,
  onValidateImageFile,
}) => {
  const { t, i18n } = useTranslation();
  // Client
  const { backend, dialog } = client || {
    backend: { uploadAsset: null, uploadAssetUnlogged: null },
    dialog: { postMediumSelectedEvent: null, postMediumDeselectedEvent: null },
  };

  // State
  const [isLoading, setIsLoading] = useState(false);
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

  // Check current total media count (images + documents)
  const currentMediaCount = documentPreviewFiles.length;

  // Image upload
  const validateImageFile = (file: File): boolean => {
    if (onValidateImageFile) {
      return onValidateImageFile(file);
    }
    return true;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the total media limit
    if (currentMediaCount + files.length > maxImages) {
      onImageError?.({
        message:
          `Maximum ${maxImages} media files allowed. You can upload ${Math.max(0, maxImages - currentMediaCount)} more file${maxImages - currentMediaCount !== 1 ? 's' : ''}.`,
        severity: 'error',
      });
      return;
    }

    // Validate all files first
    const validFiles = files.filter(file => {
      if (!validateImageFile(file)) {
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      return;
    }

    // If only one file, show modal for title input
    if (validFiles.length === 1) {
      const file = validFiles[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      
      // Set initial title as filename without extension
      const fileName = file.name.split('.').slice(0, -1).join('.');
      setImageTitle(fileName);
      
      // Show upload modal with preview
      setShowUploadModal(true);
    } else {
      // For multiple files, upload them directly with default titles
      await uploadMultipleImages(validFiles);
    }

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const uploadMultipleImages = async (files: File[]) => {
    setIsLoading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        return new Promise<{
          name: string;
          id: string;
          content: string;
          type: string;
          mediumID: string | undefined;
          url: string;
          mimeType: string;
        } | null>((resolve) => {
          const reader = new FileReader();
          
          reader.onload = async (e) => {
            const fileDataUrl = e.target?.result as string;
            const fileId = Math.random().toString(36).substr(2, 9);
            const fileName = file.name.split('.').slice(0, -1).join('.');

            if (client) {
              try {
                let asset: Asset;
                let response;

                if (authToken && backend?.uploadAsset) {
                  response = await backend.uploadAsset(
                    file.name,
                    fileDataUrl,
                    authToken
                  );
                } else if (memoriID && sessionID && backend?.uploadAssetUnlogged) {
                  response = await backend.uploadAssetUnlogged(
                    file.name,
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

                resolve({
                  name: fileName,
                  id: fileId,
                  url: asset.assetURL,
                  content: asset.assetURL,
                  type: 'image',
                  mediumID: finalMediumID,
                  mimeType: asset.mimeType,
                });
              } catch (error) {
                onImageError?.({
                  message: t('upload.uploadFailed') ?? 'Upload failed',
                  severity: 'error',
                });
                resolve(null);
              }
            } else {
              onImageError?.({
                message:
                  t('upload.apiClientNotConfigured') ??
                  'API client not configured properly for media upload',
                severity: 'warning',
              });
              resolve(null);
            }
          };

          reader.onerror = () => {
            onImageError?.({
              message: t('upload.fileReadingFailed') ?? 'File reading failed',
              severity: 'error',
            });
            resolve(null);
          };

          reader.readAsDataURL(file);
        });
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result !== null);

      if (successfulUploads.length > 0) {
        setDocumentPreviewFiles((prevFiles: any[]) => [
          ...prevFiles,
          ...successfulUploads,
        ]);
      }
    } catch (error) {
      onImageError?.({
        message: t('upload.uploadFailed') ?? 'Upload failed',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
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

        if (client) {
          try {
            let asset: Asset;
            let response;

            if (authToken && backend?.uploadAsset) {
              response = await backend.uploadAsset(
                selectedFile.name,
                fileDataUrl,
                authToken,
                // memoriID
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
            onImageError?.({
              message: t('upload.uploadFailed') ?? 'Upload failed',
              severity: 'error',
            });
          }
        } else {
          onImageError?.({
            message:
              t('upload.apiClientNotConfigured') ??
              'API client not configured properly for media upload',
            severity: 'warning',
          });
        }

        setIsLoading(false);
      };

      reader.onerror = () => {
        onImageError?.({
          message: t('upload.fileReadingFailed') ?? 'File reading failed',
          severity: 'error',
        });
        setIsLoading(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      onImageError?.({
        message: t('upload.uploadFailed') ?? 'Upload failed',
        severity: 'error',
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
        accept=".jpg,.jpeg,.png"
        multiple
        className="memori--upload-file-input"
        onChange={handleImageUpload}
        disabled={
          isLoading || !isMediaAccepted || currentMediaCount >= maxImages
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
          isLoading || !isMediaAccepted || currentMediaCount >= maxImages
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
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
            <Button
                onClick={handleCancelUpload}
                className="memori-button memori-button--outline"
              >
                {t('cancel') ?? 'Cancel'}
              </Button>
              <Button
                onClick={handleTitleSubmit}
                disabled={!selectedFile || !imageTitle.trim()}
                className="memori-button memori-button--primary memori-button--image-confirm"
              >
                {t('confirm') ?? 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UploadImages;
