import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import LoginDrawer, { Props } from './LoginDrawer';
import { tenant, user } from '../../mocks/data';
import './LoginDrawer.css';

const meta: Meta = {
  title: 'Widget/LoginDrawer',
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
      <LoginDrawer
        {...args}
        onClose={() => {}}
        onLogin={console.log}
        onLogout={() => {}}
        tenant={tenant}
        apiUrl="https://backend.memori.ai"
      />
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

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  open: true,
  user,
  loginToken: 'token',
};
