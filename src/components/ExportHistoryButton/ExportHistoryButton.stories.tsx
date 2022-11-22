import React from 'react';
import { Meta, Story } from '@storybook/react';
import ExportHistoryButton, { Props } from './ExportHistoryButton';
import { memori, history } from '../../mocks/data';
import Download from '../icons/Download';

const meta: Meta = {
  title: 'Export History Button',
  component: ExportHistoryButton,
  argTypes: {
    memori: {
      control: {
        type: 'object',
      },
    },
    icon: {
      control: {
        type: 'object',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => (
  <div style={{ textAlign: 'right' }}>
    <ExportHistoryButton {...args} />
  </div>
);

const TemplateRight: Story<Props> = args => (
  <div style={{ textAlign: 'left' }}>
    <ExportHistoryButton {...args} />
  </div>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  memori,
  history,
};

export const WithCustomIcon = Template.bind({});
WithCustomIcon.args = {
  memori,
  history,
  icon: <Download />,
};

export const WithCustomCSSClass = Template.bind({});
WithCustomCSSClass.args = {
  memori,
  history,
  buttonClassName: 'memori-button--primary',
};

export const AlignLeft = TemplateRight.bind({});
AlignLeft.args = {
  memori,
  history,
  align: 'left',
};
