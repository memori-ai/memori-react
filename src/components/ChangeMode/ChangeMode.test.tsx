import React from 'react';
import { render } from '@testing-library/react';
import ChangeMode from './ChangeMode';

it('renders ChangeMode in test mode unchanged', () => {
  const { container } = render(
    <ChangeMode instruct={false} onChangeMode={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});

it('renders ChangeMode in instruct mode unchanged', () => {
  const { container } = render(
    <ChangeMode instruct={true} onChangeMode={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});
