import React from 'react';
import { Meta, Story } from '@storybook/react';
import Typing from './Typing';

const meta: Meta = {
  title: 'Widget/Typing',
  component: Typing,
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story = args => <Typing {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {};
