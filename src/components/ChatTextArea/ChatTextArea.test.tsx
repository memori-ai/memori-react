import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ChatTextArea from './ChatTextArea';

it('renders ChatTextArea unchanged', () => {
  const { container } = render(<ChatTextArea value="" onChange={jest.fn()} />);
  expect(container).toMatchSnapshot();
});

it('renders ChatTextArea with value unchanged', () => {
  const { container } = render(
    <ChatTextArea
      value="Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor."
      onChange={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatTextArea with long text unchanged', () => {
  const { container } = render(
    <ChatTextArea
      value="Suspendisse sit amet volutpat velit. Nunc at commodo tortor, id rutrum nunc. Vivamus condimentum vel nunc et congue. Ut laoreet imperdiet nisi ac finibus. Suspendisse molestie risus a justo sagittis efficitur. Suspendisse sit amet volutpat velit. Nunc at commodo tortor, id rutrum nunc. Vivamus condimentum vel nunc et congue. Ut laoreet imperdiet nisi ac finibus. Suspendisse molestie risus a justo sagittis efficitur."
      onChange={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatTextArea expanded unchanged', () => {
  render(
    <ChatTextArea
      value="Suspendisse sit amet volutpat velit. Nunc at commodo tortor, id rutrum nunc. Vivamus condimentum vel nunc et congue. Ut laoreet imperdiet nisi ac finibus. Suspendisse molestie risus a justo sagittis efficitur. Suspendisse sit amet volutpat velit. Nunc at commodo tortor, id rutrum nunc. Vivamus condimentum vel nunc et congue. Ut laoreet imperdiet nisi ac finibus. Suspendisse molestie risus a justo sagittis efficitur."
      onChange={jest.fn()}
    />
  );

  fireEvent.click(screen.getByRole('button'));

  expect(screen.getByTestId('chat-textarea').classList).toContain(
    'memori-chat-textarea--expanded'
  );
});
