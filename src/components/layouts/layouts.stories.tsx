import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spin } from '@memori.ai/ui';
import { memori, tenant, integration } from '../../mocks/data';
import Memori, { Props } from '../../index';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import { withWidgetProviders } from '../../../.storybook/decorators';

/**
 * Canonical layout matrix — one story per LayoutName (plus Custom + HiddenChat note).
 * Live staging/localhost agents live under `Live/` (see Live/Agents.stories.tsx).
 */
const meta = {
  title: 'Layouts',
  component: Memori,
  decorators: [withWidgetProviders],
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Memori>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fixture-first base — deterministic sidebar entry for each layout. */
const fixtureBase: Partial<Props> = {
  memori,
  tenant,
  memoriName: memori.name,
  memoriID: memori.memoriID,
  ownerUserName: 'memoridev',
  tenantID: 'www.aisuru.com',
  engineURL: 'https://engine.memori.ai',
  apiURL: 'https://backend.memori.ai',
  baseURL: 'https://www.aisuru.com',
  uiLang: 'IT',
  spokenLang: 'IT',
  showSettings: true,
  showShare: true,
};

/** Default layout = FULLPAGE (not Zoomed). */
export const FullPage: Story = {
  args: {
    ...fixtureBase,
    layout: 'FULLPAGE',
  },
};

export const Chat: Story = {
  args: {
    ...fixtureBase,
    layout: 'CHAT',
    showUpload: true,
  },
};

export const Totem: Story = {
  args: {
    ...fixtureBase,
    layout: 'TOTEM',
    integration: { ...integration },
  },
};

export const ZoomedFullBody: Story = {
  args: {
    ...fixtureBase,
    layout: 'ZOOMED_FULL_BODY',
  },
};

export const WebsiteAssistant: Story = {
  args: {
    ...fixtureBase,
    layout: 'WEBSITE_ASSISTANT',
    multilingual: true,
    integration: {
      ...integration,
      customData: JSON.stringify({
        textColor: '#2a2a2a',
        buttonBgColor: '#653165',
        buttonTextColor: '#ffffff',
        blurBackground: true,
        innerBgColor: 'light',
        innerBgAlpha: 0.8,
        multilanguage: true,
        avatar: 'readyplayerme',
        avatarURL:
          'https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb',
      }),
    },
  },
};

export const WebsiteAssistantWithout3DAvatar: Story = {
  args: {
    ...WebsiteAssistant.args,
    avatar3dHidden: true,
  },
};

/** Collapsed / FAB entry point for HIDDEN_CHAT. */
export const HiddenChat: Story = {
  args: {
    ...fixtureBase,
    layout: 'HIDDEN_CHAT',
  },
};

const CustomLayout: React.FC<LayoutProps> = ({
  Chat,
  chatProps,
  StartPanel,
  startPanelProps,
  integrationStyle,
  integrationBackground,
  sessionId,
  hasUserActivatedSpeak,
  loading = false,
  poweredBy,
}) => (
  <>
    {integrationStyle}
    {integrationBackground}
    <Spin
      spinning={loading}
      className="memori-mycustom-layout"
    >
      {poweredBy}
      <div className="memori-mycustom-layout--controls">
        {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
          <Chat {...chatProps} />
        ) : startPanelProps ? (
          <StartPanel {...startPanelProps} />
        ) : null}
      </div>
    </Spin>
  </>
);

export const Custom: Story = {
  args: {
    ...fixtureBase,
    layout: 'FULLPAGE',
    customLayout: CustomLayout,
  },
};
