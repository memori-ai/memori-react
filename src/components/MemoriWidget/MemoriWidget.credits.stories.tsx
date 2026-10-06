import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { AlertProvider } from '@memori.ai/ui';
import { memori, tenant } from '../../mocks/data';
import MemoriWidget, { Props as WidgetProps } from './MemoriWidget';
import { withWidgetProviders } from '../../../.storybook/decorators';

import './MemoriWidget.css';

type CreditsScenario =
  | 'enough'
  | 'notEnough'
  | 'rejected400'
  | 'forbidden403'
  | 'notFound404'
  | 'serverError500'
  | 'networkError';

const scenarioResponses: Record<
  CreditsScenario,
  { status: number; body?: unknown } | 'networkError'
> = {
  enough: { status: 200, body: { enough: true, required: 1, tokens: 1000 } },
  notEnough: { status: 200, body: { enough: false, required: 1, tokens: 0 } },
  rejected400: {
    status: 400,
    body: { error: 'Either userID or engineMemoriID must be provided' },
  },
  forbidden403: { status: 403, body: { error: 'Forbidden' } },
  notFound404: { status: 404, body: { error: 'Not found' } },
  serverError500: { status: 500, body: { error: 'Internal server error' } },
  networkError: 'networkError',
};

interface CreditsStoryArgs extends WidgetProps {
  creditsScenario: CreditsScenario;
  /** Delay of the mocked /api/verify-tokens response, in milliseconds. */
  creditsDelayMs: number;
  /** When false the agent has no ownerUserID, as in embeds loaded by name. */
  withOwnerUserID: boolean;
}

const isVerifyTokensRequest = (input: Request | string | URL) =>
  String(input instanceof Request ? input.url : input).includes(
    '/api/verify-tokens'
  );

type MockConfig = { scenario: CreditsScenario; delayMs: number };

// A single interceptor installed once: on a control change the new widget
// renders before the old one unmounts, so per-instance patch/restore of
// `window.fetch` would let the old cleanup drop the new mock.
let activeMock: MockConfig | null = null;
let interceptorInstalled = false;

const installInterceptor = () => {
  if (interceptorInstalled) return;
  interceptorInstalled = true;
  const realFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const mock = activeMock;
    if (!mock || !isVerifyTokensRequest(input)) return realFetch(input, init);

    // eslint-disable-next-line no-console
    console.info(
      `[credits mock] ${mock.scenario}`,
      init?.body ? JSON.parse(String(init.body)) : undefined
    );
    await new Promise(resolve => setTimeout(resolve, mock.delayMs));

    const response = scenarioResponses[mock.scenario];
    if (response === 'networkError') {
      throw new TypeError('Failed to fetch');
    }
    return new Response(JSON.stringify(response.body ?? {}), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  };
};

/**
 * Activates the mock during render, before the widget's mount effects, so its
 * first credits check already hits it. Every other request goes to the real
 * services.
 */
const useMockedVerifyTokens = (scenario: CreditsScenario, delayMs: number) => {
  const config = React.useRef<MockConfig>();
  if (!config.current) {
    config.current = { scenario, delayMs };
    installInterceptor();
    activeMock = config.current;
  }

  React.useEffect(
    () => () => {
      if (activeMock === config.current) activeMock = null;
    },
    []
  );
};

const MockedWidget = ({
  creditsScenario,
  creditsDelayMs,
  withOwnerUserID,
  ...props
}: CreditsStoryArgs) => {
  useMockedVerifyTokens(creditsScenario, creditsDelayMs);

  return (
    <AlertProvider defaultDuration={5000}>
      <MemoriWidget
        {...props}
        memori={{
          ...props.memori,
          ownerUserID: withOwnerUserID ? props.memori.ownerUserID : undefined,
        }}
      />
    </AlertProvider>
  );
};

const meta: Meta<CreditsStoryArgs> = {
  title: 'Compositions/MemoriWidget/Credits',
  component: MemoriWidget,
  decorators: [withWidgetProviders],
  // Remount on every control change: the mock and the credits check run on mount.
  render: args => (
    <MockedWidget
      key={`${args.creditsScenario}-${args.creditsDelayMs}-${args.withOwnerUserID}-${args.autoStart}`}
      {...args}
    />
  ),
  argTypes: {
    creditsScenario: {
      control: { type: 'select' },
      options: Object.keys(scenarioResponses),
      description: 'Mocked response of POST /api/verify-tokens',
    },
    creditsDelayMs: { control: { type: 'number', min: 0, step: 250 } },
    withOwnerUserID: { control: { type: 'boolean' } },
    autoStart: { control: { type: 'boolean' } },
  },
  args: {
    memori,
    tenant: { ...tenant, billingDelegation: true },
    tenantID: 'www.aisuru.com',
    ownerUserName: 'memoridev',
    apiURL: 'https://backend.memori.ai',
    engineURL: 'https://engine.memori.ai',
    baseUrl: 'https://www.aisuru.com',
    layout: 'FULLPAGE',
    enableAudio: false,
    autoStart: false,
    creditsScenario: 'enough',
    creditsDelayMs: 300,
    withOwnerUserID: false,
  },
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<CreditsStoryArgs>;

/** The owner has credits: the start button is enabled and the chat opens. */
export const EnoughCredits: Story = {};

/** The owner has no credits: disabled start button, badge and notice. */
export const NotEnoughCredits: Story = {
  args: { creditsScenario: 'notEnough' },
};

/** Same as above with autostart: the start panel stays visible instead of
 * opening the chat. */
export const NotEnoughCreditsWithAutoStart: Story = {
  args: { creditsScenario: 'notEnough', autoStart: true },
};

/** The API rejects the request (missing identifiers): the session is blocked
 * with the "couldn't verify credits" notice. */
export const CheckRejected400: Story = {
  args: { creditsScenario: 'rejected400' },
};

export const CheckRejected400WithAutoStart: Story = {
  args: { creditsScenario: 'rejected400', autoStart: true },
};

/** Bot user agent rejected by the API. Currently blocked like any 4xx. */
export const CheckForbidden403: Story = {
  args: { creditsScenario: 'forbidden403' },
};

/** `baseUrl` pointing to a site without /api/verify-tokens. Currently blocked
 * like any 4xx. */
export const CheckNotFound404: Story = {
  args: { creditsScenario: 'notFound404' },
};

/** Server error: fails open, the session starts as before. */
export const CheckServerError500: Story = {
  args: { creditsScenario: 'serverError500', autoStart: true },
};

/** Network error: fails open, the session starts as before. */
export const CheckNetworkError: Story = {
  args: { creditsScenario: 'networkError', autoStart: true },
};

/** Slow API: shows what the user sees while the check is pending. */
export const SlowCheck: Story = {
  args: { creditsScenario: 'notEnough', creditsDelayMs: 4000 },
};

/** Embed that knows the owner: the request carries both userID and
 * engineMemoriID (see the browser console). */
export const WithOwnerUserID: Story = {
  args: { creditsScenario: 'enough', withOwnerUserID: true },
};
