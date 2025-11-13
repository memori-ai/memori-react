import { Page, Locator, expect } from '@playwright/test';
import { selectors, waitTimes } from '../fixtures/test-data';

/**
 * Page Object Model for the Start Panel
 */
export class StartPanel {
  readonly page: Page;
  readonly panel: Locator;
  readonly startButton: Locator;
  readonly memoriTitle: Locator;
  readonly memoriDescription: Locator;
  readonly memoriAvatar: Locator;
  readonly memoriCover: Locator;
  readonly languageSelector: Locator;

  constructor(page: Page) {
    this.page = page;
    this.panel = page.locator(selectors.startPanel);
    this.startButton = page.locator(selectors.startButton);
    this.memoriTitle = page.locator(selectors.memoriTitle);
    this.memoriDescription = page.locator(selectors.memoriDescription);
    this.memoriAvatar = page.locator(selectors.memoriAvatar);
    this.memoriCover = page.locator(selectors.memoriCover);
    this.languageSelector = page.locator(selectors.languageSelector);
  }

  /**
   * Check if start panel is visible
   */
  async isVisible(): Promise<boolean> {
    return await this.panel.isVisible();
  }

  /**
   * Wait for start panel to be visible
   */
  async waitForVisible() {
    await this.panel.waitFor({ state: 'visible' });
  }

  /**
   * Get memori name from title
   */
  async getMemoriName(): Promise<string> {
    return (await this.memoriTitle.textContent()) || '';
  }

  /**
   * Get memori description text
   */
  async getDescription(): Promise<string> {
    return (await this.memoriDescription.textContent()) || '';
  }

  /**
   * Check if avatar image is loaded
   */
  async isAvatarLoaded(): Promise<boolean> {
    const avatar = this.memoriAvatar;
    if (!(await avatar.isVisible())) return false;

    return await avatar.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalHeight !== 0;
    });
  }

  /**
   * Get avatar image URL
   */
  async getAvatarURL(): Promise<string> {
    return (await this.memoriAvatar.getAttribute('src')) || '';
  }

  /**
   * Check if cover image is loaded
   */
  async isCoverLoaded(): Promise<boolean> {
    const cover = this.memoriCover;
    if (!(await cover.isVisible())) return false;

    const bgImage = await cover.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.backgroundImage;
    });

    return bgImage !== 'none' && bgImage.length > 0;
  }

  /**
   * Check if start button is enabled
   */
  async isStartButtonEnabled(): Promise<boolean> {
    return await this.startButton.isEnabled();
  }

  /**
   * Click the start button
   */
  async clickStart() {
    await expect(this.startButton).toBeEnabled();
    await this.startButton.click();
  }

  /**
   * Start session and wait for it to initialize
   * Automatically handles age verification modal if it appears
   */
  async startSession() {
    // Click start button
    await this.clickStart();

    // Wait a bit for either modal or chat to appear
    // await this.page.waitForTimeout(1000);

    // Check if age verification modal is shown
    const hasAgeModal = await this.hasAgeVerificationModal();
    
    if (hasAgeModal) {
      
      // Automatically fill with a valid birthdate (25 years old)
      const now = new Date();
      const birthYear = now.getFullYear() - 25;
      const birthMonth = 6; // June
      const birthDay = 15;
      
      try {
        await this.completeAgeVerification(birthDay, birthMonth, birthYear);
        //wait 200ms 
        // await this.page.waitForTimeout(200);
      } catch (error) {
        console.error('Error during age verification:', error);
        throw error;
      }
    } else {
      console.log('No age verification modal, waiting for chat panel...');
      
      // Wait for chat panel to appear (no age verification needed)
      await this.page.locator('.memori-chat').waitFor({ 
        state: 'visible', 
        timeout: waitTimes.long 
      });
      
      console.log('Chat panel visible');
    }
  }

  /**
   * Check if language selector is visible
   */
  async hasLanguageSelector(): Promise<boolean> {
    return await this.languageSelector.isVisible().catch(() => false);
  }

  /**
   * Select a language from the dropdown
   */
  async selectLanguage(languageCode: string) {
    if (!(await this.hasLanguageSelector())) {
      throw new Error('Language selector is not available');
    }
    await this.languageSelector.selectOption({ value: languageCode });
    await this.page.waitForTimeout(waitTimes.short);
  }

  /**
   * Get currently selected language
   */
  async getSelectedLanguage(): Promise<string> {
    if (!(await this.hasLanguageSelector())) {
      return '';
    }
    return (await this.languageSelector.inputValue()) || '';
  }

  /**
   * Get all available languages
   */
  async getAvailableLanguages(): Promise<string[]> {
    if (!(await this.hasLanguageSelector())) {
      return [];
    }

    return await this.languageSelector.evaluate((select: HTMLSelectElement) => {
      return Array.from(select.options).map(option => option.value);
    });
  }

  /**
   * Check if memori requires login
   */
  async requiresLogin(): Promise<boolean> {
    const loginMessage = this.page.locator('.memori--needsLogin');
    return await loginMessage.isVisible().catch(() => false);
  }

  /**
   * Check if memori requires position
   */
  async requiresPosition(): Promise<boolean> {
    const positionMessage = this.page.locator('.memori--needsPosition');
    return await positionMessage.isVisible().catch(() => false);
  }

  /**
   * Check if memori is blocked
   */
  async isBlocked(): Promise<boolean> {
    const blockedBadge = this.page.locator('.memori-blocked-badge');
    return await blockedBadge.isVisible().catch(() => false);
  }

  /**
   * Check if deep thought disclaimer is shown
   */
  async hasDeepThoughtDisclaimer(): Promise<boolean> {
    const disclaimer = this.page.locator('.memori--deep-thought-disclaimer');
    return await disclaimer.isVisible().catch(() => false);
  }

  /**
   * Check if age verification modal is shown
   */
  async hasAgeVerificationModal(): Promise<boolean> {
    const modal = this.page.locator(selectors.ageVerificationModal);
    return await modal.isVisible().catch(() => false);
  }

  /**
   * Fill age verification form
   * Uses Headless UI Listbox components, not standard select elements
   * @param day Day of birth (1-31)
   * @param month Month of birth (1-12)
   * @param year Year of birth (4 digits)
   */
  async fillAgeVerification(day: number, month: number, year: number) {
    
    // Wait for the date selector to be visible
    const dateSelector = this.page.locator('.memori--date-selector');
    await dateSelector.waitFor({ state: 'visible', timeout: 5000 });
    
    // Get the three listbox buttons (day, month, year)
    const listboxButtons = dateSelector.locator('.memori--date-selector__select-button');
    
    // Ensure we have 3 buttons
    await expect(listboxButtons).toHaveCount(3);
    
    // Select DAY
    await listboxButtons.nth(0).click();
    // Wait for THE dropdown to appear (only one is visible at a time with Headless UI)
    const options = this.page.locator('.memori--date-selector__select-options');
    await options.waitFor({ state: 'visible', timeout: 3000 });
    const dayOption = options.locator('.memori--date-selector__select-option').filter({ hasText: new RegExp(`^${day}$`) });
    await dayOption.click();
    // Wait for dropdown to close
    await options.waitFor({ state: 'hidden', timeout: 2000 });
    
    // Select MONTH
    await listboxButtons.nth(1).click();
    // Wait for THE dropdown to appear again (it's the same selector, just reopened)
    await options.waitFor({ state: 'visible', timeout: 3000 });
    const monthOption = options.locator('.memori--date-selector__select-option').nth(month - 1);
    await monthOption.click();
    // Wait for dropdown to close
    await options.waitFor({ state: 'hidden', timeout: 2000 });
    
    // Select YEAR
    await listboxButtons.nth(2).click();
    // Wait for THE dropdown to appear again
    await options.waitFor({ state: 'visible', timeout: 3000 });
    const yearOption = options.locator('.memori--date-selector__select-option').filter({ hasText: new RegExp(`^${year}$`) });
    await yearOption.click();
    // Wait for dropdown to close
    await options.waitFor({ state: 'hidden', timeout: 2000 });
    
  }

  /**
   * Submit age verification form
   */
  async submitAgeVerification() {
    const submitButton = this.page.locator(selectors.ageVerificationSubmit);
    
    // Wait for button to be enabled (it's disabled until a date is selected)
    await submitButton.waitFor({ state: 'visible', timeout: 2000 });
    await expect(submitButton).toBeEnabled({ timeout: 5000 });
    
    await submitButton.click();
  }

  /**
   * Complete age verification with given birthdate
   * @param day Day of birth (1-31)
   * @param month Month of birth (1-12)
   * @param year Year of birth (4 digits)
   */
  async completeAgeVerification(day: number, month: number, year: number) {
    
    // Fill the form
    await this.fillAgeVerification(day, month, year);
    
    // Small wait before submitting
    // await this.page.waitForTimeout(500);
    
    // Submit the form
    await this.submitAgeVerification();
    
    
    // Wait for modal to close
    const modal = this.page.locator(selectors.ageVerificationModal);
    await modal.waitFor({ state: 'hidden', timeout: waitTimes.long });
    
  }

  /**
   * Close age verification modal without submitting
   */
  async closeAgeVerificationModal() {
    const closeButton = this.page.locator(`${selectors.ageVerificationModal} .memori-modal--close`);
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }
}

