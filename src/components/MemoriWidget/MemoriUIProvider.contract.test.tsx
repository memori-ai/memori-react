import React, { useState } from 'react';
import { render, screen, waitFor } from '../../testUtils';
import {
  MemoriUIProvider,
  useMemoriTheme,
  usePortalContainer,
} from '@memori.ai/ui';

function Probe() {
  const portal = usePortalContainer();
  const theme = useMemoriTheme();
  return (
    <div
      data-testid="probe"
      data-portal-is-root={
        portal instanceof HTMLElement &&
        portal.getAttribute('data-memori-probe-root') === '1'
          ? 'yes'
          : 'no'
      }
      data-theme-context={theme}
    />
  );
}

function Harness({ theme }: { theme: 'light' | 'dark' }) {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  return (
    <div
      ref={setRoot}
      data-theme={theme}
      data-memori-probe-root="1"
      data-testid="widget-root"
    >
      <MemoriUIProvider container={root} theme={theme}>
        <Probe />
      </MemoriUIProvider>
    </div>
  );
}

describe('MemoriUIProvider embed contract', () => {
  it('keeps portal target on the widget root and theme in sync with data-theme', async () => {
    render(<Harness theme="dark" />);

    const root = screen.getByTestId('widget-root');
    expect(root).toHaveAttribute('data-theme', 'dark');

    await waitFor(() => {
      const probe = screen.getByTestId('probe');
      expect(probe).toHaveAttribute('data-portal-is-root', 'yes');
      expect(probe).toHaveAttribute('data-theme-context', 'dark');
    });
  });
});
