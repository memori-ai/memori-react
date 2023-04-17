import { render } from '@testing-library/react';
import AgeVerificationModal from './AgeVerificationModal';

beforeEach(() => {
  // @ts-ignore
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
  }));
});

it('renders AgeVerificationModal unchanged', () => {
  const { container } = render(
    <AgeVerificationModal onClose={jest.fn()} minAge={0} />
  );
  expect(container).toMatchSnapshot();
});

it('renders AgeVerificationModal visible unchanged', () => {
  const { container } = render(
    <AgeVerificationModal visible onClose={jest.fn()} minAge={14} />
  );
  expect(container).toMatchSnapshot();
});

it('renders AgeVerificationModal with minAge unchanged', () => {
  const { container } = render(
    <AgeVerificationModal visible onClose={jest.fn()} minAge={18} />
  );
  expect(container).toMatchSnapshot();
});
