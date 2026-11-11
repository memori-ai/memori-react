import React from 'react';
import { render, screen, waitFor } from '../../testUtils';
import Memori from '../MemoriWidget/MemoriWidget';
import ZoomedFullBodyLayout from './ZoomedFullBody';
import { integration, memori, tenant } from '../../mocks/data';
import I18nWrapper from '../../I18nWrapper';
import { VisemeProvider } from '../../context/visemeContext';
import {
  ArtifactProvider,
  useArtifact,
} from '../MemoriArtifactSystem/context/ArtifactContext';
import { ArtifactData } from '../MemoriArtifactSystem/types/artifact.types';
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

it('renders ZOOMED_FULL_BODY layout unchanged', () => {
  const { container } = render(
    <I18nWrapper>
      <ArtifactProvider>
      <VisemeProvider>
        <Memori
          showShare={true}
          showSettings={true}
          memori={memori}
          tenant={tenant}
          tenantID="aisuru.com"
          integration={integration}
          layout="ZOOMED_FULL_BODY"
        />
      </VisemeProvider>
      </ArtifactProvider>
    </I18nWrapper>
  );
  expect(container).toMatchSnapshot();
});

const sampleArtifact: ArtifactData = {
  id: 'artifact-1',
  artifactId: 'artifact-1',
  content: '# Hello',
  mimeType: 'markdown',
  title: 'Hello',
  timestamp: new Date('2026-01-01T00:00:00.000Z'),
  size: 7,
};

const OpenArtifact = ({ children }: { children: React.ReactNode }) => {
  const { openArtifact } = useArtifact();
  React.useLayoutEffect(() => {
    openArtifact(sampleArtifact);
  }, [openArtifact]);
  return <>{children}</>;
};

const ChatStub = ({ footerBrand }: { footerBrand?: React.ReactNode }) => (
  <div>
    <textarea aria-label="message" />
    {footerBrand}
  </div>
);

const Dummy = () => null;

it('renders PoweredBy only once when an artifact drawer is open', async () => {
  const { container } = render(
    <I18nWrapper>
      <ArtifactProvider>
        <OpenArtifact>
          <ZoomedFullBodyLayout
            Avatar={Dummy as any}
            StartPanel={Dummy as any}
            Chat={ChatStub as any}
            chatProps={{} as any}
            sessionId="session-1"
            hasUserActivatedSpeak
            poweredBy={
              <div className="memori--powered-by">Powered by Memori.AI</div>
            }
          />
        </OpenArtifact>
      </ArtifactProvider>
    </I18nWrapper>
  );

  await waitFor(() => {
    expect(
      container.querySelector('.memori--grid-column-artifact--open')
    ).not.toBeNull();
  });

  expect(container.querySelectorAll('.memori--powered-by')).toHaveLength(1);
});

const renderZoomedWithArtifact = () =>
  render(
    <I18nWrapper>
      <ArtifactProvider>
        <OpenArtifact>
          <ZoomedFullBodyLayout
            Avatar={Dummy as any}
            StartPanel={Dummy as any}
            Chat={ChatStub as any}
            chatProps={{} as any}
            sessionId="session-1"
            hasUserActivatedSpeak
          />
        </OpenArtifact>
      </ArtifactProvider>
    </I18nWrapper>
  );

it('hides the avatar column while the artifact is open so chat stays on the left', async () => {
  const { container } = renderZoomedWithArtifact();

  await waitFor(() => {
    expect(
      container.querySelector('.memori--grid-column-artifact--open')
    ).not.toBeNull();
  });

  expect(container.querySelector('.memori--grid-column-left')).toHaveAttribute(
    'hidden'
  );
  expect(
    container.querySelector('.memori-chat-layout--main')
  ).toBeInTheDocument();
});

it('shows a resizable artifact column with name in the toolbar', async () => {
  const { container } = renderZoomedWithArtifact();

  await waitFor(() => {
    expect(
      container.querySelector('.memori--grid-column-artifact--open')
    ).not.toBeNull();
  });

  expect(
    screen.getByRole('separator', { name: 'artifact.resizeHandle' })
  ).toBeInTheDocument();
  expect(
    container.querySelector('.memori-artifact-toolbar--title')
  ).toHaveTextContent('Hello');
});

it('overlays the artifact panel under 1200px instead of compressing chat', async () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: query.includes('1199'),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  const { container } = renderZoomedWithArtifact();

  await waitFor(() => {
    expect(
      container.querySelector('.memori-fullpage-content-row--artifact-overlay')
    ).not.toBeNull();
  });

  expect(container.querySelector('.memori--grid-column-left')).toHaveAttribute(
    'hidden'
  );
});