import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TransferFundsPage extends BasePage {
  // Locators
  readonly pageHeading: Locator;
  readonly amountInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect: Locator;
  readonly transferButton: Locator;
  readonly successMessage: Locator;
  readonly transferAmount: Locator;
  readonly fromAccountId: Locator;
  readonly toAccountId: Locator;

  constructor(page: Page) {
    super(page);
    
    this.pageHeading = page.locator('#rightPanel h1').first();
    this.amountInput = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect = page.locator('#toAccountId');
    this.transferButton = page.getByRole('button', { name: 'Transfer' });
    this.successMessage = page.locator('#showResult h1');
    this.transferAmount = page.locator('#amount');
    this.fromAccountId = page.locator('#fromAccountId');
    this.toAccountId = page.locator('#toAccountId');
  }

  async navigate() {
    await this.page.goto('/transfer.htm', { waitUntil: 'domcontentloaded' });
    await this.pageHeading.waitFor({ state: 'visible', timeout: 30000 });
  }

  async transferFunds(amount: string, fromAccountId: string, toAccountId: string) {
    await this.amountInput.fill(amount);
    await this.fromAccountSelect.selectOption(fromAccountId);
    await this.toAccountSelect.selectOption(toAccountId);
    await this.transferButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyTransferSuccess() {
    await expect(this.successMessage).toHaveText('Transfer Complete!');
  }

  async getAvailableAccounts(): Promise<string[]> {
    const options = await this.fromAccountSelect.locator('option').allTextContents();
    return options;
  }
}
