import React, { useState } from 'react';
import { PreviewIcon } from '../icons/Preview';
import { DocumentIcon } from '../icons/Document';
import { ImageIcon } from '../icons/Image';
import CloseIcon from '../icons/Close';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { stripHTML } from '../../helpers/utils';

type FilePreviewProps = {
  previewFiles: any;
  removeFile: (id: string, mediumID: string | undefined) => void;
  allowRemove?: boolean;
  isMessagePreview?: boolean;
};

const FilePreview = ({
  previewFiles,
  removeFile,
  allowRemove = true,
  isMessagePreview = false,
}: FilePreviewProps) => {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    id: string;
    content: string;
    type?: string;
  } | null>(null);
  
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getFileType = (filename: string, type?: string) => {
    // If type is explicitly provided, use it first
    if (type === 'image') {
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
    }
    
    // Otherwise use extension
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
      case 'jpg':
      case 'jpeg':
        return 'JPEG';
      case 'png':
        return 'PNG';
      default:
        return 'Document';
    }
  };

  // Detect if the content is an image URL
  const isImageContent = (content: string, type?: string): boolean => {
    if (type === 'image') return true;
    
    // Check if the content has image file extension or is an image URL
    const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(content);
    const isImageUrl = content.startsWith('http') && 
                       (content.includes('/image/') || 
                        content.includes('/img/') || 
                        hasImageExtension);
    
    return isImageUrl || hasImageExtension;
  };

  return (
    <>
      {previewFiles.length > 0 && (
        <div
          className={`memori--preview-container  ${
            isMessagePreview
              ? 'memori--message-preview'
              : 'memori--absolute-preview'
          }`}
        >
          <div className="memori--preview-list">
            {previewFiles.map((file: any) => (
              <div
                key={file.id}
                className={`memori--preview-item ${
                  isImageContent(file.content, file.type) 
                    ? 'memori--preview-item--image' 
                    : 'memori--preview-item--document'
                }`}
                onMouseEnter={() => setHoveredId(file.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedFile(file)}
              >
                {isImageContent(file.content, file.type) ? (
                  <div className="memori--preview-thumbnail">
                    <img src={file.content} alt={file.name} />
                  </div>
                ) : (
                  <DocumentIcon className="memori--preview-icon" />
                )}
                
                <div className="memori--preview-file-info">
                  <span className="memori--preview-filename">{file.name}</span>
                  <span className="memori--preview-filetype">
                    {getFileType(file.name, file.type)}
                  </span>
                </div>
                
                {allowRemove && (
                  <Button
                    shape="rounded"
                    icon={<CloseIcon />}
                    danger
                    className={`memori--remove-button ${
                      hoveredId === file.id ? 'visible' : ''
                    }`}
                    onClick={e => {
                      e.stopPropagation();
                      removeFile(file.id, file?.mediumID);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
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
            whiteSpace: selectedFile && !isImageContent(selectedFile.content, selectedFile.type) ? 'pre-wrap' : 'normal'
          }}
        >
          {selectedFile && isImageContent(selectedFile.content, selectedFile.type) ? (
            <>
              <img 
                src={selectedFile.content} 
                alt={selectedFile.name} 
                style={{ maxWidth: '100%', maxHeight: '60vh' }} 
            />
            </>
          ) : (
            stripHTML(selectedFile?.content || '')
          )}
        </div>
      </Modal>
    </>
  );
};

export default FilePreview;