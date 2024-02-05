import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import Typing, { Props } from './Typing';

const meta: Meta = {
  title: 'Widget/Typing',
  component: Typing,
  argTypes: {
    useDefaultSentences: {
      control: {
        type: 'boolean',
      },
    },
    lang: {
      control: {
        type: 'select',
        options: ['en', 'it'],
      },
    },
  },
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story<Props> = args => (
  <I18nWrapper>
    <Typing {...args} />
  </I18nWrapper>
);
// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {};

export const WithLoadingTextIT = Template.bind({});
WithLoadingTextIT.args = {
  useDefaultSentences: true,
  lang: 'it',
};

export const WithLoadingTextEN = Template.bind({});
WithLoadingTextEN.args = {
  useDefaultSentences: true,
  lang: 'en',
};

export const WithCustomLoadingText = Template.bind({});
WithCustomLoadingText.args = {
  sentence: 'Chiedo agli unicorni cosa ne pensano...',
};

export const WithCustomLoadingTextList = Template.bind({});
WithCustomLoadingTextList.args = {
  sentences: {
    en: [
      {
        text: 'I am asking the unicorns what they think about it',
        delayAfter: 5,
      },
      {
        text: 'I am trying to understand what my cat is saying about it',
        delayAfter: 10,
      },
      {
        text: 'I am collecting the opinions of the people I know',
        delayAfter: 2,
      },
    ],
    it: [
      {
        text: 'Chiedo agli unicorni cosa ne pensano',
        delayAfter: 5,
      },
      {
        text: 'Sto cercando di capire cosa ne pensa il mio gatto',
        delayAfter: 10,
      },
      {
        text: 'Sto raccogliendo le opinioni delle persone che conosco',
        delayAfter: 2,
      },
    ],
  },
};

export const WithCustomLoadingTextListAndInitialDelay = Template.bind({});
WithCustomLoadingTextListAndInitialDelay.args = {
  sentences: {
    en: [
      {
        text: '',
        delayAfter: 10,
      },
      {
        text: 'I am asking the unicorns what they think about it',
        delayAfter: 5,
      },
      {
        text: 'I am trying to understand what my cat is saying about it',
        delayAfter: 10,
      },
      {
        text: 'I am collecting the opinions of the people I know',
        delayAfter: 2,
      },
    ],
    it: [
      {
        text: '',
        delayAfter: 10,
      },
      {
        text: 'Chiedo agli unicorni cosa ne pensano',
        delayAfter: 5,
      },
      {
        text: 'Sto cercando di capire cosa ne pensa il mio gatto',
        delayAfter: 10,
      },
      {
        text: 'Sto raccogliendo le opinioni delle persone che conosco',
        delayAfter: 2,
      },
    ],
  },
};
