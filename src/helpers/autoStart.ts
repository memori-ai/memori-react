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
