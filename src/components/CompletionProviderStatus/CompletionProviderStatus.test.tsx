import React from 'react';
import { render } from '@testing-library/react';
import CompletionProviderStatus from './CompletionProviderStatus';

it('renders CompletionProviderStatus unchanged', () => {
  const { container } = render(<CompletionProviderStatus forceStatus="none" />);
  expect(container).toMatchSnapshot();
});

it('renders CompletionProviderStatus errored unchanged', () => {
  const { container } = render(
    <CompletionProviderStatus forceStatus="major" />
  );
  expect(container).toMatchSnapshot();
});

it('renders CompletionProviderStatus with provider specified unchanged', () => {
  const { container } = render(
    <CompletionProviderStatus provider="OpenAI" forceStatus="none" />
  );
  expect(container).toMatchSnapshot();
});

it('renders CompletionProviderStatus errored with provider specified unchanged', () => {
  const { container } = render(
    <CompletionProviderStatus provider="OpenAI" forceStatus="major" />
  );
  expect(container).toMatchSnapshot();
});
