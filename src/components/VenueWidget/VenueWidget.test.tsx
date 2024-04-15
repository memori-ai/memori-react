import React from 'react';
import { render } from '@testing-library/react';
import VenueWidget from './VenueWidget';
import { venue } from '../../mocks/data';

it('renders empty VenueWidget unchanged', () => {
  const { container } = render(<VenueWidget setVenue={jest.fn()} />);
  expect(container).toMatchSnapshot();
});

it('renders VenueWidget with venue set, exact location', () => {
  const { container } = render(
    <VenueWidget
      venue={{
        ...venue,
        uncertainty: 0,
      }}
      setVenue={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders VenueWidget with venue set, with uncertainty radius', () => {
  const { container } = render(
    <VenueWidget
      venue={{
        ...venue,
        uncertainty: 10,
      }}
      setVenue={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders VenueWidget without uncertainty unchanged', () => {
  const { container } = render(
    <VenueWidget venue={venue} setVenue={jest.fn()} showUncertainty={false} />
  );
  expect(container).toMatchSnapshot();
});

it('renders VenueWidget without gps button unchanged', () => {
  const { container } = render(
    <VenueWidget venue={venue} setVenue={jest.fn()} showGpsButton={false} />
  );
  expect(container).toMatchSnapshot();
});
