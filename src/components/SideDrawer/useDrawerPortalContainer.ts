import { useCallback, useState } from 'react';

/**
 * Popups inside a drawer must portal into the drawer panel. The default
 * portal sits on the widget root, under the drawer and outside the modal,
 * so the menu or tooltip never appears. Outside a drawer this stays null
 * and the default portal is used.
 */
export function useDrawerPortalContainer() {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    setContainer(node?.closest<HTMLElement>('.memori-drawer') ?? null);
  }, []);

  return { ref, container };
}
