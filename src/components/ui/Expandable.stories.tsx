import React from 'react';
import { Meta, Story } from '@storybook/react';
import Expandable, { Props } from './Expandable';

import './Expandable.css';

const meta: Meta = {
  title: 'UI/Expandable',
  component: Expandable,
  argTypes: {
    className: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => (
  <Expandable {...args}>
    Suspendisse a sodales nulla, sed semper nisi. Suspendisse a sodales nulla,
    sed semper nisi. Suspendisse a sodales nulla, sed semper nisi. Suspendisse a
    sodales nulla, sed semper nisi. Suspendisse a sodales nulla, sed semper
    nisi.
  </Expandable>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  rows: 2,
};

export const DefaultExpanded = Template.bind({});
DefaultExpanded.args = {
  rows: 3,
  defaultExpanded: true,
};

export const WithCustomProps = Template.bind({});
WithCustomProps.args = {
  rows: 3,
  innerClassName: 'custom-inner-class',
  btnClassName: 'custom-btn-class',
  expandSymbol: () => '🔽',
  collapseSymbol: () => '🔼',
};
