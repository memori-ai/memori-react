import React from 'react';
import { fireEvent, render, screen } from '../../testUtils';
import WhyThisAnswer from './WhyThisAnswer';
import { sessionID } from '../../mocks/data';
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

const message = {
  questionAnswered: 'Quali microfoni usiamo in produzione?',
  text: 'Per l\'audio in produzione usiamo il DJI Mic Mini, abbinato al kit luci ULANZI e altro materiale di ripresa per interni, esterni e interviste lunghe che richiedono un registratore di backup.',
  date: '2021-01-01',
  placeName: 'Test Place',
  placeLatitude: 0,
  placeLongitude: 0,
  placeUncertaintyKm: 0,
  contextVars: {
    KEY: 'value',
  },
};

it('does not show the drawer when hidden', () => {
  render(
    <WhyThisAnswer
      client={memoriApiClient()}
      sessionID={sessionID}
      visible={false}
      message={message}
      closeDrawer={jest.fn()}
    />
  );
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('renders WhyThisAnswer loading unchanged', () => {
  render(
    <WhyThisAnswer
      client={memoriApiClient()}
      sessionID={sessionID}
      visible
      message={message}
      closeDrawer={jest.fn()}
      _TEST_loading
    />
  );
  expect(document.querySelector('.memori-whythisanswer-skeleton')).toBeInTheDocument();
});

it('shows the question/answer pair and source cards', () => {
  render(
    <WhyThisAnswer
      client={memoriApiClient()}
      sessionID={sessionID}
      visible
      disableFetch
      message={message}
      closeDrawer={jest.fn()}
      initialMatches={[
        {
          confidence: 0.8,
          confidenceLevel: 'HIGH',
          memory: {
            memoryID: '1',
            memoryType: 'Question',
            title: 'Che attrezzatura serve per girare',
            answers: [
              {
                text: 'Il kit base comprende ULANZI MT-44 e DJI Mic Mini.',
              },
            ],
          },
        },
      ]}
    />
  );

  expect(screen.getByText('whyThisAnswerYouAsked')).toBeInTheDocument();
  expect(
    screen.getByText('Quali microfoni usiamo in produzione?')
  ).toBeInTheDocument();
  expect(screen.getByText('whyThisAnswerShowFull')).toBeInTheDocument();
  expect(
    screen.getByText('Che attrezzatura serve per girare?')
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'whyThisAnswerOpen' })).toBeInTheDocument();
  expect(document.querySelector('.memori--whythisanswer-no-results')).toBeNull();
});

it('shows a neutral empty state for visitors', () => {
  render(
    <WhyThisAnswer
      client={memoriApiClient()}
      sessionID={sessionID}
      visible
      disableFetch
      message={message}
      closeDrawer={jest.fn()}
      initialMatches={[]}
    />
  );

  expect(screen.getByText('whyThisAnswerEmptyTitle')).toBeInTheDocument();
  expect(screen.getByText('whyThisAnswerEmptyDescription')).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'whyThisAnswerAddContent' })
  ).not.toBeInTheDocument();
});

it('adds the missing-content action for the agent author', () => {
  const onAddMissingContent = jest.fn();
  const closeDrawer = jest.fn();
  render(
    <WhyThisAnswer
      client={memoriApiClient()}
      sessionID={sessionID}
      visible
      disableFetch
      isAgentAuthor
      onAddMissingContent={onAddMissingContent}
      message={message}
      closeDrawer={closeDrawer}
      initialMatches={[]}
    />
  );

  fireEvent.click(screen.getByRole('button', { name: 'whyThisAnswerAddContent' }));
  expect(onAddMissingContent).toHaveBeenCalled();
  expect(closeDrawer).toHaveBeenCalled();
});
