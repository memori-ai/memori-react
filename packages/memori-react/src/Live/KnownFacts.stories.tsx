import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import memoriApiClient from '@memori.ai/memori-api-client';
import { AlertProvider } from '@memori.ai/ui';
import KnownFacts from '../components/KnownFacts/KnownFacts';
import '../components/KnownFacts/KnownFacts.css';

/**
 * Localhost-only KnownFacts demo. Prefer Surfaces/Known Facts fixtures for review.
 */
const meta = {
  title: 'Live/Known Facts',
  component: KnownFacts,
  parameters: {
    controls: { expanded: true },
  },
} satisfies Meta<typeof KnownFacts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithRealDataLocalhost: Story = {
  render: args => (
    <AlertProvider defaultDuration={5000}>
      <KnownFacts
        {...args}
        // @ts-expect-error storybook live demo memori shape
        memori={{
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
        }}
        sessionID="5841f5f9-3315-4a5a-9b62-33b13d5a27fd"
        closeDrawer={() => {}}
        apiClient={memoriApiClient()}
      />
    </AlertProvider>
  ),
  args: {
    visible: true,
  },
};
