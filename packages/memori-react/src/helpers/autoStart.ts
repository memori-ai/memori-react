/**
 * Auto-start must wait on the start panel when the agent requires login and
 * the user is not logged in yet: the start panel shows the login gate.
 */
export function shouldHoldAutoStartForLogin(
  requireLoginToken: boolean,
  isUserLoggedIn: boolean
): boolean {
  return !!requireLoginToken && !isUserLoggedIn;
}

/**
 * A session opened while logged in must return to the start panel when login
 * is mandatory and the user logs out. The first render, before the profile
 * is loaded, is not a logout.
 */
export function shouldReturnToStartPanelAfterLogout(
  requireLoginToken: boolean,
  wasLoggedIn: boolean,
  isUserLoggedIn: boolean,
  hasActiveSession: boolean
): boolean {
  return (
    !!requireLoginToken &&
    wasLoggedIn &&
    !isUserLoggedIn &&
    hasActiveSession
  );
}
