import {
  WIDGET_FULLSCREEN_CLASS,
  clearWidgetFullscreen,
  getFullscreenTarget,
  requestWidgetFullscreen,
} from './fullscreen';

const mountWidget = () => {
  const root = document.createElement('div');
  root.className = 'memori memori-widget memori-layout-hidden_chat';
  const surface = document.createElement('div');
  surface.className = 'memori-widget__surface';
  const panel = document.createElement('aside');
  panel.className = 'memori-sidebar';
  surface.appendChild(panel);
  root.appendChild(surface);
  document.body.appendChild(root);
  return { root, surface, panel };
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('getFullscreenTarget', () => {
  it('resolves to the enclosing widget root so portaled overlays stay visible', () => {
    const { root, panel } = mountWidget();
    expect(getFullscreenTarget(panel)).toBe(root);
  });

  it('falls back to the panel outside a widget root', () => {
    const panel = document.createElement('div');
    document.body.appendChild(panel);
    expect(getFullscreenTarget(panel)).toBe(panel);
  });
});

describe('requestWidgetFullscreen', () => {
  it('requests fullscreen on the root and marks it', async () => {
    const { root, panel } = mountWidget();
    const requestFullscreen = jest.fn().mockResolvedValue(undefined);
    (root as any).requestFullscreen = requestFullscreen;

    const target = requestWidgetFullscreen(panel);

    expect(target).toBe(root);
    expect(requestFullscreen).toHaveBeenCalledTimes(1);
    expect(root.classList.contains(WIDGET_FULLSCREEN_CLASS)).toBe(true);
  });

  it('clears the marker and reports when the request fails', async () => {
    const { root, panel } = mountWidget();
    const error = new Error('denied');
    (root as any).requestFullscreen = jest.fn().mockRejectedValue(error);
    const onError = jest.fn();

    requestWidgetFullscreen(panel, onError);
    await Promise.resolve();

    expect(onError).toHaveBeenCalledWith(error);
    expect(root.classList.contains(WIDGET_FULLSCREEN_CLASS)).toBe(false);
  });

  it('clearWidgetFullscreen removes the marker from the root', () => {
    const { root, panel } = mountWidget();
    root.classList.add(WIDGET_FULLSCREEN_CLASS);
    clearWidgetFullscreen(panel);
    expect(root.classList.contains(WIDGET_FULLSCREEN_CLASS)).toBe(false);
  });
});
