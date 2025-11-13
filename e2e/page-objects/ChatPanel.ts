import { Page, Locator, expect } from '@playwright/test';
import { selectors, waitTimes } from '../fixtures/test-data';

/**
 * Page Object Model for the Chat Panel
 */
export class ChatPanel {
  readonly page: Page;
  readonly chat: Locator;
  readonly chatHistory: Locator;
  readonly chatInput: Locator;
  readonly sendButton: Locator;
  readonly uploadButton: Locator;
  readonly speakerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.chat = page.locator(selectors.chat);
    this.chatHistory = page.locator(selectors.chatHistory);
    this.chatInput = page.locator(selectors.chatInput);
    this.sendButton = page.locator(selectors.sendButton);
    this.uploadButton = page.locator(selectors.uploadButton);
    this.speakerButton = page.locator(selectors.speakerButton);
  }

  /**
   * Check if chat panel is visible
   */
  async isVisible(): Promise<boolean> {
    return await this.chat.isVisible();
  }

  /**
   * Wait for chat to be visible
   */
  async waitForVisible() {
    await this.chat.waitFor({ state: 'visible' });
  }

  /**
   * Type a message in the chat input
   */
  async typeMessage(message: string) {
    await this.chatInput.waitFor({ state: 'visible' });
    await this.chatInput.fill(message);
  }

  /**
   * Click the send button
   */
  async clickSend() {
    await this.sendButton.click();
  }

  /**
   * Mock the API response for faster/more reliable tests
   */
  async mockApiResponse(options?: {
    message?: string;
    media?: Array<{ url: string; mimeType: string; title?: string }>;
  }) {
    await this.page.route('**/postTextEnteredEvent', async (route) => {
      const emission = options?.message || "Test response";
      const emittedMedia = options?.media || [];
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          currentState: {
            state: "R1",
            stateName: "WaitingForReceiverQuestion",
            previousState: "R1",
            confidence: 0.7,
            confidenceLevel: "LOW",
            emission: emission,
            emittedMedia: emittedMedia,
            media: emittedMedia,
            continuationEmitted: false,
            completion: true,
            acceptsTimeout: true,
            acceptsAbort: false,
            acceptsMedia: true,
            acceptsDate: false,
            acceptsPlace: false,
            acceptsTag: false,
            acceptsFeedback: false,
            hints: [],
            timeout: 85.08,
            currentTagAuthenticated: false,
            currentDate: new Date().toISOString(),
            lastMatchedMemoryID: "mock-memory-id",
            currentMedia: [],
            contextVars: {
              LANG: "IT",
              PATHNAME: "/MEMORI-REACT/IFRAME.HTML",
              ROUTE: "IFRAME.HTML"
            },
            memoryTags: []
          },
          requestID: Math.floor(Math.random() * 1000000),
          requestDateTime: new Date().toISOString(),
          resultCode: 0,
          resultMessage: "Ok"
        })
      });
    });
  }

  /**
   * Disable API mocking
   */
  async unmockApiResponse() {
    await this.page.unroute('**/postTextEnteredEvent');
  }

  /**
   * Send a message and wait for it to be sent
   */
  async sendMessage(message: string, useMock: boolean = false) {
    // Setup mock if requested (must be before sending)
    if (useMock) {
      await this.mockApiResponse({ message: `Response to: ${message}` });
    }

    // Always type and send the message (mock only intercepts the API response)
    await this.typeMessage(message);
    await this.clickSend();

    // Wait for user message to appear in the UI
    await this.waitForUserMessage();
  }

  /**
   * Wait for user message to appear in chat
   */
  async waitForUserMessage(timeout: number = waitTimes.short) {
    const memoriBubble  = this.page.locator(selectors.memoriBubble);
    await memoriBubble.last().waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for memori response
   */
  async waitForMemoriResponse(timeout: number = waitTimes.response) {
    // Wait for typing indicator (if present)
    const typingIndicator = this.page.locator(selectors.typing);
    const hasTyping = await typingIndicator.isVisible().catch(() => false);

    if (hasTyping) {
      await typingIndicator.waitFor({ state: 'hidden', timeout });
    }

    // Wait for memori bubble to appear
    const memoriBubble = this.page.locator(selectors.memoriBubble);
    await memoriBubble.last().waitFor({ state: 'visible', timeout });

    return memoriBubble.last();
  }

  /**
   * Get the latest memori response text
   */
  async getLatestMemoriResponse(): Promise<string> {
    const response = await this.waitForMemoriResponse();
    return (await response.textContent()) || '';
  }

  /**
   * Get all chat messages
   */
  async getAllMessages(): Promise<Array<{ isUser: boolean; text: string }>> {
    const bubbles = await this.page.locator(selectors.chatBubble).all();
    const messages: { isUser: boolean; text: string }[] = [];

    for (const bubble of bubbles) {
      const isUser = await bubble.evaluate(el =>
        el.classList.contains('memori-chat-bubble--user')
      );
      const text = await bubble.textContent();
      messages.push({ isUser, text: text?.trim() || '' });
    }

    return messages;
  }

  /**
   * Get the number of messages in chat
   */
  async getMessageCount(): Promise<number> {
    const bubbles = this.page.locator(selectors.chatBubble);
    return await bubbles.count();
  }

  /**
   * Get the number of user messages
   */
  async getUserMessageCount(): Promise<number> {
    const userBubbles = this.page.locator(selectors.userBubble);
    return await userBubbles.count();
  }

  /**
   * Get the number of memori messages
   */
  async getMemoriMessageCount(): Promise<number> {
    const memoriBubbles = this.page.locator(selectors.memoriBubble);
    return await memoriBubbles.count();
  }

  /**
   * Check if typing indicator is visible
   */
  async isTyping(): Promise<boolean> {
    const typing = this.page.locator(selectors.typing);
    return await typing.isVisible().catch(() => false);
  }

  /**
   * Check if chat input is enabled
   */
  async isChatInputEnabled(): Promise<boolean> {
    return await this.chatInput.isEnabled();
  }

  /**
   * Check if send button is enabled
   */
  async isSendButtonEnabled(): Promise<boolean> {
    return await this.sendButton.isEnabled();
  }

  /**
   * Clear chat input
   */
  async clearInput() {
    await this.chatInput.clear();
  }

  /**
   * Upload a file
   */
  async uploadFile(filePath: string, fileType: 'image' | 'document' = 'image') {
    await this.uploadButton.click();

    // Wait for upload menu
    await this.page.waitForSelector(selectors.uploadMenu, { state: 'visible' });

    // Select appropriate input
    const inputSelector =
      fileType === 'image'
        ? selectors.imageUploadInput
        : selectors.documentUploadInput;

    const fileInput = this.page.locator(inputSelector);
    await fileInput.setInputFiles(filePath);

    // Wait for upload to process
    await this.page.waitForTimeout(waitTimes.short);
  }

  /**
   * Check if speaker/audio is muted
   */
  async isSpeakerMuted(): Promise<boolean> {
    const button = this.speakerButton;
    if (!(await button.isVisible())) return true;
    return await button.evaluate(el => el.classList.contains('memori-header--button--speaker-muted'));
  }

  /**
   * Toggle speaker mute/unmute
   */
  async toggleSpeaker() {
    await this.speakerButton.click();
    await this.page.waitForTimeout(waitTimes.short);
  }

  /**
   * Check if audio is playing
   */
  async isAudioPlaying(): Promise<boolean> {
    const audio = this.page.locator(selectors.audioElement);
    if (!(await audio.isVisible().catch(() => false))) return false;

    return await audio.evaluate((el: HTMLAudioElement) => !el.paused);
  }

  /**
   * Wait for audio to finish playing
   */
  async waitForAudioComplete(timeout: number = waitTimes.audio) {
    const audio = this.page.locator(selectors.audioElement);

    try {
      await audio.waitFor({ state: 'visible', timeout: waitTimes.short });

      await audio.evaluate(
        (el: HTMLAudioElement) => {
          return new Promise<void>(resolve => {
            if (el.ended || el.paused) {
              resolve();
            } else {
              el.addEventListener('ended', () => resolve(), { once: true });
            }
          });
        },
        { timeout }
      );
    } catch (error) {
      // Audio might not be present, that's okay
    }
  }

  /**
   * Scroll chat to bottom
   */
  async scrollToBottom() {
    await this.chatHistory.evaluate(el => {
      el.scrollTop = el.scrollHeight;
    });
  }

  /**
   * Check if hints/suggestions are visible
   */
  async hasHints(): Promise<boolean> {
    const hints = this.page.locator('.memori-hints');
    return await hints.isVisible().catch(() => false);
  }

  /**
   * Get all available hints
   */
  async getHints(): Promise<string[]> {
    if (!(await this.hasHints())) return [];

    const hintElements = await this.page.locator('.memori-hint').all();
    const hints: string[] | undefined = [];

    for (const hint of hintElements) {
      const text = await hint.textContent();
      if (text) hints.push(text.trim());
    }

    return hints;
  }

  /**
   * Click on a hint
   */
  async clickHint(index: number) {
    const hints = this.page.locator('.memori-hint');
    await hints.nth(index).click();
  }
}
