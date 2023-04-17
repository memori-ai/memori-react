import React from 'react';
import { Meta, Story } from '@storybook/react';
import Select, { Props } from './Select';
import './Select.css';

const meta: Meta = {
  title: 'UI/Select',
  component: Select,
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    className: {
      control: {
        type: 'text',
      },
    },
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

const Template: Story<Props> = args => <Select {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  label: 'Select me',
  options: [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
  ],
};

export const Placeholder = Template.bind({});
Placeholder.args = {
  label: 'Select me',
  placeholder: 'Select me',
  options: [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
  ],
};

export const WithValue = Template.bind({});
WithValue.args = {
  label: 'Select me',
  value: '2',
  options: [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
  ],
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: `You can't select me`,
  options: [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
  ],
  value: 2,
  disabled: true,
};
