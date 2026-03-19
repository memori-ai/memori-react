import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { AlertProvider, AlertViewport } from '@memori.ai/ui';
import I18nWrapper from '../../I18nWrapper';
import UploadButton from './UploadButton';
import FilePreview from '../FilePreview/FilePreview';
import memoriApiClient from '@memori.ai/memori-api-client';
import './UploadButton.css';

// Mock API client for stories
const createMockClient = () => {
  return {
    backend: {
      uploadAsset: async (
        fileName: string,
        fileDataUrl: string,
        authToken: string
      ) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          resultCode: 0,
          resultMessage: 'Success',
          asset: {
            assetURL: `https://example.com/assets/${fileName}`,
            mimeType: 'image/jpeg',
            assetID: `asset-${Date.now()}`,
          },
        };
      },
      uploadAssetUnlogged: async (
        fileName: string,
        fileDataUrl: string,
        memoriID: string,
        sessionID: string
      ) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          resultCode: 0,
          resultMessage: 'Success',
          asset: {
            assetURL: `https://example.com/assets/${fileName}`,
            mimeType: 'image/jpeg',
            assetID: `asset-${Date.now()}`,
          },
        };
      },
    },
    dialog: {
      postMediumSelectedEvent: async (sessionID: string, medium: any) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          currentState: {
            currentMedia: [
              {
                mediumID: `medium-${Date.now()}`,
                url: medium.url,
                mimeType: medium.mimeType,
              },
            ],
          },
        };
      },
      postMediumDeselectedEvent: async (
        sessionID: string,
        mediumID: string
      ) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
      },
    },
  };
};

// Define the component props
interface UploadButtonProps {
  authToken?: string;
  client?: ReturnType<typeof memoriApiClient>;
  sessionID?: string;
  isMediaAccepted?: boolean;
  setDocumentPreviewFiles: (
    files: {
      name: string;
      id: string;
      content: string;
      type?: string;
      mediumID?: string;
      mimeType?: string;
      url?: string;
    }[]
  ) => void;
  documentPreviewFiles: {
    name: string;
    id: string;
    content: string;
    type?: string;
    mediumID?: string;
    mimeType?: string;
    url?: string;
  }[];
  memoriID?: string;
}

const meta: Meta<UploadButtonProps> = {
  title: 'Widget/Upload Button',
  component: UploadButton as React.ComponentType<UploadButtonProps>,
  argTypes: {
    isMediaAccepted: {
      control: {
        type: 'boolean',
      },
      description: 'Whether media (images) uploads are accepted',
    },
    authToken: {
      control: {
        type: 'text',
      },
      description: 'Authentication token for logged-in users',
    },
    sessionID: {
      control: {
        type: 'text',
      },
      description: 'Session ID for the current chat session',
    },
    memoriID: {
      control: {
        type: 'text',
      },
      description: 'Memori ID for unauthenticated uploads',
    },
  },
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        component: `
# Upload Button Component

A unified upload button that supports both images and documents with the following features:

## Features

- **Direct File Chooser**: Clicking the button opens the file chooser directly (no menu)
- **Unified Input**: Single file input accepts both images and documents
- **Automatic File Type Detection**: Files are automatically categorized as images or documents and routed to the appropriate handler
- **Keyboard Shortcut**: Press \`Cmd+V\` (Mac) or \`Ctrl+V\` (Windows/Linux) to open the file chooser (when not in a text input)
- **Drag and Drop**: Drag files anywhere in the widget to upload them
- **Paste Support**: Paste files from clipboard using \`Cmd+V\` / \`Ctrl+V\`

## Limits

- **Images**: Maximum 5 images, 10MB per file, formats: .jpg, .jpeg, .png
- **Documents**: Maximum 5 documents, 10MB per file, formats: .pdf, .txt, .json, .xlsx, .csv, .md
- **Content**: Document content is limited to 200,000 characters per document (truncated if exceeded)
        `,
      },
    },
  },
};

export default meta;

// Create the template
const Template: Story<UploadButtonProps> = args => {
  const [documentPreviewFiles, setDocumentPreviewFiles] = useState<
    {
      name: string;
      id: string;
      content: string;
      type?: string;
      mediumID?: string;
      mimeType?: string;
      url?: string;
    }[]
  >([]);

  const removeFile = (id: string, mediumID?: string) => {
    setDocumentPreviewFiles(prev => prev.filter(file => file.id !== id));
  };

  return (
    <I18nWrapper>
      <AlertProvider>
        <div
          style={{
            minHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '20px',
            border: '1px solid #eee',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <div
            style={{
              alignSelf: 'flex-end',
              marginBottom: '20px',
              position: 'relative',
            }}
          >
            <UploadButton
              {...args}
              setDocumentPreviewFiles={setDocumentPreviewFiles}
              documentPreviewFiles={documentPreviewFiles}
              {...(args.client
                ? { client: args.client }
                : { client: createMockClient() as any })}
            />
          </div>

          <div style={{ width: '100%', marginTop: '20px' }}>
            <h3
              style={{
                marginBottom: '10px',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              Uploaded Files ({documentPreviewFiles.length})
            </h3>
            {documentPreviewFiles.length > 0 ? (
              <FilePreview
                previewFiles={documentPreviewFiles}
                removeFile={removeFile}
              />
            ) : (
              <p
                style={{ color: '#999', fontStyle: 'italic', fontSize: '14px' }}
              >
                No files uploaded yet. Click the upload button, drag & drop
                files, or use Cmd+V / Ctrl+V to upload.
              </p>
            )}
          </div>

          <div
            style={{
              marginTop: '30px',
              padding: '15px',
              backgroundColor: '#fff',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '13px',
              color: '#666',
            }}
          >
            <strong>Try these features:</strong>
            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
              <li>Click the upload button to open file chooser</li>
              <li>Drag and drop files anywhere in this area</li>
              <li>
                Press{' '}
                <kbd
                  style={{
                    padding: '2px 6px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '3px',
                  }}
                >
                  Cmd+V
                </kbd>{' '}
                /{' '}
                <kbd
                  style={{
                    padding: '2px 6px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '3px',
                  }}
                >
                  Ctrl+V
                </kbd>{' '}
                to open file chooser
              </li>
              <li>
                Paste files from clipboard using{' '}
                <kbd
                  style={{
                    padding: '2px 6px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '3px',
                  }}
                >
                  Cmd+V
                </kbd>{' '}
                /{' '}
                <kbd
                  style={{
                    padding: '2px 6px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '3px',
                  }}
                >
                  Ctrl+V
                </kbd>
              </li>
              <li>
                Upload both images (.jpg, .jpeg, .png) and documents (.pdf,
                .txt, .json, .xlsx, .csv, .md)
              </li>
            </ul>
          </div>
        </div>
      </AlertProvider>
    </I18nWrapper>
  );
};

// Default state - no auth token, documents only
export const Default = Template.bind({});
Default.args = {
  authToken: '',
  sessionID: 'session-123',
  isMediaAccepted: false,
  memoriID: 'memori-123',
  documentPreviewFiles: [],
};
Default.parameters = {
  docs: {
    description: {
      story:
        'Default state with documents only (no images). Users can upload up to 5 documents. Click the button to open the file chooser directly.',
    },
  },
};

// Authenticated user - can upload documents
export const AuthenticatedDocumentsOnly = Template.bind({});
AuthenticatedDocumentsOnly.args = {
  authToken: 'dummy-auth-token-12345',
  sessionID: 'session-123',
  isMediaAccepted: false,
  documentPreviewFiles: [],
};
AuthenticatedDocumentsOnly.parameters = {
  docs: {
    description: {
      story:
        'Authenticated user can upload documents. The button opens the file chooser directly when clicked.',
    },
  },
};

// Authenticated user - can upload documents and images
export const AuthenticatedWithImages = Template.bind({});
AuthenticatedWithImages.args = {
  authToken: 'dummy-auth-token-12345',
  sessionID: 'session-123',
  isMediaAccepted: true,
  memoriID: 'memori-123',
  documentPreviewFiles: [],
};
AuthenticatedWithImages.parameters = {
  docs: {
    description: {
      story:
        'Full functionality: authenticated user can upload both images and documents. Supports drag & drop, Cmd+V / Ctrl+V shortcut, and paste from clipboard.',
    },
  },
};

// With existing files
export const WithExistingFiles = Template.bind({});
WithExistingFiles.args = {
  authToken: 'dummy-auth-token-12345',
  sessionID: 'session-123',
  isMediaAccepted: true,
  memoriID: 'memori-123',
  documentPreviewFiles: [
    {
      id: '1',
      name: 'document.pdf',
      content: 'Sample document content',
      type: 'document',
      mimeType: 'application/pdf',
    },
    {
      id: '2',
      name: 'image.jpg',
      content: 'https://example.com/image.jpg',
      type: 'image',
      mimeType: 'image/jpeg',
      url: 'https://example.com/image.jpg',
      mediumID: 'medium-123',
    },
  ],
};
WithExistingFiles.parameters = {
  docs: {
    description: {
      story:
        'Shows the upload button with existing files. The document count indicator shows 2/5. You can still upload more files up to the limit.',
    },
  },
};

// At maximum capacity
export const AtMaximumCapacity = Template.bind({});
AtMaximumCapacity.args = {
  authToken: 'dummy-auth-token-12345',
  sessionID: 'session-123',
  isMediaAccepted: true,
  memoriID: 'memori-123',
  documentPreviewFiles: [
    {
      id: '1',
      name: 'doc1.pdf',
      content: 'Content 1',
      type: 'document',
      mimeType: 'application/pdf',
    },
    {
      id: '2',
      name: 'doc2.pdf',
      content: 'Content 2',
      type: 'document',
      mimeType: 'application/pdf',
    },
    {
      id: '3',
      name: 'doc3.pdf',
      content: 'Content 3',
      type: 'document',
      mimeType: 'application/pdf',
    },
    {
      id: '4',
      name: 'doc4.pdf',
      content: 'Content 4',
      type: 'document',
      mimeType: 'application/pdf',
    },
    {
      id: '5',
      name: 'doc5.pdf',
      content: 'Content 5',
      type: 'document',
      mimeType: 'application/pdf',
    },
  ],
};
AtMaximumCapacity.parameters = {
  docs: {
    description: {
      story:
        'Button is disabled when maximum capacity (5 documents) is reached. The count indicator shows 5/5.',
    },
  },
};

// Not authenticated but media accepted
export const UnauthenticatedWithMediaAccepted = Template.bind({});
UnauthenticatedWithMediaAccepted.args = {
  authToken: '',
  sessionID: 'session-123',
  isMediaAccepted: true,
  memoriID: 'memori-123',
  documentPreviewFiles: [],
};
UnauthenticatedWithMediaAccepted.parameters = {
  docs: {
    description: {
      story:
        'Unauthenticated user with media accepted. Images can be uploaded using unlogged API. Documents work normally.',
    },
  },
};

// Mobile view simulation
export const MobileView = Template.bind({});
MobileView.args = {
  authToken: 'dummy-auth-token-12345',
  sessionID: 'session-123',
  isMediaAccepted: true,
  memoriID: 'memori-123',
  documentPreviewFiles: [],
};
MobileView.parameters = {
  viewport: {
    defaultViewport: 'mobile1',
  },
  docs: {
    description: {
      story:
        'Mobile view simulation. All features work on mobile: tap to upload, drag & drop (on supported devices), and paste from clipboard.',
    },
  },
};

// Drag and drop demonstration
export const DragAndDropDemo = Template.bind({});
DragAndDropDemo.args = {
  authToken: 'dummy-auth-token-12345',
  sessionID: 'session-123',
  isMediaAccepted: true,
  memoriID: 'memori-123',
  documentPreviewFiles: [],
};
DragAndDropDemo.parameters = {
  docs: {
    description: {
      story:
        'Try dragging files from your file system into this area. The overlay will appear when dragging files over the chat area. Files are automatically categorized as images or documents.',
    },
  },
};
