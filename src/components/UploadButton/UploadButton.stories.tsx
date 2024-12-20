import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import UploadButton from './UploadButton';

import './UploadButton.css';

const meta: Meta = {
  title: 'Widget/Upload Button',
  component: UploadButton,
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
        <UploadButton {...args} setPreviewFiles={setPreviewFiles} />
      </div>
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  onUpload: () => {},
  convertapiToken: 'c3lITDU8Pvr1ovTz',
};

export const Disabled = Template.bind({});
Disabled.args = {
  onUpload: () => {},
  convertapiToken: 'c3lITDU8Pvr1ovTz',
  disabled: true,
};
