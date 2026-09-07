import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import LoginDrawer, { Props } from './LoginDrawer';
import { tenant } from '../../mocks/data';
import memoriApiClient from '@memori.ai/memori-api-client';
import './LoginDrawer.css';
import { AlertProvider } from '@memori.ai/ui';

const meta: Meta = {
  title: 'Surfaces/LoginDrawer',
  component: LoginDrawer,
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

const Template: Story<Props> = args => {
  return (
    <I18nWrapper>
      <AlertProvider defaultDuration={5000}>
      <LoginDrawer
        {...args}
        onClose={() => {}}
        onLogin={console.log}
        onLogout={() => {}}
        tenant={tenant}
        apiClient={memoriApiClient()}
      />
      </AlertProvider>
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  open: true,
};

export const NeedsMissingData = Template.bind({});
NeedsMissingData.args = {
  open: true,
  __TEST__needMissingData: true,
};
