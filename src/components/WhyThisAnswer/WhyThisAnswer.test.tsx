import React from 'react';
import { render } from '@testing-library/react';
import WhyThisAnswer from './WhyThisAnswer';
import { sessionID } from '../../mocks/data';

beforeEach(() => {
  // @ts-ignore
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
  }));
});

it('renders WhyThisAnswer hidden unchanged', () => {
  const { container } = render(
    <WhyThisAnswer
      apiURL="https://backend.memori.ai"
      sessionID={sessionID}
      visible={false}
      message={{
        questionAnswered: 'Test message',
        text: 'This is a test content',
        date: '2021-01-01',
        placeName: 'Test Place',
        placeLatitude: 0,
        placeLongitude: 0,
        placeUncertaintyKm: 0,
        contextVars: {
          KEY: 'value',
        },
      }}
      closeDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders WhyThisAnswer visible unchanged', () => {
  const { container } = render(
    <WhyThisAnswer
      apiURL="https://backend.memori.ai"
      sessionID={sessionID}
      visible={true}
      message={{
        questionAnswered: 'Test message',
        text: 'This is a test content',
        date: '2021-01-01',
        placeName: 'Test Place',
        placeLatitude: 0,
        placeLongitude: 0,
        placeUncertaintyKm: 0,
        contextVars: {
          KEY: 'value',
        },
      }}
      closeDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders WhyThisAnswer loading unchanged', () => {
  const { container } = render(
    <WhyThisAnswer
      apiURL="https://backend.memori.ai"
      sessionID={sessionID}
      visible={true}
      message={{
        questionAnswered: 'Test message',
        text: 'This is a test content',
        date: '2021-01-01',
        placeName: 'Test Place',
        placeLatitude: 0,
        placeLongitude: 0,
        placeUncertaintyKm: 0,
        contextVars: {
          KEY: 'value',
        },
      }}
      closeDrawer={jest.fn()}
      _TEST_loading={true}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders WhyThisAnswer with data unchanged', () => {
  const { container } = render(
    <WhyThisAnswer
      apiURL="https://backend.memori.ai"
      sessionID={sessionID}
      visible={true}
      message={{
        questionAnswered: 'Test message',
        text: 'This is a test content',
        date: '2021-01-01',
        placeName: 'Test Place',
        placeLatitude: 0,
        placeLongitude: 0,
        placeUncertaintyKm: 0,
        contextVars: {
          KEY: 'value',
        },
      }}
      initialMatches={[
        {
          confidence: 0.8,
          confidenceLevel: 'HIGH',
          memory: {
            memoryID: '1',
            memoryType: 'Question',
            title: 'This is the title of the content',
            titleVariants: [
              "This is a variant of the content's title",
              'This is a test content',
            ],
            answers: [
              {
                text: 'This is a test answer',
              },
              {
                text: 'This is another answer',
              },
            ],
          },
        },
        {
          confidence: 0.5,
          confidenceLevel: 'LOW',
          memory: {
            memoryID: '2',
            memoryType: 'Question',
            title: 'Content with a long answer',
            titleVariants: undefined,
            answers: [
              {
                text: 'Suspendisse a sodales nulla, sed semper nisi. Suspendisse a sodales nulla, sed semper nisi. Suspendisse a sodales nulla, sed semper nisi. Suspendisse a sodales nulla, sed semper nisi. Suspendisse a sodales nulla, sed semper nisi.',
              },
            ],
          },
        },
        {
          confidence: 0.5,
          confidenceLevel: 'LOW',
          memory: {
            memoryID: '3',
            title: 'Content with sources',
            titleVariants: undefined,
            memoryType: 'Question',
            answers: [
              {
                text: 'This is a test answer',
              },
            ],
            media: [
              {
                mediumID: '1',
                mimeType: 'text/plain',
                content:
                  'This is a source. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a sodales nulla, sed semper nisi. Suspendisse a sodales nulla, sed semper nisi.',
              },
              {
                mediumID: '2',
                mimeType: 'text/plain',
                content:
                  'This is a source.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\nCras lobortis volutpat nunc.\nProin tincidunt enim in felis aliquet, a ultricies purus bibendum.\n\nQuisque in ultrices lectus.\nNulla at urna diam.\n\nProin sodales lobortis libero eu facilisis.',
              },
            ],
          },
        },
        {
          confidence: 0.7,
          confidenceLevel: 'MEDIUM',
          memory: {
            memoryID: '4',
            title: 'Content with links',
            memoryType: 'Question',
            titleVariants: undefined,
            answers: [
              {
                text: 'This is a an answer',
              },
            ],
            media: [
              {
                mediumID: '1',
                mimeType: 'text/html',
                url: 'https://memori.ai',
                title: 'Memori.AI',
              },
              {
                mediumID: '2',
                mimeType: 'text/html',
                url: 'https://nzambello.dev',
                title: 'Nicola Zambello',
              },
            ],
          },
        },
        {
          confidence: 0.7,
          confidenceLevel: 'MEDIUM',
          memory: {
            memoryID: '5',
            memoryType: 'Question',
            title: 'Content with receiver',
            titleVariants: undefined,
            receiverName: 'receiver',
            receiverTag: '🧑‍💻',
            answers: [
              {
                text: 'This is a an answer',
              },
            ],
            media: [],
          },
        },
        {
          confidence: 0.5,
          confidenceLevel: 'MEDIUM',
          memory: {
            memoryID: '5',
            memoryType: 'Question',
            title: 'Content with context',
            titleVariants: undefined,
            contextVars: {
              KEY: 'VALUE',
            },
            answers: [
              {
                text: 'This is a an answer',
              },
            ],
            media: [],
          },
        },
      ]}
      closeDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
