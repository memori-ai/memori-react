import { render } from '@testing-library/react';
import ExpertsDrawer from './ExpertsDrawer';
import React from 'react';
import { tenant, expertReference } from '../../mocks/data';

beforeEach(() => {
  // @ts-ignore
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
  }));
});

it('renders ExpertsDrawer unchanged', () => {
  const { container } = render(
    <ExpertsDrawer
      onClose={jest.fn()}
      baseUrl="https://aisuru.com"
      apiUrl="https://backend.memori.ai"
      tenant={tenant}
      experts={[
        expertReference,
        {
          ...expertReference,
          expertID: '2',
        },
      ]}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ExpertsDrawer open unchanged', () => {
  const { container } = render(
    <ExpertsDrawer
      open
      onClose={jest.fn()}
      baseUrl="https://aisuru.com"
      apiUrl="https://backend.memori.ai"
      tenant={tenant}
      experts={[
        expertReference,
        {
          ...expertReference,
          expertID: '2',
        },
      ]}
    />
  );
  expect(container).toMatchSnapshot();
});
