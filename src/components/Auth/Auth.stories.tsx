import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import AuthWidget, { Props } from './Auth';

const meta: Meta = {
  title: 'Auth Widget',
  component: AuthWidget,
  argTypes: {
    pwdOrTokens: {
      control: {
        type: 'select',
        options: ['password', 'tokens'],
      },
    },
    showTokens: {
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
  const [pwdOrTokens, setPwdOrTokens] = useState<'password' | 'tokens'>(
    args.pwdOrTokens as 'password' | 'tokens'
  );

  return (
    <AuthWidget
      {...args}
      pwdOrTokens={pwdOrTokens}
      setPwdOrTokens={setPwdOrTokens}
    />
  );
};

const TemplateWithModal: Story<Props> = args => {
  const [pwdOrTokens, setPwdOrTokens] = useState<'password' | 'tokens'>(
    args.pwdOrTokens as 'password' | 'tokens'
  );

  return (
    <AuthWidget
      {...args}
      withModal
      pwdOrTokens={pwdOrTokens}
      setPwdOrTokens={setPwdOrTokens}
    />
  );
};

export const Password = Template.bind({});
Password.args = {
  pwdOrTokens: 'password',
  minimumNumberOfRecoveryTokens: 2,
  showTokens: false,
};

export const WithTokens = Template.bind({});
WithTokens.args = {
  pwdOrTokens: 'password',
  minimumNumberOfRecoveryTokens: 2,
  showTokens: true,
};

export const Tokens = Template.bind({});
Tokens.args = {
  pwdOrTokens: 'tokens',
  minimumNumberOfRecoveryTokens: 2,
  showTokens: true,
};

export const WithModal = TemplateWithModal.bind({});
WithModal.args = {
  pwdOrTokens: 'password',
  minimumNumberOfRecoveryTokens: 2,
  showTokens: true,
};
