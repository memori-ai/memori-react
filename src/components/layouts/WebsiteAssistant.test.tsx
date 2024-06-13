import { render } from '@testing-library/react';
import Memori from '../MemoriWidget/MemoriWidget';
import { integration, memori, tenant } from '../../mocks/data';

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

it('renders WEBSITE_ASSISTANT layout unchanged', () => {
  const { container } = render(
    <Memori
      showShare={true}
      showSettings={true}
      memori={memori}
      tenant={tenant}
      tenantID="aisuru.com"
      integration={integration}
      layout="WEBSITE_ASSISTANT"
    />
  );
  expect(container).toMatchSnapshot();
});
