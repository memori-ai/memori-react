import React from 'react';
import { Meta, Story } from '@storybook/react';
import Blob, { Props } from './Blob';
import './Blob.css';

const meta: Meta = {
  title: 'Blob',
  component: Blob,
  argTypes: {
    avatar: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => (
  <div style={{ marginTop: '20vw' }}>
    <Blob {...args} />
  </div>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {};

export const WithAvatar = Template.bind({});
WithAvatar.args = {
  avatar: 'https://avatars.githubusercontent.com/u/21101435?v=4',
};
