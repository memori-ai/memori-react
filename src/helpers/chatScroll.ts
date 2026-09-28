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

export function scrollChatToBottom(element: {
  scrollTop: number;
  scrollHeight: number;
}): void {
  element.scrollTop = element.scrollHeight;
}
