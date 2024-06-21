import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import CompletionProviderStatus, { Props } from './CompletionProviderStatus';

import './CompletionProviderStatus.css';

const meta: Meta = {
  title: 'Completion Provider Status',
  component: CompletionProviderStatus,
  argTypes: {},
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => (
  <I18nWrapper>
    <CompletionProviderStatus {...args} />
  </I18nWrapper>
);

export const Default = Template.bind({});
Default.args = {};

export const Errored = Template.bind({});
Errored.args = {
  forceStatus: 'major_outage',
};

export const WithSpecifiedProvider = Template.bind({});
WithSpecifiedProvider.args = {
  provider: 'OpenAI',
};

export const ErroredWithSpecifiedProvider = Template.bind({});
ErroredWithSpecifiedProvider.args = {
  forceStatus: 'major_outage',
  provider: 'OpenAI',
};
