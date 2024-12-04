import React, { useState } from 'react';
import PreviewIcon from '../icons/Preview';
import CloseIcon from '../icons/Close';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

type FilePreviewProps = {
  previewFiles: { name: string; id: string; content: string }[];
  removeFile: (id: string) => void;
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
    content: string;
  } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      {previewFiles.length > 0 && (
        <div
          className={`memori--preview-container ${
            isMessagePreview
              ? 'memori--message-preview'
              : 'memori--absolute-preview'
          }`}
        >
          <div className="memori--preview-list">
            {previewFiles.map(file => (
              <div
                key={file.id}
                className="memori--preview-item"
                onMouseEnter={() => setHoveredId(file.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedFile(file)}
              >
                <PreviewIcon className="memori--preview-icon" />
                <span className="memori--preview-filename">{file.name}</span>

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
                      removeFile(file.id);
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
        <div className="memori--preview-content" style={{ whiteSpace: 'pre-wrap', maxHeight: '70vh', overflowY: 'auto' }}>
          {selectedFile?.content}
        </div>
      </Modal>
    </>
  );
};

export default FilePreview;
