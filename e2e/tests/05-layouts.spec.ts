import { test, expect } from '@playwright/test';
import { MemoriWidget } from '../page-objects/MemoriWidget';
import { testConfig, testMessages } from '../fixtures/test-data';

/**
 * Layouts Tests
 * Tests different widget layout configurations
 */

test.describe('Layouts', () => {
  let widget: MemoriWidget;

  test.beforeEach(async ({ page }) => {
    widget = new MemoriWidget(page);
    await page.goto(testConfig.baseURL);
    await widget.waitForLoad();
  });

  test('should render and function in FULLPAGE layout', async () => {
    await widget.goto({
      layout: 'FULLPAGE',
    });

    await widget.waitForLoad();
    const hasLayout = await widget.hasLayout('fullpage');
    expect(hasLayout).toBe(true);

    await widget.startPanel.startSession();
    await widget.chatPanel.sendMessage('response to: ' + testMessages.simple, testMessages.simple, true);
    await widget.chatPanel.waitForMemoriResponse();

    const messageCount = await widget.chatPanel.getMessageCount();
    expect(messageCount).toBeGreaterThan(0);
  });

  test('should render and function in CHAT layout', async () => {
    await widget.goto({
      layout: 'CHAT',
    });

    await widget.waitForLoad();
    const hasLayout = await widget.hasLayout('chat');
    expect(hasLayout).toBe(true);

    await widget.startPanel.startSession();
    await widget.chatPanel.sendMessage('response to: ' + testMessages.simple, testMessages.simple, true);
    await widget.chatPanel.waitForMemoriResponse();

    const messageCount = await widget.chatPanel.getMessageCount();
    expect(messageCount).toBeGreaterThan(0);
  });

  test('should render and function in TOTEM layout', async () => {
    await widget.goto({
      layout: 'TOTEM',
    });

    await widget.waitForLoad();
    const hasLayout = await widget.hasLayout('totem');
    expect(hasLayout).toBe(true);
  });

  test('should render and function in WEBSITE_ASSISTANT layout', async () => {
    await widget.goto({
      layout: 'WEBSITE_ASSISTANT',
    });

    await widget.waitForLoad();
    const hasLayout = await widget.hasLayout('website_assistant');
    expect(hasLayout).toBe(true);
  });

  test('should adapt to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await widget.waitForLoad();
    expect(await widget.isVisible()).toBe(true);

    const dimensions = await widget.getDimensions();
    expect(dimensions).toBeTruthy();
    expect(dimensions!.width).toBeLessThanOrEqual(375);
  });
});
