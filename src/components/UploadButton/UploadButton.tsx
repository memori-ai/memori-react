import React, { useState, useRef } from 'react';
import cx from 'classnames';
import ConvertApi from 'convertapi-js';
import UploadIcon from '../icons/Upload';
import Spin from '../ui/Spin';

/**
 * UploadButton component
 * @param {Function} setPreviewFiles - Callback function to handle the uploaded text
 * @param {string} convertapiToken - ConvertAPI token
 * @returns {JSX.Element}
 */
const FileUploadButton = ({
  setPreviewFiles,
  convertapiToken,
}: {
  setPreviewFiles: (
    previewFiles: { name: string; id: string; content: string }[]
  ) => void;
  convertapiToken: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToTxt = async (file: File) => {
    if (!convertapiToken || !file) {
      console.error('Missing ConvertAPI token or file');
      setError('Missing ConvertAPI token or file');
      return;
    }

    setIsLoading(true);
    const fileExt =
      file.name.split('.').pop() || file.type.split('/').pop() || 'pdf';

    try {
      const convertApi = ConvertApi.auth(convertapiToken);
      const params = convertApi.createParams();
      params.add('File', file);
      params.add('TextEncoding', 'UTF-8');
      params.add('PageRange', '1-2000');

      const result = await convertApi.convert(fileExt, 'txt', params);
      const fileUrl = result.files[0].Url;

      const response = await fetch(fileUrl);
      const text = await response.text();

      return text;
    } catch (error) {
      console.error('Conversion error:', error);
      setError('Conversion error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviewFiles: { name: string; id: string; content: string }[] = [];

    for (const file of files) {
      const fileId = Math.random().toString(36).substr(2, 9);

      const text = await convertToTxt(file);

      if (text) {
        newPreviewFiles.push({
          name: file.name,
          id: fileId,
          content: text || '',
        });
      } else {
        setError('Failed to convert file to text');
      }
    }

    setPreviewFiles(newPreviewFiles);
  };

  return (
    <div className="file-upload-wrapper">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        className="memori--upload-file-input"
        onChange={handleFileSelect}
      />

      <button
        className={cx(
          'memori-button',
          'memori-button--circle',
          'memori-button--icon-only',
          'memori-share-button--button',
          'memori--conversation-button',
          { 'memori--error': error }
        )}
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
      >
        {error ? (
          <span className="memori--error-message">{error}</span>
        ) : isLoading ? (
          <Spin spinning className="memori--upload-icon" />
        ) : (
          <UploadIcon className="memori--upload-icon" />
        )}
      </button>
    </div>
  );
};

export default FileUploadButton;
