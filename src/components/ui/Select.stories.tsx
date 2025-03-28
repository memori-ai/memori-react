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
    showSearch: {
      control: {
        type: 'boolean',
      },
    },
    optionFilterProp: {
      control: {
        type: 'select',
        options: ['label', 'value', 'children'],
      },
    },
    placeholder: {
      control: {
        type: 'text',
      },
    },
    defaultValue: {
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
  value: '2',
  disabled: true,
};

// New stories for the added props

export const WithSearch = Template.bind({});
WithSearch.args = {
  label: 'Searchable Select',
  placeholder: 'Search options...',
  showSearch: true,
  options: [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'durian', label: 'Durian' },
    { value: 'elderberry', label: 'Elderberry' },
    { value: 'fig', label: 'Fig' },
    { value: 'grape', label: 'Grape' },
  ],
};

export const WithCustomFilter = Template.bind({});
WithCustomFilter.args = {
  label: 'Custom Filter Select',
  placeholder: 'Type a fruit...',
  showSearch: true,
  optionFilterProp: 'label',
  filterOption: (input, option) => 
    (option?.label ?? '').toLowerCase().startsWith(input.toLowerCase()),
  options: [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'durian', label: 'Durian' },
    { value: 'elderberry', label: 'Elderberry' },
    { value: 'fig', label: 'Fig' },
    { value: 'grape', label: 'Grape' },
  ],
};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = {
  label: 'Default Value Select',
  defaultValue: 'banana',
  options: [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ],
};

export const WithLongList = Template.bind({});
WithLongList.args = {
  label: 'Long List Select',
  placeholder: 'Find an item...',
  showSearch: true,
  options: Array.from({ length: 100 }, (_, i) => ({
    value: `item-${i + 1}`,
    label: `Item ${i + 1}`,
  })),
};

export const CompleteExample = Template.bind({});
CompleteExample.args = {
  label: 'Expert',
  placeholder: 'Select an expert',
  showSearch: true,
  optionFilterProp: 'label',
  filterOption: (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
  options: [
    { value: 'alice', label: 'Alice Smith (Design)' },
    { value: 'bob', label: 'Bob Johnson (Engineering)' },
    { value: 'carol', label: 'Carol Williams (Marketing)' },
    { value: 'david', label: 'David Brown (Sales)' },
    { value: 'eve', label: 'Eve Davis (Product)' },
  ],
  defaultValue: 'alice',
};