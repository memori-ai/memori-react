import React from 'react';
import { render } from '@testing-library/react';
import { memori } from '../../mocks/data';
import FeedbackButtons from './FeedbackButtons';

it('renders FeedbackButtons unchanged', () => {
  const { container } = render(
    <FeedbackButtons memori={memori} simulateUserPrompt={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});
