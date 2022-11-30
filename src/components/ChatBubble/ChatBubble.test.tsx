import React from 'react';
import { render } from '@testing-library/react';
import ChatBubble from './ChatBubble';
import { memori, tenant } from '../../mocks/data';

it('renders ChatBubble unchanged', () => {
  const { container } = render(
    <ChatBubble
      memori={memori}
      tenant={tenant}
      message={{
        fromUser: false,
        text:
          'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
        initial: false,
        translatedText:
          'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatBubble with user msg unchanged', () => {
  const { container } = render(
    <ChatBubble
      memori={memori}
      tenant={tenant}
      message={{
        fromUser: true,
        text:
          'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
        initial: false,
        translatedText:
          'Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.',
      }}
    />
  );
  expect(container).toMatchSnapshot();
});
