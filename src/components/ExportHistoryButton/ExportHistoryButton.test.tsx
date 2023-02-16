import React from 'react';
import { render } from '@testing-library/react';
import ExportHistoryButton from './ExportHistoryButton';
import { memori, history } from '../../mocks/data';
import Download from '../icons/Download';

import './ExportHistoryButton.css';

it('renders ExportHistoryButton unchanged', () => {
  const { container } = render(
    <ExportHistoryButton memori={memori} history={[]} />
  );
  expect(container).toMatchSnapshot();
});

it('renders ExportHistoryButton unchanged with history', () => {
  const { container } = render(
    <ExportHistoryButton memori={memori} history={history} />
  );
  expect(container).toMatchSnapshot();
});

it('renders ExportHistoryButton unchanged with className', () => {
  const { container } = render(
    <ExportHistoryButton memori={memori} history={[]} className="test" />
  );
  expect(container).toMatchSnapshot();
});

it('renders ExportHistoryButton unchanged disabled', () => {
  const { container } = render(
    <ExportHistoryButton memori={memori} history={[]} disabled />
  );
  expect(container).toMatchSnapshot();
});

it('renders ExportHistoryButton unchanged with custom icon', () => {
  const { container } = render(
    <ExportHistoryButton
      memori={memori}
      history={history}
      icon={<Download />}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ExportHistoryButton unchanged with custom button props', () => {
  const { container } = render(
    <ExportHistoryButton
      memori={memori}
      history={history}
      icon={<Download />}
      buttonClassName="test"
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ExportHistoryButton unchanged with custom filename', () => {
  const { container } = render(
    <ExportHistoryButton
      memori={memori}
      history={[]}
      filename="awanagana.txt"
    />
  );
  expect(container).toMatchSnapshot();
});
