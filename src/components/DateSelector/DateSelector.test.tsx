import { render } from '@testing-library/react';
import DateSelector from './DateSelector';

jest.setSystemTime(new Date('2022-09-24'));
Date.now = jest.fn(() => new Date(Date.UTC(2022, 8, 24)).valueOf());

jest
  .spyOn(Date, 'now')
  .mockImplementation(() => new Date(2022, 8, 24, 0, 0, 0, 0).valueOf());

it('renders DateSelector unchanged', () => {
  const { container } = render(
    <DateSelector defaultDate={new Date(Date.now())} onChange={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});

it('renders DateSelector with default value unchanged', () => {
  const { container } = render(
    <DateSelector
      defaultDate={new Date(2000, 0, 1, 0, 0, 0)}
      onChange={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders DateSelector disabled unchanged', () => {
  const { container } = render(
    <DateSelector
      disabled
      defaultDate={new Date(2000, 0, 1, 0, 0, 0)}
      onChange={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
