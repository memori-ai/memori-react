import React from 'react';
import { RenderOptions, RenderResult } from '@testing-library/react';
declare function render(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult;
export * from '@testing-library/react';
export { render };
