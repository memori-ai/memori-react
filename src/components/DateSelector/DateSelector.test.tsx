import { render } from '@testing-library/react';
import DateSelector from './DateSelector';
import moment from 'moment';

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
    <DateSelector
      defaultDate={moment(`2022-08-24 00:00:00Z`)}
      onChange={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders DateSelector disabled unchanged', () => {
  const { container } = render(
    <DateSelector
      disabled
      defaultDate={moment(`2022-08-24 00:00:00Z`)}
      onChange={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
