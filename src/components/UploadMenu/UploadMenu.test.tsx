import React from 'react';
import { render } from '@testing-library/react';
import UploadMenu from './UploadMenu';

it('renders UploadMenu unchanged', () => {
  const { container } = render(
    <UploadMenu setAttachmentsMenuOpen={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});

it('renders UploadMenu disabled unchanged', () => {
  const { container } = render(
    <UploadMenu setAttachmentsMenuOpen={jest.fn()} disabled />
  );
  expect(container).toMatchSnapshot();
});

it('renders UploadMenu on link selected unchanged', () => {
  const { container } = render(
    <UploadMenu attachmentsMenuOpen="link" setAttachmentsMenuOpen={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});

it('renders UploadMenu on media selected unchanged', () => {
  const { container } = render(
    <UploadMenu
      attachmentsMenuOpen="media"
      setAttachmentsMenuOpen={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
