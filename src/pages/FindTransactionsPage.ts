import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Find Transactions page
 */
export class FindTransactionsPage extends BasePage {
  // Locators
  readonly pageHeading: Locator;
  readonly accountSelect: Locator;
  readonly findByAmountInput: Locator;
  readonly findByAmountButton: Locator;
  readonly transactionTable: Locator;
  readonly transactionRows: Locator;

  constructor(page: Page) {
    super(page);
    
    this.pageHeading = page.locator('#rightPanel h1').first();
    this.accountSelect = page.locator('#accountId');
    this.findByAmountInput = page.locator('input[name="criteria.amount"]');
    this.findByAmountButton = page.locator('button[ng-click*="findByAmount"]');
    this.transactionTable = page.locator('#transactionTable');
    this.transactionRows = page.locator('#transactionTable tbody tr');
  }

  /**
   * Navigate to find transactions page
   */
  async navigate() {
    await this.page.goto('/parabank/findtrans.htm', { waitUntil: 'domcontentloaded' });
    await this.pageHeading.waitFor({ state: 'visible', timeout: 30000 });
  }

  /**
   * Select account to search transactions
   */
  async selectAccount(accountId: string) {
    await this.accountSelect.selectOption(accountId);
  }

  /**
   * Find transactions by amount
   */
  async findByAmount(accountId: string, amount: string) {
    await this.selectAccount(accountId);
    await this.findByAmountInput.fill(amount);
    await this.findByAmountButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get transaction count
   */
  async getTransactionCount(): Promise<number> {
    return await this.transactionRows.count();
  }

  /**
   * Verify transactions are displayed
   */
  async verifyTransactionsDisplayed() {
    await expect(this.transactionTable).toBeVisible();
    await expect(this.transactionRows.first()).toBeVisible();
  }
}
