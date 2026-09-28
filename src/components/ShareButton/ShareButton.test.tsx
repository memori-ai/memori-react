import React from 'react';
import { render, screen } from '../../testUtils';
import ShareButton from './ShareButton';
import { tenant, memori, sessionID } from '../../mocks/data';

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

it('renders ShareButton with share chat unchanged', () => {
  const { container } = render(
    <ShareButton memori={memori} sessionID={sessionID} />
  );
  expect(container).toMatchSnapshot();
});

it('renders an inline share list for the mobile share page', () => {
  const { container } = render(
    <ShareButton renderMode="inline" url="https://memori.ai" />
  );

  expect(
    container.querySelector('.memori-share-button--inline-list')
  ).toBeTruthy();
  expect(
    container.querySelector('.memori-share-button--dropdown-section-social')
  ).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Facebook' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Email' })).toBeTruthy();
});