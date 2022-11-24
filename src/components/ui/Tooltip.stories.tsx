import React from 'react';
import { Meta, Story } from '@storybook/react';
import Tooltip, { Props } from './Tooltip';

const meta: Meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
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

const Template: Story<Props> = args => <Tooltip {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  content: 'Here is some tooltip content',
  children: <span>Hover me</span>,
};

export const WithJSXContent = Template.bind({});
WithJSXContent.args = {
  content: (
    <p>
      Here we have some JSX, useful for{' '}
      <a href="https://memori.ai" rel="noopener noreferrer" target="_blank">
        links
      </a>
      , for example.
    </p>
  ),
  children: <span>Hover me</span>,
};

export const Disabled = Template.bind({});
Disabled.args = {
  content: 'Here is some tooltip content but I am disabled',
  children: <span>Hover me</span>,
  disabled: true,
};

export const VisibleControlled = Template.bind({});
VisibleControlled.args = {
  content:
    'Here is some tooltip content displayed by default as I am controlled',
  children: <span>Hover me</span>,
  visible: true,
};
