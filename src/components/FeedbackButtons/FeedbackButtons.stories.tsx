import React from 'react';
import { Meta, Story } from '@storybook/react';
import FeedbackButtons, { Props } from './FeedbackButtons';
import { memori } from '../../mocks/data';

const meta: Meta = {
  title: 'Feedback Buttons',
  component: FeedbackButtons,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => <FeedbackButtons {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  memori,
  onNegativeClick: () => {},
};
