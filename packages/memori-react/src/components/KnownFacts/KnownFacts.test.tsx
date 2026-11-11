import React from 'react';
import { fireEvent, render, screen } from '../../testUtils';
import KnownFacts from './KnownFacts';
import { knownFact, memori, sessionID } from '../../mocks/data';
import memoriApiClient from '@memori.ai/memori-api-client';

beforeEach(() => {
  // @ts-ignore
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
  }));
});

const client = memoriApiClient();

const facts = [
  knownFact,
  {
    ...knownFact,
    knownFactID: 'fact-2',
    text: 'The user prefers concise answers.',
  },
];

it('does not show the drawer when hidden', () => {
  render(
    <KnownFacts
      apiClient={client}
      memori={memori}
      sessionID={sessionID}
      visible={false}
      closeDrawer={jest.fn()}
    />
  );
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('renders KnownFacts as a column of cards', () => {
  render(
    <KnownFacts
      apiClient={client}
      memori={memori}
      sessionID={sessionID}
      visible
      disableFetch
      initialKnownFacts={facts}
      closeDrawer={jest.fn()}
    />
  );

  expect(screen.getByText(knownFact.text)).toBeInTheDocument();
  expect(screen.getByText('The user prefers concise answers.')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('knownFacts.searchPlaceholder')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'knownFacts.select' })).toBeInTheDocument();
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
});

it('shows an empty state that explains how facts appear', () => {
  render(
    <KnownFacts
      apiClient={client}
      memori={memori}
      sessionID={sessionID}
      visible
      disableFetch
      initialKnownFacts={[]}
      closeDrawer={jest.fn()}
    />
  );

  expect(screen.getByText('knownFacts.emptyTitle')).toBeInTheDocument();
  expect(screen.getByText('knownFacts.emptyDescription')).toBeInTheDocument();
});

it('keeps multi-select behind the Select button', () => {
  render(
    <KnownFacts
      apiClient={client}
      memori={memori}
      sessionID={sessionID}
      visible
      disableFetch
      initialKnownFacts={facts}
      closeDrawer={jest.fn()}
    />
  );

  expect(
    screen.queryByRole('region', { name: 'knownFacts.selected' })
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'knownFacts.select' }));
  fireEvent.click(screen.getAllByRole('checkbox')[0]);
  expect(
    screen.getByRole('region', { name: 'knownFacts.selected' })
  ).toBeInTheDocument();
});
