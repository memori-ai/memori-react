import React from 'react';
import { render } from '@testing-library/react';
import SendOnEnterMenu from './SendOnEnterMenu';

it('renders SendOnEnterMenu on click unchanged', () => {
  const { container } = render(
    <SendOnEnterMenu sendOnEnter="click" setSendOnEnter={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});

it('renders SendOnEnterMenu on keypress unchanged', () => {
  const { container } = render(
    <SendOnEnterMenu sendOnEnter="keypress" setSendOnEnter={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});
