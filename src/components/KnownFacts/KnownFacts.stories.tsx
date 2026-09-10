import React from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, sessionID, knownFact } from '../../mocks/data';
import I18nWrapper from '../../I18nWrapper';
import KnownFacts, { Props } from './KnownFacts';
import memoriApiClient from '@memori.ai/memori-api-client';

import './KnownFacts.css';
import { AlertProvider } from '@memori.ai/ui';

const meta: Meta = {
  title: 'Surfaces/Known Facts',
  component: KnownFacts,
  argTypes: {
    visible: {
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

const Template: Story<Props> = args => (
  <I18nWrapper>
    <AlertProvider defaultDuration={5000}>
      <KnownFacts
        // @ts-ignore-next-line
        memori={memori}
        {...args}
        sessionID={sessionID}
        closeDrawer={() => {}}
        apiClient={memoriApiClient()}
      />
    </AlertProvider>
  </I18nWrapper>
);

export const Default = Template.bind({});
Default.args = {
  visible: true,
};

export const WithData = Template.bind({});
WithData.args = {
  visible: true,
  initialKnownFacts: [knownFact],
};

export const WithPaginatedData = Template.bind({});
WithPaginatedData.args = {
  visible: true,
  initialKnownFacts: new Array(26).fill(knownFact).map((fact, index) => ({
    ...fact,
    knownFactID: fact.knownFactID + index,
  })),
};
