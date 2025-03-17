import React, { useEffect } from 'react';
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
    <>
      <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
      <Drawer
        {...args}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        {content}
      </Drawer>
    </>
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
    loading: false
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
    <>
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
    </>
  );
};

export const WithDataDetection = DataTemplate.bind({});
WithDataDetection.args = {
  open: true,
  title: 'Data Change Detection',
  description: 'This drawer demonstrates the data change detection feature',
};

const ConfirmationDialogTemplate: Story<Props> = args => {
  const [isOpen, setIsOpen] = React.useState(!!args.open || false);
  const [data, setData] = React.useState({ id: 1, name: 'John Doe' });
  
  // Memoize this object to reduce rerenders
  const modifiedData = React.useMemo(() => ({ id: 1, name: 'Jane Smith' }), []);
  
  // Optimize the handler
  const handleModifyData = React.useCallback(() => {
    setData(modifiedData);
  }, [modifiedData]);

  return (
    <>
      <Button onClick={() => { setIsOpen(true); }}>Open Dialog Demo Drawer</Button>
      
      <Drawer
        {...args}
        open={isOpen}
        data={data}
        onClose={() => setIsOpen(false)}
        footer={{
          leftAction: data.name === 'Jane Smith' ? (
            <span>Data has been modified</span>
          ) : (
            <Button onClick={handleModifyData}>
              Modify Data (to trigger dialog)
            </Button>
          ),
          onSubmit: () => setIsOpen(false),
        }}
      >
        <div style={{ padding: '8px 0' }}>
          <h3>Confirmation Dialog Demo</h3>
          <p>This drawer will trigger the confirmation dialog when you try to close it after modifying data.</p>
          
          <div style={{ marginTop: '20px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
            <p><strong>Current data:</strong> {JSON.stringify(data)}</p>
            {data.name === 'Jane Smith' && (
              <p><strong>Original data:</strong> {JSON.stringify({ id: 1, name: 'John Doe' })}</p>
            )}
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <p><strong>Instructions:</strong></p>
            <ol>
              <li>Click the Modify Data button in the footer</li>
              <li>Then click the X button or Cancel to see the confirmation dialog</li>
            </ol>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export const WithConfirmationDialog = ConfirmationDialogTemplate.bind({});
WithConfirmationDialog.args = {
  open: true,
  title: 'Unsaved Changes Demo',
  description: 'This drawer shows the confirmation dialog when closing with unsaved changes',
};

// Fixed Template with lots of content and proper footer
const LongContentTemplate: Story<Props> = args => {
  const [isOpen, setIsOpen] = React.useState(!!args.open || false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Long Content Drawer</Button>
      <Drawer
        {...args}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        {content}
        {content}
        {content}
        {content}
      </Drawer>
    </>
  );
};

export const WithLongContent = LongContentTemplate.bind({});
WithLongContent.args = {
  open: true,
  title: 'Long Content Drawer',
  description: 'This drawer has a lot of content',
  footer: simpleFooterObject, // Use the properly structured footer object
};