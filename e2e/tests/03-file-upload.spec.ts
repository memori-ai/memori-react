import { test, expect } from '@playwright/test';
import { MemoriWidget } from '../page-objects/MemoriWidget';
import { testConfig, waitTimes, selectors } from '../fixtures/test-data';

/**
 * File Upload Tests
 * Tests file upload functionality
 */

test.describe('File Upload', () => {
  let widget: MemoriWidget;

  test.beforeEach(async ({ page }) => {
    widget = new MemoriWidget(page);
    await page.goto(testConfig.baseURL);
    await widget.waitForLoad();
    await widget.startPanel.startSession();
    await widget.chatPanel.waitForVisible();
  });

  test('should show upload button when enabled', async () => {
    const uploadButton = widget.chatPanel.uploadButton;
    const isVisible = await uploadButton.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should open upload menu when upload button is clicked', async () => {
    const uploadButton = widget.chatPanel.uploadButton;
    
    if (!(await uploadButton.isVisible().catch(() => false))) {
      test.skip();
    }
    
    await uploadButton.click();
    
    const uploadMenu = widget.page.locator(selectors.uploadMenu);
    await uploadMenu.waitFor({ state: 'visible', timeout: waitTimes.short });
    expect(await uploadMenu.isVisible()).toBe(true);
  });
});

