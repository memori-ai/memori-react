import React, { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Message } from '@memori.ai/memori-api-client/dist/types';
import { AlertProvider } from '@memori.ai/ui';
import I18nWrapper from '../../I18nWrapper';
import {
  ArtifactProvider,
  useArtifact,
} from './context/ArtifactContext';
import ArtifactDrawer from './components/ArtifactDrawer/ArtifactDrawer';
import ArtifactHandler from './components/ArtifactHandler/ArtifactHandler';
import { ArtifactData } from './types/artifact.types';

const HTML_ARTIFACT_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Dashboard</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      color: #0f172a;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
    }
    .metric {
      font-size: 28px;
      font-weight: 700;
      margin: 8px 0 0;
    }
    .label {
      color: #64748b;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    h1 { margin-top: 0; font-size: 22px; }
  </style>
</head>
<body>
  <h1>Product Dashboard</h1>
  <p>Interactive HTML artifact shown in the side drawer panel.</p>
  <div class="grid">
    <div class="card">
      <div class="label">Active users</div>
      <div class="metric">12,480</div>
    </div>
    <div class="card">
      <div class="label">Conversion</div>
      <div class="metric">4.8%</div>
    </div>
    <div class="card">
      <div class="label">Revenue</div>
      <div class="metric">€84,200</div>
    </div>
    <div class="card">
      <div class="label">Support tickets</div>
      <div class="metric">37</div>
    </div>
  </div>
</body>
</html>`;

const MARKDOWN_ARTIFACT_CONTENT = `# Weekly Report

This artifact expands **inline in the chat log** instead of opening the side drawer.

## Highlights

| Metric | Value | Change |
|--------|-------|--------|
| Sessions | 18,420 | +12% |
| Avg. response time | 1.4s | -8% |
| Satisfaction | 4.7/5 | +0.2 |

## Next steps

- Review artifact preview and code tabs
- Try copy, download, and print actions
- Collapse the panel with the artifact handler button

\`\`\`typescript
export function summarize(report: WeeklyReport) {
  return report.highlights.map(item => item.title).join(', ');
}
\`\`\`
`;

const wrapArtifactTag = (
  content: string,
  mimeType: string,
  title: string
): string =>
  `<output class="memori-artifact" data-mimetype="${mimeType}" data-title="${title}">${content}</output>`;

const createArtifactMessage = (
  content: string,
  mimeType: string,
  title: string,
  timestamp: string
): Message => ({
  text: wrapArtifactTag(content, mimeType, title),
  fromUser: false,
  timestamp,
  generatedByAI: true,
});

const htmlArtifactMessage = createArtifactMessage(
  HTML_ARTIFACT_CONTENT,
  'html',
  'Product Dashboard',
  '2026-05-27T10:00:00.000Z'
);

const markdownArtifactMessage = createArtifactMessage(
  MARKDOWN_ARTIFACT_CONTENT,
  'markdown',
  'Weekly Report',
  '2026-05-27T11:00:00.000Z'
);

const StoryProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <I18nWrapper>
    <AlertProvider defaultDuration={5000}>
      <ArtifactProvider>{children}</ArtifactProvider>
    </AlertProvider>
  </I18nWrapper>
);

const OpenArtifactOnMount: React.FC<{
  artifact: ArtifactData;
  isChatLogPanel?: boolean;
}> = ({ artifact, isChatLogPanel = false }) => {
  const { openArtifact } = useArtifact();

  useEffect(() => {
    openArtifact(artifact, { isChatLogPanel });
  }, [artifact, isChatLogPanel, openArtifact]);

  return null;
};

const DrawerModeDemo: React.FC = () => (
  <div
    style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--memori-main-background)',
    }}
  >
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: '24px',
        borderRight: '1px solid var(--memori-border-primary)',
        overflow: 'auto',
      }}
    >
      <p style={{ marginTop: 0, color: 'var(--memori-text-color)' }}>
        Side-drawer mode: the artifact opens in a dedicated layout column while
        the chat stays visible on the left.
      </p>
      <ArtifactHandler
        isChatlogPanel={false}
        message={htmlArtifactMessage}
      />
    </div>
    <div style={{ width: '46%', minWidth: 360 }}>
      <ArtifactDrawer isLayoutColumn />
    </div>
  </div>
);

const ChatLogModeDemo: React.FC = () => {
  const markdownArtifact: ArtifactData = {
    id: 'storybook-chatlog-artifact',
    content: MARKDOWN_ARTIFACT_CONTENT,
    mimeType: 'markdown',
    title: 'Weekly Report',
    timestamp: new Date('2026-05-27T11:00:00.000Z'),
    size: MARKDOWN_ARTIFACT_CONTENT.length,
  };

  return (
    <div
      style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '24px',
        background: 'var(--memori-main-background)',
        minHeight: '100vh',
      }}
    >
      <p style={{ marginTop: 0, color: 'var(--memori-text-color)' }}>
        Chatlog mode: the artifact expands inline below the handler button inside
        the conversation.
      </p>
      <OpenArtifactOnMount artifact={markdownArtifact} isChatLogPanel />
      <ArtifactHandler
        isChatlogPanel
        message={markdownArtifactMessage}
      />
    </div>
  );
};

const meta: Meta = {
  title: 'Artifact System/ArtifactDrawer',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const DrawerMode: Story = {
  render: () => (
    <StoryProviders>
      <DrawerModeDemo />
    </StoryProviders>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'HTML artifact opened in side-drawer mode. The handler auto-opens the artifact in the layout column, matching FullPage and Chat layouts.',
      },
    },
  },
};

export const ChatLogMode: Story = {
  render: () => (
    <StoryProviders>
      <ChatLogModeDemo />
    </StoryProviders>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Markdown artifact shown inline in chatlog mode. The drawer renders below the artifact handler inside the message flow.',
      },
    },
  },
};
