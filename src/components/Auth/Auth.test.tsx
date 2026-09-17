import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Auth from './Auth';

it('renders Auth unchanged', () => {
  const { container } = render(
    <Auth
      pwdOrTokens="password"
      setPwdOrTokens={() => {}}
      minimumNumberOfRecoveryTokens={2}
      showTokens={false}
      onFinish={() => Promise.resolve()}
      withModal={false}
      openModal
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Auth with tokens unchanged', () => {
  const { container } = render(
    <Auth
      pwdOrTokens="password"
      setPwdOrTokens={() => {}}
      minimumNumberOfRecoveryTokens={2}
      showTokens={true}
      onFinish={() => Promise.resolve()}
      withModal={false}
      openModal
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Auth on tokens unchanged', () => {
  const { container } = render(
    <Auth
      pwdOrTokens="tokens"
      setPwdOrTokens={() => {}}
      minimumNumberOfRecoveryTokens={2}
      showTokens={true}
      onFinish={() => Promise.resolve()}
      withModal={false}
      openModal
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Auth with modal unchanged', () => {
  const { container } = render(
    <Auth
      pwdOrTokens="password"
      setPwdOrTokens={() => {}}
      minimumNumberOfRecoveryTokens={2}
      showTokens={true}
      onFinish={() => Promise.resolve()}
      withModal={true}
      openModal
    />
  );
  expect(container).toMatchSnapshot();
});

it('submits the password via onFinish', async () => {
  const onFinish = jest.fn().mockResolvedValue(undefined);
  const { container } = render(
    <Auth
      pwdOrTokens="password"
      setPwdOrTokens={() => {}}
      showTokens={false}
      onFinish={onFinish}
      withModal={false}
      openModal
    />
  );

  const input = container.querySelector('#auth-password') as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'secret-pin' } });
  fireEvent.click(screen.getByRole('button', { name: 'confirm' }));

  await waitFor(() => {
    expect(onFinish).toHaveBeenCalledWith(
      expect.objectContaining({ password: 'secret-pin' })
    );
  });
});

it('shows a visible error when credentials are invalid', async () => {
  const onFinish = jest.fn().mockRejectedValue(new Error('AUTH_FAILED'));
  const { container } = render(
    <Auth
      pwdOrTokens="password"
      setPwdOrTokens={() => {}}
      showTokens={false}
      onFinish={onFinish}
      withModal={false}
      openModal
    />
  );

  const input = container.querySelector('#auth-password') as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'wrong' } });
  fireEvent.click(screen.getByRole('button', { name: 'confirm' }));

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'auth.invalidCredentials'
  );
});

it('shows a visible error when password is missing', async () => {
  const onFinish = jest.fn();
  const { container } = render(
    <Auth
      pwdOrTokens="password"
      setPwdOrTokens={() => {}}
      showTokens={false}
      onFinish={onFinish}
      withModal={false}
      openModal
    />
  );

  fireEvent.click(screen.getByRole('button', { name: 'confirm' }));

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'auth.passwordRequired'
  );
  expect(onFinish).not.toHaveBeenCalled();
});
