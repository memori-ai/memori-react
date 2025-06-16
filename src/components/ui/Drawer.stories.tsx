import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import Drawer, { Props } from './Drawer';
import Button from './Button';

import './Drawer.css';
import I18nWrapper from '../../I18nWrapper';

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
    placement: {
      control: {
        type: 'select',
        options: ['left', 'right'],
      },
    },
    width: {
      control: {
        type: 'text',
      },
    },
    animated: {
      control: {
        type: 'boolean',
      },
    },
    closable: {
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
  </>
);

// Create a proper footer object for the Drawer component
const simpleFooterObject = {
  onSubmit: () => console.log('Submit clicked'),
  loading: false,
};

const Template: Story<Props> = args => {
  const [isOpen, setIsOpen] = React.useState(!!args.open || false);

  return (
    <I18nWrapper>
      <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
      <Drawer {...args} open={isOpen} onClose={() => setIsOpen(false)}>
        {content}
      </Drawer>
    </I18nWrapper>
  );
};

// Basic examples
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

export const WithSimpleFooter = Template.bind({});
WithSimpleFooter.args = {
  open: true,
  title: 'Drawer Title',
  description: 'Drawer Description',
  footer: {
    onSubmit: () => console.log('Submit'),
    loading: false,
  },
};

export const PlacementLeft = Template.bind({});
PlacementLeft.args = {
  open: true,
  placement: 'left',
  title: 'Left Drawer',
};

export const CustomWidth = Template.bind({});
CustomWidth.args = {
  open: true,
  title: 'Custom Width Drawer',
  width: '50%',
};

export const NonAnimated = Template.bind({});
NonAnimated.args = {
  open: true,
  title: 'Non-Animated Drawer',
  animated: false,
};

export const NonClosable = Template.bind({});
NonClosable.args = {
  open: true,
  title: 'Non-Closable Drawer',
  closable: false,
};

// Template for data detection
const DataTemplate: Story<Props> = args => {
  const [isOpen, setIsOpen] = React.useState(!!args.open || false);
  // Use static data for the story - don't try to update it which might cause issues
  const staticData = { id: 1, name: 'John Doe' };

  return (
    <I18nWrapper>
      <Button onClick={() => setIsOpen(true)}>Open Data Drawer</Button>
      <Drawer
        {...args}
        open={isOpen}
        data={staticData}
        onClose={() => setIsOpen(false)}
      >
        <p>This drawer has data associated with it.</p>
        <p>When you close it, the component will check for unsaved changes.</p>
        <p>(For this demo, no actual changes are tracked)</p>
      </Drawer>
    </I18nWrapper>
  );
};

export const WithDataDetection = DataTemplate.bind({});
WithDataDetection.args = {
  open: true,
  title: 'Data Change Detection',
  description: 'This drawer demonstrates the data change detection feature',
};

// Improved ConfirmationDialog template with better state management

const ConfirmationDialogTemplate: Story<Props> = ({ open = true }: Props) => {
  const [isOpen, setIsOpen] = useState(open);
  const [data, setData] = useState({ id: 1, name: 'John Doe' });

  return (
    <I18nWrapper>
      <Button onClick={() => setIsOpen(true)}>Open Confirmation Dialog</Button>
      <Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        data={data}
        title="Confirmation Example"
        confirmDialogTitle="Confirmation Example"
        confirmDialogMessage="Are you sure you want to close this drawer?"
        footer={{
          onSubmit: () => {
            console.log('Submitted with data:', data);
            setIsOpen(false);
          },
        }}
      >
        <h3>Sample Form Content</h3>
        <p>Current data: {JSON.stringify(data)}</p>
        <Button onClick={() => setData({ id: 1, name: 'Jane Smith' })}>
          Modify Data
        </Button>
      </Drawer>
    </I18nWrapper>
  );
};

export const WithConfirmationDialog = ConfirmationDialogTemplate.bind({});
WithConfirmationDialog.args = {
  open: true,
  title: 'Unsaved Changes Demo',
  description:
    'This drawer shows the confirmation dialog when closing with unsaved changes',
};

// Fixed Template with lots of content and proper footer
const LongContentTemplate: Story<Props> = args => {
  const [isOpen, setIsOpen] = React.useState(!!args.open || false);

  return (
    <I18nWrapper>
      <Button onClick={() => setIsOpen(true)}>Open Long Content Drawer</Button>
      <Drawer {...args} open={isOpen} onClose={() => setIsOpen(false)}>
        {content}
        {content}
        {content}
        {content}
      </Drawer>
    </I18nWrapper>
  );
};

export const WithLongContent = LongContentTemplate.bind({});
WithLongContent.args = {
  open: true,
  title: 'Long Content Drawer',
  description: 'This drawer has a lot of content',
  footer: simpleFooterObject, // Use the properly structured footer object
};
