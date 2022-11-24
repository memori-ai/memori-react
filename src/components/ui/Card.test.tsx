import React from 'react';
import { render } from '@testing-library/react';
import Card from './Card';

it('renders Card unchanged', () => {
  const { container } = render(<Card />);
  expect(container).toMatchSnapshot();
});

it('renders Card with title unchanged', () => {
  const { container } = render(<Card title="Card title" />);
  expect(container).toMatchSnapshot();
});

it('renders Card with description unchanged', () => {
  const { container } = render(<Card description="Card description" />);
  expect(container).toMatchSnapshot();
});

it('renders Card with cover unchanged', () => {
  const { container } = render(<Card cover={<img src="#" alt="" />} />);
  expect(container).toMatchSnapshot();
});

it('renders Card with children unchanged', () => {
  const { container } = render(
    <Card>
      <p>Ciao</p>
    </Card>
  );
  expect(container).toMatchSnapshot();
});

it('renders Card loading unchanged', () => {
  const { container } = render(<Card title="Card title" loading />);
  expect(container).toMatchSnapshot();
});

it('renders Card with custom CSS class unchanged', () => {
  const { container } = render(<Card className="lorem-ipsum" />);
  expect(container).toMatchSnapshot();
});

it('renders Card hoverable unchanged', () => {
  const { container } = render(<Card title="lorem-ipsum" hoverable />);
  expect(container).toMatchSnapshot();
});
