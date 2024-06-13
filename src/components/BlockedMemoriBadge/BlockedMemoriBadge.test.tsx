import React from 'react';
import { render } from '@testing-library/react';
import BlockedMemoriBadge from './BlockedMemoriBadge';

it('renders BlockedMemoriBadge unchanged', () => {
  const { container } = render(
    <BlockedMemoriBadge
      memoriName="John Doe"
      blockedUntil="2051-01-01T00:00:00.000Z"
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders BlockedMemoriBadge with giver info unchanged', () => {
  const { container } = render(
    <BlockedMemoriBadge
      memoriName="John Doe"
      blockedUntil="2051-01-01T00:00:00.000Z"
      showGiverInfo
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders BlockedMemoriBadge with title unchanged', () => {
  const { container } = render(
    <BlockedMemoriBadge
      memoriName="John Doe"
      blockedUntil="2051-01-01T00:00:00.000Z"
      showTitle
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders BlockedMemoriBadge with margin left unchanged', () => {
  const { container } = render(
    <BlockedMemoriBadge
      memoriName="John Doe"
      blockedUntil="2051-01-01T00:00:00.000Z"
      marginLeft
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders BlockedMemoriBadge for not enough credits unchanged', () => {
  const { container } = render(
    <BlockedMemoriBadge memoriName="John Doe" notEnoughCredits />
  );
  expect(container).toMatchSnapshot();
});
