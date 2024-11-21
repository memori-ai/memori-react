import React from 'react';
import { render } from '@testing-library/react';
import AccountForm from './AccountForm';
import { user } from '../../mocks/data';
import memoriApiClient from '@memori.ai/memori-api-client';

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
      apiClient={memoriApiClient()}
      user={user}
      loginToken="token"
      onUserUpdate={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
