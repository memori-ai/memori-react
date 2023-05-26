import React from 'react';
import { render } from '@testing-library/react';
import Tooltip from './Tooltip';

it('renders Tooltip unchanged', () => {
  const { container } = render(
    <Tooltip content="Here is some tooltip content">Hover me</Tooltip>
  );
  expect(container).toMatchSnapshot();
});

it('renders Tooltip with jsx content unchanged', () => {
  const { container } = render(
    <Tooltip
      content={
        <p>
          Here we have some JSX, useful for
          <a href="https://memori.ai" rel="noopener noreferrer" target="_blank">
            links
          </a>
          , for example.
        </p>
      }
    >
      Hover me
    </Tooltip>
  );
  expect(container).toMatchSnapshot();
});

it('renders Tooltip disabled unchanged', () => {
  const { container } = render(
    <Tooltip content="Here is some tooltip content but I am disabled" disabled>
      Hover me
    </Tooltip>
  );
  expect(container).toMatchSnapshot();
});

it('renders Tooltip visible unchanged', () => {
  const { container } = render(
    <Tooltip
      content="Here is some tooltip content by default as I am controlled"
      visible
    >
      Hover me
    </Tooltip>
  );
  expect(container).toMatchSnapshot();
});

it('renders Tooltip aligned left unchanged', () => {
  const { container } = render(
    <Tooltip
      content="Here is some tooltip content by default as I am controlled"
      visible
      align="left"
    >
      Hover me
    </Tooltip>
  );
  expect(container).toMatchSnapshot();
});

it('renders Tooltip aligned top left unchanged', () => {
  const { container } = render(
    <Tooltip
      content="Here is some tooltip content by default as I am controlled"
      visible
      align="topLeft"
    >
      Hover me
    </Tooltip>
  );
  expect(container).toMatchSnapshot();
});

it('renders Tooltip aligned right unchanged', () => {
  const { container } = render(
    <Tooltip
      content="Here is some tooltip content by default as I am controlled"
      visible
      align="right"
    >
      Hover me
    </Tooltip>
  );
  expect(container).toMatchSnapshot();
});

it('renders Tooltip aligned top right unchanged', () => {
  const { container } = render(
    <Tooltip
      content="Here is some tooltip content by default as I am controlled"
      visible
      align="topRight"
    >
      Hover me
    </Tooltip>
  );
  expect(container).toMatchSnapshot();
});
