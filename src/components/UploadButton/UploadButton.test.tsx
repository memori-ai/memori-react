import React from 'react';
import { render } from '@testing-library/react';
import UploadButton from './UploadButton';

it('renders UploadButton unchanged', () => {
  const { container } = render(
    <UploadButton setDocumentPreviewFiles={jest.fn()} documentPreviewFiles={[]} />
  );
  expect(container).toMatchSnapshot();
});

