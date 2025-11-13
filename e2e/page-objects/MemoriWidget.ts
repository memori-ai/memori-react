import { Page, Locator } from '@playwright/test';
import { selectors } from '../fixtures/test-data';
import { StartPanel } from './StartPanel';
import { ChatPanel } from './ChatPanel';

/**
 * Page Object Model for the main Memori Widget
 * Encapsulates all interactions with the widget
 */
export class MemoriWidget {
  readonly page: Page;
  readonly widget: Locator;
  readonly startPanel: StartPanel;
  readonly chatPanel: ChatPanel;

  constructor(page: Page) {
    this.page = page;
    this.widget = page.locator(selectors.widget);
    this.startPanel = new StartPanel(page);
    this.chatPanel = new ChatPanel(page);
  }

  /**
   * Navigate to the widget page with specific configuration
   */
  async goto(options: {
    memoriID?: string;
    ownerUserID?: string;
    memoriName?: string;
    ownerUserName?: string;
    tenantID?: string;
    layout?: string;
    integrationID?: string;
    sessionID?: string;
    multilingual?: boolean;
    showShare?: boolean;
    autoStart?: boolean;
    uiLang?: string;
    storyID?: string;
    viewMode?: string;
  }) {
    // Collect args for the "args" param in Storybook-style format "key:value;key2:value2"
    const argsArr: string[] = [];

    if (options.layout) argsArr.push(`layout:${options.layout}`);
    if (options.memoriID) argsArr.push(`memoriID:${options.memoriID}`);
    if (options.ownerUserID) argsArr.push(`ownerUserID:${options.ownerUserID}`);
    if (options.memoriName) argsArr.push(`memoriName:${options.memoriName}`);
    if (options.ownerUserName) argsArr.push(`ownerUserName:${options.ownerUserName}`);
    if (options.tenantID) argsArr.push(`tenantID:${options.tenantID}`);
    if (options.integrationID) argsArr.push(`integrationID:${options.integrationID}`);
    if (options.sessionID) argsArr.push(`sessionID:${options.sessionID}`);
    if (options.multilingual !== undefined) argsArr.push(`multilingual:${options.multilingual}`);
    if (options.showShare !== undefined) argsArr.push(`showShare:${options.showShare}`);
    if (options.autoStart !== undefined) argsArr.push(`autoStart:${options.autoStart}`);
    if (options.uiLang) argsArr.push(`uiLang:${options.uiLang}`);

    const argsStr = argsArr.join(';');

    // id and viewMode can be overridden with options or use defaults
    const storyID = options.storyID || 'general-layouts--default';
    const viewMode = options.viewMode || 'story';

    // Construct the URL as: /iframe.html?args=...&id=...&viewMode=...
    // If already on a page like "http://localhost:6006/iframe.html?...", preserve the origin
    const baseUrl = `${this.page.url().split('/iframe.html')[0]}/iframe.html`;
    const url = `${baseUrl}?args=${encodeURIComponent(argsStr)}&id=${encodeURIComponent(storyID)}&viewMode=${encodeURIComponent(viewMode)}`;

    await this.page.goto(url);
    await this.waitForLoad();
  }

  /**
   * Wait for the widget to be fully loaded
   */
  async waitForLoad() {
    await this.widget.waitFor({ state: 'visible' });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if the widget is visible
   */
  async isVisible(): Promise<boolean> {
    return await this.widget.isVisible();
  }

  /**
   * Get the current session ID from widget data attribute
   */
  async getSessionID(): Promise<string | null> {
    const element = this.page.locator(selectors.sessionIDAttr).first();
    return await element.getAttribute('data-memori-session-id');
  }

  /**
   * Get the current engine state from widget data attribute
   */
  async getEngineState(): Promise<any> {
    const element = this.page.locator(selectors.engineStateAttr).first();
    const stateJSON = await element.getAttribute('data-memori-engine-state');
    return stateJSON ? JSON.parse(stateJSON) : null;
  }

  /**
   * Check if session is active
   */
  async hasActiveSession(): Promise<boolean> {
    const sessionID = await this.getSessionID();
    return sessionID !== null && sessionID.length > 0;
  }

  /**
   * Get the current layout from widget class
   */
  async getLayout(): Promise<string | null> {
    const classes = await this.widget.getAttribute('class');
    if (!classes) return null;

    const layoutMatch = classes.match(/memori-layout-(\w+)/);
    return layoutMatch ? layoutMatch[1] : null;
  }

  /**
   * Check if widget is in loading state
   */
  async isLoading(): Promise<boolean> {
    const loadingIndicator = this.page.locator('.memori-loading, .ant-spin');
    return await loadingIndicator.isVisible().catch(() => false);
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingComplete(timeout: number = 10000) {
    const loadingIndicator = this.page.locator('.memori-loading, .ant-spin');
    await loadingIndicator.waitFor({ state: 'hidden', timeout }).catch(() => {
      // Loading indicator might not exist, that's okay
    });
  }

  /**
   * Get widget dimensions
   */
  async getDimensions() {
    return await this.widget.boundingBox();
  }

  /**
   * Take a screenshot of the widget
   */
  async screenshot(path: string) {
    await this.widget.screenshot({ path });
  }

  /**
   * Check if specific layout class is present
   */
  async hasLayout(layout: string): Promise<boolean> {
    const hasClass = await this.widget.evaluate(
      (el, layoutName) => el.classList.contains(`memori-layout-${layoutName}`),
      layout.toLowerCase()
    );
    return hasClass;
  }

  /**
   * Get all API errors from network
   */
  async getNetworkErrors(): Promise<string[]> {
    const errors: string[] = [];
    this.page.on('response', response => {
      if (response.status() >= 400) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });
    return errors;
  }

  /**
   * Set birthdate in localStorage
   * @param birthDate ISO date string
   */
  async setBirthDateInLocalStorage(birthDate: string) {
    await this.page.evaluate((date) => {
      localStorage.setItem('birthDate', date);
    }, birthDate);
  }

  /**
   * Get birthdate from localStorage
   */
  async getBirthDateFromLocalStorage(): Promise<string | null> {
    return await this.page.evaluate(() => {
      return localStorage.getItem('birthDate');
    });
  }

  /**
   * Clear birthdate from localStorage
   */
  async clearBirthDateFromLocalStorage() {
    await this.page.evaluate(() => {
      localStorage.removeItem('birthDate');
    });
  }

  /**
   * Check if birthdate exists in localStorage
   */
  async hasBirthDateInLocalStorage(): Promise<boolean> {
    const birthDate = await this.getBirthDateFromLocalStorage();
    return birthDate !== null && birthDate.length > 0;
  }

  /**
   * Set a value in memori localStorage config
   * @param key Config key
   * @param value Config value
   */
  async setLocalConfig(key: string, value: any) {
    await this.page.evaluate(({ k, v }) => {
      localStorage.setItem(k, JSON.stringify(v));
    }, { k: key, v: value });
  }

  /**
   * Get a value from memori localStorage config
   * @param key Config key
   */
  async getLocalConfig(key: string): Promise<any> {
    return await this.page.evaluate((k) => {
      const item = localStorage.getItem(k);
      return item ? JSON.parse(item) : null;
    }, key);
  }

  /**
   * Clear all memori localStorage data
   */
  async clearLocalStorage() {
    await this.page.evaluate(() => {
      localStorage.clear();
    });
  }

  /**
   * Complete age verification if modal appears
   * @param day Day of birth (1-31)
   * @param month Month of birth (1-12)
   * @param year Year of birth (4 digits)
   */
  async handleAgeVerificationIfNeeded(day: number, month: number, year: number) {
    const hasAgeModal = await this.startPanel.hasAgeVerificationModal();
    if (hasAgeModal) {
      await this.startPanel.completeAgeVerification(day, month, year);
    }
  }
}

