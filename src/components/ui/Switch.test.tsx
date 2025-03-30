import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Switch from './Switch';

describe('Switch Component', () => {
  it('renders Switch unchanged', () => {
    const { container } = render(
      <Switch onChange={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Switch with label unchanged', () => {
    const { container } = render(
      <Switch
        label="Toggle me"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Switch checked unchanged', () => {
    const { container } = render(
      <Switch
        checked={true}
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Switch with defaultChecked unchanged', () => {
    const { container } = render(
      <Switch
        defaultChecked={true}
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Switch disabled unchanged', () => {
    const { container } = render(
      <Switch
        disabled={true}
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Switch disabled and checked unchanged', () => {
    const { container } = render(
      <Switch
        disabled={true}
        checked={true}
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Switch with size small unchanged', () => {
    const { container } = render(
      <Switch
        size="small"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Switch with size large unchanged', () => {
    const { container } = render(
      <Switch
        size="large"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Switch with loading state unchanged', () => {
    const { container } = render(
      <Switch
        loading={true}
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Switch with checkedChildren and unCheckedChildren unchanged', () => {
    const { container } = render(
      <Switch
        checkedChildren="ON"
        unCheckedChildren="OFF"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Switch with data-testid unchanged', () => {
    const { container } = render(
      <Switch
        data-testid="feature-toggle"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('calls onChange when clicked', () => {
    const handleChange = jest.fn();
    render(<Switch onChange={handleChange} data-testid="test-switch" />);
    
    const switchElement = screen.getByTestId('test-switch');
    fireEvent.click(switchElement);
    
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('does not call onChange when disabled', () => {
    const handleChange = jest.fn();
    render(<Switch onChange={handleChange} disabled data-testid="test-switch" />);
    
    const switchElement = screen.getByTestId('test-switch');
    fireEvent.click(switchElement);
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('does not call onChange when loading', () => {
    const handleChange = jest.fn();
    render(<Switch onChange={handleChange} loading data-testid="test-switch" />);
    
    const switchElement = screen.getByTestId('test-switch');
    fireEvent.click(switchElement);
    
    expect(handleChange).not.toHaveBeenCalled();
  });
});