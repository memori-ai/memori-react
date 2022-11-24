import React from 'react';
import { Medium } from '@memori.ai/memori-api-client/dist/types';
import { render } from '@testing-library/react';
import LinkItemWidget from './LinkItemWidget';

const linkMedium: Medium = {
  mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
  mimeType: 'text/html',
  title: 'Memori Srl',
  url: 'https://memori.ai/en',
};

it('renders LinkItemWidget unchanged', () => {
  const { container } = render(<LinkItemWidget items={[linkMedium]} />);
  expect(container).toMatchSnapshot();
});

it('renders LinkItemWidget unchanged with no media', () => {
  const { container } = render(<LinkItemWidget items={[]} />);
  expect(container).toMatchSnapshot();
});

it('renders LinkItemWidget unchanged with baseUrl', () => {
  const { container } = render(<LinkItemWidget items={[linkMedium]} />);
  expect(container).toMatchSnapshot();
});

it('renders LinkItemWidget unchanged with description oneline', () => {
  const { container } = render(
    <LinkItemWidget items={[linkMedium]} descriptionOneLine />
  );
  expect(container).toMatchSnapshot();
});
