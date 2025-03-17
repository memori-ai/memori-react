import React, { useState, useRef } from 'react';
import cx from 'classnames';
import UploadIcon from '../icons/Upload';
import Spin from '../ui/Spin';
import Alert from '../ui/Alert';

// Define error types for better type safety
type UploadError = {
  message: string;
  severity: 'error' | 'warning';
  fileId?: string;
};

/**
 * FileUploadButton component allows users to upload and convert files to text
 * Supports PDF and TXT files up to 10MB
 * Extracts text from PDFs using PDF.js
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TEXT_LENGTH = 100000; // 100,000 characters
const PDF_JS_VERSION = '3.11.174'; // Last stable version with .min.js files
const WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}/pdf.worker.min.js`;
const PDF_JS_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}/pdf.min.js`;

// Add type definition for pdfjsLib
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const FileUploadButton = ({
  setPreviewFiles,
}: {
  setPreviewFiles: (
    previewFiles: { name: string; id: string; content: string }[]
  ) => void;
}) => {
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);
  // State for tracking upload errors
  const [errors, setErrors] = useState<UploadError[]>([]);
  // Reference to hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear all errors
  const clearErrors = () => setErrors([]);

  // Remove a specific error by message
  const removeError = (errorMessage: string) => {
    setErrors(prev => prev.filter(e => e.message !== errorMessage));
  };

  // Add a new error and auto-remove after 5 seconds
  const addError = (error: UploadError) => {
    setErrors(prev => [...prev, error]);
    // Auto-clear errors after 5 seconds
    setTimeout(() => {
      removeError(error.message);
    }, 5000);
  };

  /**
   * Extracts text from PDF using PDF.js
   * @param file PDF file to process
   * @returns Promise resolving to extracted text
   */
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      // Load PDF.js if not already loaded
      if (!window.pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = PDF_JS_URL;
          script.onload = () => {
            // Set up worker
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
            resolve(true);
          };
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Extract text from PDF
      const arrayBuffer = await file.arrayBuffer();
      // Get PDF document
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer })
        .promise;
      let text = '';

      // Iterate through each page and extract text
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        // Filter out non-string items and join text
        const pageText = content.items
          .filter((item: any) => item.str && typeof item.str === 'string')
          .map((item: any) => item.str)
          .join(' ');
        text += pageText + '\n';
      }

      // Return extracted text
      return text;
    } catch (error) {
      throw new Error(
        `PDF extraction failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  /**
   * Validates uploaded file
   * Checks file type and size restrictions
   * @param file File to validate
   * @returns boolean indicating if file is valid
   */
  const validateFile = (file: File): boolean => {
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const ALLOWED_FILE_TYPES = ['.pdf', '.txt'];

    if (!ALLOWED_FILE_TYPES.includes(fileExt)) {
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

  /**
   * Processes file to extract text content
   * @param file File to process
   * @returns Promise resolving to extracted text or null if processing fails
   */
  const processFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

    try {
      let text: string | null = null;

      if (fileExt === 'pdf') {
        text = await extractTextFromPDF(file);
      } else if (fileExt === 'txt' || fileExt === 'json') {
        text = await file.text();
      }

      // Check text length limit
      if (text && text.length > MAX_TEXT_LENGTH) {
        addError({
          message: `File "${file.name}" content exceeds ${MAX_TEXT_LENGTH} characters`,
          severity: 'error',
          fileId: file.name,
        });
        return null;
      }

      return text;
    } catch (error) {
      addError({
        message: `Failed to process "${file.name}": ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        severity: 'error',
        fileId: file.name,
      });
      return null;
    }
  };

  /**
   * Handles file selection event
   * Validates files and processes them to extract text
   * Updates preview files state with processed content
   */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsLoading(true);
    clearErrors();

    const newPreviewFiles: { name: string; id: string; content: string }[] = [];

    // Process each selected file
    for (const file of files) {
      if (!validateFile(file)) continue;

      const fileId = Math.random().toString(36).substr(2, 9);
      const text = await processFile(file);

      if (text) {
        newPreviewFiles.push({
          name: file.name,
          id: fileId,
          content: text,
        });
      }
    }

    // Update preview files if any processing succeeded
    if (newPreviewFiles.length > 0) {
      setPreviewFiles(newPreviewFiles);
      if (newPreviewFiles.length < files.length) {
        addError({
          message: 'Some files were not processed successfully',
          severity: 'warning',
        });
      }
    }

    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative file-upload-wrapper">
      {/* Hidden file input triggered by button click */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.json"
        className="memori--upload-file-input"
        onChange={handleFileSelect}
        multiple
      />

      {/* Upload button with loading state */}
      <button
        className={cx(
          'memori-button',
          'memori-button--circle',
          'memori-button--icon-only',
          'memori-share-button--button',
          'memori--conversation-button',
          { 'memori--error': errors.length > 0 }
        )}
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        title="Upload file"
      >
        {isLoading ? (
          <Spin spinning className="memori--upload-icon" />
        ) : (
          <UploadIcon className="memori--upload-icon" />
        )}
      </button>

      {/* Error messages container */}
      <div className="memori--error-message-container">
        {errors.map((error, index) => (
          <Alert
            key={`${error.message}-${index}`}
            open={true}
            type={error.severity}
            title={'File upload failed'}
            description={error.message}
            onClose={() => removeError(error.message)}
            width="350px"
          />
        ))}
      </div>
    </div>
  );
};

export default FileUploadButton;
