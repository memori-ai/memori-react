import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import DateSelector, { Props } from './DateSelector';

import './DateSelector.css';

const meta: Meta = {
  title: 'DateSelector',
  component: DateSelector,
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
  },
};

export default meta;

const Template: Story<Props> = args => (
  <I18nWrapper>
    <DateSelector {...args} />
  </I18nWrapper>
);
// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  defaultDate: new Date(Date.now()),
  onChange: console.log,
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  defaultDate: new Date(Date.now()),
  onChange: () => {},
  disabled: false,
};
