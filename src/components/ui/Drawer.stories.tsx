import React from 'react';
import { Meta, Story } from '@storybook/react';
import Drawer, { Props } from './Drawer';
import Button from './Button';

import './Drawer.css';

const meta: Meta = {
  title: 'UI/Drawer',
  component: Drawer,
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
    loading: {
      control: {
        type: 'boolean',
      },
    },
    open: {
      control: {
        type: 'boolean',
      },
    },
    className: {
      control: {
        type: 'text',
      },
    },
    side: {
      control: {
        type: 'select',
        options: ['left', 'right'],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const content = (
  <>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <h3>Suspendisse a sodales nulla, sed semper nisi.</h3>
    <p>Proin tincidunt enim in felis aliquet, a ultricies purus bibendum.</p>
    <ul>
      <li>Quisque in ultrices lectus.</li>
      <li>Quisque in ultrices lectus.</li>
      <li>Quisque in ultrices lectus.</li>
    </ul>
    <p>Nulla at urna diam.</p>
    <h3>Suspendisse a sodales nulla, sed semper nisi.</h3>
    <p>Proin tincidunt enim in felis aliquet, a ultricies purus bibendum.</p>
    <ul>
      <li>Quisque in ultrices lectus.</li>
      <li>Quisque in ultrices lectus.</li>
      <li>Quisque in ultrices lectus.</li>
    </ul>
    <p>Nulla at urna diam.</p>
    <p>Nulla at urna diam.</p>
    <h3>Suspendisse a sodales nulla, sed semper nisi.</h3>
    <p>Proin tincidunt enim in felis aliquet, a ultricies purus bibendum.</p>
    <ul>
      <li>Quisque in ultrices lectus.</li>
      <li>Quisque in ultrices lectus.</li>
      <li>Quisque in ultrices lectus.</li>
    </ul>
    <p>Nulla at urna diam.</p>
  </>
);

const footer = (
  <>
    <Button primary>OK</Button>
    <Button>Cancel</Button>
  </>
);

const Template: Story<Props> = args => {
  const [isOpen, setIsOpen] = React.useState(!!args.open || false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Click me</Button>
      <Drawer
        {...args}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        footer={args.footer}
      >
        {content}
      </Drawer>
    </>
  );
};

const TemplateWithALotOfContent: Story<Props> = args => {
  const [isOpen, setIsOpen] = React.useState(!!args.open || false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Click me</Button>
      <Drawer
        {...args}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        footer={args.footer}
      >
        {content}
        {content}
        {content}
        {content}
        {content}
      </Drawer>
    </>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  open: false,
};

export const Open = Template.bind({});
Open.args = {
  open: true,
};

export const WithTitle = Template.bind({});
WithTitle.args = {
  open: true,
  title: 'Drawer Title',
};

export const WithTitleAndDescription = Template.bind({});
WithTitleAndDescription.args = {
  open: true,
  title: 'Drawer Title',
  description: 'Drawer Description',
};

export const Loading = Template.bind({});
Loading.args = {
  open: true,
  title: 'Drawer Title',
  description: 'Drawer Description',
  loading: true,
};

export const WithFooter = Template.bind({});
WithFooter.args = {
  open: true,
  title: 'Drawer Title',
  description: 'Drawer Description',
  footer,
};

export const SideLeft = Template.bind({});
SideLeft.args = {
  open: true,
  side: 'left',
};

export const WithALotOfContent = TemplateWithALotOfContent.bind({});
WithALotOfContent.args = {
  open: true,
  title: 'Drawer Title',
  description: 'Drawer Description',
  footer,
};
