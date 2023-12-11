import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import AttachmentLinkModal, { Props } from './AttachmentLinkModal';

import './AttachmentLinkModal.css';

const meta: Meta = {
  title: 'AttachmentLinkModal',
  component: AttachmentLinkModal,
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
  },
};

export default meta;

const Template: Story<Props> = args => (
  <I18nWrapper>
    <AttachmentLinkModal {...args} />
  </I18nWrapper>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  visible: true,
  onCancel: () => {},
  onOk: () => {},
};
