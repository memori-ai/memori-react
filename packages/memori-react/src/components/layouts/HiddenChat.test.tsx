import React from 'react';
import { render, fireEvent } from '../../testUtils';
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

const renderHiddenChat = () =>
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
            layout="HIDDEN_CHAT"
          />
        </VisemeProvider>
      </ArtifactProvider>
    </I18nWrapper>
  );

it('renders HIDDEN_CHAT layout unchanged', () => {
  const { container } = renderHiddenChat();
  expect(container).toMatchSnapshot();
});

describe('fullscreen', () => {
  const requestFullscreen = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    requestFullscreen.mockClear();
    Object.defineProperty(document, 'fullscreenEnabled', {
      configurable: true,
      value: true,
    });
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      value: null,
    });
    HTMLElement.prototype.requestFullscreen = requestFullscreen;
  });

  afterEach(() => {
    delete (HTMLElement.prototype as any).requestFullscreen;
  });

  it('requests fullscreen on the widget root so portaled drawers stay visible', () => {
    const { container } = renderHiddenChat();
    const button = container.querySelector(
      'button[aria-label="fullscreenEnter"]'
    ) as HTMLButtonElement;
    expect(button).not.toBeNull();

    fireEvent.click(button);

    expect(requestFullscreen).toHaveBeenCalledTimes(1);
    const target = requestFullscreen.mock.instances[0] as HTMLElement;
    expect(target.classList.contains('memori-widget')).toBe(true);
    // The drawer portal root must be inside the fullscreen element.
    expect(target.querySelector('.memori-widget__surface')).not.toBeNull();
    expect(target.querySelector('.memori-sidebar')).not.toBeNull();
    expect(target.classList.contains('memori-widget--fullscreen')).toBe(true);
  });
});
