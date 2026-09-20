import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spin } from '@memori.ai/ui';
import { memori, tenant, integration } from '../../mocks/data';
import Memori, { Props } from '../../index';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import { withWidgetProviders } from '../../../.storybook/decorators';
import FullPageLayout from './FullPage';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';
import { ArtifactData } from '../MemoriArtifactSystem/types/artifact.types';

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

const sampleArtifact: ArtifactData = {
  id: 'artifact-fullpage',
  artifactId: 'artifact-fullpage',
  mimeType: 'markdown',
  title: 'Guida alla conversazione',
  timestamp: new Date('2026-01-01T00:00:00.000Z'),
  size: 120,
  content: `# Guida alla conversazione

## Come funziona

Questo pannello mostra l'artifact in una colonna di lettura da 720px, con titolo e tipo nella toolbar.
`,
};

const OpenArtifactOnMount = () => {
  const { openArtifact } = useArtifact();
  React.useLayoutEffect(() => {
    openArtifact(sampleArtifact);
  }, [openArtifact]);
  return null;
};

const ArtifactChatStub = ({
  footerBrand,
}: {
  footerBrand?: React.ReactNode;
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '1.5rem',
      background: '#fff',
    }}
  >
    <p style={{ margin: 0 }}>Chat</p>
    <button
      type="button"
      style={{ marginTop: '1rem', alignSelf: 'flex-start' }}
    >
      Guida alla conversazione
    </button>
    {footerBrand}
  </div>
);

const ArtifactDummy = () => null;

export const FullPageWithArtifact: Story = {
  render: () => (
    <div
      className="memori memori-widget memori-layout-fullpage"
      data-theme="light"
      style={{ height: '100%', minHeight: '100%' }}
    >
      <OpenArtifactOnMount />
      <FullPageLayout
        Avatar={ArtifactDummy as any}
        StartPanel={ArtifactDummy as any}
        Chat={ArtifactChatStub as any}
        chatProps={{} as any}
        sessionId="session-1"
        hasUserActivatedSpeak
      />
    </div>
  ),
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

export const WebsiteAssistantWith3DAvatar: Story = {
  args: {
    ...WebsiteAssistant.args,
    avatar3dHidden: false,
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
    <Spin spinning={loading} className="memori-mycustom-layout">
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
