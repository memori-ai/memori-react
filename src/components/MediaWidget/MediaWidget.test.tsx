import React from 'react';
import {
  Medium,
  TranslatedHint,
} from '@memori.ai/memori-api-client/dist/types';
import { render } from '@testing-library/react';
import { medium } from '../../mocks/data';
import MediaWidget from './MediaWidget';

const linkMedium: Medium = {
  mediumID: '95226d7e-7bae-465e-8b80-995587bb5971',
  mimeType: 'text/html',
  title: 'Memori Srl',
  url: 'https://memori.ai/en',
};

const hint: TranslatedHint = {
  text: 'All right',
  originalText: 'Va bene',
};

it('renders MediaWidget as empty unchanged', () => {
  const { container } = render(<MediaWidget />);
  expect(container).toMatchSnapshot();
});

it('renders MediaWidget with links unchanged', () => {
  const { container } = render(<MediaWidget links={[linkMedium]} />);
  expect(container).toMatchSnapshot();
});

it('renders MediaWidget with media unchanged', () => {
  const { container } = render(<MediaWidget media={[medium]} />);
  expect(container).toMatchSnapshot();
});

it('renders MediaWidget with hints unchanged', () => {
  const { container } = render(<MediaWidget hints={[hint]} />);
  expect(container).toMatchSnapshot();
});
