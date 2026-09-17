import { render } from '@testing-library/react';
import Memori from '../MemoriWidget/MemoriWidget';
import { integration, memori, tenant } from '../../mocks/data';
import I18nWrapper from '../../I18nWrapper';
import { VisemeProvider } from '../../context/visemeContext';
import { ArtifactProvider } from '../MemoriArtifactSystem/context/ArtifactContext';
import '@testing-library/jest-dom';

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

const renderChatWidget = (
  extraProps: { layout?: 'CHAT' | 'FULLPAGE'; height?: string } = {}
) =>
  render(
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
            layout="CHAT"
            {...extraProps}
          />
        </VisemeProvider>
      </ArtifactProvider>
    </I18nWrapper>
  );

it('renders Chat layout unchanged', () => {
  const { container } = renderChatWidget();
  expect(container).toMatchSnapshot();
});

it('defaults widget height to 100% of the host instead of the viewport', () => {
  const { container } = renderChatWidget();
  const widget = container.querySelector(
    '.memori-widget.memori-layout-chat'
  ) as HTMLElement;
  expect(widget).toHaveStyle({ height: '100%' });
  expect(widget.style.height).not.toBe('100vh');
});

it('lets the height prop override the default', () => {
  const { container } = renderChatWidget({ height: '600px' });
  const widget = container.querySelector(
    '.memori-widget.memori-layout-chat'
  ) as HTMLElement;
  expect(widget).toHaveStyle({ height: '600px' });
});

it('keeps 100vh available as an explicit full-page fallback', () => {
  const { container } = renderChatWidget({
    layout: 'FULLPAGE',
    height: '100vh',
  });
  const widget = container.querySelector('.memori-widget') as HTMLElement;
  expect(widget).toHaveStyle({ height: '100vh' });
});

it('defaults every layout to 100% when height is omitted', () => {
  const { container } = renderChatWidget({ layout: 'FULLPAGE' });
  const widget = container.querySelector('.memori-widget') as HTMLElement;
  expect(widget).toHaveStyle({ height: '100%' });
});

it('fills a 400px host through webcomponent wrappers instead of using 100vh', () => {
  const host = document.createElement('div');
  host.style.height = '400px';
  host.innerHTML = `
    <memori-client>
      <div>
        <div id="memori-root"></div>
      </div>
    </memori-client>
  `;
  document.body.appendChild(host);

  try {
    const mountNode = host.querySelector('#memori-root') as HTMLElement;
    render(
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
              layout="CHAT"
              height="100%"
            />
          </VisemeProvider>
        </ArtifactProvider>
      </I18nWrapper>,
      { container: mountNode }
    );

    const widget = host.querySelector(
      '.memori-widget.memori-layout-chat'
    ) as HTMLElement;
    const client = host.querySelector('memori-client') as HTMLElement;
    const wrapper = client.firstElementChild as HTMLElement;
    const memoriRoot = host.querySelector('#memori-root') as HTMLElement;

    expect(host).toHaveStyle({ height: '400px' });
    expect(widget).toHaveStyle({ height: '100%' });
    expect(widget.style.height).not.toBe('100vh');
    expect(wrapper).toContainElement(memoriRoot);
    expect(memoriRoot).toContainElement(widget);
  } finally {
    host.remove();
  }
});
