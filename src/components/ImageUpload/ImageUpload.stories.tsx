import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import ImageUpload, { Props } from './ImageUpload';
import memoriAPIClient from '@memori.ai/memori-api-client';

import './ImageUpload.css';

const client = memoriAPIClient();

const meta: Meta = {
  title: 'ImageUpload',
  component: ImageUpload,
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
  },
};

export default meta;

const Template: Story<Props> = args => (
  <I18nWrapper>
    <ImageUpload {...args} />
  </I18nWrapper>
);
// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  uploadMultipleImages: true,
  uploadUrl: client.backend.getUploadAssetURL(
    'edaf4de9-3e94-4aff-8bee-42c9aa6c7b40',
    '6573844d-a7cd-47ef-9e78-840d82020c21'
  ),
  tenantID: 'app.memorytwin.com',
  uploadMessage: 'Upload',
  onUploadFinished: console.log,
  onFileChanged: console.log,
  onFileNotValid: console.log,
};

export const SingleImage = Template.bind({});
SingleImage.args = {
  ...Default.args,
  uploadMultipleImages: false,
};

export const WithCrop = Template.bind({});
WithCrop.args = {
  ...Default.args,
  useImageCrop: true,
  imageProportions: 1,
  imageProportionsHelper: 'Image proportions squared (1:1)',
};

export const WithMaxSize = Template.bind({});
WithMaxSize.args = {
  ...Default.args,
  maxFileSizeInMB: 1,
};

export const WithMimeType = Template.bind({});
WithMimeType.args = {
  ...Default.args,
  allowedMimeTypes: ['image/png'],
};

export const WithHelper = Template.bind({});
WithHelper.args = {
  ...Default.args,
  showHelper: true,
  additionalHelper: 'Additional helper',
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};
