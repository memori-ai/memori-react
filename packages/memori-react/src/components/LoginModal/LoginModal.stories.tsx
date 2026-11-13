import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import LoginModal, { Props } from './LoginModal';
import { tenant } from '../../mocks/data';
import memoriApiClient from '@memori.ai/memori-api-client';
import './LoginModal.css';
import { AlertProvider } from '@memori.ai/ui';

const meta: Meta = {
  title: 'Surfaces/LoginModal',
  component: LoginModal,
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
        <LoginModal
          {...args}
          onClose={() => {}}
          onLogin={console.log}
          onLogout={() => {}}
          tenant={tenant}
          apiClient={memoriApiClient()}
          setUser={() => {}}
        />
      </AlertProvider>
    </I18nWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  open: true,
  memoriName: 'Layout Storybook',
};

export const NeedsMissingData = Template.bind({});
NeedsMissingData.args = {
  open: true,
  memoriName: 'Layout Storybook',
  __TEST__needMissingData: true,
};
