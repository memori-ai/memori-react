import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import UploadMenu, { Props } from './UploadMenu';

import './UploadMenu.css';

const meta: Meta = {
  title: 'Widget/Upload Menu',
  component: UploadMenu,
  argTypes: {
    attachmentsMenuOpen: {
      control: {
        type: 'select',
        options: ['link', 'media'],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => {
  const [attachmentsMenuOpen, setAttachmentsMenuOpen] = useState<
    'link' | 'media' | undefined
  >(args.attachmentsMenuOpen);
  return (
    <I18nWrapper>
      <div
        style={{
          minHeight: '200px',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <UploadMenu
          {...args}
          attachmentsMenuOpen={attachmentsMenuOpen}
          setAttachmentsMenuOpen={setAttachmentsMenuOpen}
        />
      </div>
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  attachmentsMenuOpen: undefined,
};

export const Disabled = Template.bind({});
Disabled.args = {
  attachmentsMenuOpen: undefined,
  disabled: true,
};

export const Authenticated = Template.bind({});
Authenticated.args = {
  attachmentsMenuOpen: undefined,
  authToken: 'test',
};
