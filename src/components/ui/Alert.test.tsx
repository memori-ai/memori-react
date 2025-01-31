import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Alert from './Alert';
import Warning from '../icons/Warning';

beforeEach(() => {
  // Mock IntersectionObserver
  // @ts-ignore
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
  }));

  // Mock setTimeout/clearTimeout
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Alert Component', () => {
  it('renders Alert unchanged', () => {
    const { container } = render(
      <Alert
        open={false}
        onClose={jest.fn()}
        title="Test Alert"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Alert open unchanged', () => {
    const { container } = render(
      <Alert
        open={true}
        onClose={jest.fn()}
        title="Test Alert"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <Alert
        open={true}
        onClose={onClose}
        title="Test Alert"
      />
    );
    
    const closeButton = screen.getByTitle('close');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });


  it('auto-dismisses after duration', () => {
    const onClose = jest.fn();
    render(
      <Alert
        open={true}
        onClose={onClose}
        title="Test Alert"
        duration={3000}
      />
    );

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('renders with custom width', () => {
    const { container } = render(
      <Alert
        open={true}
        onClose={jest.fn()}
        title="Test Alert"
        width="500px"
      />
    );
    
    const style = window.getComputedStyle(container.firstChild as Element);
    expect(style.getPropertyValue('--memori-alert--width')).toBe('500px');
  });

  it('renders with action button', () => {
    const actionClick = jest.fn();
    render(
      <Alert
        open={true}
        onClose={jest.fn()}
        title="Test Alert"
        action={<button onClick={actionClick}>Action</button>}
      />
    );
    
    const actionButton = screen.getByText('Action');
    fireEvent.click(actionButton);
    expect(actionClick).toHaveBeenCalled();
  });

  it('cleans up timer on unmount', () => {
    const onClose = jest.fn();
    const { unmount } = render(
      <Alert
        open={true}
        onClose={onClose}
        title="Test Alert"
        duration={3000}
      />
    );

    unmount();
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});