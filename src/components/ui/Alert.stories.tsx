import React from 'react';
import { Meta, Story } from '@storybook/react';
import Alert, { Props } from './Alert';
import Button from './Button';
import './Alert.css';

const meta: Meta = {
  title: 'UI/Alert',
  component: Alert,
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['success', 'warning', 'error', 'info']
      }
    },
    title: {
      control: {
        type: 'text'
      }
    },
    description: {
      control: {
        type: 'text'
      }
    },
    open: {
      control: {
        type: 'boolean'
      }
    },
    closable: {
      control: {
        type: 'boolean'
      }
    },
    width: {
      control: {
        type: 'text'
      }
    }
  },
  parameters: {
    controls: { expanded: true }
  }
};

export default meta;

const Template: Story<Props> = args => {
  const [isOpen, setIsOpen] = React.useState(!!args.open);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show Alert</Button>
      <Alert
        {...args}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  open: false,
  type: 'info',
  title: 'Information',
  description: 'This is an informative alert message.'
};

export const Success = Template.bind({});
Success.args = {
  open: true,
  type: 'success',
  title: 'Success!',
  description: 'Operation completed successfully.'
};

export const Warning = Template.bind({});
Warning.args = {
  open: true,
  type: 'warning',
  title: 'Warning',
  description: 'Please review this important warning message.'
};

export const Error = Template.bind({});
Error.args = {
  open: true,
  type: 'error',
  title: 'Error',
  description: 'An error occurred while processing your request.'
};

export const WithAction = Template.bind({});
WithAction.args = {
  open: true,
  type: 'info',
  title: 'Update Available',
  description: 'A new version is available.',
  action: <Button primary>Update Now</Button>
};

export const NonClosable = Template.bind({});
NonClosable.args = {
  open: true,
  type: 'warning',
  title: 'Important Notice',
  description: 'This message cannot be dismissed.',
  closable: false
};

export const CustomWidth = Template.bind({});
CustomWidth.args = {
  open: true,
  type: 'info',
  title: 'Custom Width',
  description: 'This alert has a custom width.',
  width: '500px'
};

export const WithoutDescription = Template.bind({});
WithoutDescription.args = {
  open: true,
  type: 'success',
  title: 'Operation Successful'
};

export const AutoDismiss = Template.bind({});
AutoDismiss.args = {
  open: true,
  type: 'success',
  title: 'Auto Dismiss',
  description: 'This alert will dismiss automatically after 3 seconds.',
  duration: 3000
};