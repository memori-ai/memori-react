import React from 'react';
import { render } from '@testing-library/react';
import LoginDrawer from './LoginDrawer';
import { tenant, user } from '../../mocks/data';
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

it('renders LoginDrawer closed unchanged', () => {
  const { container } = render(
    <LoginDrawer
      onClose={jest.fn()}
      apiClient={memoriApiClient()}
      tenant={tenant}
      onLogin={jest.fn()}
      onLogout={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders LoginDrawer open unchanged', () => {
  const { container } = render(
    <LoginDrawer
      onClose={jest.fn()}
      apiClient={memoriApiClient()}
      tenant={tenant}
      onLogin={jest.fn()}
      onLogout={jest.fn()}
      open
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders LoginDrawer unlogged unchanged', () => {
  const { container } = render(
    <LoginDrawer
      onClose={jest.fn()}
      apiClient={memoriApiClient()}
      tenant={tenant}
      onLogin={jest.fn()}
      onLogout={jest.fn()}
      open
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders LoginDrawer logged with missing data unchanged', () => {
  const { container } = render(
    <LoginDrawer
      onClose={jest.fn()}
      apiClient={memoriApiClient()}
      tenant={tenant}
      onLogin={jest.fn()}
      onLogout={jest.fn()}
      open
      __TEST__needMissingData
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders LoginDrawer logged in unchanged', () => {
  const { container } = render(
    <LoginDrawer
      onClose={jest.fn()}
      apiClient={memoriApiClient()}
      tenant={tenant}
      onLogin={jest.fn()}
      onLogout={jest.fn()}
      open
      user={user}
      loginToken="token"
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders LoginDrawer on signup unchanged', () => {
  const { container } = render(
    <LoginDrawer
      onClose={jest.fn()}
      apiClient={memoriApiClient()}
      tenant={tenant}
      onLogin={jest.fn()}
      onLogout={jest.fn()}
      __TEST__signup
      open
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders LoginDrawer on signup waiting for otp unchanged', () => {
  const { container } = render(
    <LoginDrawer
      onClose={jest.fn()}
      apiClient={memoriApiClient()}
      tenant={tenant}
      onLogin={jest.fn()}
      onLogout={jest.fn()}
      __TEST__signup
      __TEST__waitingForOtp
      open
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders LoginDrawer on change password unchanged', () => {
  const { container } = render(
    <LoginDrawer
      onClose={jest.fn()}
      apiClient={memoriApiClient()}
      tenant={tenant}
      onLogin={jest.fn()}
      onLogout={jest.fn()}
      __TEST__changePwd
      open
    />
  );
  expect(container).toMatchSnapshot();
});
