import { shouldRestartSessionOnPositionPopoverClose } from './positionPopover';

describe('shouldRestartSessionOnPositionPopoverClose', () => {
  it('restarts only when closing an open popover with autoStart', () => {
    expect(shouldRestartSessionOnPositionPopoverClose(true, false, true)).toBe(
      true
    );
  });

  it('does not restart when already closed (user/info popover dismiss)', () => {
    expect(shouldRestartSessionOnPositionPopoverClose(false, false, true)).toBe(
      false
    );
  });

  it('does not restart when opening the popover', () => {
    expect(shouldRestartSessionOnPositionPopoverClose(false, true, true)).toBe(
      false
    );
  });

  it('does not restart when staying open', () => {
    expect(shouldRestartSessionOnPositionPopoverClose(true, true, true)).toBe(
      false
    );
  });

  it('does not restart without autoStart', () => {
    expect(shouldRestartSessionOnPositionPopoverClose(true, false, false)).toBe(
      false
    );
  });
});
