import React from 'react';
import { render } from '../../testUtils';
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
  extraProps: {
    layout?: 'CHAT' | 'FULLPAGE';
    height?: string;
    enableAudio?: boolean;
    ttsProvider?: 'azure' | 'openai';
  } = {}
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

describe('speaker toggle on mobile', () => {
  const mobileMatchMedia = (query: string) => ({
    matches: query.includes('max-width: 768px'),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(mobileMatchMedia);
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  // i18n returns raw keys in tests; the speaker button is labelled widget.sound
  const querySpeakerButton = (container: HTMLElement) =>
    container.querySelector('button[aria-label="widget.sound"]');

  it.each(['CHAT', 'FULLPAGE'] as const)(
    'shows the speaker toggle in %s when audio is enabled',
    layout => {
      const { container } = renderChatWidget({
        layout,
        ttsProvider: 'azure',
      });
      expect(querySpeakerButton(container)).toBeInTheDocument();
    }
  );

  it.each(['CHAT', 'FULLPAGE'] as const)(
    'hides the speaker toggle in %s when enableAudio is false',
    layout => {
      const { container } = renderChatWidget({
        layout,
        ttsProvider: 'azure',
        enableAudio: false,
      });
      expect(querySpeakerButton(container)).not.toBeInTheDocument();
    }
  );

  it('hides the speaker toggle when no TTS provider is configured', () => {
    const { container } = renderChatWidget({ layout: 'CHAT' });
    expect(querySpeakerButton(container)).not.toBeInTheDocument();
  });
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
