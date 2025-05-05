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
  onLoadingChange?: (loading: boolean) => void;
}

const UploadImages: React.FC<UploadImagesProps> = ({
  authToken = '',
  apiUrl = '',
  sessionID = '',
  isMediaAccepted = false,
  setDocumentPreviewFiles,
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

  // File handling
  const removeFile = async (fileId: string) => {
    // Remove from preview files
    setPreviewFiles(prev => prev.filter(file => file.id !== fileId));
    
    // Remove from image files state
    setImageFiles(prev => prev.filter(file => file.id !== fileId));
    
    // Update parent component state
    setDocumentPreviewFiles((prevFiles: { name: string; id: string; content: string; type: string }[]) => prevFiles.filter(file => file.id !== fileId));

    // Call the MediumDeselected event if dialog API is available
    if (dialog.postMediumDeselectedEvent && sessionID) {
      await dialog.postMediumDeselectedEvent(sessionID, fileId);
    }
  };

  // Image upload
  const validateImageFile = (file: File): boolean => {
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const ALLOWED_FILE_TYPES = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.svg',
    ];

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
              if (dialog?.postMediumSelectedEvent && sessionID) {
                await dialog.postMediumSelectedEvent(sessionID, {
                  url: asset.assetURL,
                  mimeType: asset.mimeType,
                } as Medium);
              }
              // Update parent component with the new file
              setDocumentPreviewFiles((prevFiles: { name: string; id: string; content: string; type: string }[]) => [...prevFiles, newImageFile]);
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
      case 'gif':
        return 'GIF';
      case 'webp':
        return 'WebP';
      case 'svg':
        return 'SVG';
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
        accept="image/*"
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

      {/* File previews */}
      {previewFiles.length > 0 && (
        <div className="memori--preview-container memori--absolute-preview">
          <div className="memori--preview-list">
            {previewFiles.map(file => (
              <div
                key={file.id}
                className={cx('memori--preview-item', {
                  'memori--preview-item--image': true,
                  'memori--preview-item--uploaded': file.uploaded,
                  'memori--preview-item--error': file.error,
                })}
                onMouseEnter={() => setHoveredId(file.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedFile(file)}
              >
                {file.previewUrl ? (
                  <div className="memori--preview-thumbnail">
                    <img src={file.previewUrl} alt={file.name} />
                  </div>
                ) : null}

                <div className="memori--preview-file-info">
                  <span className="memori--preview-filename">{file.name}</span>
                  <span className="memori--preview-filetype">
                    {getFileType(file.name)}
                    {file.uploaded && (
                      <span className="memori--upload-status">• Uploaded</span>
                    )}
                    {file.error && (
                      <span className="memori--upload-status memori--upload-status-error">
                        • Failed
                      </span>
                    )}
                  </span>
                </div>

                <Button
                  shape="rounded"
                  icon={<CloseIcon />}
                  danger
                  className={`memori--remove-button ${
                    hoveredId === file.id ? 'visible' : ''
                  }`}
                  onClick={e => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

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