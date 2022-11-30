import React from 'react';
import { render } from '@testing-library/react';
import ChatInputs from './ChatInputs';
import { dialogState } from '../../mocks/data';

it('renders ChatInputs unchanged', () => {
  const { container } = render(
    <ChatInputs
      dialogState={dialogState}
      userMessage=""
      onChangeUserMessage={jest.fn()}
      sendMessage={jest.fn()}
      onTextareaPressEnter={jest.fn()}
      onTextareaFocus={jest.fn()}
      onTextareaBlur={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatInputs with user message unchanged', () => {
  const { container } = render(
    <ChatInputs
      userMessage="Lorem ipsum"
      onChangeUserMessage={jest.fn()}
      dialogState={dialogState}
      sendMessage={jest.fn()}
      onTextareaPressEnter={jest.fn()}
      onTextareaFocus={jest.fn()}
      onTextareaBlur={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatInputs on instruct unchanged', () => {
  const { container } = render(
    <ChatInputs
      userMessage="Lorem ipsum"
      onChangeUserMessage={jest.fn()}
      dialogState={{
        ...dialogState,
        acceptsMedia: true,
      }}
      sendMessage={jest.fn()}
      onTextareaPressEnter={jest.fn()}
      onTextareaFocus={jest.fn()}
      onTextareaBlur={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
      instruct
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders ChatInputs disabled unchanged', () => {
  const { container } = render(
    <ChatInputs
      userMessage="Lorem ipsum"
      onChangeUserMessage={jest.fn()}
      dialogState={{
        ...dialogState,
        state: 'X3',
      }}
      sendMessage={jest.fn()}
      onTextareaPressEnter={jest.fn()}
      onTextareaFocus={jest.fn()}
      onTextareaBlur={jest.fn()}
      setAttachmentsMenuOpen={jest.fn()}
      setSendOnEnter={jest.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
