import React from 'react';
import { render } from '@testing-library/react';
import PositionDrawer from './PositionDrawer';
import { venue, memori } from '../../mocks/data';

beforeEach(() => {
  // @ts-ignore
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
  }));
});

it('renders PositionDrawer unchanged', () => {
  const { container } = render(
    <PositionDrawer
      memori={memori}
      open={true}
      onClose={jest.fn()}
      setVenue={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders VenueWidget with venue set', () => {
  const { container } = render(
    <PositionDrawer
      memori={memori}
      open={true}
      onClose={jest.fn()}
      venue={venue}
      setVenue={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
