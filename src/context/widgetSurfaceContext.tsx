import React, { createContext, useContext } from 'react';

/**
 * Portal target for fixed overlays (Drawer/Modal) that must stay clipped to the
 * chat widget. Kept separate from MemoriUIProvider's container so Floating UI
 * menus (Select/Popover) can portal to the widget root *outside* `contain: layout`.
 */
const WidgetSurfaceContext = createContext<HTMLElement | null>(null);

export const WidgetSurfaceProvider = WidgetSurfaceContext.Provider;

export function useWidgetSurfaceEl(): HTMLElement | null {
  return useContext(WidgetSurfaceContext);
}
