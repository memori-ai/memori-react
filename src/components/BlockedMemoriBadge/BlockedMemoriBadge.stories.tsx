import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import BlockedMemoriBadge, { Props } from './BlockedMemoriBadge';

import './BlockedMemoriBadge.css';

const meta: Meta = {
  title: 'Blocked Memori Badge',
  component: BlockedMemoriBadge,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => (
  <I18nWrapper>
    <BlockedMemoriBadge {...args} />
  </I18nWrapper>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  memoriName: 'John Doe',
  blockedUntil: '2051-01-01T00:00:00.000Z',
};

export const WithGiverInfo = Template.bind({});
WithGiverInfo.args = {
  memoriName: 'John Doe',
  blockedUntil: '2051-01-01T00:00:00.000Z',
  showGiverInfo: true,
};

export const WithTitle = Template.bind({});
WithTitle.args = {
  memoriName: 'John Doe',
  blockedUntil: '2051-01-01T00:00:00.000Z',
  showTitle: true,
};

export const WithMarginLeft = Template.bind({});
WithMarginLeft.args = {
  memoriName: 'John Doe',
  blockedUntil: '2051-01-01T00:00:00.000Z',
  marginLeft: true,
};

export const NotEnoughCredits = Template.bind({});
NotEnoughCredits.args = {
  memoriName: 'John Doe',
  notEnoughCredits: true,
};
