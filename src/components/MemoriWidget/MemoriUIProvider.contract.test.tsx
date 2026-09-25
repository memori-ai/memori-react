import React, { useState } from 'react';
import { render, screen, waitFor } from '../../testUtils';
import {
  MemoriUIProvider,
  useMemoriTheme,
  usePortalContainer,
} from '@memori.ai/ui';

function Probe() {
  const escapePortal = usePortalContainer(undefined, 'escape');
  const clipPortal = usePortalContainer(undefined, 'clip');
  const theme = useMemoriTheme();
  return (
    <div
      data-testid="probe"
      data-escape-is-root={
        escapePortal instanceof HTMLElement &&
        escapePortal.getAttribute('data-memori-probe-root') === '1'
          ? 'yes'
          : 'no'
      }
      data-clip-is-surface={
        clipPortal instanceof HTMLElement &&
        clipPortal.getAttribute('data-memori-probe-surface') === '1'
          ? 'yes'
          : 'no'
      }
      data-theme-context={theme}
    />
  );
}

function Harness({ theme }: { theme: 'light' | 'dark' }) {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [surface, setSurface] = useState<HTMLDivElement | null>(null);
  return (
    <div
      ref={setRoot}
      data-theme={theme}
      data-memori-probe-root="1"
      data-testid="widget-root"
    >
      <div
        ref={setSurface}
        data-memori-probe-surface="1"
        data-testid="widget-surface"
      />
      <MemoriUIProvider
        container={root}
        clipContainer={surface}
        theme={theme}
      >
        <Probe />
      </MemoriUIProvider>
    </div>
  );
}

describe('MemoriUIProvider embed contract', () => {
  it('keeps escape portal on widget root, clip on surface, theme in sync', async () => {
    render(<Harness theme="dark" />);

    const root = screen.getByTestId('widget-root');
    expect(root).toHaveAttribute('data-theme', 'dark');

    await waitFor(() => {
      const probe = screen.getByTestId('probe');
      expect(probe).toHaveAttribute('data-escape-is-root', 'yes');
      expect(probe).toHaveAttribute('data-clip-is-surface', 'yes');
      expect(probe).toHaveAttribute('data-theme-context', 'dark');
    });
  });
});
