import {
  shouldHoldAutoStartForLogin,
  shouldReturnToStartPanelAfterLogout,
} from './autoStart';

describe('shouldHoldAutoStartForLogin', () => {
  it('holds when login is required and the user is not logged in', () => {
    expect(shouldHoldAutoStartForLogin(true, false)).toBe(true);
  });

  it('does not hold when the user is logged in', () => {
    expect(shouldHoldAutoStartForLogin(true, true)).toBe(false);
  });

  it('does not hold when login is not required', () => {
    expect(shouldHoldAutoStartForLogin(false, false)).toBe(false);
  });
});

describe('shouldReturnToStartPanelAfterLogout', () => {
  it('returns to the start panel when mandatory login is lost during a session', () => {
    expect(
      shouldReturnToStartPanelAfterLogout(true, true, false, true)
    ).toBe(true);
  });

  it('does not reset before the user was ever logged in', () => {
    expect(
      shouldReturnToStartPanelAfterLogout(true, false, false, true)
    ).toBe(false);
  });

  it('does not reset when the user is still logged in', () => {
    expect(
      shouldReturnToStartPanelAfterLogout(true, true, true, true)
    ).toBe(false);
  });

  it('does not reset when login is optional', () => {
    expect(
      shouldReturnToStartPanelAfterLogout(false, true, false, true)
    ).toBe(false);
  });

  it('does not reset when there is no active session', () => {
    expect(
      shouldReturnToStartPanelAfterLogout(true, true, false, false)
    ).toBe(false);
  });
});
