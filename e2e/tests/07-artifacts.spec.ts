import { test, expect } from '@playwright/test';
import { MemoriWidget } from '../page-objects/MemoriWidget';
import { testConfig, waitTimes, selectors } from '../fixtures/test-data';

/**
 * Artifacts Tests
 * Tests artifact detection and display functionality
 */

test.describe('Artifact System', () => {
  let widget: MemoriWidget;

  test.beforeEach(async ({ page }) => {
    widget = new MemoriWidget(page);
    await page.goto(testConfig.baseURL);
    await widget.waitForLoad();
    await widget.startPanel.startSession();
    await widget.chatPanel.waitForVisible();
  });

  test('should detect and display HTML artifact with all actions', async ({ page, context }) => {
    // Mock API response with HTML artifact
    const htmlArtifact = `
      <output class="memori-artifact" data-mimetype="text/html">
        <!DOCTYPE html>
        <html>
          <head><title>Test HTML</title></head>
          <body><h1>Hello World</h1><p>This is a test HTML artifact</p></body>
        </html>
      </output>
    `;
    
    await widget.chatPanel.mockApiResponse({
      message: `Here is an HTML page for you: ${htmlArtifact}`,
    });
    
    // Send a message
    await widget.chatPanel.sendMessage('Create an HTML page', true);
    
    // Wait for response
    await widget.chatPanel.waitForMemoriResponse();
    
    // Check if artifact button is visible
    const hasArtifact = await widget.chatPanel.hasArtifactButton();
    expect(hasArtifact).toBe(true);
    
    // Verify artifact output element exists in the response
    const artifactOutput = page.locator(selectors.artifactOutput);
    await expect(artifactOutput).toBeVisible();
    
    // Click artifact to open drawer
    await widget.chatPanel.clickArtifact(0);
    
    // Wait for drawer to open
    await page.waitForTimeout(waitTimes.short);
    
    // Verify drawer is open
    const isDrawerOpen = await widget.chatPanel.isArtifactDrawerOpen();
    expect(isDrawerOpen).toBe(true);
    
    // Test Copy Button
    await widget.chatPanel.clickArtifactCopy();
    await page.waitForTimeout(500);
    
    // Verify copy success state
    const copySuccess = await widget.chatPanel.isCopySuccessful();
    expect(copySuccess).toBe(true);
    
    // Wait for success state to clear
    await page.waitForTimeout(1500);
    
    // Test Copy Dropdown Menu
    await widget.chatPanel.clickArtifactCopyDropdown();
    const menuVisible = await widget.chatPanel.isArtifactCopyMenuVisible();
    expect(menuVisible).toBe(true);
    
    // Verify menu has items
    const menuItemCount = await widget.chatPanel.getArtifactCopyMenuItemCount();
    expect(menuItemCount).toBeGreaterThan(0);
    
    // Test clicking a copy menu item (first format option)
    await widget.chatPanel.clickArtifactCopyMenuItem(0);
    await page.waitForTimeout(500);
    
    // Open dropdown again to test other actions
    await widget.chatPanel.clickArtifactCopyDropdown();
    await page.waitForTimeout(500);
    
    // Test External/Open in new window action
    const pagePromise = context.waitForEvent('page');
    await widget.chatPanel.clickArtifactExternal();
    const newPage = await pagePromise;
    expect(newPage).toBeTruthy();
    await newPage.close();
    
    // Open dropdown again for print test
    await widget.chatPanel.clickArtifactCopyDropdown();
    await page.waitForTimeout(500);
    
    // Test Print action (will open print dialog in new window)
    const printPromise = context.waitForEvent('page');
    await widget.chatPanel.clickArtifactPrint();
    const printPage = await printPromise;
    expect(printPage).toBeTruthy();
    await printPage.close();
    
    // Close artifact drawer
    await widget.chatPanel.closeArtifactDrawer();
    await page.waitForTimeout(500);
    
    // Verify drawer is closed
    const isDrawerClosed = !(await widget.chatPanel.isArtifactDrawerOpen());
    expect(isDrawerClosed).toBe(true);
  });

  test('should detect and display Markdown artifact with all actions', async ({ page, context }) => {
    // Mock API response with Markdown artifact
    const markdownArtifact = `
      <output class="memori-artifact" data-mimetype="text/markdown">
# Test Markdown Document

This is a **test** markdown artifact.

## Features
- Bold text
- Lists
- Headers

\`\`\`javascript
console.log('Code blocks too!');
\`\`\`
      </output>
    `;
    
    await widget.chatPanel.mockApiResponse({
      message: `Here is a markdown document: ${markdownArtifact}`,
    });
    
    // Send a message
    await widget.chatPanel.sendMessage('Create a markdown document', true);
    
    // Wait for response
    await widget.chatPanel.waitForMemoriResponse();
    
    // Check if artifact button is visible
    const hasArtifact = await widget.chatPanel.hasArtifactButton();
    expect(hasArtifact).toBe(true);
    
    // Verify artifact badge exists
    const artifactBadge = page.locator(selectors.artifactButton);
    const badgeCount = await artifactBadge.count();
    expect(badgeCount).toBeGreaterThan(0);
    
    // Verify artifact output element has correct mimetype
    const artifactOutput = page.locator(selectors.artifactOutput).first();
    const mimetype = await artifactOutput.getAttribute('data-mimetype');
    expect(mimetype).toBe('text/markdown');
    
    // Open artifact drawer
    await widget.chatPanel.clickArtifact(0);
    await page.waitForTimeout(waitTimes.short);
    
    // Verify drawer is open
    expect(await widget.chatPanel.isArtifactDrawerOpen()).toBe(true);
    
    // Test Copy Button
    await widget.chatPanel.clickArtifactCopy();
    await page.waitForTimeout(500);
    expect(await widget.chatPanel.isCopySuccessful()).toBe(true);
    await page.waitForTimeout(1500);
    
    // Test Copy Dropdown
    await widget.chatPanel.clickArtifactCopyDropdown();
    expect(await widget.chatPanel.isArtifactCopyMenuVisible()).toBe(true);
    
    // Test copy menu items (should have multiple format options for markdown)
    const menuItemCount = await widget.chatPanel.getArtifactCopyMenuItemCount();
    expect(menuItemCount).toBeGreaterThan(0);
    
    // Test External action (markdown renders as HTML in new window)
    const pagePromise = context.waitForEvent('page');
    await widget.chatPanel.clickArtifactExternal();
    const newPage = await pagePromise;
    expect(newPage).toBeTruthy();
    await newPage.close();
    
    // Test Print action
    await widget.chatPanel.clickArtifactCopyDropdown();
    await page.waitForTimeout(500);
    const printPromise = context.waitForEvent('page');
    await widget.chatPanel.clickArtifactPrint();
    const printPage = await printPromise;
    expect(printPage).toBeTruthy();
    await printPage.close();
    
    // Close drawer
    await widget.chatPanel.closeArtifactDrawer();
    expect(!(await widget.chatPanel.isArtifactDrawerOpen())).toBe(true);
  });

  test('should detect and display JavaScript code artifact with all actions', async ({ page, context }) => {
    // Mock API response with JavaScript artifact
    const jsArtifact = `
      <output class="memori-artifact" data-mimetype="text/javascript">
// Test JavaScript code
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
      </output>
    `;
    
    await widget.chatPanel.mockApiResponse({
      message: `Here is a JavaScript implementation: ${jsArtifact}`,
    });
    
    // Send a message
    await widget.chatPanel.sendMessage('Write fibonacci in JavaScript', true);
    
    // Wait for response
    await widget.chatPanel.waitForMemoriResponse();
    
    // Check if artifact button is visible
    const hasArtifact = await widget.chatPanel.hasArtifactButton();
    expect(hasArtifact).toBe(true);
    
    // Verify the artifact output has correct mimetype
    const artifactOutput = page.locator(selectors.artifactOutput).first();
    const mimetype = await artifactOutput.getAttribute('data-mimetype');
    expect(mimetype).toBe('text/javascript');
    
    // Open artifact drawer
    await widget.chatPanel.clickArtifact(0);
    await page.waitForTimeout(waitTimes.short);
    
    // Verify drawer is open
    expect(await widget.chatPanel.isArtifactDrawerOpen()).toBe(true);
    
    // Test Copy Button
    await widget.chatPanel.clickArtifactCopy();
    await page.waitForTimeout(500);
    expect(await widget.chatPanel.isCopySuccessful()).toBe(true);
    await page.waitForTimeout(1500);
    
    // Test Copy Dropdown with format options
    await widget.chatPanel.clickArtifactCopyDropdown();
    expect(await widget.chatPanel.isArtifactCopyMenuVisible()).toBe(true);
    
    const menuItemCount = await widget.chatPanel.getArtifactCopyMenuItemCount();
    expect(menuItemCount).toBeGreaterThan(0);
    
    // Test clicking different copy format
    await widget.chatPanel.clickArtifactCopyMenuItem(0);
    await page.waitForTimeout(500);
    
    // Test External action (opens code in new window)
    await widget.chatPanel.clickArtifactCopyDropdown();
    await page.waitForTimeout(500);
    const pagePromise = context.waitForEvent('page');
    await widget.chatPanel.clickArtifactExternal();
    const newPage = await pagePromise;
    expect(newPage).toBeTruthy();
    await newPage.close();
    
    // Test Print action
    await widget.chatPanel.clickArtifactCopyDropdown();
    await page.waitForTimeout(500);
    const printPromise = context.waitForEvent('page');
    await widget.chatPanel.clickArtifactPrint();
    const printPage = await printPromise;
    expect(printPage).toBeTruthy();
    await printPage.close();
    
    // Close drawer
    await widget.chatPanel.closeArtifactDrawer();
    expect(!(await widget.chatPanel.isArtifactDrawerOpen())).toBe(true);
  });

  test('should only show artifacts in memori messages, not user messages', async ({ page }) => {
    // First, send a user message (no artifacts should appear)
    await widget.chatPanel.typeMessage('Hello');
    await widget.chatPanel.clickSend();
    await widget.chatPanel.waitForUserMessage();
    
    // User messages should not have artifact buttons
    const userBubble = page.locator(selectors.userBubble).last();
    const artifactInUser = userBubble.locator(selectors.artifactButton);
    const userArtifactCount = await artifactInUser.count();
    expect(userArtifactCount).toBe(0);
    
    // Now mock a memori response with artifact
    const artifact = `
      <output class="memori-artifact" data-mimetype="text/html">
        <h1>Test</h1>
      </output>
    `;
    
    await widget.chatPanel.mockApiResponse({
      message: `Response with artifact: ${artifact}`,
    });
    
    await widget.chatPanel.sendMessage('Generate something', true);
    await widget.chatPanel.waitForMemoriResponse();
    
    // Memori message should have artifact
    const hasArtifact = await widget.chatPanel.hasArtifactButton();
    expect(hasArtifact).toBe(true);
  });

  test('should handle multiple artifacts in single response', async ({ page }) => {
    // Mock API response with multiple artifacts
    const artifact1 = `<output class="memori-artifact" data-mimetype="text/html"><h1>First Artifact</h1></output>`;
    const artifact2 = `<output class="memori-artifact" data-mimetype="text/markdown"># Second Artifact</output>`;
    
    await widget.chatPanel.mockApiResponse({
      message: `Here are two artifacts: ${artifact1} and ${artifact2}`,
    });
    
    // Send a message
    await widget.chatPanel.sendMessage('Create multiple artifacts', true);
    
    // Wait for response
    await widget.chatPanel.waitForMemoriResponse();
    
    // Check artifact count - should have at least 2 artifacts
    const artifactButtons = page.locator(selectors.artifactButton);
    const count = await artifactButtons.count();
    expect(count).toBeGreaterThanOrEqual(2);
    
    // Test that we can open each artifact independently
    // Open first artifact
    await widget.chatPanel.clickArtifact(0);
    await page.waitForTimeout(waitTimes.short);
    expect(await widget.chatPanel.isArtifactDrawerOpen()).toBe(true);
    
    // Close it
    await widget.chatPanel.closeArtifactDrawer();
    await page.waitForTimeout(500);
    
    // Open second artifact
    await widget.chatPanel.clickArtifact(1);
    await page.waitForTimeout(waitTimes.short);
    expect(await widget.chatPanel.isArtifactDrawerOpen()).toBe(true);
    
    // Close it
    await widget.chatPanel.closeArtifactDrawer();
  });

  test('should test all copy format options in dropdown', async ({ page }) => {
    // Create an HTML artifact with rich content
    const htmlArtifact = `
      <output class="memori-artifact" data-mimetype="text/html">
        <!DOCTYPE html>
        <html>
          <head>
            <title>Rich HTML Content</title>
            <style>body { font-family: Arial; }</style>
          </head>
          <body>
            <h1>Test Page</h1>
            <p>This is a <strong>rich</strong> HTML document.</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </body>
        </html>
      </output>
    `;
    
    await widget.chatPanel.mockApiResponse({
      message: `HTML artifact: ${htmlArtifact}`,
    });
    
    await widget.chatPanel.sendMessage('Create HTML', true);
    await widget.chatPanel.waitForMemoriResponse();
    
    // Open artifact drawer
    await widget.chatPanel.clickArtifact(0);
    await page.waitForTimeout(waitTimes.short);
    
    // Open copy dropdown
    await widget.chatPanel.clickArtifactCopyDropdown();
    expect(await widget.chatPanel.isArtifactCopyMenuVisible()).toBe(true);
    
    // Get all copy format options
    const menuItemCount = await widget.chatPanel.getArtifactCopyMenuItemCount();
    expect(menuItemCount).toBeGreaterThan(0);
    
    // Test each copy format option (excluding print and external which are last 2)
    const copyFormatCount = menuItemCount - 2; // Exclude print and external
    
    for (let i = 0; i < copyFormatCount; i++) {
      // Open dropdown if not visible
      if (!(await widget.chatPanel.isArtifactCopyMenuVisible())) {
        await widget.chatPanel.clickArtifactCopyDropdown();
        await page.waitForTimeout(300);
      }
      
      // Click the copy format option
      await widget.chatPanel.clickArtifactCopyMenuItem(i);
      await page.waitForTimeout(500);
      
      // Wait for success state to clear if it appears
      await page.waitForTimeout(1000);
    }
    
    // Close drawer
    await widget.chatPanel.closeArtifactDrawer();
  });

  test('should test copy actions for different code artifact types', async ({ page }) => {
    const codeArtifacts = [
      {
        name: 'Python',
        mimetype: 'text/python',
        content: `def hello_world():\n    print("Hello, World!")\n\nhello_world()`,
      },
      {
        name: 'JSON',
        mimetype: 'application/json',
        content: `{\n  "name": "Test",\n  "version": "1.0.0",\n  "items": [1, 2, 3]\n}`,
      },
      {
        name: 'CSS',
        mimetype: 'text/css',
        content: `.container {\n  display: flex;\n  justify-content: center;\n}`,
      },
    ];
    
    for (const artifact of codeArtifacts) {
      // Create artifact
      const artifactOutput = `
        <output class="memori-artifact" data-mimetype="${artifact.mimetype}">
${artifact.content}
        </output>
      `;
      
      await widget.chatPanel.mockApiResponse({
        message: `Here's ${artifact.name} code: ${artifactOutput}`,
      });
      
      await widget.chatPanel.sendMessage(`Create ${artifact.name} code`, true);
      await widget.chatPanel.waitForMemoriResponse();
      
      // Verify artifact is detected
      expect(await widget.chatPanel.hasArtifactButton()).toBe(true);
      
      // Open drawer
      await widget.chatPanel.clickArtifact(0);
      await page.waitForTimeout(waitTimes.short);
      
      // Test copy button
      await widget.chatPanel.clickArtifactCopy();
      await page.waitForTimeout(500);
      expect(await widget.chatPanel.isCopySuccessful()).toBe(true);
      
      // Close drawer for next iteration
      await widget.chatPanel.closeArtifactDrawer();
      await page.waitForTimeout(500);
    }
  });
});

