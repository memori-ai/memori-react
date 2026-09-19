import React from 'react';
import { render, waitFor } from '../../testUtils';
import Memori from '../MemoriWidget/MemoriWidget';
import FullPageLayout from './FullPage';
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

it('renders FullPage layout unchanged', () => {
  const { container } = render(
    <I18nWrapper>
      <ArtifactProvider
      >
        <VisemeProvider>
          <Memori
            showShare={true}
            showSettings={true}
            memori={memori}
            tenant={tenant}
            tenantID="aisuru.com"
            integration={integration}
            layout="FULLPAGE"
          />
        </VisemeProvider>
      </ArtifactProvider>
    </I18nWrapper>
  );
  expect(container).toMatchSnapshot();
});

it('renders FullPage layout with root css properties unchanged', () => {
  const { container } = render(
    <I18nWrapper>
      <ArtifactProvider
      >
      <VisemeProvider>
        <Memori
          showShare={true}
          showSettings={true}
          memori={memori}
          tenant={tenant}
          tenantID="aisuru.com"
          integration={integration}
          layout="FULLPAGE"
          applyVarsToRoot
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
          <FullPageLayout
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
