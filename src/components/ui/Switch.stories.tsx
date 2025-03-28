import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import Switch, { Props } from './Switch';
import './Switch.css';

const meta: Meta = {
  title: 'UI/Switch',
  component: Switch,
  argTypes: {
    checked: {
      control: {
        type: 'boolean',
      },
    },
    defaultChecked: {
      control: {
        type: 'boolean',
      },
    },
    disabled: {
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
    loading: {
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

const Template: Story<Props> = args => {
  const [checked, setChecked] = useState(args.checked || args.defaultChecked || false);
  
  const handleChange = (newChecked: boolean) => {
    setChecked(newChecked);
    if (args.onChange) {
      args.onChange(newChecked);
    }
  };
  
  return <Switch {...args} checked={checked} onChange={handleChange} />;
};

export const Default = Template.bind({});
Default.args = {};

export const Checked = Template.bind({});
Checked.args = {
  defaultChecked: true,
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: 'Toggle feature',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const DisabledAndChecked = Template.bind({});
DisabledAndChecked.args = {
  disabled: true,
  defaultChecked: true,
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
};

export const LoadingAndChecked = Template.bind({});
LoadingAndChecked.args = {
  loading: true,
  defaultChecked: true,
};

export const WithTestId = Template.bind({});
WithTestId.args = {
  'data-testid': 'feature-toggle',
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  checkedChildren: 'ON',
  unCheckedChildren: 'OFF',
};

export const SmallWithChildren = Template.bind({});
SmallWithChildren.args = {
  size: 'small',
  checkedChildren: '✓',
  unCheckedChildren: '✗',
};

export const LargeWithChildren = Template.bind({});
LargeWithChildren.args = {
  size: 'large',
  checkedChildren: 'ENABLED',
  unCheckedChildren: 'DISABLED',
};

// Interactive example with form integration
export const InteractiveForm: Story<Props> = () => {
  const [formState, setFormState] = useState({
    disableR2R3Loop: false,
    enableNotifications: true,
    darkMode: false,
  });

  const handleFieldChange = (field: string) => (checked: boolean) => {
    setFormState({
      ...formState,
      [field]: checked,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
      <h3>Settings</h3>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Disable R2R3 Loop</span>
        <Switch
          data-testid="r2r3-loop-switch"
          checked={formState.disableR2R3Loop}
          onChange={handleFieldChange('disableR2R3Loop')}
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Enable Notifications</span>
        <Switch
          data-testid="notifications-switch"
          checked={formState.enableNotifications}
          onChange={handleFieldChange('enableNotifications')}
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Dark Mode</span>
        <Switch
          data-testid="dark-mode-switch"
          checked={formState.darkMode}
          onChange={handleFieldChange('darkMode')}
        />
      </div>
      
      <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <pre style={{ margin: 0 }}>{JSON.stringify(formState, null, 2)}</pre>
      </div>
    </div>
  );
};