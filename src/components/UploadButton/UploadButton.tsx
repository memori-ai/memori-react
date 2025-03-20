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
 * Supports PDF, TXT, CSV and XLSX files up to 10MB
 * Extracts text from PDFs using PDF.js
 * Extracts text from XLSX using xlsx library
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TEXT_LENGTH = 100000; // 100,000 characters
const PDF_JS_VERSION = '3.11.174'; // Last stable version with .min.js files
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
      setErrors(prev => [...prev, {
        message: `PDF extraction failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        severity: 'error',
          fileId: file.name,
        },
      ]);
      throw new Error(
        `PDF extraction failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  /**
   * Extracts text from XLSX using xlsx library with enhanced error handling
   * @param file XLSX file to process
   * @returns Promise resolving to extracted text
   */
  const extractTextFromXLSX = async (file: File): Promise<string> => {
    try {
      // First, check if the XLSX library is loaded in the window object
      // If not, dynamically load it by creating and appending a script tag
      if (!window.XLSX) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = XLSX_URL;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Convert the File object to ArrayBuffer for XLSX parsing
      const arrayBuffer = await file.arrayBuffer();

      // Check for minimum valid Excel file size
      if (arrayBuffer.byteLength < 4) {
        throw new Error('File appears to be corrupted or empty');
      }

      let workbook;
      try {
        // Try parsing with full options first
        workbook = window.XLSX.read(arrayBuffer, {
          type: 'array',
          cellFormula: false, // Disable formula parsing to avoid potential issues
          cellNF: false, // Disable number format parsing
          cellHTML: false, // Disable HTML parsing
          cellText: true, // Force text output
          cellDates: false, // Disable date parsing to avoid errors
          error: (e: any) => {
            console.warn('Non-fatal XLSX error:', e);
          }, // Log non-fatal errors
          cellStyles: false, // Disable style parsing
        });
      } catch (initialError) {
        console.warn(
          'Initial XLSX parsing failed, attempting recovery mode:',
          initialError
        );

        // Fallback to a more permissive parsing method
        try {
          workbook = window.XLSX.read(arrayBuffer, {
            type: 'array',
            sheetRows: 1000, // Limit number of rows to parse
            cellFormula: false,
            cellStyles: false,
            bookDeps: false, // Don't parse external dependencies
            bookFiles: false, // Don't parse embedded files
            bookProps: false, // Don't parse document properties
            bookSheets: false, // Don't parse sheet properties
            bookVBA: false, // Don't parse VBA
            WTF: true, // "What the Formula" mode - ignores errors when possible
          });
        } catch (recoveryError) {
          setErrors(prev => [...prev, {
            message: `File appears to be corrupted. Recovery attempt failed: ${
              recoveryError instanceof Error
                ? recoveryError.message
                : 'Unknown error'
            }`,
            severity: 'error',
            fileId: file.name,
          }]);
          throw new Error(
            `File appears to be corrupted. Recovery attempt failed: ${
              recoveryError instanceof Error
                ? recoveryError.message
                : 'Unknown error'
            }`
          );
        }
      }

      // Verify that workbook contains at least one sheet
      if (
        !workbook ||
        !workbook.SheetNames ||
        workbook.SheetNames.length === 0
      ) {
        throw new Error('Excel file contains no valid worksheets');
      }

      let text = '';
      let successfulSheets = 0;
      const totalSheets = workbook.SheetNames.length;

      // Loop through each sheet in the workbook
      for (const sheetName of workbook.SheetNames) {
        try {
          const worksheet = workbook.Sheets[sheetName];
          if (!worksheet) {
            throw new Error(`Sheet ${sheetName} is empty or corrupted`);
          }

          // Safely get the dimensions of the sheet
          const range = window.XLSX.utils.decode_range(
            worksheet['!ref'] || 'A1:A1'
          );

          // Check if sheet seems abnormally large (possible corruption)
          const rowCount = range.e.r - range.s.r + 1;
          const colCount = range.e.c - range.s.c + 1;
          if (rowCount > 10000 || colCount > 1000) {
            throw new Error(
              `Sheet ${sheetName} has suspicious dimensions (${rowCount}x${colCount}) and may be corrupted`
            );
          }

          // Try to convert sheet to CSV
          let csv;
          try {
            csv = window.XLSX.utils.sheet_to_csv(worksheet);
          } catch (csvError) {
            // If CSV conversion fails, try a more basic cell-by-cell approach
            csv = '';
            for (let r = range.s.r; r <= Math.min(range.e.r, 1000); ++r) {
              let row = '';
              for (let c = range.s.c; c <= Math.min(range.e.c, 100); ++c) {
                const cell =
                  worksheet[window.XLSX.utils.encode_cell({ r: r, c: c })];
                row += (cell ? String(cell.v || '') : '') + ',';
              }
              csv += row + '\n';
            }
            csv += '...(truncated due to potential corruption)';
          }

          // Add sheet name and content to final text
          text += `Sheet: ${sheetName}\n${csv}\n\n`;
          successfulSheets++;
        } catch (sheetError) {
          // Log sheet-specific error but continue with other sheets
          text += `Sheet: ${sheetName}\nError extracting content: ${
            sheetError instanceof Error ? sheetError.message : 'Unknown error'
          }\n\n`;
        }
      }

      // If we couldn't extract any sheets successfully
      if (successfulSheets === 0) {
        throw new Error(
          'Could not extract any valid content from the Excel file'
        );
      }

      // If some sheets failed but others succeeded
      if (successfulSheets < totalSheets) {
        text =
          `Warning: Only extracted ${successfulSheets} of ${totalSheets} sheets due to possible corruption.\n\n` +
          text;
      }

      return text; // Return the extracted text from all sheets
    } catch (error) {
      setErrors(prev => [...prev, {
        message: `XLSX extraction failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        severity: 'error',
            fileId: file.name,
          },
        ]);
      // If any error occurs during processing, throw with descriptive message
      throw new Error(
        `XLSX extraction failed: ${
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
    const ALLOWED_FILE_TYPES = ['.pdf', '.txt', '.xlsx', '.csv'];

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
      } else if (fileExt === 'txt' || fileExt === 'json' || fileExt === 'csv') {
        text = await file.text();
      } else if (fileExt === 'xlsx') {
        text = await extractTextFromXLSX(file);
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
        accept=".pdf,.txt,.json,.xlsx,.csv"
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
