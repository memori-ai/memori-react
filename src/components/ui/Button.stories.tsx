import React from 'react';
import { Meta, Story } from '@storybook/react';
import Button, { Props } from './Button';
import Eye from '../icons/Eye';
import './Button.css';

const meta: Meta = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
    className: {
      control: {
        type: 'text',
      },
    },
    type: {
      control: {
        type: 'select',
        options: ['button', 'submit', 'reset'],
      },
    },
    primary: {
      control: {
        type: 'boolean',
      },
    },
    outlined: {
      control: {
        type: 'boolean',
      },
    },
    ghost: {
      control: {
        type: 'boolean',
      },
    },
    padded: {
      control: {
        type: 'boolean',
      },
    },
    block: {
      control: {
        type: 'boolean',
      },
    },
    danger: {
      control: {
        type: 'boolean',
      },
    },
    loading: {
      control: {
        type: 'boolean',
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

const Template: Story<Props> = args => <Button {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  children: 'Click me',
};

export const Primary = Template.bind({});
Primary.args = {
  children: 'Click me',
  primary: true,
};

export const Outlined = Template.bind({});
Outlined.args = {
  children: 'Click me',
  outlined: true,
};

export const Ghost = Template.bind({});
Ghost.args = {
  children: 'Click me',
  ghost: true,
};

export const PrimaryOutlined = Template.bind({});
PrimaryOutlined.args = {
  children: 'Click me',
  primary: true,
  outlined: true,
};

export const Square = Template.bind({});
Square.args = {
  children: 'Click me',
  shape: 'square',
};

export const Padded = Template.bind({});
Padded.args = {
  children: 'Click me',
  padded: true,
};

export const Block = Template.bind({});
Block.args = {
  children: 'Click me',
  block: true,
};

export const Circle = Template.bind({});
Circle.args = {
  shape: 'circle',
  icon: <Eye />,
  padded: false,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: 'Click me',
  icon: <Eye />,
};

export const Danger = Template.bind({});
Danger.args = {
  children: 'Click me',
  danger: true,
};

export const Loading = Template.bind({});
Loading.args = {
  children: 'Click me',
  loading: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Click me',
  disabled: true,
};
