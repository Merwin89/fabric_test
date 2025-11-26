import { Page, Locator } from '@playwright/test';

/**
 * Base Page class containing common methods and utilities used across all pages
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(path: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }) {
    await this.page.goto(path, options);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get text content from a locator
   */
  async getTextContent(locator: Locator): Promise<string> {
    const text = await locator.textContent();
    return text?.trim() || '';
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Get current page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
