import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import { UploadIcon } from '../../icons/Upload';
import Spin from '../../ui/Spin';
import Alert from '../../ui/Alert';
import { ImageIcon } from '../../icons/Image';
import CloseIcon from '../../icons/Close';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import memoriApiClient from '@memori.ai/memori-api-client';
import { Medium } from '@memori.ai/memori-api-client/dist/types';

// Define Asset type
type Asset = {
  id: string;
  url: string;
  name: string;
  assetID?: string;
  assetURL?: string;
  mimeType?: string;
  [key: string]: any;
};

// Define Response type
type ResponseSpec = {
  success: boolean;
  resultCode?: number;
  resultMessage?: string;
  msg?: string;
  [key: string]: any;
};

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
  error?: boolean;
};

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Props interface
interface UploadImagesProps {
  authToken?: string;
  apiUrl?: string;
  sessionID?: string;
  isMediaAccepted?: boolean;
  setDocumentPreviewFiles: any;
  documentPreviewFiles: any;
  onLoadingChange?: (loading: boolean) => void;
}

const ALLOWED_FILE_TYPES = [
  '.jpg',
  '.jpeg',
  '.png',
];

const UploadImages: React.FC<UploadImagesProps> = ({
  authToken = '',
  apiUrl = '',
  sessionID = '',
  isMediaAccepted = false,
  setDocumentPreviewFiles,
  documentPreviewFiles,
  onLoadingChange,
}) => {
  // Client
  const client = apiUrl ? memoriApiClient(apiUrl) : null;
  const { backend, dialog } = client || {
    backend: { uploadAsset: null },
    dialog: { postMediumSelectedEvent: null, postMediumDeselectedEvent: null },
  };

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<UploadError[]>([]);
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<PreviewFile | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<{ name: string; id: string; content: string; type: string }[]>([]);

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

    if (file.size > MAX_FILE_SIZE) {
      addError({
        message: `File "${file.name}" exceeds ${
          MAX_FILE_SIZE / 1024 / 1024
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

    setIsLoading(true);
    clearErrors();

    for (const file of files) {
      if (!validateImageFile(file)) {
        continue;
      }

      const fileId = Math.random().toString(36).substr(2, 9);
      const previewUrl = URL.createObjectURL(file);

      // Add file to preview list
      setPreviewFiles(prev => [
        ...prev,
        {
          name: file.name,
          id: fileId,
          content: '',
          type: 'image',
          previewUrl,
          uploaded: false,
        },
      ]);

      try {
        // Read the file as a data URL
        const reader = new FileReader();

        reader.onload = async e => {
          const fileDataUrl = e.target?.result as string;

          if (backend?.uploadAsset && authToken) {
            try {
              // Upload the asset
              const { asset, ...resp } = await backend.uploadAsset(
                file.name,
                fileDataUrl,
                authToken
              );

              if (resp.resultCode !== 0) {
                throw new Error(resp.resultMessage || 'Upload failed');
              }

              // Create the new image file object
              const newImageFile = {
                name: file.name || '',
                id: fileId,
                content: asset.assetURL || '',
                type: 'image',
              };

              // Update the preview item with asset information
              setPreviewFiles(prev =>
                prev.map(item =>
                  item.id === fileId
                    ? {
                        ...item,
                        content: asset.assetURL,
                        uploaded: true,
                      }
                    : item
                )
              );

              // Update image files state
              setImageFiles(prev => [...prev, newImageFile]);

              // Call the MediumSelected event if dialog API is available
              let medium: any = null;
              if (dialog?.postMediumSelectedEvent && sessionID) {
                medium = await dialog.postMediumSelectedEvent(sessionID, {
                  url: asset.assetURL,
                  mimeType: asset.mimeType,
                } as Medium);
                console.log('medium', medium);
              }

              // Find mediumID that isn't already in documentPreviewFiles
              let finalMediumID: string | undefined = undefined;
              if (medium?.currentState?.currentMedia) {

                // create a set of existing mediumIDs
                const existingMediumIDs = new Set(
                  documentPreviewFiles.map((file: any) => file.mediumID)
                );

                // find the first mediumID that isn't already in the set
                finalMediumID = medium.currentState.currentMedia.find(
                  (media: any) => !existingMediumIDs.has(media.mediumID)
                )?.mediumID;
                console.log('finalMediumID', finalMediumID);
              }

              // Update parent component with the new file, including all properties and mediumID
              setDocumentPreviewFiles((prevFiles: { name: string; id: string; content: string; type: string; mediumID: string | undefined }[]) => [
                ...prevFiles,
                {
                  name: file.name,
                  id: fileId,
                  content: asset.assetURL,
                  type: 'image',
                  mediumID: finalMediumID
                }
              ]);
            } catch (error) {
              setPreviewFiles(prev =>
                prev.map(item =>
                  item.id === fileId
                    ? {
                        ...item,
                        error: true,
                      }
                    : item
                )
              );

              addError({
                message: `Upload failed: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`,
                severity: 'error',
                fileId: file.name,
              });
            }
          } else {
            addError({
              message: 'API client not configured properly for media upload',
              severity: 'warning',
            });
          }
        };

        reader.onerror = () => {
          addError({
            message: `File reading failed`,
            severity: 'error',
            fileId: file.name,
          });
        };

        reader.readAsDataURL(file);
      } catch (error) {
        addError({
          message: `Upload failed: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
          severity: 'error',
          fileId: file.name,
        });
      }
    }

    setIsLoading(false);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const getFileType = (filename: string) => {
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
        disabled={!isMediaAccepted || !authToken}
        multiple
      />

      {/* Upload image button */}
      <button
        className={cx(
          'memori-button',
          'memori-button--circle',
          'memori-button--icon-only',
          'memori-share-button--button',
          'memori--conversation-button',
          'memori--image-upload-button',
          { 'memori--error': errors.length > 0 }
        )}
        onClick={() =>
          isMediaAccepted && authToken && imageInputRef.current?.click()
        }
        disabled={isLoading || !isMediaAccepted || !authToken}
        title={!authToken ? 'Please login to upload images' : 'Upload image'}
      >
        {isLoading ? (
          <Spin spinning className="memori--upload-icon" />
        ) : (
          <ImageIcon className="memori--upload-icon" />
        )}
      </button>

      {/* Modal */}
      <Modal
        width="80%"
        widthMd="80%"
        open={!!selectedFile}
        className="memori--modal-preview-file"
        onClose={() => setSelectedFile(null)}
        closable
        title={selectedFile?.name}
      >
        <div
          className="memori--preview-content"
          style={{
            maxHeight: '70vh',
            overflowY: 'auto',
            textAlign: 'center',
          }}
        >
          {selectedFile?.previewUrl ? (
            <img
              src={selectedFile.previewUrl}
              alt={selectedFile.name}
              style={{ maxWidth: '100%', maxHeight: '60vh' }}
            />
          ) : null}

          {selectedFile?.uploaded && (
            <div className="memori--asset-info">
              <p>Uploaded successfully</p>
              {selectedFile.content && (
                <p className="memori--asset-url">
                  Asset URL: {selectedFile.content}
                </p>
              )}
            </div>
          )}
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

      {/* Login tip */}
      {!authToken && (
        <div className="memori--login-tip">
          <Alert
            type="info"
            title="Login Required"
            description="Please login to upload images"
            width="350px"
            onClose={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default UploadImages;