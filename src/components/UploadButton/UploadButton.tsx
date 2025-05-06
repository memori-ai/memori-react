import React, { useState, useRef, useEffect } from 'react';
import { UploadIcon } from '../icons/Upload';
import { DocumentIcon } from '../icons/Document';
import { ImageIcon } from '../icons/Image';
import Spin from '../ui/Spin';
import Alert from '../ui/Alert';
import cx from 'classnames';
import UploadDocuments from './UploadDocuments/UploadDocuments';
import UploadImages from './UploadImages/UploadImages';

// Define types for files
type CombinedFile = {
  name: string;
  id: string;
  content: string;
  type: 'document' | 'image';
  previewUrl?: string;
};

// Props interface
interface ParentComponentProps {
  authToken?: string;
  apiUrl?: string;
  sessionID?: string;
  isMediaAccepted?: boolean;  
  setDocumentPreviewFiles: any;
  documentPreviewFiles: any;
}

const UploadButton: React.FC<ParentComponentProps> = ({
  authToken = '',
  apiUrl = '',
  sessionID = '',
  isMediaAccepted = false,
  setDocumentPreviewFiles,
  documentPreviewFiles,
}) => {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [documentFiles, setDocumentFiles] = useState<{ name: string; id: string; content: string }[]>([]);
  const [allFiles, setAllFiles] = useState<CombinedFile[]>([]);
  const [errors, setErrors] = useState<{ message: string; severity: 'error' | 'warning' | 'info' }[]>([]);
  
  // Refs
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  // Error handling
  const clearErrors = () => setErrors([]);
  
  const removeError = (errorMessage: string) => {
    setErrors(prev => prev.filter(e => e.message !== errorMessage));
  };
  
  const addError = (error: { message: string; severity: 'error' | 'warning' | 'info' }) => {
    setErrors(prev => [...prev, error]);
    setTimeout(() => removeError(error.message), 5000);
  };
  
  // Menu handling
  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };
  
  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handler for document files
  const handleDocumentFiles = (files: { name: string; id: string; content: string }[]) => {
    setDocumentFiles(files);
    setDocumentPreviewFiles((prevFiles: { name: string; id: string; content: string; type: string }[]) => [...prevFiles, ...files]);
    // Update combined files
    const nonDocuments = allFiles.filter(file => file.type !== 'document');
    
    const newDocuments = files.map(file => ({
      ...file,
      type: 'document' as const
    }));
    
    setAllFiles([...nonDocuments, ...newDocuments]);
  };

  // When document option is clicked
  const handleDocumentClick = () => {
    // Find the actual button in the UploadDocuments component and click it
    const documentButtonElement = documentRef.current?.querySelector('button');
    if (documentButtonElement) {
      documentButtonElement.click();
    }
    closeMenu();
  };
  
  // When image option is clicked
  const handleImageClick = () => {
    if (isMediaAccepted && authToken) {
      // Find the actual button in the UploadImages component and click it
      const imageButtonElement = imageRef.current?.querySelector('button');
      if (imageButtonElement) {
        imageButtonElement.click();
      }
    } else if (!authToken) {
      addError({
        message: "Please login to upload images",
        severity: "info"
      });
    }
    closeMenu();
  };
  
  return (
    <div className="memori--unified-upload-wrapper">
      {/* Main upload button */}
      <button
        ref={buttonRef}
        className={cx(
          'memori-button',
          'memori-button--circle',
          'memori-button--icon-only',
          'memori-share-button--button',
          'memori--conversation-button',
          'memori--unified-upload-button',
          { 'memori--error': errors.length > 0 }
        )}
        onClick={toggleMenu}
        disabled={isLoading}
        title="Upload files"
      >
        {isLoading ? (
          <Spin spinning className="memori--upload-icon" />
        ) : (
          <UploadIcon className="memori--upload-icon" />
        )}
      </button>
      
      {/* Floating menu */}
      {menuOpen && (
        <div className="memori--upload-menu" ref={menuRef}>
          <div 
            className="memori--upload-menu-item"
            onClick={handleDocumentClick}
          >
            <DocumentIcon className="memori--upload-menu-icon" />
            <span>Upload Document</span>
          </div>
          
          <div 
            className={cx("memori--upload-menu-item", {
              "memori--upload-menu-item--disabled": !isMediaAccepted || !authToken
            })}
            onClick={handleImageClick}
            title={!authToken ? "Please login to upload images" : "Upload image"}
          >
            <ImageIcon className="memori--upload-menu-icon-image" />
            <span>Upload Image</span>
          </div>
        </div>
      )}
      
      {/* Hidden components */}
      <div className="memori--hidden-uploader" ref={documentRef}>
        <UploadDocuments 
          setDocumentPreviewFiles={handleDocumentFiles}
        />
      </div>
      
      <div className="memori--hidden-uploader" ref={imageRef}>
        <UploadImages 
          authToken={authToken}
          apiUrl={apiUrl}
          setDocumentPreviewFiles={setDocumentPreviewFiles}
          sessionID={sessionID}
          documentPreviewFiles={documentPreviewFiles}
          isMediaAccepted={isMediaAccepted}
        />
      </div>
      
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
      {!authToken && menuOpen && (
        <div className="memori--login-tip">
          <Alert
            type="info"
            title="Login Required"
            description="Please login to upload images"
            width="350px"
            onClose={closeMenu}
          />
        </div>
      )}
    
    </div>
  );
};

export default UploadButton;