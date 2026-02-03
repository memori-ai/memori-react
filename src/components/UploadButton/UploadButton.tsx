import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DocumentIcon } from '../icons/Document';
import { ImageIcon } from '../icons/Image';
import { UploadIcon } from '../icons/Upload';
import { Spin, useAlertManager } from '@memori.ai/ui';
import cx from 'classnames';
import UploadDocuments from './UploadDocuments/UploadDocuments';
import UploadImages from './UploadImages/UploadImages';
import { useTranslation } from 'react-i18next';
import memoriApiClient from '@memori.ai/memori-api-client';
import { Tooltip } from '@memori.ai/ui';

// Constants
const MAX_MEDIA = 10;

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
  const [isDragging, setIsDragging] = useState(false);
  const { t, i18n } = useTranslation();
  const alertManager = useAlertManager();

  // Refs
  const buttonRef = useRef<HTMLButtonElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const unifiedInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Calculate total media count
  const currentMediaCount = documentPreviewFiles.length;
  const remainingSlots = MAX_MEDIA - currentMediaCount;
  const hasReachedMediaLimit = remainingSlots <= 0;

  // Error handling - show alerts via toast manager
  const addError = useCallback(
    (error: { message: string; severity: 'error' | 'warning' | 'info' }) => {
      alertManager.add({
        title: 'Upload notification',
        description: error.message,
        data: { severity: error.severity, closable: true },
      });
    },
    [alertManager]
  );

  // Check if file is an image
  const isImageFile = (file: File): boolean => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const imageExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    return imageTypes.includes(file.type) || imageExtensions.includes(fileExt);
  };

  // Check if file is a document
  const isDocumentFile = (file: File): boolean => {
    const documentExtensions = ['.pdf', '.txt', '.json', '.xlsx', '.csv', '.md', '.html'];
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    return documentExtensions.includes(fileExt);
  };

  // Use refs to access latest values in event handlers
  const isMediaAcceptedRef = useRef(isMediaAccepted);
  const currentMediaCountRef = useRef(currentMediaCount);
  const addErrorRef = useRef(addError);

  useEffect(() => {
    isMediaAcceptedRef.current = isMediaAccepted;
    currentMediaCountRef.current = currentMediaCount;
    addErrorRef.current = addError;
  }, [isMediaAccepted, currentMediaCount, addError]);

  // Handle unified file selection
  const handleUnifiedFileSelection = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const imageFiles: File[] = [];
    const documentFiles: File[] = [];

    // Separate files by type
    fileArray.forEach(file => {
      if (isImageFile(file)) {
        imageFiles.push(file);
      } else if (isDocumentFile(file)) {
        documentFiles.push(file);
      } else {
        addErrorRef.current({
          message: `File "${file.name}" is not a supported image or document type`,
          severity: 'error',
        });
      }
    });

    // Calculate total files to be added
    const totalFilesToAdd = imageFiles.length + documentFiles.length;
    const newTotalCount = currentMediaCountRef.current + totalFilesToAdd;

    // Check if adding these files would exceed the limit
    if (newTotalCount > MAX_MEDIA) {
      addErrorRef.current({
        message: `Maximum ${MAX_MEDIA} media files allowed.`,
        severity: 'error',
      });
      return;
    }

    // Process images
    if (imageFiles.length > 0) {
      if (!isMediaAcceptedRef.current) {
        addErrorRef.current({
          message:
            t('upload.mediaNotAccepted') ?? 'Media uploads are not accepted',
          severity: 'info',
        });
      } else {
        // Trigger image upload by creating a synthetic event
        const imageInput = imageRef.current?.querySelector('input[type="file"]') as HTMLInputElement;
        if (imageInput) {
          const dataTransfer = new DataTransfer();
          imageFiles.forEach(file => {
            try {
              dataTransfer.items.add(file);
            } catch (err) {
              console.warn('Failed to add image file to DataTransfer:', err);
            }
          });
          
          // Only proceed if we successfully added files
          if (dataTransfer.files.length > 0) {
            imageInput.files = dataTransfer.files;
            const changeEvent = new Event('change', { bubbles: true });
            imageInput.dispatchEvent(changeEvent);
          }
        }
      }
    }

    // Process documents
    if (documentFiles.length > 0) {
      // Trigger document upload by creating a synthetic event
      const documentInput = documentRef.current?.querySelector('input[type="file"]') as HTMLInputElement;
      if (documentInput) {
        const dataTransfer = new DataTransfer();
        documentFiles.forEach(file => {
          try {
            dataTransfer.items.add(file);
          } catch (err) {
            console.warn('Failed to add document file to DataTransfer:', err);
          }
        });
        
        // Only proceed if we successfully added files
        if (dataTransfer.files.length > 0) {
          documentInput.files = dataTransfer.files;
          const changeEvent = new Event('change', { bubbles: true });
          documentInput.dispatchEvent(changeEvent);
        }
      }
    }
  }, [t]);

  // Handle button click - open file chooser directly
  const handleButtonClick = () => {
    if (unifiedInputRef.current) {
      unifiedInputRef.current.click();
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUnifiedFileSelection(files);
    }
    // Reset input value to allow selecting the same file again
    if (unifiedInputRef.current) {
      unifiedInputRef.current.value = '';
    }
  };

  // Paste handler for files
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData;
      if (!clipboardData) {
        console.log('[UploadButton] handlePaste: No clipboardData available.');
        return;
      }

      const files: File[] = [];
      
      // Helper to check if a file is already in the array
      const isDuplicate = (file: File) => {
        return files.some(f => 
          f.name === file.name && 
          f.size === file.size && 
          f.lastModified === file.lastModified
        );
      };
      
      // Prefer clipboardData.files if available (most reliable and prevents duplicates)
      // Only fall back to items if files is empty (some browsers only populate items)
      if (clipboardData.files && clipboardData.files.length > 0) {
        const clipboardFiles = Array.from(clipboardData.files);
        console.log(`[UploadButton] handlePaste: clipboardData.files found`, clipboardFiles);
        clipboardFiles.forEach(file => {
          if (!isDuplicate(file)) {
            files.push(file);
          } else {
            console.log(`[UploadButton] handlePaste: Duplicate file skipped from clipboardData.files:`, file);
          }
        });
      } else {
        // Fall back to items array only if files is empty
        // This prevents processing the same file twice when both are populated
        const items = clipboardData.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
              const file = item.getAsFile();
              if (file && !isDuplicate(file)) {
                console.log(`[UploadButton] handlePaste: Adding file from items array:`, file);
                files.push(file);
              } else if (file) {
                console.log(`[UploadButton] handlePaste: Duplicate file skipped from items array:`, file);
              }
            }
          }
        }
      }

      if (files.length > 0) {
        console.log(`[UploadButton] handlePaste: ${files.length} file(s) to process from paste`, files);
        e.preventDefault();
        handleUnifiedFileSelection(files);
      } else {
        console.log('[UploadButton] handlePaste: No files found in paste event.');
      }
    };

    // Add paste listener to document
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handleUnifiedFileSelection]);

  // Drag and drop handlers
  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter++;
      if (dragCounter === 1) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter--;
      if (dragCounter === 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter = 0;
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        handleUnifiedFileSelection(files);
      }
    };

    // Add drag and drop listeners to document
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [handleUnifiedFileSelection]);

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
      '.html',
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


  // Set loading state for child components
  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div 
      className={cx('memori--unified-upload-wrapper', {
        'memori--dragging': isDragging,
      })}
      ref={wrapperRef}
    >
      {/* Unified file input - accepts both images and documents */}
      <input
        ref={unifiedInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,.txt,.json,.xlsx,.csv,.md,.html"
        multiple
        className="memori--upload-file-input"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {/* Main upload button */}
      <button
        ref={buttonRef}
        className={cx(
          'memori-button',
          'memori-button--circle',
          'memori-button--icon-only',
          'memori-share-button--button',
          'memori--conversation-button',
          'memori--unified-upload-button'
        )}
        onClick={handleButtonClick}
        disabled={isLoading || hasReachedMediaLimit}
        title={t('upload.uploadFiles', { shortcut: /Mac|iPhone|iPod|iPad/i.test(navigator.platform) || navigator.userAgent.includes('Mac') ? 'Cmd' : 'Ctrl' }) ?? 'Upload files (drag & drop)'}
      >
        {isLoading ? (
          <Spin spinning className="memori--upload-icon" />
        ) : (
          <UploadIcon className="memori--upload-icon" />
        )}
      </button>

      {/* Media count indicator */}
      {currentMediaCount > 0 && (
        <div
          className={cx('memori--document-count', {
            'memori--document-count-full': hasReachedMediaLimit,
          })}
        >
          {currentMediaCount}/{MAX_MEDIA}
        </div>
      )}

      {/* Hidden components */}
      <div className="memori--hidden-uploader" ref={documentRef}>
        <UploadDocuments
          setDocumentPreviewFiles={handleDocumentFiles}
          maxDocuments={MAX_MEDIA}
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
          maxImages={MAX_MEDIA}
          memoriID={memoriID}
          onImageError={handleImageError}
          onValidateImageFile={validateImageFile}
        />
      </div>

    </div>
  );
};

export default UploadButton;
