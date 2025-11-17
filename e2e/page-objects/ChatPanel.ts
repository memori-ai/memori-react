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
   * Matches: https://engine-staging.memori.ai/memori/v2/TextEnteredEvent/{sessionID}
   */
  async mockApiResponse(options?: {
    message?: string;
    media?: Array<{ url: string; mimeType: string; title?: string }>;
  }) {
    await this.page.route('**/memori/v2/TextEnteredEvent/**', async (route) => {
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
    await this.page.unroute('**/memori/v2/TextEnteredEvent/**');
  }

  /**
   * Send a message and wait for it to be sent
   */
  async sendMessage(agentMessage: string, message: string, useMock: boolean = false) {
    // Setup mock if requested (must be before sending)
    if (useMock) {
      await this.mockApiResponse({ message: agentMessage });
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
    const userBubble = this.page.locator(selectors.memoriBubble);
    await userBubble.last().waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for memori response
   */
  async waitForMemoriResponse(timeout: number = waitTimes.response) {
    const memoriBubble = this.page.locator(selectors.memoriBubble);
    
    // Get current count of memori bubbles
    const initialCount = await memoriBubble.count();
    
    // Wait for typing indicator (if present)
    const typingIndicator = this.page.locator(selectors.typing);
    const hasTyping = await typingIndicator.isVisible().catch(() => false);

    if (hasTyping) {
      await typingIndicator.waitFor({ state: 'hidden', timeout });
    }

    // Return the latest bubble
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

  /**
   * Check if artifact button is visible
   */
  async hasArtifactButton(): Promise<boolean> {
    const artifactButton = this.page.locator(selectors.artifactButton);
    return await artifactButton.isVisible().catch(() => false);
  }

  /**
   * Click on an artifact badge to open artifact drawer
   */
  async clickArtifact(index: number = 0) {
    const artifactButtons = this.page.locator(selectors.artifactButton);
    await artifactButtons.nth(index).click();
  }

  /**
   * Check if artifact drawer is open
   */
  async isArtifactDrawerOpen(): Promise<boolean> {
    const drawer = this.page.locator(selectors.artifactDrawer);
    return await drawer.isVisible().catch(() => false);
  }

  /**
   * Check if reasoning details are visible
   */
  async hasReasoningDetails(): Promise<boolean> {
    const reasoning = this.page.locator(selectors.reasoningDetails);
    return await reasoning.isVisible().catch(() => false);
  }

  /**
   * Expand reasoning details
   */
  async expandReasoning() {
    const reasoning = this.page.locator(selectors.reasoningDetails);
    if (await reasoning.isVisible()) {
      const summary = reasoning.locator('summary');
      await summary.click();
    }
  }

  /**
   * Check if uploaded media exists in chat
   */
  async hasUploadedMedia(): Promise<boolean> {
    const media = this.page.locator(selectors.uploadedMedia);
    return await media.isVisible().catch(() => false);
  }

  /**
   * Get count of uploaded media in chat
   */
  async getUploadedMediaCount(): Promise<number> {
    const media = this.page.locator(selectors.uploadedMedia);
    return await media.count();
  }

  /**
   * Check if uploaded document exists in chat
   */
  async hasUploadedDocument(): Promise<boolean> {
    const doc = this.page.locator(selectors.uploadedMedia);
    return await doc.isVisible().catch(() => false);
  }

  /**
   * Check if uploaded image exists in chat
   */
  async hasUploadedImage(): Promise<boolean> {
    const img = this.page.locator('.memori-media-item--figure');
    return await img.isVisible().catch(() => false);
  }

  /**
   * Click the copy button in artifact drawer
   */
  async clickArtifactCopy() {
    const copyButton = this.page.locator(selectors.artifactCopyButton);
    await copyButton.click();
  }

  /**
   * Click the copy dropdown to open copy options menu
   */
  async clickArtifactCopyDropdown() {
    const dropdown = this.page.locator(selectors.artifactCopyDropdown);
    await dropdown.click();
    await this.page.waitForTimeout(waitTimes.short);
  }

  /**
   * Check if artifact copy menu is visible
   */
  async isArtifactCopyMenuVisible(): Promise<boolean> {
    const menu = this.page.locator(selectors.artifactCopyMenu);
    return await menu.isVisible().catch(() => false);
  }

  /**
   * Click a specific copy menu item by index
   */
  async clickArtifactCopyMenuItem(index: number) {
    const menuItems = this.page.locator(selectors.artifactCopyMenuItem);
    await menuItems.nth(index).click();
  }

  /**
   * Click download button in artifact drawer
   */
  async clickArtifactDownload() {
    const downloadButton = this.page.locator(selectors.artifactDownloadButton);
    await downloadButton.click();
  }

  /**
   * Click print button in artifact drawer
   */
  async clickArtifactPrint() {
    const printButton = this.page.locator(selectors.artifactPrintButton);
    await printButton.click();
  }

  /**
   * Click external/open in new window button in artifact drawer
   */
  async clickArtifactExternal() {
    const externalButton = this.page.locator(selectors.artifactExternalButton);
    await externalButton.click();
  }

  /**
   * Get count of copy menu items
   */
  async getArtifactCopyMenuItemCount(): Promise<number> {
    const menuItems = this.page.locator(selectors.artifactCopyMenuItem);
    return await menuItems.count();
  }

  /**
   * Close artifact drawer
   */
  async closeArtifactDrawer() {
    const closeButton = this.page.locator(selectors.artifactCloseButton);
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.waitForTimeout(waitTimes.short);
    }
  }

  /**
   * Check if copy button shows success state
   */
  async isCopySuccessful(): Promise<boolean> {
    const copyButton = this.page.locator(selectors.artifactCopyButton);
    return await copyButton.evaluate(el => 
      el.classList.contains('memori-copy-button--success')
    ).catch(() => false);
  }

  /**
   * Get the data-language attribute from the Snippet code element in the artifact drawer
   * This verifies the artifact is properly displayed with the correct syntax highlighting
   */
  async getArtifactSnippetLanguage(): Promise<string | null> {
    const snippetCode = this.page.locator('.memori-snippet code[data-language]');
    return await snippetCode.getAttribute('data-language');
  }
}
