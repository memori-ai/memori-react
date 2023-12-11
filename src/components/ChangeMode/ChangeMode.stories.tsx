import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import ChangeMode, { Props } from './ChangeMode';

import './ChangeMode.css';

const meta: Meta = {
  title: 'Widget/Change Mode',
  component: ChangeMode,
  argTypes: {
    instruct: {
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
  const [instruct, setInstruct] = React.useState(args.instruct);

  return (
    <I18nWrapper>
      <ChangeMode
        {...args}
        canInstruct
        instruct={instruct}
        onChangeMode={mode => setInstruct(mode === 'instruct')}
      />
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  instruct: false,
};

export const Instruct = Template.bind({});
Instruct.args = {
  instruct: true,
};
