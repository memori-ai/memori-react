import React from 'react';
import { render } from '@testing-library/react';
import Button from './Button';
import Loading from '../icons/Loading';

it('renders empty Button unchanged', () => {
  const { container } = render(<Button />);
  expect(container).toMatchSnapshot();
});

it('renders Button unchanged', () => {
  const { container } = render(<Button>Click me</Button>);
  expect(container).toMatchSnapshot();
});

it('renders Button primary unchanged', () => {
  const { container } = render(<Button primary>Click me</Button>);
  expect(container).toMatchSnapshot();
});

it('renders Button outlined unchanged', () => {
  const { container } = render(<Button outlined>Click me</Button>);
  expect(container).toMatchSnapshot();
});

it('renders Button padded unchanged', () => {
  const { container } = render(<Button padded>Click me</Button>);
  expect(container).toMatchSnapshot();
});

it('renders Button block unchanged', () => {
  const { container } = render(<Button block>Click me</Button>);
  expect(container).toMatchSnapshot();
});

it('renders Button with icon unchanged', () => {
  const { container } = render(<Button icon={<Loading />}>Click me</Button>);
  expect(container).toMatchSnapshot();
});

it('renders Button with icon only unchanged', () => {
  const { container } = render(<Button icon={<Loading />} />);
  expect(container).toMatchSnapshot();
});

it('renders Button danger unchanged', () => {
  const { container } = render(<Button danger>Click me</Button>);
  expect(container).toMatchSnapshot();
});

it('renders Button loading unchanged', () => {
  const { container } = render(<Button loading>Click me</Button>);
  expect(container).toMatchSnapshot();
});

it('renders Button disabled unchanged', () => {
  const { container } = render(<Button disabled>Click me</Button>);
  expect(container).toMatchSnapshot();
});

it('renders Button with title unchanged', () => {
  const { container } = render(<Button title="Button title">Click me</Button>);
  expect(container).toMatchSnapshot();
});

it('renders Button square unchanged', () => {
  const { container } = render(<Button shape="square">Click me</Button>);
  expect(container).toMatchSnapshot();
});

it('renders Button circle unchanged', () => {
  const { container } = render(<Button shape="circle" icon={<Loading />} />);
  expect(container).toMatchSnapshot();
});
