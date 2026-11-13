import { renderHook, act } from '@testing-library/react';
import type { MouseEvent } from 'react';
import { usePressTooltip } from './usePressTooltip';

describe('usePressTooltip', () => {
  it('toggles open on press trigger click and exposes a fixed anchor positioner', () => {
    const { result } = renderHook(() => usePressTooltip());

    expect(result.current.open).toBe(false);
    expect(result.current.positionerProps.positionMethod).toBe('fixed');

    const anchor = document.createElement('button');
    act(() => {
      result.current.anchorRef(anchor);
    });
    expect(result.current.positionerProps.anchor.current).toBe(anchor);

    const clickEvent = {
      stopPropagation: jest.fn(),
    } as unknown as MouseEvent;

    act(() => {
      result.current.pressTriggerProps.onClick(clickEvent);
    });

    expect(clickEvent.stopPropagation).toHaveBeenCalled();
    expect(result.current.open).toBe(true);
    expect(result.current.tooltipProps.open).toBe(true);
  });
});
