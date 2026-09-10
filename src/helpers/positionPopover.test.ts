import {
  shouldHoldAutoStartForPosition,
  shouldRestartSessionOnPositionPopoverClose,
} from './positionPopover';

describe('shouldHoldAutoStartForPosition', () => {
  it('holds auto-start when position is required and none is stored', () => {
    expect(shouldHoldAutoStartForPosition(true, false)).toBe(true);
  });

  it('does not hold when a position (or skip) is already stored', () => {
    expect(shouldHoldAutoStartForPosition(true, true)).toBe(false);
  });

  it('does not hold when the agent does not require a position', () => {
    expect(shouldHoldAutoStartForPosition(false, false)).toBe(false);
  });
});

describe('shouldRestartSessionOnPositionPopoverClose', () => {
  it('restarts only when closing an open popover with autoStart and no session', () => {
    expect(
      shouldRestartSessionOnPositionPopoverClose(true, false, true, false)
    ).toBe(true);
  });

  it('does not restart when a session is already started', () => {
    expect(
      shouldRestartSessionOnPositionPopoverClose(true, false, true, true)
    ).toBe(false);
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

  it('does not restart when closing without a stored position', () => {
    expect(
      shouldRestartSessionOnPositionPopoverClose(
        true,
        false,
        true,
        false,
        false
      )
    ).toBe(false);
  });

  it('restarts when closing after a position was stored', () => {
    expect(
      shouldRestartSessionOnPositionPopoverClose(true, false, true, false, true)
    ).toBe(true);
  });
});
