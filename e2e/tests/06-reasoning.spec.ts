import { test, expect } from '@playwright/test';
import { MemoriWidget } from '../page-objects/MemoriWidget';
import { testConfig, waitTimes, selectors } from '../fixtures/test-data';

/**
 * Reasoning Tests
 * Tests showReasoning prop functionality with <think> tags
 */

test.describe('Reasoning Display', () => {
  let widget: MemoriWidget;

  test.beforeEach(async ({ page }) => {
    widget = new MemoriWidget(page);
  });

  test('should show reasoning when showReasoning is true', async ({ page }) => {
    // Navigate with showReasoning enabled
    await page.goto(`${testConfig.baseURL}&args=showReasoning:true`);
    await widget.waitForLoad();
    await widget.startPanel.startSession();
    await widget.chatPanel.waitForVisible();
    
    // Send a message with mock API response containing <think> tags
    await widget.chatPanel.sendMessage('<think>This is my reasoning process step by step</think>Here is my final answer', 'Test question', true);
    
    // Wait for response
    await widget.chatPanel.waitForMemoriResponse();
    
    // Check if reasoning details are visible
    const hasReasoning = await widget.chatPanel.hasReasoningDetails();
    expect(hasReasoning).toBe(true);
    
    // Verify the reasoning element has the correct class
    const reasoningElement = page.locator(selectors.reasoningDetails);
    await expect(reasoningElement).toBeVisible();
    
    // Check that summary exists
    const summary = page.locator(selectors.reasoningSummary);
    await expect(summary).toBeVisible();
    
    // Verify summary contains text (like "Reasoning...")
    const summaryText = await summary.textContent();
    expect(summaryText).toBeTruthy();
  });

  test('should hide reasoning when showReasoning is false', async ({ page }) => {
    // Navigate with showReasoning disabled (default)
    await page.goto(`${testConfig.baseURL}&args=showReasoning:false`);
    await widget.waitForLoad();
    await widget.startPanel.startSession();
    await widget.chatPanel.waitForVisible();
    
    // Send a message with mock API response containing <think> tags
    await widget.chatPanel.sendMessage('<think>This is my reasoning process that should be hidden</think>Here is my final answer', 'Test question', true);
    
    // Wait for response
    await widget.chatPanel.waitForMemoriResponse();
    
    // Check that reasoning details are NOT visible
    const hasReasoning = await widget.chatPanel.hasReasoningDetails();
    expect(hasReasoning).toBe(false);
    
    // Verify the response still appears but without reasoning details
    const lastResponse = await widget.chatPanel.getLatestMemoriResponse();
    expect(lastResponse).toBeTruthy();
    
    // Verify reasoning element doesn't exist in DOM
    const reasoningElement = page.locator(selectors.reasoningDetails);
    const count = await reasoningElement.count();
    expect(count).toBe(0);
  });

  test('should be able to expand reasoning details', async ({ page }) => {
    // Navigate with showReasoning enabled
    await page.goto(`${testConfig.baseURL}&args=showReasoning:true`);
    await widget.waitForLoad();
    await widget.startPanel.startSession();
    await widget.chatPanel.waitForVisible();
    
    // Send a message with mock API response containing <think> tags
    await widget.chatPanel.sendMessage('<think>Step 1: Analyze the question\nStep 2: Consider options\nStep 3: Provide answer</think>Final response', 'Complex question', true);
    
    // Wait for response
    await widget.chatPanel.waitForMemoriResponse();
    
    // Verify reasoning is visible
    const hasReasoning = await widget.chatPanel.hasReasoningDetails();
    expect(hasReasoning).toBe(true);
    
    // Expand the reasoning
    await widget.chatPanel.expandReasoning();
    
    // Wait a bit for expansion animation
    await page.waitForTimeout(waitTimes.short);
    
    // Verify details element has open attribute
    const details = page.locator(selectors.reasoningDetails).first();
    const isOpen = await details.evaluate((el: HTMLDetailsElement) => el.open);
    expect(isOpen).toBe(true);
  });
});

