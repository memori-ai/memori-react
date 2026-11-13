import React from 'react';
import { render } from '../../testUtils';
import LoginModal from './LoginModal';
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

const baseProps = {
  onClose: jest.fn(),
  apiClient: memoriApiClient(),
  tenant,
  onLogin: jest.fn(),
  setUser: jest.fn(),
  onLogout: jest.fn(),
  memoriName: 'Layout Storybook',
};

it('renders LoginModal closed unchanged', () => {
  const { container } = render(<LoginModal {...baseProps} />);
  expect(container).toMatchSnapshot();
});

it('renders LoginModal open unchanged', () => {
  const { container } = render(<LoginModal {...baseProps} open />);
  expect(container).toMatchSnapshot();
});

it('renders LoginModal unlogged unchanged', () => {
  const { container } = render(<LoginModal {...baseProps} open />);
  expect(container).toMatchSnapshot();
});

it('renders LoginModal logged with missing data unchanged', () => {
  const { container } = render(
    <LoginModal {...baseProps} open __TEST__needMissingData />
  );
  expect(container).toMatchSnapshot();
});

it('renders LoginModal logged in unchanged', () => {
  const { container } = render(
    <LoginModal {...baseProps} open user={user} loginToken="token" />
  );
  expect(container).toMatchSnapshot();
});

it('renders LoginModal on signup unchanged', () => {
  const { container } = render(
    <LoginModal {...baseProps} __TEST__signup open />
  );
  expect(container).toMatchSnapshot();
});

it('renders LoginModal with OTP form unchanged', () => {
  const { container } = render(<LoginModal {...baseProps} open />);
  expect(container).toMatchSnapshot();
});
