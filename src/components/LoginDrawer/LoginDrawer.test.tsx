import { render } from '@testing-library/react';
import LoginDrawer from './LoginDrawer';
import React from 'react';
import { tenant, expertReference, user } from '../../mocks/data';

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
      apiUrl="https://backend.memori.ai"
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
      apiUrl="https://backend.memori.ai"
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
      apiUrl="https://backend.memori.ai"
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
      apiUrl="https://backend.memori.ai"
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
      apiUrl="https://backend.memori.ai"
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
