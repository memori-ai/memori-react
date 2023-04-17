import React from 'react';
import { render } from '@testing-library/react';
import Select from './Select';

it('renders Select unchanged', () => {
  const { container } = render(
    <Select
      label="Select me"
      options={[
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
      ]}
      onChange={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Select with placeholder unchanged', () => {
  const { container } = render(
    <Select
      label="Select me"
      placeholder="Select me"
      options={[
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
      ]}
      onChange={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Select with value unchanged', () => {
  const { container } = render(
    <Select
      label="Select me"
      value="2"
      options={[
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
      ]}
      onChange={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders Select disabled unchanged', () => {
  const { container } = render(
    <Select
      label="Select me"
      value="2"
      options={[
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
      ]}
      disabled
      onChange={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
