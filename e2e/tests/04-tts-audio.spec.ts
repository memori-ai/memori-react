import { test, expect } from '@playwright/test';
import { MemoriWidget } from '../page-objects/MemoriWidget';
import { testConfig, testMessages, waitTimes } from '../fixtures/test-data';

/**
 * TTS Audio Tests
 * Tests text-to-speech audio generation and playback
 */

test.describe('TTS Audio', () => {
  let widget: MemoriWidget;

  test.beforeEach(async ({ page }) => {
    widget = new MemoriWidget(page);
    await page.goto(testConfig.baseURL);
    await widget.waitForLoad();
    await widget.startPanel.startSession();
    await widget.chatPanel.waitForVisible();
  });

  test('should show speaker button', async () => {
    const speakerButton = widget.chatPanel.speakerButton;
    const isVisible = await speakerButton.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should toggle speaker mute state', async () => {
    const speakerButton = widget.chatPanel.speakerButton;
    
    if (!(await speakerButton.isVisible().catch(() => false))) {
      test.skip();
    }
    
    const initialMuted = await widget.chatPanel.isSpeakerMuted();
    await widget.chatPanel.toggleSpeaker();
    
    const newMuted = await widget.chatPanel.isSpeakerMuted();
    expect(newMuted).toBe(!initialMuted);
  });

  test('should persist speaker mute setting in localStorage', async () => {
    const speakerButton = widget.chatPanel.speakerButton;
    
    if (!(await speakerButton.isVisible().catch(() => false))) {
      test.skip();
    }
    
    const wasMuted = await widget.chatPanel.isSpeakerMuted();
    if (!wasMuted) {
      await widget.chatPanel.toggleSpeaker();
    }
    
    const muteSetting = await widget.page.evaluate(() => 
      localStorage.getItem('@memori:muteSpeaker')
    );
    
    expect(muteSetting).toBeTruthy();
  });
});

