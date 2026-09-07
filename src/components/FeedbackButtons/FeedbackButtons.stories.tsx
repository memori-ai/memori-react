import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import FeedbackButtons, { Props } from './FeedbackButtons';
import { memori } from '../../mocks/data';

import './FeedbackButtons.css';
import { AlertProvider, AlertViewport } from '@memori.ai/ui';

const meta: Meta = {
  title: 'Internals/Feedback Buttons',
  component: FeedbackButtons,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
    layout: 'centered',
  },
};

export default meta;

const Template: Story<Props> = args => (
  <I18nWrapper>
    <AlertProvider defaultDuration={5000}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            flex: 'none',
            alignItems: 'center',
            padding: '6px 10px',
            borderRadius: 999,
            background:
              'color-mix(in srgb, var(--memori-main-background, #fff) 92%, transparent)',
            boxShadow:
              '0 4px 16px color-mix(in srgb, var(--memori-text-color, #111827) 18%, transparent)',
          }}
        >
          <FeedbackButtons {...args} />
        </div>
      </div>
      <AlertViewport />
    </AlertProvider>
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
