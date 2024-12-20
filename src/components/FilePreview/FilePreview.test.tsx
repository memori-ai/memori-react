import React from 'react';
import { render } from '@testing-library/react';
import FilePreview from './FilePreview';

it('renders FilePreview unchanged', () => {
  const { container } = render(
    <FilePreview previewFiles={[]} removeFile={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});

it('renders FilePreview with one file', () => {
  const { container } = render(
    <FilePreview previewFiles={[{ name: 'test.pdf', id: '1', content: 'test' }]} removeFile={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});


it('renders FilePreview with two files', () => {
  const { container } = render(
    <FilePreview previewFiles={[{ name: 'test.pdf', id: '1', content: 'test' }, { name: 'test.pdf', id: '2', content: 'test' }]} removeFile={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});

