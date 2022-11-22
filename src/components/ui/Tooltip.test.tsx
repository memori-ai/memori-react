import React from 'react';
import { render } from '@testing-library/react';
import Tooltip from './Tooltip';

it('renders Tooltip unchanged', () => {
  const { container } = render(
    <Tooltip content="Here is some tooltip content">Hover me</Tooltip>
  );
  expect(container).toMatchSnapshot();
});

it('renders Tooltip with jsx content unchanged', () => {
  const { container } = render(
    <Tooltip
      content={
        <p>
          Here we have some JSX, useful for <a href="#">links</a>, for example.
        </p>
      }
    >
      Hover me
    </Tooltip>
  );
  expect(container).toMatchSnapshot();
});

it('renders Tooltip disabled unchanged', () => {
  const { container } = render(
    <Tooltip content="Here is some tooltip content but I am disabled" disabled>
      Hover me
    </Tooltip>
  );
  expect(container).toMatchSnapshot();
});
