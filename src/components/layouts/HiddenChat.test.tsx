import { render } from '@testing-library/react';
import Memori from '../MemoriWidget/MemoriWidget';
import { integration, memori, tenant } from '../../mocks/data';
import I18nWrapper from '../../I18nWrapper';
import { VisemeProvider } from '../../context/visemeContext';
import { ArtifactSystemProvider } from '../MemoriArtifactSystem';
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

it('renders HIDDEN_CHAT layout unchanged', () => {
  const { container } = render(
    <I18nWrapper>
      <ArtifactSystemProvider config={{
        supportedMimeTypes: {
          html: {
            name: 'HTML',
            icon: '🌐',
            hasPreview: true,
            language: 'html',
            mimeType: 'text/html',
          },
        },
      }}>
      <VisemeProvider>
        <Memori
          showShare={true}
          showSettings={true}
          memori={memori}
          tenant={tenant}
          tenantID="aisuru.com"
          integration={integration}
          layout="HIDDEN_CHAT"
        />
      </VisemeProvider>
      </ArtifactSystemProvider>
    </I18nWrapper>
  );
  expect(container).toMatchSnapshot();
});
