import React from 'react';
import { Meta, Story } from '@storybook/react';
import Slider, { Props } from './Slider';

import './Slider.css';

const meta: Meta = {
  title: 'UI/Slider',
  component: Slider,
  argTypes: {
    min: {
      control: {
        type: 'number',
      },
    },
    max: {
      control: {
        type: 'number',
      },
    },
    step: {
      control: {
        type: 'number',
      },
    },
  },        
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => (
  <Slider {...args} />
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 50,
};

export const Spinning = Template.bind({});
Spinning.args = {
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 50,
};

export const Primary = Template.bind({});
Primary.args = {
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 50,
  primary: true,
};
