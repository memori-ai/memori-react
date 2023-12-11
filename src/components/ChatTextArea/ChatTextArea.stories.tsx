import React from 'react';
import { Meta, Story } from '@storybook/react';
import ChatTextArea, { Props } from './ChatTextArea';
import I18nWrapper from '../../I18nWrapper';
import './ChatTextArea.css';

const meta: Meta = {
  title: 'Widget/Chat textarea',
  component: ChatTextArea,
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
  const [userMessage, setUserMessage] = React.useState(args.value);

  return (
    <I18nWrapper>
      <div style={{ paddingTop: '10rem' }}>
        <ChatTextArea {...args} value={userMessage} onChange={setUserMessage} />
      </div>
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  value: '',
  onChange: () => {},
};

export const WithValue = Template.bind({});
WithValue.args = {
  value: 'Suspendisse sit amet volutpat velit.',
  onChange: () => {},
};

export const WithLongText = Template.bind({});
WithLongText.args = {
  value:
    'Suspendisse sit amet volutpat velit. Nunc at commodo tortor, id rutrum nunc. Vivamus condimentum vel nunc et congue. Ut laoreet imperdiet nisi ac finibus. Suspendisse molestie risus a justo sagittis efficitur. Suspendisse sit amet volutpat velit. Nunc at commodo tortor, id rutrum nunc. Vivamus condimentum vel nunc et congue. Ut laoreet imperdiet nisi ac finibus. Suspendisse molestie risus a justo sagittis efficitur.',
  onChange: () => {},
};
