import React from 'react';
import { render } from '@testing-library/react';
import SignupForm from './SignupForm';
import { tenant } from '../../mocks/data';
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

it('renders SignupForm unchanged', () => {
  const { container } = render(
    <SignupForm
      apiClient={memoriApiClient()}
      tenant={tenant}
      onLogin={jest.fn()}
      goToLogin={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders SignupForm on otp form unchanged', () => {
  const { container } = render(
    <SignupForm
      apiClient={memoriApiClient()}
      tenant={tenant}
      onLogin={jest.fn()}
      goToLogin={jest.fn()}
      __TEST__waitingForOtp
    />
  );
  expect(container).toMatchSnapshot();
});
