import { shouldHoldAutoStartForLogin } from './autoStart';

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
