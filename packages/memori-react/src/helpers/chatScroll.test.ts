import {
  CHAT_SCROLL_BOTTOM_THRESHOLD_PX,
  getNextPinnedToBottom,
  isChatScrolledToBottom,
  scrollChatToBottom,
} from './chatScroll';

describe('isChatScrolledToBottom', () => {
  it('is true when the remaining distance is zero', () => {
    expect(
      isChatScrolledToBottom({
        scrollTop: 600,
        scrollHeight: 1000,
        clientHeight: 400,
      })
    ).toBe(true);
  });

  it('is true when the remaining distance is within the threshold', () => {
    expect(
      isChatScrolledToBottom({
        scrollTop: 600 - CHAT_SCROLL_BOTTOM_THRESHOLD_PX,
        scrollHeight: 1000,
        clientHeight: 400,
      })
    ).toBe(true);
  });

  it('is false when the user has scrolled away from the latest message', () => {
    expect(
      isChatScrolledToBottom({
        scrollTop: 0,
        scrollHeight: 1000,
        clientHeight: 400,
      })
    ).toBe(false);
  });
});

describe('getNextPinnedToBottom', () => {
  const metrics = (scrollTop: number) => ({
    scrollTop,
    scrollHeight: 1000,
    clientHeight: 400,
  });

  it('pins when the container is at the very bottom', () => {
    expect(getNextPinnedToBottom(false, 700, metrics(600))).toBe(true);
  });

  it('unpins on a small upward scroll, even within the threshold', () => {
    expect(getNextPinnedToBottom(true, 600, metrics(570))).toBe(false);
  });

  it('re-pins when scrolling down into the threshold', () => {
    expect(getNextPinnedToBottom(false, 400, metrics(550))).toBe(true);
  });

  it('keeps the previous state on a downward scroll short of the bottom', () => {
    expect(getNextPinnedToBottom(true, 0, metrics(300))).toBe(true);
    expect(getNextPinnedToBottom(false, 0, metrics(300))).toBe(false);
  });
});

describe('scrollChatToBottom', () => {
  it('moves scrollTop to the end of the container', () => {
    const element = { scrollTop: 10, scrollHeight: 840 };
    scrollChatToBottom(element);
    expect(element.scrollTop).toBe(840);
  });
});
