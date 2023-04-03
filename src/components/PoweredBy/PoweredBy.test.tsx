import React from 'react';
import { render } from '@testing-library/react';
import PoweredBy from './PoweredBy';

it('renders PoweredBy unchanged', () => {
  const { container } = render(<PoweredBy />);
  expect(container).toMatchSnapshot();
});
