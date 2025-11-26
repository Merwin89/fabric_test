import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly welcomeText: Locator;

  constructor(page: Page) {
    super(page);
    
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.errorMessage = page.locator('.error');
    this.welcomeText = page.locator('#leftPanel p').first();
  }

  async navigate() {
    await this.page.goto('/parabank/index.htm', { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(10000);
    await this.usernameInput.waitFor({ state: 'visible', timeout: 20000 });
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyLoginSuccess(firstName: string, lastName: string) {
    await expect(this.welcomeText).toContainText(`Welcome ${firstName} ${lastName}`);
  }

  async verifyLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }
}
