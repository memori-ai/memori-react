/**
 * Auto-start must wait on the start panel when the agent requires a location
 * and none has been stored yet (share or skip). The start panel is the place
 * to collect that preference; do not open the header popover instead.
 */
export function shouldHoldAutoStartForPosition(
  needsPosition: boolean,
  hasPosition: boolean
): boolean {
  return !!needsPosition && !hasPosition;
}

/**
 * Whether closing the position popover should re-run autoStart (`onClickStart`).
 * Only true on a real open → closed transition when a session has not started yet
 * and a position (or skip) is already stored. Closing during an active session
 * must not wipe chat history. Closing without a position leaves the start panel.
 */
export function shouldRestartSessionOnPositionPopoverClose(
  wasOpen: boolean,
  nextOpen: boolean,
  autoStart: boolean,
  sessionAlreadyStarted = false,
  hasPosition = true
): boolean {
  return (
    wasOpen &&
    !nextOpen &&
    !!autoStart &&
    !sessionAlreadyStarted &&
    hasPosition
  );
}
