import React from 'react';
import { render } from '@testing-library/react';
import Modal from './Modal';
import Button from './Button';

const content = (
  <>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <h3>Suspendisse a sodales nulla, sed semper nisi.</h3>
    <p>Proin tincidunt enim in felis aliquet, a ultricies purus bibendum.</p>
    <ul>
      <li>Quisque in ultrices lectus.</li>
      <li>Quisque in ultrices lectus.</li>
      <li>Quisque in ultrices lectus.</li>
    </ul>
    <p>Nulla at urna diam.</p>
  </>
);

const footer = (
  <>
    <Button primary>Ok</Button>
    <Button>Cancel</Button>
  </>
);

beforeEach(() => {
  // @ts-ignore
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
  }));
});

it('renders Modal unchanged', () => {
  const { container } = render(
    <Modal open={false} onClose={jest.fn()}>
      {content}
    </Modal>
  );
  expect(container).toMatchSnapshot();
});

it('renders Modal open unchanged', () => {
  const { container } = render(
    <Modal open={true} onClose={jest.fn()}>
      {content}
    </Modal>
  );
  expect(container).toMatchSnapshot();
});

it('renders Modal with title unchanged', () => {
  const { container } = render(
    <Modal open={true} onClose={jest.fn()} title="Lorem ipsum">
      {content}
    </Modal>
  );
  expect(container).toMatchSnapshot();
});

it('renders Modal with description unchanged', () => {
  const { container } = render(
    <Modal
      open={true}
      onClose={jest.fn()}
      description="Lorem ipsum dolor sit amet"
    >
      {content}
    </Modal>
  );
  expect(container).toMatchSnapshot();
});

it('renders Modal loading unchanged', () => {
  const { container } = render(
    <Modal open={true} onClose={jest.fn()} loading>
      {content}
    </Modal>
  );
  expect(container).toMatchSnapshot();
});

it('renders Modal with footer unchanged', () => {
  const { container } = render(
    <Modal open={true} onClose={jest.fn()} footer={footer}>
      {content}
    </Modal>
  );
  expect(container).toMatchSnapshot();
});

it('renders Modal non closable unchanged', () => {
  const { container } = render(
    <Modal open={true} onClose={jest.fn()} closable={false}>
      {content}
    </Modal>
  );
  expect(container).toMatchSnapshot();
});
