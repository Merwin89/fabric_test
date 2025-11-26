import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountsOverviewPage extends BasePage {
  // Locators
  readonly pageHeading: Locator;
  readonly accountsTable: Locator;
  readonly accountLinks: Locator;
  readonly totalBalance: Locator;
  readonly availableAmount: Locator;

  constructor(page: Page) {
    super(page);
    
    this.pageHeading = page.locator('#rightPanel h1');
    this.accountsTable = page.locator('#accountTable');
    this.accountLinks = page.locator('#accountTable tbody tr td:first-child a');
    this.totalBalance = page.locator('#accountTable tfoot tr:first-child td:last-child');
    this.availableAmount = page.locator('#accountTable tfoot tr:last-child td:last-child');
  }

  async navigate() {
    await this.page.goto('/parabank/overview.htm');
    await this.pageHeading.first().waitFor({ state: 'visible', timeout: 30000 });
  }

  async getAccountIds(): Promise<string[]> {
    const accounts = await this.accountLinks.allTextContents();
    return accounts;
  }

  async getAccountBalance(accountId: string): Promise<string> {
    const row = this.page.locator(`#accountTable tbody tr:has(a:text("${accountId}"))`);
    const balance = await row.locator('td:nth-child(2)').textContent();
    return balance?.trim() || '0';
  }

  async clickAccount(accountId: string) {
    await this.page.locator(`#accountTable tbody tr a:text("${accountId}")`).click();
    await this.waitForPageLoad();
  }

  async verifyAccountsDisplayed() {
    await expect(this.pageHeading.first()).toHaveText('Accounts Overview');
    await expect(this.accountsTable).toBeVisible();
  }

  async verifyBalanceDetails() {
    await expect(this.totalBalance).toBeVisible();
    await expect(this.availableAmount).toBeVisible();
  }

  async getTotalBalance(): Promise<string> {
    return await this.getTextContent(this.totalBalance);
  }
}
