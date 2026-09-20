import {
  CHAT_SCROLL_BOTTOM_THRESHOLD_PX,
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

describe('scrollChatToBottom', () => {
  it('moves scrollTop to the end of the container', () => {
    const element = { scrollTop: 10, scrollHeight: 840 };
    scrollChatToBottom(element);
    expect(element.scrollTop).toBe(840);
  });
});
