import React from 'react';
import { render } from '@testing-library/react';
import Drawer from './Drawer';
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

it('renders Drawer unchanged', () => {
  const { container } = render(
    <Drawer open={false} onClose={jest.fn()}>
      {content}
    </Drawer>
  );
  expect(container).toMatchSnapshot();
});

it('renders Drawer open unchanged', () => {
  const { container } = render(
    <Drawer open={true} onClose={jest.fn()}>
      {content}
    </Drawer>
  );
  expect(container).toMatchSnapshot();
});

it('renders Drawer with title unchanged', () => {
  const { container } = render(
    <Drawer open={true} onClose={jest.fn()} title="Lorem ipsum">
      {content}
    </Drawer>
  );
  expect(container).toMatchSnapshot();
});

it('renders Drawer with description unchanged', () => {
  const { container } = render(
    <Drawer
      open={true}
      onClose={jest.fn()}
      description="Lorem ipsum dolor sit amet"
    >
      {content}
    </Drawer>
  );
  expect(container).toMatchSnapshot();
});

it('renders Drawer loading unchanged', () => {
  const { container } = render(
    <Drawer open={true} onClose={jest.fn()} loading>
      {content}
    </Drawer>
  );
  expect(container).toMatchSnapshot();
});

it('renders Drawer with footer unchanged', () => {
  const { container } = render(
    <Drawer open={true} onClose={jest.fn()} footer={footer}>
      {content}
    </Drawer>
  );
  expect(container).toMatchSnapshot();
});

it('renders Drawer non closable unchanged', () => {
  const { container } = render(
    <Drawer open={true} onClose={jest.fn()} closable={false}>
      {content}
    </Drawer>
  );
  expect(container).toMatchSnapshot();
});

it('renders Drawer side left unchanged', () => {
  const { container } = render(
    <Drawer open={true} onClose={jest.fn()} side="left">
      {content}
    </Drawer>
  );
  expect(container).toMatchSnapshot();
});

it('renders Drawer with custom widths unchanged', () => {
  const { container } = render(
    <Drawer
      open={true}
      onClose={jest.fn()}
      width="100%"
      widthMd="90%"
      widthLg="80%"
    >
      {content}
    </Drawer>
  );
  expect(container).toMatchSnapshot();
});
