export const WIDGET_ROOT_SELECTOR = '.memori-widget';
export const WIDGET_FULLSCREEN_CLASS = 'memori-widget--fullscreen';

/**
 * Resolve the element to pass to `requestFullscreen()` for a layout panel.
 *
 * Drawers, modals, tooltips and alerts portal into the widget root
 * (`.memori-widget` / `.memori-widget__surface`), not into the layout panel.
 * The Fullscreen API only paints the fullscreen element and its descendants,
 * so requesting fullscreen on the panel itself (HiddenChat sidebar,
 * WebsiteAssistant expanded panel) leaves every overlay hidden underneath.
 * Requesting it on the widget root keeps them visible.
 *
 * Falls back to the panel when it is not mounted inside a widget root.
 */
export function getFullscreenTarget(panel: HTMLElement): HTMLElement {
  return (
    (panel.closest(WIDGET_ROOT_SELECTOR) as HTMLElement | null) ?? panel
  );
}

/**
 * Request fullscreen on the widget root that contains `panel`, marking the
 * root with `memori-widget--fullscreen` so layout CSS can size the panel.
 * Returns the element fullscreen was requested on.
 */
export function requestWidgetFullscreen(
  panel: HTMLElement,
  onError?: (err: unknown) => void
): HTMLElement {
  const target = getFullscreenTarget(panel);
  target.classList.add(WIDGET_FULLSCREEN_CLASS);
  if (typeof target.requestFullscreen === 'function') {
    target.requestFullscreen().catch(err => {
      target.classList.remove(WIDGET_FULLSCREEN_CLASS);
      onError?.(err);
    });
  }
  return target;
}

/**
 * Remove the fullscreen marker from the widget root that contains `panel`.
 */
export function clearWidgetFullscreen(panel: HTMLElement): void {
  getFullscreenTarget(panel).classList.remove(WIDGET_FULLSCREEN_CLASS);
}
