import React from 'react';
import { Meta, Story } from '@storybook/react';
import Modal, { ModalProps } from './Modal';
import Button from './Button';
import './Modal.css';

const meta: Meta = {
  title: 'UI/Modal',
  component: Modal,
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
    visible: {
      control: {
        type: 'boolean',
      },
    },
    className: {
      control: {
        type: 'text',
      },
    },
    maskClosable: {
      control: {
        type: 'boolean',
      },
    },
    destroyOnClose: {
      control: {
        type: 'boolean',
      },
    },
    width: {
      control: {
        type: 'text',
      },
    },
    widthMd: {
      control: {
        type: 'text',
      },
    },
    okText: {
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
  </>
);

const footer = (
  <>
    <Button primary>OK</Button>
    <Button>Cancel</Button>
  </>
);

const footerNonClosableModal = <Button primary>OK</Button>;

const Template: Story<ModalProps> = args => {
  const [isOpen, setIsOpen] = React.useState(!!args.open || !!args.visible || false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Click me</Button>
      <Modal
        {...args}
        open={isOpen}
        visible={isOpen}
        onClose={args.closable !== false ? () => setIsOpen(false) : () => {}}
        onCancel={args.closable !== false ? () => setIsOpen(false) : undefined}
        footer={args.footer}
      >
        {content}
      </Modal>
    </>
  );
};

const TemplateWithALotOfContent: Story<ModalProps> = args => {
  const [isOpen, setIsOpen] = React.useState(!!args.open || !!args.visible || false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Click me</Button>
      <Modal
        {...args}
        open={isOpen}
        visible={isOpen}
        onClose={args.closable !== false ? () => setIsOpen(false) : () => {}}
        onCancel={args.closable !== false ? () => setIsOpen(false) : undefined}
        footer={args.footer}
      >
        {content}
        {content}
        {content}
        {content}
        {content}
      </Modal>
    </>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  open: false,
  closable: true,
};

export const Open = Template.bind({});
Open.args = {
  open: true,
  closable: true,
};

export const WithTitle = Template.bind({});
WithTitle.args = {
  open: true,
  closable: true,
  title: 'Modal Title',
};

export const WithTitleAndDescription = Template.bind({});
WithTitleAndDescription.args = {
  open: true,
  closable: true,
  title: 'Modal Title',
  description: 'Modal Description',
};

export const Loading = Template.bind({});
Loading.args = {
  open: true,
  closable: true,
  title: 'Modal Title',
  description: 'Modal Description',
  loading: true,
};

export const WithFooter = Template.bind({});
WithFooter.args = {
  open: true,
  closable: true,
  title: 'Modal Title',
  description: 'Modal Description',
  footer,
};

export const WithAutoFooter = Template.bind({});
WithAutoFooter.args = {
  open: true,
  closable: true,
  title: 'Modal Title',
  description: 'Modal Description',
  okText: 'Confirm',
  cancelText: 'Cancel',
  onOk: () => console.log('OK clicked'),
};

export const NonClosable = Template.bind({});
NonClosable.args = {
  open: true,
  title: 'Modal Title',
  description: 'Modal Description',
  footer: footerNonClosableModal,
  closable: false,
};

export const MaskClosable = Template.bind({});
MaskClosable.args = {
  open: true,
  title: 'Modal Title',
  description: 'Modal Description',
  maskClosable: true,
};

export const WithALotOfContent = TemplateWithALotOfContent.bind({});
WithALotOfContent.args = {
  open: true,
  closable: true,
  title: 'Modal Title',
  description: 'Modal Description',
  footer,
};

export const CustomWidth = Template.bind({});
CustomWidth.args = {
  open: true,
  closable: true,
  title: 'Modal Title',
  description: 'Modal Description',
  width: '500px',
  widthMd: '700px',
};

export const AntDesignStyle = Template.bind({});
AntDesignStyle.args = {
  visible: true,
  title: 'Ant Design Style Modal',
  okText: 'Submit',
  cancelText: 'Back',
  onOk: () => console.log('OK clicked'),
  onCancel: () => console.log('Cancel clicked'),
  okButtonProps: { disabled: false },
  cancelButtonProps: { danger: true },
  destroyOnClose: true,
};