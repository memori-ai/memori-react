import React from 'react';
import { render } from '@testing-library/react';
import Spin from './Spin';

const content = (
  <>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <h2>Suspendisse a sodales nulla, sed semper nisi.</h2>
    <p>Proin tincidunt enim in felis aliquet, a ultricies purus bibendum.</p>
    <ul>
      <li>Quisque in ultrices lectus.</li>
      <li>Quisque in ultrices lectus.</li>
      <li>Quisque in ultrices lectus.</li>
    </ul>
    <p>Nulla at urna diam.</p>
  </>
);

it('renders Spin unchanged', () => {
  const { container } = render(<Spin>{content}</Spin>);
  expect(container).toMatchSnapshot();
});

it('renders Spin spinning unchanged', () => {
  const { container } = render(<Spin spinning>{content}</Spin>);
  expect(container).toMatchSnapshot();
});

it('renders Spin with custom className unchanged', () => {
  const { container } = render(<Spin className="lorem-ipsum">{content}</Spin>);
  expect(container).toMatchSnapshot();
});

it('renders Spin spinning primary unchanged', () => {
  const { container } = render(
    <Spin spinning primary>
      {content}
    </Spin>
  );
  expect(container).toMatchSnapshot();
});
