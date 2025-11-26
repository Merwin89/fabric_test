import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import type { UserData } from '../types/user.types';

export class RegisterPage extends BasePage {
  // Locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly ssnInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly successMessage: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators using attribute selectors for dotted IDs
    this.firstNameInput = page.locator('input[name="customer.firstName"]');
    this.lastNameInput = page.locator('input[name="customer.lastName"]');
    this.addressInput = page.locator('input[name="customer.address.street"]');
    this.cityInput = page.locator('input[name="customer.address.city"]');
    this.stateInput = page.locator('input[name="customer.address.state"]');
    this.zipCodeInput = page.locator('input[name="customer.address.zipCode"]');
    this.phoneInput = page.locator('input[name="customer.phoneNumber"]');
    this.ssnInput = page.locator('input[name="customer.ssn"]');
    this.usernameInput = page.locator('input[name="customer.username"]');
    this.passwordInput = page.locator('input[name="customer.password"]');
    this.confirmPasswordInput = page.locator('input[name="repeatedPassword"]');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.successMessage = page.locator('#rightPanel h1');
    this.welcomeMessage = page.locator('#rightPanel p');
  }

  async navigate() {
    await this.goto('/parabank/register.htm', { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(10000);
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 20000 });
  }

  async fillRegistrationForm(userData: UserData) {
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.addressInput.fill(userData.address);
    await this.cityInput.fill(userData.city);
    await this.stateInput.fill(userData.state);
    await this.zipCodeInput.fill(userData.zipCode);
    await this.phoneInput.fill(userData.phoneNumber);
    await this.ssnInput.fill(userData.ssn);
    await this.usernameInput.fill(userData.username);
    await this.passwordInput.fill(userData.password);
    await this.confirmPasswordInput.fill(userData.password);
  }

  async submitRegistration() {
    await this.registerButton.click();
    await this.page.waitForURL(/register\.htm/, { timeout: 30000 });
    await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });
  }

  async register(userData: UserData) {
    await this.fillRegistrationForm(userData);
    await this.submitRegistration();
  }

  async verifyRegistrationSuccess(username: string) {
    await expect(this.successMessage).toHaveText(`Welcome ${username}`);
    await expect(this.welcomeMessage).toContainText('Your account was created successfully');
  }
}
