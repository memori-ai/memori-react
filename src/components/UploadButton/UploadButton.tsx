import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import ConvertApi from 'convertapi-js';
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
 * Supports PDF, DOC, DOCX and TXT files up to 10MB
 * Converts files to text using ConvertAPI service
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TEXT_LENGTH = 100000; // 100,000 characters
const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.txt'];

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
  // State for ConvertAPI authentication token
  const [convertapiToken, setConvertapiToken] = useState<string>();

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
   * Fetches ConvertAPI token from backend service
   * Displays error if token fetch fails
   */
  const fetchConvertapiToken = async () => {
    try {
      const result = await fetch('https://www.aisuru.com/api/convertapi-token');
      const response = await result.json();
      if (!response.Tokens?.[0]?.Id) {
        throw new Error('Invalid token response');
      }
      setConvertapiToken(response.Tokens[0].Id);
    } catch (error) {
      addError({
        message: 'Failed to initialize file conversion service. Please try again later.',
        severity: 'error'
      });
    }
  };

  // Fetch token on component mount
  useEffect(() => {
    fetchConvertapiToken();
  }, []);

  /**
   * Validates uploaded file
   * Checks file type and size restrictions
   * @param file File to validate
   * @returns boolean indicating if file is valid
   */
  const validateFile = (file: File): boolean => {
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    
    if (!ALLOWED_FILE_TYPES.includes(fileExt)) {
      addError({
        message: `File type "${fileExt}" is not supported. Please use: ${ALLOWED_FILE_TYPES.join(', ')}`,
        severity: 'error',
        fileId: file.name
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      addError({
        message: `File "${file.name}" exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
        severity: 'error',
        fileId: file.name
      });
      return false;
    }

    return true;
  };

  /**
   * Converts uploaded file to text using ConvertAPI
   * @param file File to convert
   * @returns Promise resolving to converted text or null if conversion fails
   */
  const convertToTxt = async (file: File): Promise<string | null> => {
    if (!convertapiToken) {
      addError({
        message: 'File conversion service not initialized',
        severity: 'error'
      });
      return null;
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';

    try {
      // Initialize ConvertAPI with token
      const convertApi = ConvertApi.auth(convertapiToken);
      const params = convertApi.createParams();
      params.add('File', file);
      params.add('TextEncoding', 'UTF-8');
      params.add('PageRange', '1-2000');

      // Convert file to text
      const result = await convertApi.convert(fileExt, 'txt', params);
      const fileUrl = result.files[0].Url;

      // Fetch converted text content
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();

      // Check text length limit
      if (text.length > MAX_TEXT_LENGTH) {
        addError({
          message: `File "${file.name}" content exceeds ${MAX_TEXT_LENGTH} characters`,
          severity: 'error',
          fileId: file.name
        });
        return null;
      }

      return text;
    } catch (error) {
      addError({
        message: `Failed to convert "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
        fileId: file.name
      });
      return null;
    }
  };

  /**
   * Handles file selection event
   * Validates files and converts them to text
   * Updates preview files state with converted content
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
      const text = await convertToTxt(file);

      if (text) {
        newPreviewFiles.push({
          name: file.name,
          id: fileId,
          content: text
        });
      }
    }

    // Update preview files if any conversions succeeded
    if (newPreviewFiles.length > 0) {
      setPreviewFiles(newPreviewFiles);
      if (newPreviewFiles.length < files.length) {
        addError({
          message: 'Some files were not processed successfully',
          severity: 'warning'
        });
      }
    }

    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  console.log(errors);

  return (
    <div className="relative file-upload-wrapper">
    {/* Hidden file input triggered by button click */}
    <input
      ref={fileInputRef}
      type="file"
      accept=".pdf,.doc,.docx,.txt"
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
          title={error.message}
          onClose={() => removeError(error.message)}
          width="300px"
        />
      ))}
    </div>
  </div>
  );
};

export default FileUploadButton;