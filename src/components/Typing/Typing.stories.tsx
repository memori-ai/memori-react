import React from 'react';
import { Meta, Story } from '@storybook/react';
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
    sentence: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story<Props> = args => <Typing {...args} />;

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
