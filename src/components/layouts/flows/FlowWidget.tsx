import React from 'react';
import { AlertProvider, Spin } from '@memori.ai/ui';
import memoriApiClient from '@memori.ai/memori-api-client';
import type {
  Memori,
  Tenant,
  Venue,
} from '@memori.ai/memori-api-client/src/types';
import MemoriWidget, {
  Props as WidgetProps,
} from '../../MemoriWidget/MemoriWidget';
import {
  removeLocalConfig,
  setLocalConfig,
} from '../../../helpers/configuration';

type MemoriOverrides = Partial<Memori> & { requireLoginToken?: boolean };

export interface FlowWidgetProps extends Omit<WidgetProps, 'memori'> {
  memoriID: string;
  /** Applied on top of the agent fetched from the API (gate flags). */
  memoriOverrides?: MemoriOverrides;
  /** Pre-seeds localStorage as if the user had already shared/skipped position. */
  storedPosition?: Venue;
  /** Pre-seeds localStorage as if the user had already passed age verification. */
  storedBirthDate?: string;
}

/**
 * Fetches the live agent (like `<Memori>`), then applies `memoriOverrides` so
 * stories can force `needsPosition` / `requireLoginToken` / `ageRestriction`
 * without editing the agent. Gate state persisted in localStorage is reset on
 * every mount, so each story starts from a clean first visit.
 */
export const FlowWidget: React.FC<FlowWidgetProps> = ({
  memoriID,
  memoriOverrides,
  storedPosition,
  storedBirthDate,
  authToken,
  ...args
}) => {
  const didReset = React.useRef(false);
  if (!didReset.current) {
    removeLocalConfig('position');
    removeLocalConfig('birthDate');
    removeLocalConfig('loginToken');
    if (storedPosition) {
      setLocalConfig('position', JSON.stringify(storedPosition));
    }
    if (storedBirthDate) {
      setLocalConfig('birthDate', storedBirthDate);
    }
    didReset.current = true;
  }

  const [memori, setMemori] = React.useState<Memori>();
  const [tenant, setTenant] = React.useState<Tenant>();
  const [error, setError] = React.useState<string>();

  const { apiURL, engineURL, tenantID, ownerUserID } = args;
  React.useEffect(() => {
    if (!tenantID || !ownerUserID) return;
    const client = memoriApiClient(apiURL, engineURL);
    client.backend
      .getMemoriByUserAndId(tenantID, ownerUserID, memoriID)
      .then(({ memori, ...resp }) => {
        if (resp.resultCode === 0 && memori) setMemori(memori);
        else setError(resp.resultMessage);
      })
      .catch(e => setError(String(e)));
    client.backend.tenant
      .getTenant(tenantID)
      .then(({ tenant }) => setTenant(tenant))
      .catch(() => {});
  }, [apiURL, engineURL, tenantID, ownerUserID, memoriID]);

  if (error) return <p>Failed to load agent: {error}</p>;
  if (!memori) return <Spin spinning />;

  return (
    <AlertProvider defaultDuration={5000}>
      <MemoriWidget
        {...args}
        tenant={tenant}
        memori={{ ...memori, ...memoriOverrides }}
        authToken={authToken || undefined}
      />
    </AlertProvider>
  );
};

/** Remount (and reset localStorage) whenever the story or its controls change. */
export const renderFlow = (args: FlowWidgetProps, context: { id: string }) => (
  <FlowWidget key={`${context.id}:${JSON.stringify(args)}`} {...args} />
);

/** Staging "Layout Storybook" agent (same as `src/index.stories.tsx`). */
export const flowBase: FlowWidgetProps = {
  memoriID: 'ae20fc5a-cc15-4db9-b7dd-2cd4a621b85e',
  ownerUserID: '91dbc9ba-b684-4fbe-9828-b5980af6cda9',
  ownerUserName: 'andrea.patini',
  tenantID: 'aisuru-staging.aclambda.online',
  baseUrl: 'https://aisuru-staging.aclambda.online',
  engineURL: 'https://engine-staging.memori.ai/memori/v2',
  apiURL: 'https://backend-staging.memori.ai/api/v2',
  uiLang: 'IT',
  spokenLang: 'IT',
  showShare: true,
  showSettings: true,
  autoStart: false,
  /**
   * No gates by default, regardless of how the agent is configured. The engine
   * enforces the agent's age restriction, so it is satisfied via
   * `storedBirthDate` instead of being overridden.
   */
  memoriOverrides: {
    needsPosition: false,
    requireLoginToken: false,
    privacyType: 'PUBLIC',
  },
  storedBirthDate: '1990-01-01T00:00:00.000Z',
};

export const noGates = flowBase.memoriOverrides as MemoriOverrides;

export const flowArgTypes = {
  autoStart: { control: 'boolean' },
  showLogin: { control: 'boolean' },
  showShare: { control: 'boolean' },
  showClear: { control: 'boolean' },
  showMessageConsumption: { control: 'boolean' },
  authToken: {
    control: 'text',
    description:
      'Paste a real PWL login token for the tenant to simulate a logged-in user (fake tokens are rejected by `pwlGetCurrentUser`).',
  },
  sessionID: { control: 'text' },
  memoriOverrides: { control: 'object' },
  storedPosition: { control: 'object' },
  storedBirthDate: { control: 'text' },
};
