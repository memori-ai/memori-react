import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import FilePreview from './FilePreview';

import './FilePreview.css';

const meta: Meta = {
  title: 'Widget/File Preview',
  component: FilePreview,
  argTypes: {
    disabled: {
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};


type Props = {
  onUpload: (text: string) => void;
  convertapiToken: string;
};

export default meta;

const Template: Story<Props> = args => {
    const [previewFiles, setPreviewFiles] = useState<{ name: string; id: string; content: string; }[]>([]);

  return (
    <I18nWrapper>
      <div
        style={{
          minHeight: '200px',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <FilePreview {...args} previewFiles={previewFiles} removeFile={
            (id: string) => {
                setPreviewFiles(previewFiles.filter(file => file.id !== id));
            }
        } />
      </div>
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  onUpload: () => {},
  convertapiToken: '',
};

export const Disabled = Template.bind({});
Disabled.args = {
  onUpload: () => {},
  convertapiToken: '',
  disabled: true,
};
