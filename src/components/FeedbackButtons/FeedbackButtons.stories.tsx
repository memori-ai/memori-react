import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import FeedbackButtons, { Props } from './FeedbackButtons';
import { memori } from '../../mocks/data';

import './FeedbackButtons.css';

const meta: Meta = {
  title: 'Feedback Buttons',
  component: FeedbackButtons,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
  decorators: [
    Story => (
      <div style={{ textAlign: 'right', padding: '0 3rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

const Template: Story<Props> = args => (
  <I18nWrapper>
    <FeedbackButtons {...args} />
  </I18nWrapper>
);
// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  memori,
  onNegativeClick: () => {},
};

export const Toggle = Template.bind({});
Toggle.args = {
  memori,
  toggle: true,
  onNegativeClick: () => {},
};

export const Dropdown = Template.bind({});
Dropdown.args = {
  memori,
  dropdown: true,
  onNegativeClick: () => {},
};
