import React from 'react';
import { render } from '@testing-library/react';
import AttachmentLinkModal from './AttachmentLinkModal';

it('renders AttachmentLinkModal unchanged', () => {
  const { container } = render(
    <AttachmentLinkModal visible onCancel={() => {}} onOk={() => {}} />
  );
  expect(container).toMatchSnapshot();
});
