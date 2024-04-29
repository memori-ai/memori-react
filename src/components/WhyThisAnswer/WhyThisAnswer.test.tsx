import React from 'react';
import { render } from '@testing-library/react';
import WhyThisAnswer from './WhyThisAnswer';
import { sessionID, memoryQuestion } from '../../mocks/data';

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

it('renders WhyThisAnswer with data unchanged', () => {
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
      initialMatches={[
        {
          confidence: 0.8,
          confidenceLevel: 'HIGH',
          memory: {
            ...memoryQuestion,
            title: 'This is the title of the content',
            titleVariants: [
              "This is a variant of the content's title",
              'This is a test content',
            ],
            answers: [
              {
                text: 'This is a test answer',
              },
            ],
            memoryID: '1',
          },
        },
        {
          confidence: 0.7,
          confidenceLevel: 'MEDIUM',
          memory: {
            ...memoryQuestion,
            memoryID: '2',
            title: 'This is a test title',
            titleVariants: undefined,
            answers: [
              {
                text: 'This is a an answer',
              },
              {
                text: 'This is another answer',
              },
            ],
          },
        },
      ]}
      closeDrawer={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
