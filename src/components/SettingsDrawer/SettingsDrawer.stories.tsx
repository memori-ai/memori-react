import React from 'react';
import { Meta, Story } from '@storybook/react';
import SettingsDrawer, { Props } from './SettingsDrawer';
import './SettingsDrawer.css';

const meta: Meta = {
  title: 'Widget/SettingsDrawer',
  component: SettingsDrawer,
  argTypes: {
    open: {
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

const Template: Story<Props> = args => <SettingsDrawer {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  open: true,
  onClose: () => {},
  continuousSpeech: false,
  continuousSpeechTimeout: 2,
  setContinuousSpeech: () => {},
  setContinuousSpeechTimeout: () => {},
};
