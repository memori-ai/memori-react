import { test, expect } from '@playwright/test';
import { selectors } from '../fixtures/test-data';
import { MemoriWidget } from '../page-objects/MemoriWidget';
import { testConfig, testMessages } from '../fixtures/test-data';

/**
 * Chat Messaging Tests
 * Tests the core conversation functionality
 */

test.describe('Chat Messaging', () => {
  let widget: MemoriWidget;
  const useMock = testConfig.useMockApi;

  test.beforeEach(async ({ page }) => {
    widget = new MemoriWidget(page);
    await page.goto(testConfig.baseURL);
    await widget.waitForLoad();
    await widget.startPanel.startSession();
  });

  test('should send a text message and receive response', async () => {
    const initialCount = await widget.chatPanel.getMessageCount();
    
    await widget.chatPanel.sendMessage(testMessages.question, useMock);
    
    const newCount = await widget.chatPanel.getMessageCount();
    expect(newCount).toBeGreaterThan(initialCount);
    
    const response = await widget.chatPanel.waitForMemoriResponse();
    expect(response).toBeTruthy();
    
    const responseText = await widget.chatPanel.getLatestMemoriResponse();
    expect(responseText.length).toBeGreaterThan(0);
  });

  test('should clear input after sending message', async () => {
    if (useMock) {
      await widget.chatPanel.mockApiResponse({ message: 'Mock response' });
    }
    
    await widget.chatPanel.typeMessage(testMessages.simple);
    
    const inputValue = await widget.chatPanel.chatInput.inputValue();
    expect(inputValue).toBe(testMessages.simple);
    
    await widget.chatPanel.clickSend();
    await widget.chatPanel.waitForUserMessage();
    await widget.page.waitForTimeout(500);
    
    const clearedValue = await widget.chatPanel.chatInput.inputValue();
    expect(clearedValue).toBe('');
  });

  test('should display chat bubbles with correct styling', async () => {
    await widget.chatPanel.sendMessage(testMessages.simple, useMock);
    
    const userBubbles = widget.page.locator(selectors.userBubble);
    expect(await userBubbles.count()).toBeGreaterThan(0);
    
    await widget.chatPanel.waitForMemoriResponse();
    
    const memoriBubbles = widget.page.locator('.memori-chat--bubble:not(.memori-chat--user-bubble)');
    expect(await memoriBubbles.count()).toBeGreaterThan(0);
  });

  test('should scroll to show latest messages', async () => {
    for (let i = 0; i < 5; i++) {
      await widget.chatPanel.sendMessage(`Test message ${i + 1}`, useMock);
      await widget.chatPanel.waitForMemoriResponse();
    }
    
    const lastMessage = widget.page.locator(selectors.memoriBubble).last();
    await expect(lastMessage).toBeVisible();
  });
});