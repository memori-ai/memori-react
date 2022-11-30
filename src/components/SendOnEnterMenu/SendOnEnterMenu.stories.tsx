import React from 'react';
import { Meta, Story } from '@storybook/react';
import SendOnEnterMenu, { Props } from './SendOnEnterMenu';

const meta: Meta = {
  title: 'Widget/Send On Enter Menu',
  component: SendOnEnterMenu,
  argTypes: {
    sendOnEnter: {
      control: {
        type: 'select',
        options: ['keypress', 'click'],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => {
  const [sendOnEnter, setSendOnEnter] = React.useState(args.sendOnEnter);
  return (
    <div
      style={{
        minHeight: '200px',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <SendOnEnterMenu
        {...args}
        sendOnEnter={sendOnEnter}
        setSendOnEnter={setSendOnEnter}
      />
    </div>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Click = Template.bind({});
Click.args = {
  sendOnEnter: 'click',
};

export const Keypress = Template.bind({});
Keypress.args = {
  sendOnEnter: 'keypress',
};
