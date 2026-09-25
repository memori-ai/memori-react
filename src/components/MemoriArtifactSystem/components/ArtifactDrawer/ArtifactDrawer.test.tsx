import React from 'react';
import { fireEvent, render, screen, waitFor } from '../../../../testUtils';
import I18nWrapper from '../../../../I18nWrapper';
import { ArtifactProvider, useArtifact } from '../../context/ArtifactContext';
import { ArtifactData } from '../../types/artifact.types';
import ArtifactDrawer from './ArtifactDrawer';

const sampleArtifact: ArtifactData = {
  id: 'artifact-1',
  artifactId: 'artifact-1',
  content: '# Hello\n\n## Section',
  mimeType: 'markdown',
  title: 'Hello notes',
  timestamp: new Date('2026-01-01T00:00:00.000Z'),
  size: 20,
};

const OpenArtifact = ({ children }: { children: React.ReactNode }) => {
  const { openArtifact } = useArtifact();
  React.useLayoutEffect(() => {
    openArtifact(sampleArtifact);
  }, [openArtifact]);
  return <>{children}</>;
};

const renderDrawer = (isChatLogPanel = false) =>
  render(
    <I18nWrapper>
      <ArtifactProvider>
        <OpenArtifact>
          <ArtifactDrawer
            isLayoutColumn={!isChatLogPanel}
            isChatLogPanel={isChatLogPanel}
          />
        </OpenArtifact>
      </ArtifactProvider>
    </I18nWrapper>
  );

it('puts the artifact name and type in the toolbar', async () => {
  renderDrawer();

  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: 'Hello notes' })
    ).toBeInTheDocument();
  });

  expect(screen.getByText('Markdown')).toBeInTheDocument();
});

it('hides the artifact title and type in chatlog panel mode', async () => {
  renderDrawer(true);

  await screen.findByRole('button', { name: 'artifact.preview' });

  expect(
    screen.queryByRole('heading', { name: 'Hello notes' })
  ).not.toBeInTheDocument();
  expect(screen.queryByText('Markdown')).not.toBeInTheDocument();
});

it('keeps tabs and the compact actions control in the chatlog toolbar on mobile', async () => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: 390,
  });
  window.dispatchEvent(new Event('resize'));

  renderDrawer(true);

  await screen.findByRole('button', { name: 'artifact.preview' });
  expect(
    screen.getByRole('button', { name: 'artifact.source' })
  ).toBeInTheDocument();
  expect(screen.getByTitle('artifact.actions')).toBeInTheDocument();
});

it('toggles preview and source with aria-pressed', async () => {
  renderDrawer();

  const preview = await screen.findByRole('button', {
    name: 'artifact.preview',
  });
  const source = screen.getByRole('button', { name: 'artifact.source' });

  expect(preview).toHaveAttribute('aria-pressed', 'true');
  expect(source).toHaveAttribute('aria-pressed', 'false');

  fireEvent.click(source);

  expect(source).toHaveAttribute('aria-pressed', 'true');
  expect(preview).toHaveAttribute('aria-pressed', 'false');
});
