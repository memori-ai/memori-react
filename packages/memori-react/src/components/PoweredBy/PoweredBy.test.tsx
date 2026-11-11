import React from 'react';
import { render } from '@testing-library/react';
import PoweredBy from './PoweredBy';

it('renders PoweredBy unchanged', () => {
  const { container } = render(<PoweredBy />);
  expect(container).toMatchSnapshot();
});

it('renders PoweredBy with data unchanged', () => {
  const { container } = render(
    <PoweredBy integrationID="abc" memoriHash="tenant-owner-memori" />
  );
  expect(container).toMatchSnapshot();
});
