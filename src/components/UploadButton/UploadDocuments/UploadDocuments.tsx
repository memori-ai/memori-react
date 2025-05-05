import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import { UploadIcon } from '../../icons/Upload';
import Spin from '../../ui/Spin';
import Alert from '../../ui/Alert';
import { DocumentIcon } from '../../icons/Document';
import CloseIcon from '../../icons/Close';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';

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
  type: 'document';
  previewUrl?: string;
  uploaded?: boolean;
  error?: boolean;
};

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TEXT_LENGTH = 100000; // 100,000 characters
const PDF_JS_VERSION = '3.11.174';
const WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}/pdf.worker.min.js`;
const PDF_JS_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}/pdf.min.js`;
const XLSX_URL = 'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js';

// Add type definitions for external libraries
declare global {
  interface Window {
    pdfjsLib: any;
    XLSX: any;
  }
}

// Props interface
interface UploadDocumentsProps {
  setDocumentPreviewFiles: (files: { name: string; id: string; content: string }[]) => void;
}

const UploadDocuments: React.FC<UploadDocumentsProps> = ({
  setDocumentPreviewFiles,
}) => {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<UploadError[]>([]);
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<PreviewFile | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Refs
  const documentInputRef = useRef<HTMLInputElement>(null);

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
    setPreviewFiles(prev => prev.filter(file => file.id !== fileId));
    
    // Update document preview files
    const documentFiles = previewFiles
      .filter(file => file.id !== fileId)
      .map(({ name, id, content }) => ({ name, id, content }));
    
    setDocumentPreviewFiles(documentFiles);
  };

  // Document upload
  const validateDocumentFile = (file: File): boolean => {
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const ALLOWED_FILE_TYPES = ['.pdf', '.txt', '.json', '.xlsx', '.csv'];

    if (!ALLOWED_FILE_TYPES.includes(fileExt)) {
      addError({
        message: `File type "${fileExt}" is not supported. Please use: ${ALLOWED_FILE_TYPES.join(', ')}`,
        severity: 'error',
        fileId: file.name,
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      addError({
        message: `File "${file.name}" exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
        severity: 'error',
        fileId: file.name,
      });
      return false;
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
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
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
      throw new Error(`PDF extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        const data = window.XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
        
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
      throw new Error(`XLSX extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

      if (text && text.length > MAX_TEXT_LENGTH) {
        addError({
          message: `File "${file.name}" content exceeds ${MAX_TEXT_LENGTH} characters and was truncated`,
          severity: 'warning',
          fileId: file.name,
        });
        text = text.substring(0, MAX_TEXT_LENGTH) + "\n\n[Content truncated due to size limits]";
      }

      return text;
    } catch (error) {
      throw new Error(`Failed to process "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsLoading(true);
    clearErrors();

    const newDocumentFiles: { name: string; id: string; content: string }[] = [];

    for (const file of files) {
      if (!validateDocumentFile(file)) continue;

      const fileId = Math.random().toString(36).substr(2, 9);
      
      try {
        const text = await processDocumentFile(file);
        
        if (text) {
          // Add to preview files
          setPreviewFiles(prev => [
            ...prev,
            {
              name: file.name,
              id: fileId,
              content: text,
              type: 'document',
            }
          ]);
          
          // Add to document-specific preview
          newDocumentFiles.push({
            name: file.name,
            id: fileId,
            content: text,
          });
        }
      } catch (error) {
        addError({
          message: `${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error',
          fileId: file.name,
        });
      }
    }

    if (newDocumentFiles.length > 0) {
      setDocumentPreviewFiles(newDocumentFiles);
    }

    setIsLoading(false);
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };

  const getFileType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'PDF';
      case 'txt':
        return 'Text';
      case 'json':
        return 'JSON';
      case 'xlsx':
        return 'Excel';
      case 'csv':
        return 'CSV';
      default:
        return 'File';
    }
  };

  return (
    <div className="memori--document-upload-wrapper">
      {/* Hidden file input */}
      <input
        ref={documentInputRef}
        type="file"
        accept=".pdf,.txt,.md,.json,.xlsx,.csv"
        className="memori--upload-file-input"
        onChange={handleDocumentUpload}
        multiple
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
          { 'memori--error': errors.length > 0 }
        )}
        onClick={() => documentInputRef.current?.click()}
        disabled={isLoading}
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
            whiteSpace: 'pre-wrap'
          }}
        >
          {selectedFile?.content}
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

export default UploadDocuments;