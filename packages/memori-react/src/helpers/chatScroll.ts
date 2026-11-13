export const CHAT_SCROLL_BOTTOM_THRESHOLD_PX = 80;

type ScrollMetrics = {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
};

export function isChatScrolledToBottom(
  element: ScrollMetrics,
  thresholdPx = CHAT_SCROLL_BOTTOM_THRESHOLD_PX
): boolean {
  return (
    element.scrollHeight - element.scrollTop - element.clientHeight <=
    thresholdPx
  );
}

/**
 * Decides whether the chat should keep following new content after a scroll.
 * Any upward scroll unpins (even within the threshold), so the user can always
 * escape; a downward scroll that lands short of the bottom keeps the previous
 * state, because programmatic scrolls can be outrun by async content growth.
 */
export function getNextPinnedToBottom(
  wasPinned: boolean,
  previousScrollTop: number,
  element: ScrollMetrics,
  thresholdPx = CHAT_SCROLL_BOTTOM_THRESHOLD_PX
): boolean {
  const distanceFromBottom =
    element.scrollHeight - element.scrollTop - element.clientHeight;
  if (distanceFromBottom <= 1) return true;
  if (element.scrollTop < previousScrollTop) return false;
  if (distanceFromBottom <= thresholdPx) return true;
  return wasPinned;
}

export function scrollChatToBottom(element: {
  scrollTop: number;
  scrollHeight: number;
}): void {
  element.scrollTop = element.scrollHeight;
}
