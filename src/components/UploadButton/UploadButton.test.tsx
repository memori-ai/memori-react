import React from 'react';
import { render } from '@testing-library/react';
import { AlertProvider } from '@memori.ai/ui';
import UploadButton from './UploadButton';

it('renders UploadButton unchanged', () => {
  const { container } = render(
    <AlertProvider>
      <UploadButton setDocumentPreviewFiles={jest.fn()} documentPreviewFiles={[]} />
    </AlertProvider>
  );
  expect(container).toMatchSnapshot();
});

