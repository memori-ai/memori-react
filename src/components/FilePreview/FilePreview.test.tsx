import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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

it('opens the document preview with a wrapping title and rendered markdown', () => {
  render(
    <FilePreview
      previewFiles={[
        {
          name: 'artifact-targeted-edits.md',
          id: '1',
          mimeType: 'text/markdown',
          type: 'document',
          content:
            '# Artifact Targeted Edits\n\nEliminare (`cambia questa frase`).',
        },
      ]}
      removeFile={jest.fn()}
    />
  );

  fireEvent.click(screen.getByLabelText('artifact-targeted-edits.md'));

  expect(
    document.querySelector('.memori-content-preview-modal--heading-title')
  ).toHaveTextContent('artifact-targeted-edits.md');
  expect(
    screen.getByRole('heading', { name: 'Artifact Targeted Edits' })
  ).toBeInTheDocument();
  const inlineCode = screen.getByText('cambia questa frase');
  expect(inlineCode.tagName).toBe('CODE');
});
