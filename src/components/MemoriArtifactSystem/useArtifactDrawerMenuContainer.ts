import { useCallback, useState } from 'react';

/**
 * Menus inside the artifact Drawer must portal into the drawer popup.
 * The default escape portal sits on the widget root: z-index is below the
 * drawer (1100 vs 1400) and the modal marks that node inert, so the menu
 * never appears. Layout-column artifacts are not in a drawer, so this
 * stays null and the default portal is used.
 */
export function useArtifactDrawerMenuContainer() {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    setContainer(node?.closest<HTMLElement>('.memori-drawer') ?? null);
  }, []);

  return { ref, container };
}
