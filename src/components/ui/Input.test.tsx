import React from 'react';
import { render, screen } from '@testing-library/react';
import Input from './Input';

describe('Input Component', () => {
  it('renders Input unchanged', () => {
    const { container } = render(
      <Input
        name="test-input"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Input with label unchanged', () => {
    const { container } = render(
      <Input
        label="Input Label"
        name="test-input"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Input with placeholder unchanged', () => {
    const { container } = render(
      <Input
        placeholder="Enter text here"
        name="test-input"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Input with value unchanged', () => {
    const { container } = render(
      <Input
        value="Test Value"
        name="test-input"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Input with prefix unchanged', () => {
    const { container } = render(
      <Input
        prefix={<span data-testid="prefix-icon">@</span>}
        name="test-input"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Input with suffix unchanged', () => {
    const { container } = render(
      <Input
        suffix={<span data-testid="suffix-icon">%</span>}
        name="test-input"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Input with addonBefore unchanged', () => {
    const { container } = render(
      <Input
        addonBefore="https://"
        name="test-input"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Input with addonAfter unchanged', () => {
    const { container } = render(
      <Input
        addonAfter=".com"
        name="test-input"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Input with allowClear unchanged', () => {
    const { container } = render(
      <Input
        value="Clear me"
        allowClear
        name="test-input"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders disabled Input unchanged', () => {
    const { container } = render(
      <Input
        value="Disabled input"
        disabled
        name="test-input"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders password Input unchanged', () => {
    const { container } = render(
      <Input
        type="password"
        value="password123"
        name="test-input"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders search Input unchanged', () => {
    const { container } = render(
      <Input
        type="search"
        placeholder="Search..."
        name="test-input"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders complete example unchanged', () => {
    const { container } = render(
      <Input
        label="Search"
        type="search"
        name="query"
        allowClear
        placeholder="Search by name"
        prefix={<span>🔍</span>}
        addonAfter={<button>Search</button>}
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });
});