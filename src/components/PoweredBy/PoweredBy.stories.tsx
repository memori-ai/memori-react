import { Meta, Story } from '@storybook/react';
import PoweredBy, { Props } from './PoweredBy';

import './PoweredBy.css';

const meta: Meta = {
  title: 'Powered by',
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

export const MemoryTwin = Template.bind({});
MemoryTwin.args = {
  tenant: {
    id: 'memorytwin',
    theme: 'memorytwin',
    config: {
      name: 'MemoryTwin',
      showNewUser: true,
      requirePosition: false,
      feedbackURL: '',
    },
  },
};

export const Italian = Template.bind({});
Italian.args = {
  userLang: 'it',
};
