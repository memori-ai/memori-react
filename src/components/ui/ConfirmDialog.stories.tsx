import React from 'react';
import { Meta, Story } from '@storybook/react';
import ConfirmDialog from './ConfirmDialog';
import Button from './Button';

import './ConfirmDialog.css';

type Props = React.ComponentProps<typeof ConfirmDialog>;

const meta: Meta = {
  title: 'UI/ConfirmDialog',
  component: ConfirmDialog,
  argTypes: {
    isOpen: {
      control: {
        type: 'boolean',
      },
    },
    title: {
      control: {
        type: 'text',
      },
    },
    message: {
      control: {
        type: 'text',
      },
    },
    confirmText: {
      control: {
        type: 'text',
      },
    },
    cancelText: {
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

const Template: Story<Props> = args => {
  const [isOpen, setIsOpen] = React.useState(!!args.isOpen || false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Confirm Dialog</Button>
      <ConfirmDialog
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          console.log('Confirmed!');
          setIsOpen(false);
        }}
      />
    </>
  );
};

// Basic examples
export const Default = Template.bind({});
Default.args = {
  isOpen: false,
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed with this action?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
};

export const Open = Template.bind({});
Open.args = {
  isOpen: true,
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed with this action?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
};

export const WithCustomTitle = Template.bind({});
WithCustomTitle.args = {
  isOpen: true,
  title: 'Delete Item',
  message: 'Are you sure you want to proceed with this action?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
};

export const WithCustomMessage = Template.bind({});
WithCustomMessage.args = {
  isOpen: true,
  title: 'Confirm Action',
  message: 'This action cannot be undone. All associated data will be permanently deleted from the system.',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
};

export const WithCustomButtonText = Template.bind({});
WithCustomButtonText.args = {
  isOpen: true,
  title: 'Delete Item',
  message: 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText: 'Yes, Delete',
  cancelText: 'No, Keep It',
};

// Use case examples
const DeleteTemplate: Story<Props> = args => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDeleted, setIsDeleted] = React.useState(false);

  const handleConfirm = () => {
    setIsDeleted(true);
    setIsOpen(false);
    console.log('Item deleted!');
  };

  return (
    <>
      {isDeleted ? (
        <div style={{ 
          padding: '12px', 
          background: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          Item has been deleted successfully!
        </div>
      ) : (
        <Button onClick={() => setIsOpen(true)}>Delete Item</Button>
      )}
      
      <ConfirmDialog
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export const DeleteConfirmation = DeleteTemplate.bind({});
DeleteConfirmation.args = {
  title: 'Delete Item',
  message: 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText: 'Delete',
  cancelText: 'Cancel',
};

const SaveTemplate: Story<Props> = args => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [navigatedAway, setNavigatedAway] = React.useState(false);

  const handleTryNavigate = () => {
    setIsOpen(true);
  };

  const handleConfirm = () => {
    setNavigatedAway(true);
    setIsOpen(false);
    console.log('Navigated without saving!');
  };

  return (
    <>
      {navigatedAway ? (
        <div style={{ 
          padding: '12px', 
          background: '#d4edda', 
          color: '#155724', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          Navigated away without saving changes.
        </div>
      ) : (
        <div>
          <div style={{ 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <h3>Unsaved Form</h3>
            <p>This is a form with unsaved changes.</p>
            <input type="text" placeholder="Your name" style={{ padding: '8px', marginBottom: '10px', width: '100%' }} />
            <textarea placeholder="Your message" style={{ padding: '8px', width: '100%', height: '100px' }} />
          </div>
          <Button onClick={handleTryNavigate}>Navigate Away</Button>
        </div>
      )}
      
      <ConfirmDialog
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export const UnsavedChanges = SaveTemplate.bind({});
UnsavedChanges.args = {
  title: 'Unsaved Changes',
  message: 'You have unsaved changes. Are you sure you want to leave without saving?',
  confirmText: 'Leave',
  cancelText: 'Stay',
};