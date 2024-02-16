import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import ExpertsDrawer, { Props } from './ExpertsDrawer';
import { tenant, expertReference } from '../../mocks/data';
import './ExpertsDrawer.css';

const meta: Meta = {
  title: 'Widget/ExpertsDrawer',
  component: ExpertsDrawer,
  argTypes: {
    open: {
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => {
  return (
    <I18nWrapper>
      <ExpertsDrawer
        {...args}
        baseUrl="https://aisuru.com"
        apiUrl="https://backend.memori.ai"
        tenant={tenant}
        experts={[
          expertReference,
          {
            ...expertReference,
            expertID: '2',
            name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          },
        ]}
      />
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  open: true,
  onClose: () => {},
};
