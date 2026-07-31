/**
 * Whether closing the position popover should re-run autoStart (`onClickStart`).
 * Only true on a real open → closed transition, so incidental
 * `setPositionPopoverOpen(false)` calls (e.g. opening user/info popovers)
 * do not wipe chat history.
 */
export function shouldRestartSessionOnPositionPopoverClose(
  wasOpen: boolean,
  nextOpen: boolean,
  autoStart: boolean
): boolean {
  return wasOpen && !nextOpen && !!autoStart;
}
