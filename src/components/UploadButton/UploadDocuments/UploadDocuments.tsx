import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import Spin from '../../ui/Spin';
import { DocumentIcon } from '../../icons/Document';
import Modal from '../../ui/Modal';
import { MAX_DOCUMENT_CONTENT_LENGTH } from '../../../helpers/constants';

// Types
type PreviewFile = {
  name: string;
  id: string;
  content: string;
  type: 'document';
  previewUrl?: string;
  uploaded?: boolean;
  error?: boolean;
};

// Constants
const PDF_JS_VERSION = '3.11.174';
const WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}/pdf.worker.min.js`;
const PDF_JS_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}/pdf.min.js`;
const XLSX_URL =
  'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js';

// Add type definitions for external libraries
declare global {
  interface Window {
    pdfjsLib: any;
    XLSX: any;
  }
}

// Props interface
interface UploadDocumentsProps {
  setDocumentPreviewFiles: (
    files: { name: string; id: string; content: string; mimeType: string }[]
  ) => void;
  maxDocuments?: number;
  documentPreviewFiles: any;
  onLoadingChange?: (loading: boolean) => void;
  onDocumentError?: (error: {
    message: string;
    severity: 'error' | 'warning' | 'info';
  }) => void;
  onValidateFile?: (file: File) => boolean;
  onValidatePayloadSize?: (
    newDocuments: {
      name: string;
      id: string;
      content: string;
      mimeType: string;
    }[]
  ) => boolean;
}

const UploadDocuments: React.FC<UploadDocumentsProps> = ({
  setDocumentPreviewFiles,
  maxDocuments,
  documentPreviewFiles,
  onLoadingChange,
  onDocumentError,
  onValidateFile,
  onValidatePayloadSize,
}) => {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<PreviewFile | null>(null);

  // Refs
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Update loading state in parent component
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  // Document upload
  const validateDocumentFile = (file: File): boolean => {
    if (onValidateFile) {
      return onValidateFile(file);
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
    if (onValidatePayloadSize) {
      return onValidatePayloadSize(newDocuments);
    }
    return true;
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      // Load PDF.js if not already loaded
      if (!window.pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = PDF_JS_URL;
          script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
            resolve(true);
          };
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Extract text from PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer })
        .promise;
      let text = '';

      // Iterate through each page and extract text
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .filter((item: any) => item.str && typeof item.str === 'string')
          .map((item: any) => item.str)
          .join(' ');
        text += pageText + '\n';
      }

      return text;
    } catch (error) {
      console.error('PDF extraction failed:', error);
      throw new Error(
        `PDF extraction failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  const extractTextFromXLSX = async (file: File): Promise<string> => {
    try {
      if (!window.XLSX) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = XLSX_URL;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const arrayBuffer = await file.arrayBuffer();
      const workbook = window.XLSX.read(arrayBuffer, {
        type: 'array',
        cellFormula: true,
        cellNF: true,
        cellText: true,
        cellDates: true,
      });

      let text = '';
      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const data = window.XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
        });

        const colWidths = data.reduce((widths: number[], row: any[]) => {
          row.forEach((cell, i) => {
            const cellWidth = (cell || '').toString().length;
            widths[i] = Math.max(widths[i] || 0, cellWidth);
          });
          return widths;
        }, []);

        const formattedText = data.map((row: any[]) => {
          return row
            .map((cell, i) => {
              const cellStr = (cell || '').toString();
              return cellStr.padEnd(colWidths[i] + 2);
            })
            .join('|')
            .trim();
        });

        if (formattedText.length > 0) {
          const separator = colWidths
            .map((w: number) => '-'.repeat(w + 2))
            .join('+');
          formattedText.splice(1, 0, separator);
        }

        text += `Sheet: ${sheetName}\n${formattedText.join('\n')}\n\n`;
      }

      return text;
    } catch (error) {
      console.error('XLSX extraction failed:', error);
      throw new Error(
        `XLSX extraction failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  const processDocumentFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

    try {
      let text: string | null = null;

      if (fileExt === 'pdf') {
        text = await extractTextFromPDF(file);
      } else if (['txt', 'md', 'json', 'csv'].includes(fileExt)) {
        text = await file.text();
      } else if (fileExt === 'xlsx') {
        text = await extractTextFromXLSX(file);
      }

      if (text && text.length > MAX_DOCUMENT_CONTENT_LENGTH) {
        console.warn(
          'Document content exceeds length limit:',
          text.length,
          '>',
          MAX_DOCUMENT_CONTENT_LENGTH
        );
        onDocumentError?.({
          message: `File "${file.name}" content exceeds ${MAX_DOCUMENT_CONTENT_LENGTH} characters and was truncated`,
          severity: 'warning',
        });
        text =
          text.substring(0, MAX_DOCUMENT_CONTENT_LENGTH) +
          '\n\n[Content truncated due to size limits]';
      }
      return text;
    } catch (error) {
      console.error('Document processing failed:', error);
      throw new Error(
        `Failed to process "${file.name}": ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check current total media count (images + documents)
    const currentMediaCount = documentPreviewFiles.length;

    // Check if adding these files would exceed the total media limit
    if (maxDocuments && currentMediaCount + files.length > maxDocuments) {
      onDocumentError?.({
        message: `Maximum ${maxDocuments} media files allowed. You can upload ${Math.max(0, maxDocuments - currentMediaCount)} more file${maxDocuments - currentMediaCount !== 1 ? 's' : ''}.`,
        severity: 'error',
      });
      if (documentInputRef.current) {
        documentInputRef.current.value = '';
      }
      return;
    }

    setIsLoading(true);

    // Process each file
    const processedFiles: {
      name: string;
      id: string;
      content: string;
      mimeType: string;
    }[] = [];

    for (const file of files) {
      if (!validateDocumentFile(file)) {
        continue;
      }

      const fileId = Math.random().toString(36).substr(2, 9);

      try {
        const text = await processDocumentFile(file);

        if (text) {
          processedFiles.push({
            name: file.name,
            id: fileId,
            content: text,
            mimeType: file.type,
          });
        }
      } catch (error) {
        console.error('File processing error:', error);
        onDocumentError?.({
          message: `${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
          severity: 'error',
        });
      }
    }

    // Add new documents to existing ones
    if (processedFiles.length > 0) {
      // Validate total payload size
      if (!validatePayloadSize(processedFiles)) {
        setIsLoading(false);
        if (documentInputRef.current) {
          documentInputRef.current.value = '';
        }
        return;
      }

      const existingDocuments = documentPreviewFiles.filter(
        (file: any) => file.type === 'document'
      );
      const existingImages = documentPreviewFiles.filter(
        (file: any) => file.type === 'image'
      );

      setDocumentPreviewFiles([
        ...existingDocuments,
        ...processedFiles.map(file => ({
          ...file,
          type: 'document',
        })),
      ]);
    }
    setIsLoading(false);
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };

  return (
    <div className="memori--document-upload-wrapper">
      {/* Hidden file input */}
      <input
        ref={documentInputRef}
        type="file"
        accept=".pdf,.txt,.md,.json,.xlsx,.csv"
        multiple
        className="memori--upload-file-input"
        onChange={handleDocumentUpload}
      />

      {/* Upload document button */}
      <button
        className={cx(
          'memori-button',
          'memori-button--circle',
          'memori-button--icon-only',
          'memori-share-button--button',
          'memori--conversation-button',
          'memori--document-upload-button',
          { 'memori--error': false } // Removed errors.length > 0
        )}
        onClick={() => documentInputRef.current?.click()}
        disabled={
          isLoading ||
          (maxDocuments &&
            documentPreviewFiles.length >= maxDocuments) ||
          false
        }
        title="Upload documents"
      >
        {isLoading ? (
          <Spin spinning className="memori--upload-icon" />
        ) : (
          <React.Fragment>
            <DocumentIcon className="memori--upload-icon" />
          </React.Fragment>
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
            whiteSpace: 'pre-wrap',
          }}
        >
          {selectedFile?.content}
        </div>
      </Modal>
    </div>
  );
};

export default UploadDocuments;