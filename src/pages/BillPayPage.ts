import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BillPayPage extends BasePage {
  // Locators
  readonly pageHeading: Locator;
  readonly payeeNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly accountInput: Locator;
  readonly verifyAccountInput: Locator;
  readonly amountInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly sendPaymentButton: Locator;
  readonly successMessage: Locator;
  readonly payeeName: Locator;
  readonly paymentAmount: Locator;

  constructor(page: Page) {
    super(page);
    
    this.pageHeading = page.locator('#rightPanel h1').first();
    this.payeeNameInput = page.locator('input[name="payee.name"]');
    this.addressInput = page.locator('input[name="payee.address.street"]');
    this.cityInput = page.locator('input[name="payee.address.city"]');
    this.stateInput = page.locator('input[name="payee.address.state"]');
    this.zipCodeInput = page.locator('input[name="payee.address.zipCode"]');
    this.phoneInput = page.locator('input[name="payee.phoneNumber"]');
    this.accountInput = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.fromAccountSelect = page.locator('select[name="fromAccountId"]');
    this.sendPaymentButton = page.getByRole('button', { name: 'Send Payment' });
    this.successMessage = page.locator('#billpayResult h1');
    this.payeeName = page.locator('#payeeName');
    this.paymentAmount = page.locator('#amount');
  }

  async navigate() {
    await this.page.goto('/parabank/billpay.htm', { waitUntil: 'domcontentloaded' });
    await this.pageHeading.waitFor({ state: 'visible', timeout: 30000 });
  }

  async fillPayeeInfo(
    name: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    phone: string,
    accountNumber: string
  ) {
    await this.payeeNameInput.fill(name);
    await this.addressInput.fill(address);
    await this.cityInput.fill(city);
    await this.stateInput.fill(state);
    await this.zipCodeInput.fill(zipCode);
    await this.phoneInput.fill(phone);
    await this.accountInput.fill(accountNumber);
    await this.verifyAccountInput.fill(accountNumber);
  }

  async payBill(
    payeeName: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    phone: string,
    accountNumber: string,
    amount: string,
    fromAccountId: string
  ) {
    await this.fillPayeeInfo(payeeName, address, city, state, zipCode, phone, accountNumber);
    await this.amountInput.fill(amount);
    await this.fromAccountSelect.selectOption(fromAccountId);
    await this.sendPaymentButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyPaymentSuccess() {
    await expect(this.successMessage).toHaveText('Bill Payment Complete');
  }

  async getPaymentAmount(): Promise<string> {
    return await this.getTextContent(this.paymentAmount);
  }
}
