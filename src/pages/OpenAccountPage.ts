import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class OpenAccountPage extends BasePage {
  // Locators
  readonly pageHeading: Locator;
  readonly accountTypeSelect: Locator;
  readonly fromAccountSelect: Locator;
  readonly openAccountButton: Locator;
  readonly newAccountId: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    this.pageHeading = page.locator('#rightPanel h1').first();
    this.accountTypeSelect = page.locator('#type');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.openAccountButton = page.getByRole('button', { name: 'Open New Account' });
    this.newAccountId = page.locator('#newAccountId');
    this.successMessage = page.locator('#openAccountResult p').first();
  }

  async navigate() {
    await this.page.goto('/parabank/openaccount.htm');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 30000 });
  }

  async selectAccountType(accountType: 'CHECKING' | 'SAVINGS') {
    await this.accountTypeSelect.selectOption(accountType);
  }

  async selectFromAccount(accountId: string) {
    await this.fromAccountSelect.selectOption(accountId);
  }

  async clickOpenAccount() {
    await this.openAccountButton.click();
    await this.page.waitForURL(/account\.htm/, { timeout: 30000 });
  }

  async createAccount(accountType: 'CHECKING' | 'SAVINGS', fromAccountId?: string) {
    await this.selectAccountType(accountType);
    if (fromAccountId) {
      await this.selectFromAccount(fromAccountId);
    }
    await this.clickOpenAccount();
  }

  async getNewAccountId(): Promise<string> {
    await this.newAccountId.waitFor({ state: 'visible', timeout: 30000 });
    const accountId = await this.getTextContent(this.newAccountId);
    return accountId;
  }

  async verifyAccountCreated() {
    await expect(this.successMessage).toContainText('Congratulations, your account is now open');
    await expect(this.newAccountId).toBeVisible();
  }
}
