import React from 'react';
import { Meta, Story } from '@storybook/react';
import Spin, { Props } from './Spin';

import './Spin.css';

const meta: Meta = {
  title: 'UI/Spin',
  component: Spin,
  argTypes: {
    spinning: {
      control: {
        type: 'boolean',
      },
    },
    primary: {
      control: {
        type: 'boolean',
      },
    },
    className: {
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
  <Spin {...args}>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <h2>Suspendisse a sodales nulla, sed semper nisi.</h2>
    <p>Proin tincidunt enim in felis aliquet, a ultricies purus bibendum.</p>
    <ul>
      <li>Quisque in ultrices lectus.</li>
      <li>Quisque in ultrices lectus.</li>
      <li>Quisque in ultrices lectus.</li>
    </ul>
    <p>Nulla at urna diam.</p>
  </Spin>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  spinning: false,
};

export const Spinning = Template.bind({});
Spinning.args = {
  spinning: true,
};

export const Primary = Template.bind({});
Primary.args = {
  spinning: true,
  primary: true,
};
