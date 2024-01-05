import React from 'react';
import { render } from '@testing-library/react';
import KnownFacts from './KnownFacts';
import { knownFact, memori, sessionID } from '../../mocks/data';

beforeEach(() => {
  // @ts-ignore
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
  }));
});

it('renders KnownFacts hidden unchanged', () => {
  const { container } = render(
    <KnownFacts
      apiURL="https://backend.memori.ai"
      memori={memori}
      sessionID={sessionID}
      visible={false}
      closeDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders KnownFacts visible unchanged', () => {
  const { container } = render(
    <KnownFacts
      apiURL="https://backend.memori.ai"
      memori={memori}
      sessionID={sessionID}
      visible={true}
      closeDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders KnownFacts with data unchanged', () => {
  const { container } = render(
    <KnownFacts
      apiURL="https://backend.memori.ai"
      memori={memori}
      sessionID={sessionID}
      visible={true}
      initialKnownFacts={[knownFact]}
      closeDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
