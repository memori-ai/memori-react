import React from 'react';
import { Meta, Story } from '@storybook/react';
import Input, { Props } from './Input';
import './Input.css';

// Mock icons for demonstration
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const LoadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 6v2"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

// Mock button component for addons
const Button = ({ children, type = 'default', disabled = false, htmlType = 'button', title = '', onClick = () => {} }: { children: React.ReactNode, type?: 'default' | 'primary', disabled?: boolean, htmlType?: 'button' | 'submit' | 'reset', title?: string, onClick?: () => void }) => (
  <button 
    type={htmlType}
    className={`mock-button mock-button-${type}`}
    disabled={disabled}
    title={title}
    onClick={onClick}
    style={{
      padding: '0.5rem 1rem',
      background: type === 'primary' ? '#1890ff' : '#fff',
      color: type === 'primary' ? '#fff' : '#000',
      border: '1px solid #d9d9d9',
      borderRadius: '0.25rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.65 : 1
    }}
  >
    {children}
  </button>
);

const meta: Meta = {
  title: 'UI/Input',
  component: Input,
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
      },
    },
    value: {
      control: {
        type: 'text',
      },
    },
    placeholder: {
      control: {
        type: 'text',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    readOnly: {
      control: {
        type: 'boolean',
      },
    },
    allowClear: {
      control: {
        type: 'boolean',
      },
    },
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
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Please input',
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: 'Username',
  placeholder: 'Please input username',
};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = {
  label: 'Email',
  defaultValue: 'example@example.com',
};

export const Password = Template.bind({});
Password.args = {
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password',
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Disabled input',
  value: 'You cannot change this',
  disabled: true,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  label: 'Read-only input',
  value: 'You cannot change this',
  readOnly: true,
};

export const WithClearButton = Template.bind({});
WithClearButton.args = {
  label: 'Clearable input',
  defaultValue: 'Clear me',
  allowClear: true,
};

export const WithPrefix = Template.bind({});
WithPrefix.args = {
  label: 'With prefix',
  placeholder: 'Enter username',
  prefix: <UserIcon />,
};

export const WithSuffix = Template.bind({});
WithSuffix.args = {
  label: 'With suffix',
  placeholder: 'Enter search term',
  suffix: <SearchIcon />,
};

export const WithAddonBefore = Template.bind({});
WithAddonBefore.args = {
  label: 'With addon before',
  placeholder: 'Enter website',
  addonBefore: 'https://',
};

export const WithAddonAfter = Template.bind({});
WithAddonAfter.args = {
  label: 'With addon after',
  placeholder: 'Enter domain',
  addonAfter: '.com',
};

export const Search = Template.bind({});
Search.args = {
  type: 'search',
  placeholder: 'Search...',
  allowClear: true,
  addonAfter: (
    <Button type="primary" htmlType="submit" title="Search">
      <SearchIcon />
    </Button>
  ),
};

export const Loading = Template.bind({});
Loading.args = {
  type: 'search',
  placeholder: 'Search...',
  allowClear: true,
  addonAfter: (
    <Button type="primary" htmlType="submit" disabled title="Searching...">
      <LoadingIcon />
    </Button>
  ),
};

export const CompleteExample = Template.bind({});
CompleteExample.args = {
  label: 'Search followers',
  type: 'search',
  name: 'query',
  allowClear: true,
  placeholder: 'Search by name or email',
  prefix: <SearchIcon />,
  addonAfter: (
    <Button type="primary" htmlType="submit" title="Search">
      <SearchIcon />
    </Button>
  ),
};