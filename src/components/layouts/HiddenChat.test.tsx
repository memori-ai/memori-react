import React from 'react';
import { render } from '../../testUtils';
import Memori from '../MemoriWidget/MemoriWidget';
import { integration, memori, tenant } from '../../mocks/data';
import I18nWrapper from '../../I18nWrapper';
import { VisemeProvider } from '../../context/visemeContext';
import { ArtifactProvider } from '../MemoriArtifactSystem/context/ArtifactContext';
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
      <ArtifactProvider>
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
      </ArtifactProvider>
    </I18nWrapper>
  );
  expect(container).toMatchSnapshot();
});
