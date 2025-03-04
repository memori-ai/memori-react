import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDialog from './ConfirmDialog';

beforeEach(() => {
  // @ts-ignore
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
  }));
});

it('renders ConfirmDialog unchanged', () => {
  const { container } = render(
    <ConfirmDialog
      isOpen={false}
      onClose={jest.fn()}
      onConfirm={jest.fn()}
      title="Test Title"
      message="Test Message"
      confirmText="Confirm"
      cancelText="Cancel"
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ConfirmDialog open unchanged', () => {
  const { container } = render(
    <ConfirmDialog
      isOpen={true}
      onClose={jest.fn()}
      onConfirm={jest.fn()}
      title="Test Title"
      message="Test Message"
      confirmText="Confirm"
      cancelText="Cancel"
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ConfirmDialog with custom title unchanged', () => {
  const { container } = render(
    <ConfirmDialog
      isOpen={true}
      onClose={jest.fn()}
      onConfirm={jest.fn()}
      title="Custom Title"
      message="Test Message"
      confirmText="Confirm"
      cancelText="Cancel"
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ConfirmDialog with custom message unchanged', () => {
  const { container } = render(
    <ConfirmDialog
      isOpen={true}
      onClose={jest.fn()}
      onConfirm={jest.fn()}
      title="Test Title"
      message="Custom confirmation message for testing purposes"
      confirmText="Confirm"
      cancelText="Cancel"
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ConfirmDialog with custom button text unchanged', () => {
  const { container } = render(
    <ConfirmDialog
      isOpen={true}
      onClose={jest.fn()}
      onConfirm={jest.fn()}
      title="Test Title"
      message="Test Message"
      confirmText="Yes, proceed"
      cancelText="No, go back"
    />
  );
  expect(container).toMatchSnapshot();
});

it('calls onClose when cancel button is clicked', () => {
  const onCloseMock = jest.fn();
  render(
    <ConfirmDialog
      isOpen={true}
      onClose={onCloseMock}
      onConfirm={jest.fn()}
      title="Test Title"
      message="Test Message"
      confirmText="Confirm"
      cancelText="Cancel"
    />
  );
  
  fireEvent.click(screen.getByText('Cancel'));
  expect(onCloseMock).toHaveBeenCalledTimes(1);
});

it('calls onConfirm when confirm button is clicked', () => {
  const onConfirmMock = jest.fn();
  render(
    <ConfirmDialog
      isOpen={true}
      onClose={jest.fn()}
      onConfirm={onConfirmMock}
      title="Test Title"
      message="Test Message"
      confirmText="Confirm"
      cancelText="Cancel"
    />
  );
  
  fireEvent.click(screen.getByText('Confirm'));
  expect(onConfirmMock).toHaveBeenCalledTimes(1);
});