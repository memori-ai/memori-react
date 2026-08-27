/**
 * Whether closing the position popover should re-run autoStart (`onClickStart`).
 * Only true on a real open → closed transition when a session has not started yet
 * (e.g. autostart blocked waiting for position). Closing during an active session
 * must not wipe chat history.
 */
export function shouldRestartSessionOnPositionPopoverClose(
  wasOpen: boolean,
  nextOpen: boolean,
  autoStart: boolean,
  sessionAlreadyStarted = false
): boolean {
  return (
    wasOpen && !nextOpen && !!autoStart && !sessionAlreadyStarted
  );
}
