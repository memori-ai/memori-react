import React from 'react';
import { Meta, Story } from '@storybook/react';
import Checkbox, { Props } from './Checkbox';
import './Checkbox.css';

const meta: Meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
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

const Template: Story<Props> = args => <Checkbox {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  label: 'Check me',
};

export const Checked = Template.bind({});
Checked.args = {
  label: 'Uncheck me',
  checked: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Do not check me',
  disabled: true,
};

export const DisabledChecked = Template.bind({});
DisabledChecked.args = {
  label: 'Do not uncheck me',
  checked: true,
  disabled: true,
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
  label: 'Indeterminate',
  checked: true,
  indeterminate: true,
};

export const DisabledIndeterminate = Template.bind({});
DisabledIndeterminate.args = {
  label: 'Indeterminate',
  checked: false,
  indeterminate: true,
  disabled: true,
};
