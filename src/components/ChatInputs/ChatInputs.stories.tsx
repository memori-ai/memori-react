import React from 'react';
import { Meta, Story } from '@storybook/react';
import ChatInputs, { Props } from './ChatInputs';
import { dialogState } from '../../mocks/data';

const meta: Meta = {
  title: 'Widget/Chat inputs (footer)',
  component: ChatInputs,
  argTypes: {
    disabled: {
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => {
  const [userMessage, setUserMessage] = React.useState(args.userMessage);

  return (
    <div style={{ paddingTop: '10rem' }}>
      <ChatInputs
        {...args}
        userMessage={userMessage}
        onChangeUserMessage={setUserMessage}
      />
    </div>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  userMessage: '',
  dialogState,
  sendMessage: (msg: string) => console.log(msg),
  onTextareaBlur: () => {},
  onTextareaFocus: () => {},
  onTextareaPressEnter: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithValue = Template.bind({});
WithValue.args = {
  userMessage: 'Suspendisse sit amet volutpat velit.',
  dialogState,
  sendMessage: (msg: string) => console.log(msg),
  onTextareaBlur: () => {},
  onTextareaFocus: () => {},
  onTextareaPressEnter: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const WithLongText = Template.bind({});
WithLongText.args = {
  userMessage:
    'Suspendisse sit amet volutpat velit. Nunc at commodo tortor, id rutrum nunc. Vivamus condimentum vel nunc et congue. Ut laoreet imperdiet nisi ac finibus. Suspendisse molestie risus a justo sagittis efficitur. Suspendisse sit amet volutpat velit. Nunc at commodo tortor, id rutrum nunc. Vivamus condimentum vel nunc et congue. Ut laoreet imperdiet nisi ac finibus. Suspendisse molestie risus a justo sagittis efficitur.',
  dialogState,
  sendMessage: (msg: string) => console.log(msg),
  onTextareaBlur: () => {},
  onTextareaFocus: () => {},
  onTextareaPressEnter: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const Instruct = Template.bind({});
Instruct.args = {
  instruct: true,
  userMessage: 'Suspendisse sit amet volutpat velit.',
  dialogState: {
    ...dialogState,
    acceptsMedia: true,
  },
  sendMessage: (msg: string) => console.log(msg),
  onTextareaBlur: () => {},
  onTextareaFocus: () => {},
  onTextareaPressEnter: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};

export const Disabled = Template.bind({});
Disabled.args = {
  dialogState: {
    ...dialogState,
    state: 'X3',
  },
  userMessage: 'Suspendisse sit amet volutpat velit.',
  sendMessage: (msg: string) => console.log(msg),
  onTextareaBlur: () => {},
  onTextareaFocus: () => {},
  onTextareaPressEnter: () => {},
  setAttachmentsMenuOpen: () => {},
  setSendOnEnter: () => {},
};
