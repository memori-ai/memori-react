import React from 'react';
import { Meta, Story } from '@storybook/react';
import Card, { Props } from './Card';
import Button from './Button';
import './Card.css';

const meta: Meta = {
  title: 'UI/Card',
  component: Card,
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
    },
    description: {
      control: {
        type: 'text',
      },
    },
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
    loading: {
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

const Template: Story<Props> = args => <Card {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  title: 'Card title',
  loading: false,
};

export const WithTitleAndDescription = Template.bind({});
WithTitleAndDescription.args = {
  title: 'Card title',
  description: 'Card description',
  loading: false,
};

export const Loading = Template.bind({});
Loading.args = {
  title: 'Card title',
  description: 'Card description',
  loading: true,
};

export const WithCover = Template.bind({});
WithCover.args = {
  title: 'Card title',
  description: 'Card description',
  cover: <img src="https://picsum.photos/200/300" alt="cover" />,
  loading: false,
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  title: 'Card title',
  description: 'Card description',
  children: (
    <div>
      <p>Some text</p>
      <Button primary>Show more</Button>
    </div>
  ),
  loading: false,
};

export const Hoverable = Template.bind({});
Hoverable.args = {
  title: 'Card title',
  description: 'Card description',
  loading: false,
  hoverable: true,
};
