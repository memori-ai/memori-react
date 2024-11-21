import React from 'react';
import { Meta, Story } from '@storybook/react';
import { memori, sessionID, knownFact } from '../../mocks/data';
import I18nWrapper from '../../I18nWrapper';
import KnownFacts, { Props } from './KnownFacts';
import memoriApiClient from '@memori.ai/memori-api-client';

import './KnownFacts.css';

const meta: Meta = {
  title: 'Known Facts',
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
    <KnownFacts
      // @ts-ignore-next-line
      memori={memori}
      {...args}
      sessionID={sessionID}
      closeDrawer={() => {}}
      apiClient={memoriApiClient()}
    />
  </I18nWrapper>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
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

export const WithRealDataLocalhost = Template.bind({});
WithRealDataLocalhost.args = {
  visible: true,
  sessionID: '5841f5f9-3315-4a5a-9b62-33b13d5a27fd',
  memori: {
    memoriName: 'test memori',
    ownerUserName: 'nicola',
    memoriID: '1a9c75e8-57aa-4ce3-8ea5-256185fa79a7',
    ownerUserID: '04a8cff9-13d6-4367-9cb2-72b9af9ee494',
    tenantID: 'app.memorytwin.com',
    apiURL: 'http://localhost:7778',
    baseURL: 'http://localhost:3000',
    uiLang: 'EN',
    lang: 'IT',
    layout: 'FULLPAGE',
    showShare: 'true',
    integrationID: '82f017cc-450b-4c47-acf5-47910d336ce9',
  },
};
