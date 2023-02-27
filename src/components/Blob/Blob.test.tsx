import React from 'react';
import { render } from '@testing-library/react';
import Blob from './Blob';

it('renders Blob unchanged', () => {
  const { container } = render(<Blob />);
  expect(container).toMatchSnapshot();
});

it('renders Blob speaking unchanged', () => {
  const { container } = render(<Blob speaking />);
  expect(container).toMatchSnapshot();
});

it('renders Blob with avatar unchanged', () => {
  const { container } = render(<Blob avatar="/images/logo.png" />);
  expect(container).toMatchSnapshot();
});
