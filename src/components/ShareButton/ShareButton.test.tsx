import React from 'react';
import { render } from '@testing-library/react';
import ShareButton from './ShareButton';
import { tenant } from '../../mocks/data';

it('renders ShareButton unchanged', () => {
  const { container } = render(<ShareButton />);
  expect(container).toMatchSnapshot();
});

it('renders ShareButton with url unchanged', () => {
  const { container } = render(<ShareButton url="https://memori.ai" />);
  expect(container).toMatchSnapshot();
});

it('renders ShareButton with title unchanged', () => {
  const { container } = render(<ShareButton title="Lorem ipsum" />);
  expect(container).toMatchSnapshot();
});

it('renders ShareButton with button not primary unchanged', () => {
  const { container } = render(<ShareButton primary={false} />);
  expect(container).toMatchSnapshot();
});

it('renders ShareButton without qr code unchanged', () => {
  const { container } = render(<ShareButton showQrCode={false} />);
  expect(container).toMatchSnapshot();
});

it('renders ShareButton aligned left unchanged', () => {
  const { container } = render(<ShareButton align="left" />);
  expect(container).toMatchSnapshot();
});

it('renders ShareButton with tenant img set unchanged', () => {
  const { container } = render(<ShareButton tenant={tenant} />);
  expect(container).toMatchSnapshot();
});

it('renders ShareButton with other tenant img set unchanged', () => {
  const { container } = render(
    <ShareButton tenant={{ ...tenant, theme: 'tailoor' }} />
  );
  expect(container).toMatchSnapshot();
});
