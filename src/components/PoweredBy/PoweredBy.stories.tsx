import { Meta, Story } from '@storybook/react';
import PoweredBy, { Props } from './PoweredBy';

import './PoweredBy.css';

const meta: Meta = {
  title: 'Internals/Powered by',
  component: PoweredBy,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => <PoweredBy {...args} />;

export const Default = Template.bind({});
Default.args = {
  userLang: 'en',
};
