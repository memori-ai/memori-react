import React from 'react';
import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import { AlertProvider, AlertViewport } from '@memori.ai/ui';

/**
 * Wraps the component tree with AlertProvider (Toast.Provider) so that
 * useAlertManager() works in tests.
 */
function AlertProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AlertProvider>
      {children}
      <AlertViewport />
    </AlertProvider>
  );
}

/**
 * Custom render that wraps the component tree with AlertProvider by default.
 * Use this instead of @testing-library/react's render in any test that
 * renders a component using useAlertManager().
 *
 * Import from testUtils:
 *   import { render, screen } from '../../testUtils';
 */
function render(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return rtlRender(ui, {
    wrapper: AlertProviderWrapper,
    ...options,
  });
}

// Re-export everything else from RTL so tests can import from one place
export * from '@testing-library/react';
export { render };
