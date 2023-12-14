import { render } from '@testing-library/react';
import DateSelector from './DateSelector';
import { DateTime } from 'luxon';

const dateMock = new Date(Date.UTC(2022, 8, 24, 0, 0, 0, 0));

jest.setSystemTime(dateMock);
Date.now = jest.fn(() => dateMock.valueOf());

jest.spyOn(Date, 'now').mockImplementation(() => dateMock.valueOf());

it('renders DateSelector unchanged', () => {
  const { container } = render(
    <DateSelector defaultDate={new Date(Date.now())} onChange={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});

it('renders DateSelector with default value unchanged', () => {
  const { container } = render(
    <DateSelector defaultDate="2023-12-14T08:48:06.977Z" onChange={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});

it('renders DateSelector disabled unchanged', () => {
  const { container } = render(
    <DateSelector
      disabled
      defaultDate={new Date(Date.now())}
      onChange={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
