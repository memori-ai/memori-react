import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import Tabs, { Props, TabItem } from './Tabs';
import './Tabs.css';

// Mock icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const defaultItems: TabItem[] = [
  {
    key: 'tab1',
    label: 'Tab 1',
    children: <div>Content of Tab 1</div>,
  },
  {
    key: 'tab2',
    label: 'Tab 2',
    children: <div>Content of Tab 2</div>,
  },
  {
    key: 'tab3',
    label: 'Tab 3',
    children: <div>Content of Tab 3</div>,
  },
];

const meta: Meta = {
  title: 'UI/Tabs',
  component: Tabs,
  argTypes: {
    activeKey: {
      control: {
        type: 'text',
      },
    },
    defaultActiveKey: {
      control: {
        type: 'text',
      },
    },
    tabPosition: {
      control: {
        type: 'select',
        options: ['top', 'bottom', 'left', 'right'],
      },
    },
    centered: {
      control: {
        type: 'boolean',
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['small', 'default', 'large'],
      },
    },
    type: {
      control: {
        type: 'select',
        options: ['line', 'card', 'editable-card'],
      },
    },
    animated: {
      control: {
        type: 'boolean',
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

const Template: Story<Props> = args => {
  const [activeKey, setActiveKey] = useState(args.defaultActiveKey || 'tab1');
  
  const handleChange = (key: string) => {
    setActiveKey(key);
    if (args.onChange) {
      args.onChange(key);
    }
  };
  
  return <Tabs {...args} activeKey={activeKey} onChange={handleChange} />;
};

export const Default = Template.bind({});
Default.args = {
  items: defaultItems,
  defaultActiveKey: 'tab1',
  'data-testid': 'default-tabs',
};

export const WithIcons = Template.bind({});
WithIcons.args = {
  items: [
    {
      key: 'home',
      label: 'Home',
      children: <div>Home content</div>,
      icon: <HomeIcon />,
    },
    {
      key: 'profile',
      label: 'Profile',
      children: <div>Profile content</div>,
      icon: <UserIcon />,
    },
    {
      key: 'settings',
      label: 'Settings',
      children: <div>Settings content</div>,
      icon: <SettingsIcon />,
    },
  ],
  defaultActiveKey: 'home',
  'data-testid': 'icon-tabs',
};

export const WithDisabledTab = Template.bind({});
WithDisabledTab.args = {
  items: [
    {
      key: 'tab1',
      label: 'Tab 1',
      children: <div>Content of Tab 1</div>,
    },
    {
      key: 'tab2',
      label: 'Tab 2 (Disabled)',
      children: <div>Content of Tab 2</div>,
      disabled: true,
    },
    {
      key: 'tab3',
      label: 'Tab 3',
      children: <div>Content of Tab 3</div>,
    },
  ],
  defaultActiveKey: 'tab1',
  'data-testid': 'disabled-tabs',
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  items: defaultItems,
  defaultActiveKey: 'tab1',
  size: 'small',
  'data-testid': 'small-tabs',
};

export const LargeSize = Template.bind({});
LargeSize.args = {
  items: defaultItems,
  defaultActiveKey: 'tab1',
  size: 'large',
  'data-testid': 'large-tabs',
};

export const CardStyle = Template.bind({});
CardStyle.args = {
  items: defaultItems,
  defaultActiveKey: 'tab1',
  type: 'card',
  'data-testid': 'card-tabs',
};

export const CenteredTabs = Template.bind({});
CenteredTabs.args = {
  items: defaultItems,
  defaultActiveKey: 'tab1',
  centered: true,
  'data-testid': 'centered-tabs',
};

export const BottomPosition = Template.bind({});
BottomPosition.args = {
  items: defaultItems,
  defaultActiveKey: 'tab1',
  tabPosition: 'bottom',
  'data-testid': 'bottom-tabs',
};

export const LeftPosition = Template.bind({});
LeftPosition.args = {
  items: defaultItems,
  defaultActiveKey: 'tab1',
  tabPosition: 'left',
  'data-testid': 'left-tabs',
};

export const RightPosition = Template.bind({});
RightPosition.args = {
  items: defaultItems,
  defaultActiveKey: 'tab1',
  tabPosition: 'right',
  'data-testid': 'right-tabs',
};

export const WithoutAnimation = Template.bind({});
WithoutAnimation.args = {
  items: defaultItems,
  defaultActiveKey: 'tab1',
  animated: false,
  'data-testid': 'no-animation-tabs',
};

// Interactive example with form fields in tabs
export const InteractiveFormTabs: Story<Props> = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    preferences: {
      notifications: true,
      darkMode: false
    }
  });
  
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };
  
  const handleCheckboxChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [field]: e.target.checked
      }
    });
  };
  
  return (
    <Tabs
      items={[
        {
          key: 'personal',
          label: 'Personal Info',
          icon: <UserIcon />,
          children: (
            <div className="tab-form">
              <div className="form-row">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name} 
                  onChange={handleInputChange('name')}
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-row">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email} 
                  onChange={handleInputChange('email')}
                  placeholder="Enter your email"
                />
              </div>
            </div>
          ),
        },
        {
          key: 'address',
          label: 'Address',
          icon: <HomeIcon />,
          children: (
            <div className="tab-form">
              <div className="form-row">
                <label htmlFor="address">Address</label>
                <textarea 
                  id="address" 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Enter your address"
                  rows={4}
                />
              </div>
            </div>
          ),
        },
        {
          key: 'settings',
          label: 'Settings',
          icon: <SettingsIcon />,
          children: (
            <div className="tab-form">
              <div className="form-row checkbox-row">
                <label htmlFor="notifications">
                  <input 
                    type="checkbox" 
                    id="notifications" 
                    checked={formData.preferences.notifications} 
                    onChange={handleCheckboxChange('notifications')}
                  />
                  Enable notifications
                </label>
              </div>
              <div className="form-row checkbox-row">
                <label htmlFor="darkMode">
                  <input 
                    type="checkbox" 
                    id="darkMode" 
                    checked={formData.preferences.darkMode} 
                    onChange={handleCheckboxChange('darkMode')}
                  />
                  Dark mode
                </label>
              </div>
            </div>
          ),
        },
      ]}
      defaultActiveKey="personal"
      data-testid="form-tabs"
      type="card"
    />
  );
};

// Add some basic form styling for the interactive example
InteractiveFormTabs.decorators = [
  (Story) => (
    <div>
      <style>{`
        .tab-form {
          padding: 16px;
          max-width: 500px;
        }
        .form-row {
          margin-bottom: 16px;
        }
        .form-row label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .form-row input[type="text"],
        .form-row input[type="email"],
        .form-row textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
        }
        .checkbox-row label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: normal;
        }
      `}</style>
      <Story />
    </div>
  ),
];