import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import UploadButton from './UploadButton';
import FilePreview from '../FilePreview/FilePreview';
import './UploadButton.css';

// Define the component props
interface UploadButtonProps {
  authToken?: string;
  apiUrl?: string;
  sessionID?: string;
  isMediaAccepted?: boolean;
  setDocumentPreviewFiles: (files: { name: string; id: string; content: string; type?: string }[]) => void;
  disabled?: boolean;
}

const meta: Meta<UploadButtonProps> = {
  title: 'Widget/Upload Button',
  component: UploadButton,
  argTypes: {
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    isMediaAccepted: {
      control: {
        type: 'boolean',
      },
    },
    authToken: {
      control: {
        type: 'text',
      },
    },
    apiUrl: {
      control: {
        type: 'text',
      },
    },
    sessionID: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

// Create the template
const Template: Story<UploadButtonProps> = (args) => {
  const [documentPreviewFiles, setDocumentPreviewFiles] = useState<{
    name: string;
    id: string;
    content: string;
    type?: string;
  }[]>([]);

  const removeFile = (id: string) => {
    setDocumentPreviewFiles(prev => prev.filter(file => file.id !== id));
  };

  return (
    <I18nWrapper>
      <div
        style={{
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '20px',
          border: '1px solid #eee',
          borderRadius: '8px',
        }}
      >
        <div style={{ alignSelf: 'flex-end', marginBottom: '20px' }}>
          <UploadButton {...args} setDocumentPreviewFiles={setDocumentPreviewFiles} />
        </div>
        
        {documentPreviewFiles.length > 0 && (
          <div style={{ width: '100%', marginTop: '20px' }}>
            <h3>Uploaded Files</h3>
            <FilePreview 
              previewFiles={documentPreviewFiles} 
              removeFile={removeFile}
            />
          </div>
        )}
      </div>
    </I18nWrapper>
  );
};

// Default state - no auth token, documents only
export const Default = Template.bind({});
Default.args = {
  authToken: '',
  apiUrl: 'https://api.example.com',
  sessionID: 'session-123',
  isMediaAccepted: false,
};

// Authenticated user - can upload documents
export const AuthenticatedDocumentsOnly = Template.bind({});
AuthenticatedDocumentsOnly.args = {
  authToken: 'dummy-auth-token-12345',
  apiUrl: 'https://api.example.com',
  sessionID: 'session-123',
  isMediaAccepted: false,
};

// Authenticated user - can upload documents and images
export const AuthenticatedWithImages = Template.bind({});
AuthenticatedWithImages.args = {
  authToken: 'dummy-auth-token-12345',
  apiUrl: 'https://api.example.com',
  sessionID: 'session-123',
  isMediaAccepted: true,
};

// Not authenticated but media accepted (should show warning for images)
export const UnauthenticatedWithMediaAccepted = Template.bind({});
UnauthenticatedWithMediaAccepted.args = {
  authToken: '',
  apiUrl: 'https://api.example.com',
  sessionID: 'session-123',
  isMediaAccepted: true,
};

// Disabled state
export const Disabled = Template.bind({});
Disabled.args = {
  authToken: 'dummy-auth-token-12345',
  apiUrl: 'https://api.example.com',
  sessionID: 'session-123',
  isMediaAccepted: true,
  disabled: true,
};


// Mobile view simulation
export const MobileView = Template.bind({});
MobileView.args = {
  authToken: 'dummy-auth-token-12345',
  apiUrl: 'https://api.example.com',
  sessionID: 'session-123',
  isMediaAccepted: true,
};
MobileView.parameters = {
  viewport: {
    defaultViewport: 'mobile1',
  },
  docs: {
    description: {
      story: 'A simulation of how the upload button appears on mobile devices.',
    },
  },
};