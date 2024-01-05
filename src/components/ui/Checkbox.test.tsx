import React from 'react';
import { render } from '@testing-library/react';
import Checkbox from './Checkbox';

it('renders Checkbox unchanged', () => {
  const { container } = render(<Checkbox label="Check me" />);
  expect(container).toMatchSnapshot();
});

it('renders Checkbox checked unchanged', () => {
  const { container } = render(<Checkbox label="Check me" checked />);
  expect(container).toMatchSnapshot();
});

it('renders Checkbox disabled unchanged', () => {
  const { container } = render(<Checkbox label="Check me" disabled />);
  expect(container).toMatchSnapshot();
});

it('renders Checkbox checked and disabled unchanged', () => {
  const { container } = render(<Checkbox label="Check me" checked disabled />);
  expect(container).toMatchSnapshot();
});

it('renders Checkbox indeterminate unchanged', () => {
  const { container } = render(<Checkbox label="Check me" indeterminate />);
  expect(container).toMatchSnapshot();
});
