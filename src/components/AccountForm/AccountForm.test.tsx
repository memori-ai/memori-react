import React from 'react';
import { render } from '@testing-library/react';
import AccountForm from './AccountForm';
import { user } from '../../mocks/data';

beforeEach(() => {
  // @ts-ignore
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
  }));
});

it('renders AccountForm unchanged', () => {
  const { container } = render(
    <AccountForm
      apiUrl="https://backend.memori.ai"
      user={user}
      loginToken="token"
      onUserUpdate={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
