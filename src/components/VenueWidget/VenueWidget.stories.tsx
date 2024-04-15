import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import VenueWidget, { Props } from './VenueWidget';
import { venue } from '../../mocks/data';
import './VenueWidget.css';

const meta: Meta = {
  title: 'Widget/VenueWidget',
  component: VenueWidget,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => {
  const [venue, setVenue] = React.useState(args.venue);
  return (
    <I18nWrapper>
      <VenueWidget {...args} venue={venue} setVenue={setVenue} />
    </I18nWrapper>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {};

export const WithVenueExactLocartion = Template.bind({});
WithVenueExactLocartion.args = {
  venue: {
    ...venue,
    uncertainty: 0,
  },
};

export const WithVenueUncertainty = Template.bind({});
WithVenueUncertainty.args = {
  venue: {
    ...venue,
    uncertainty: 2,
  },
};

export const WithVenueLargeUncertainty = Template.bind({});
WithVenueLargeUncertainty.args = {
  venue: {
    ...venue,
    uncertainty: 20,
  },
};

export const WithUncertaintyUI = Template.bind({});
WithUncertaintyUI.args = {
  venue,
  showUncertainty: true,
};

export const WithoutGpsButton = Template.bind({});
WithoutGpsButton.args = {
  venue,
  showGpsButton: false,
};
