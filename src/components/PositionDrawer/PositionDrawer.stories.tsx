import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import PositionDrawer, { Props } from './PositionDrawer';
import { Venue } from '@memori.ai/memori-api-client/dist/types';
import { venue, memori } from '../../mocks/data';

const meta: Meta = {
  title: 'Widget/PositionDrawer',
  component: PositionDrawer,
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
  const [venue, setVenue] = React.useState<Venue | undefined>(args.venue);

  return (
    <I18nWrapper>
      <PositionDrawer
        {...args}
        memori={memori}
        venue={venue}
        setVenue={setVenue}
      />
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  open: true,
};

export const WithVenue = Template.bind({});
WithVenue.args = {
  open: true,
  venue,
};
