import React from 'react';
import { Meta, Story } from '@storybook/react';
import AttachmentMediaModal, { Props } from './AttachmentMediaModal';
import memoriAPIClient from '@memori.ai/memori-api-client';
import { Asset } from '@memori.ai/memori-api-client/dist/types';

const client = memoriAPIClient();

const meta: Meta = {
  title: 'AttachmentMediaModal',
  component: AttachmentMediaModal,
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
  },
};

export default meta;

const Template: Story<Props> = args => <AttachmentMediaModal {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  visible: true,
  uploadAssetURL: client.backend.getUploadAssetURL(
    'edaf4de9-3e94-4aff-8bee-42c9aa6c7b40',
    '6573844d-a7cd-47ef-9e78-840d82020c21'
  ),
  sessionID: 'edaf4de-3e94-4aff-8bee-42c9aa6c7b41',
  authToken: 'edaf4de-3e94-4aff-8bee-42c9aa6c7b42',
  tenantID: 'app.memorytwin.com',
  deleteAsset: (_token: string, _assetURL: string) =>
    Promise.resolve({
      resultCode: 0,
      resultMessage: 'OK',
      requestID: 'edaf4de9-3e94-4aff-8bee-42c9aa6c7b43',
      requestDateTime: '2021-05-05T12:00:00.000Z',
    }),
  onCancel: () => {},
  onOk: (_asset: Asset) => Promise.resolve(),
};
