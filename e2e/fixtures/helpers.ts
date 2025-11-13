import { Page, expect } from '@playwright/test';
import { selectors, waitTimes } from './test-data';

/**
 * Helper functions for common test operations
 */

/**
 * Wait for the Memori widget to be fully loaded
 */
export async function waitForWidgetLoad(page: Page) {
  await page.waitForSelector(selectors.widget, { state: 'visible' });
  // Wait for any loading indicators to disappear
  await page.waitForLoadState('networkidle');
}

/**
 * Wait for a network request to complete
 */
export async function waitForAPIResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout: number = waitTimes.response
) {
  return await page.waitForResponse(
    response =>
      (typeof urlPattern === 'string'
        ? response.url().includes(urlPattern)
        : urlPattern.test(response.url())) && response.status() === 200,
    { timeout }
  );
}

/**
 * Get the session ID from the widget's data attribute
 */
export async function getSessionID(page: Page): Promise<string | null> {
  const sessionElement = await page.locator(selectors.sessionIDAttr).first();
  return await sessionElement.getAttribute('data-memori-session-id');
}

/**
 * Get the engine state from the widget's data attribute
 */
export async function getEngineState(page: Page): Promise<any> {
  const stateElement = await page.locator(selectors.engineStateAttr).first();
  const stateJSON = await stateElement.getAttribute('data-memori-engine-state');
  return stateJSON ? JSON.parse(stateJSON) : null;
}

/**
 * Click the start button and wait for session to initialize
 */
export async function startSession(page: Page) {
  // Wait for start button to be visible and enabled
  const startButton = page.locator(selectors.startButton);
  await startButton.waitFor({ state: 'visible' });
  await expect(startButton).toBeEnabled();
  
  // Click start button and wait for session initialization
  const responsePromise = waitForAPIResponse(page, '/openSession');
  await startButton.click();
  await responsePromise;
  
  // Wait for chat interface to appear
  await page.waitForSelector(selectors.chat, { state: 'visible' });
  
  // Verify session was created
  const sessionID = await getSessionID(page);
  expect(sessionID).toBeTruthy();
  
  return sessionID;
}

/**
 * Send a message in the chat
 */
export async function sendMessage(page: Page, message: string) {
  // Type message
  const chatInput = page.locator(selectors.chatInput);
  await chatInput.fill(message);
  
  // Click send button
  const sendButton = page.locator(selectors.sendButton);
  const responsePromise = waitForAPIResponse(page, '/postTextEnteredEvent');
  await sendButton.click();
  await responsePromise;
  
  // Wait for message to appear in history
  await page.waitForSelector(selectors.userBubble, { state: 'visible' });
}

/**
 * Wait for Memori response
 */
export async function waitForMemoriResponse(page: Page, timeout: number = waitTimes.response) {
  // Wait for typing indicator to appear (if enabled)
  const typingIndicator = page.locator(selectors.typing);
  const hasTyping = await typingIndicator.isVisible().catch(() => false);
  
  if (hasTyping) {
    // Wait for typing to disappear
    await typingIndicator.waitFor({ state: 'hidden', timeout });
  }
  
  // Wait for memori bubble to appear
  await page.waitForSelector(selectors.memoriBubble, { 
    state: 'visible',
    timeout 
  });
  
  // Get the latest memori response
  const bubbles = page.locator(selectors.memoriBubble);
  const count = await bubbles.count();
  return bubbles.nth(count - 1);
}

/**
 * Get all messages in the chat history
 */
export async function getChatHistory(page: Page) {
  const bubbles = await page.locator(selectors.chatBubble).all();
  const messages: { isUser: boolean; text: string }[] = [];
  
  for (const bubble of bubbles) {
    const isUser = await bubble.evaluate(el => 
      el.classList.contains('memori-chat-bubble--user')
    );
    const text = await bubble.textContent();
    messages.push({ isUser, text: text?.trim() || '' } as { isUser: boolean; text: string });
  }
  
  return messages;
}

/**
 * Upload a file (image or document)
 */
export async function uploadFile(
  page: Page,
  filePath: string,
  fileType: 'image' | 'document' = 'image'
) {
  // Click upload button
  await page.locator(selectors.uploadButton).click();
  
  // Wait for upload menu
  await page.waitForSelector(selectors.uploadMenu, { state: 'visible' });
  
  // Select the appropriate input based on file type
  const inputSelector =
    fileType === 'image'
      ? selectors.imageUploadInput
      : selectors.documentUploadInput;
  
  // Upload file
  const fileInput = page.locator(inputSelector);
  await fileInput.setInputFiles(filePath);
  
  // Wait for upload to complete
  await page.waitForTimeout(waitTimes.short);
}

/**
 * Open settings drawer
 */
export async function openSettings(page: Page) {
  const settingsButton = page.locator(selectors.settingsButton);
  await settingsButton.click();
  await page.waitForSelector(selectors.settingsDrawer, { state: 'visible' });
}

/**
 * Close settings drawer
 */
export async function closeSettings(page: Page) {
  // Look for close button or click outside
  const closeButton = page.locator('.memori-drawer-close');
  if (await closeButton.isVisible()) {
    await closeButton.click();
  } else {
    // Click outside the drawer
    await page.mouse.click(10, 10);
  }
  await page.waitForSelector(selectors.settingsDrawer, { state: 'hidden' });
}

/**
 * Toggle speaker mute/unmute
 */
export async function toggleSpeaker(page: Page) {
  const speakerButton = page.locator(selectors.speakerButton);
  await speakerButton.click();
  await page.waitForTimeout(waitTimes.short);
}

/**
 * Check if audio is playing
 */
export async function isAudioPlaying(page: Page): Promise<boolean> {
  const audio = page.locator(selectors.audioElement);
  if (!(await audio.isVisible())) return false;
  
  return await audio.evaluate((el: HTMLAudioElement) => !el.paused);
}

/**
 * Wait for audio to complete playing
 */
export async function waitForAudioComplete(page: Page, timeout: number = waitTimes.audio) {
  const audio = page.locator(selectors.audioElement);
  await audio.waitFor({ state: 'visible', timeout: waitTimes.short });
  
  // Wait for the 'ended' event
  await audio.evaluate((el: HTMLAudioElement) => {
    return new Promise<void>(resolve => {
      if (el.ended || el.paused) {
        resolve();
      } else {
        el.addEventListener('ended', () => resolve(), { once: true });
      }
    });
  }, { timeout });
}

/**
 * Get localStorage value
 */
export async function getLocalStorageItem(page: Page, key: string): Promise<string | null> {
  return await page.evaluate(k => localStorage.getItem(k), key);
}

/**
 * Set localStorage value
 */
export async function setLocalStorageItem(page: Page, key: string, value: string) {
  await page.evaluate(
    ({ k, v }) => localStorage.setItem(k, v),
    { k: key, v: value }
  );
}

/**
 * Clear localStorage
 */
export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

/**
 * Take a screenshot with a custom name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `e2e/test-results/screenshots/${name}.png` });
}

/**
 * Check network error responses
 */
export async function setupNetworkErrorListener(page: Page) {
  const errors: string[] = [];
  
  page.on('response', response => {
    if (response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  
  return errors;
}

