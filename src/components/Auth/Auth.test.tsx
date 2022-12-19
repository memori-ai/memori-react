import React from 'react';
import { render } from '@testing-library/react';
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
