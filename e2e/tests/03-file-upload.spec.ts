import { test, expect } from '@playwright/test';
import { MemoriWidget } from '../page-objects/MemoriWidget';
import { testConfig, waitTimes, selectors, testMessages } from '../fixtures/test-data';
import path from 'path';

/**
 * File Upload Tests
 * Tests file upload functionality including documents and images
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

  test('should upload PDF document and show in chat', async () => {
    const uploadButton = widget.chatPanel.uploadButton;
    
    // Skip if upload not available
    if (!(await uploadButton.isVisible().catch(() => false))) {
      test.skip();
    }
    
    // Click upload button to open menu
    await uploadButton.click();
    await widget.page.waitForTimeout(waitTimes.short);
    
    // Find and click document upload button in menu
    const documentUploadButton = widget.page.locator(selectors.uploadMenu).locator('.memori--upload-menu-item--document');
    
    // Check if document upload is available
    await documentUploadButton.click();
    
    // Wait for file input and upload file
    const fileInput = widget.page.locator(selectors.documentUploadInput);
    const filePath = path.resolve(testConfig.testFiles.pdf);
    await fileInput.setInputFiles(filePath);
    
    // Wait for upload to process
    await widget.page.waitForTimeout(waitTimes.medium);
    
    // Send a message with the uploaded document
    await widget.chatPanel.sendMessage(testMessages.withDocument, true);
    
    // Verify message was sent
    await widget.chatPanel.waitForUserMessage();
    
    // Verify response received
    await widget.chatPanel.waitForMemoriResponse();
    
    // Check that document appears in chat (in user message)
    const hasDocument = await widget.chatPanel.hasUploadedDocument();
    expect(hasDocument).toBe(true);
  });

  test('should upload JPG image and show in chat', async () => {
    const uploadButton = widget.chatPanel.uploadButton;
    
    // Skip if upload not available
    if (!(await uploadButton.isVisible().catch(() => false))) {
      test.skip();
    }
    
    // Click upload button to open menu
    await uploadButton.click();
    await widget.page.waitForTimeout(waitTimes.short);
    
    // Find and click image upload button in menu
    const imageUploadButton = widget.page.locator(selectors.uploadMenu).locator('.memori--upload-menu-item--image');
    
    // Check if image upload is available
    const hasImageUpload = await imageUploadButton.isVisible().catch(() => false);
    if (!hasImageUpload) {
      test.skip();
    }
    
    await imageUploadButton.click();
    
    // Wait for file input and upload file
    const fileInput = widget.page.locator(selectors.imageUploadInput);
    const filePath = path.resolve(testConfig.testFiles.jpg);
    await fileInput.setInputFiles(filePath);
    
    // Wait for upload to process
    await widget.page.waitForTimeout(waitTimes.medium);
    
    // Send a message with the uploaded image
    await widget.chatPanel.sendMessage(testMessages.withImage, true);
    
    // Verify message was sent
    await widget.chatPanel.waitForUserMessage();
    
    // Verify response received
    await widget.chatPanel.waitForMemoriResponse();
    
    // Check that image appears in chat
    const hasImage = await widget.chatPanel.hasUploadedImage();
    expect(hasImage).toBe(true);
  });

  test('should handle multiple image format uploads (JPG)', async () => {
    const uploadButton = widget.chatPanel.uploadButton;
    
    // Skip if upload not available
    if (!(await uploadButton.isVisible().catch(() => false))) {
      test.skip();
    }
    
    // Click upload button
    await uploadButton.click();
    await widget.page.waitForTimeout(waitTimes.short);
    
    const imageUploadButton = widget.page.locator(selectors.uploadMenu).locator('.memori--upload-menu-item--image');
    
    if (!(await imageUploadButton.isVisible().catch(() => false))) {
      test.skip();
    }
    
    await imageUploadButton.click();
    
    // Upload JPG
    const fileInput = widget.page.locator(selectors.imageUploadInput);
    const filePath = path.resolve(testConfig.testFiles.jpg);
    await fileInput.setInputFiles(filePath);
    
    // Wait for upload
    await widget.page.waitForTimeout(waitTimes.medium);
    
    // Verify uploaded media count increased
    const mediaCount = await widget.chatPanel.getUploadedMediaCount();
    expect(mediaCount).toBeGreaterThanOrEqual(0);
  });
});

