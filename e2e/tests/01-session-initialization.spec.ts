import { test, expect } from '@playwright/test';
import { MemoriWidget } from '../page-objects/MemoriWidget';
import { testConfig, waitTimes } from '../fixtures/test-data';

/**
 * Session Initialization Tests
 * Tests the critical flow of loading the widget and initializing a session
 */

test.describe('Session Initialization', () => {
  let widget: MemoriWidget;

  test.beforeEach(async ({ page }) => {
    widget = new MemoriWidget(page);
    await page.goto(testConfig.baseURL);
    await widget.waitForLoad();
  });

  test('should load widget and display start panel', async () => {
    expect(await widget.isVisible()).toBe(true);
    expect(await widget.startPanel.isVisible()).toBe(true);

    // Verify memori information is displayed
    const memoriName = await widget.startPanel.getMemoriName();
    expect(memoriName).toBeTruthy();
    expect(memoriName.length).toBeGreaterThan(0);
    expect(await widget.startPanel.isStartButtonEnabled()).toBe(true);
  });

  test('should initialize session when start button is clicked', async () => {
    expect(await widget.hasActiveSession()).toBe(false);

    await widget.startPanel.startSession();

    expect(await widget.hasActiveSession()).toBe(true);
    const sessionID = await widget.getSessionID();
    expect(sessionID).toBeTruthy();
    // expect(await widget.chatPanel.isVisible()).toBe(true);
  });

  test('should handle page reload with existing session', async () => {
    await widget.startPanel.startSession();

    const initialSessionID = await widget.getSessionID();

    await widget.goto({
      // memoriID: testConfig.memori.id,
      // ownerUserID: testConfig.memori.ownerUserID,
      // tenantID: testConfig.tenant.id,
      sessionID: initialSessionID!,
    });

    const reloadedSessionID = await widget.getSessionID();
    expect(reloadedSessionID).toBe(initialSessionID);
    // expect(await widget.chatPanel.isVisible()).toBe(true);
  });

  test('should auto-start session when autoStart is enabled', async () => {
    await widget.goto({
      // memoriID: testConfig.memori.id,
      // ownerUserID: testConfig.memori.ownerUserID,
      // tenantID: testConfig.tenant.id,
      autoStart: true,
    });

    // Check if age verification modal is shown
    const hasAgeModal = await widget.startPanel.hasAgeVerificationModal();

    if (hasAgeModal) {
      console.log('Age verification modal detected, filling it...');

      // Automatically fill with a valid birthdate (25 years old)
      const now = new Date();
      const birthYear = now.getFullYear() - 25;
      const birthMonth = 6; // June
      const birthDay = 15;

      try {
        await widget.startPanel.completeAgeVerification(
          birthDay,
          birthMonth,
          birthYear
        );
      } catch (error) {
        console.error('Error during age verification:', error);
        throw error;
      }
    } else {
      console.log('No age verification modal, waiting for chat panel...');

      // Wait for chat panel to appear (no age verification needed)
      await widget.page.locator('.memori-chat').waitFor({
        state: 'visible',
        timeout: waitTimes.long,
      });

      console.log('Chat panel visible');
    }

    // await widget.chatPanel.waitForVisible();
    expect(await widget.hasActiveSession()).toBe(true);
    // expect(await widget.chatPanel.isVisible()).toBe(true);
  });
});
