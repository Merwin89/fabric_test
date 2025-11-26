import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class NavigationMenu extends BasePage {
  readonly openNewAccountLink: Locator;
  readonly accountsOverviewLink: Locator;
  readonly transferFundsLink: Locator;
  readonly billPayLink: Locator;
  readonly findTransactionsLink: Locator;
  readonly updateContactInfoLink: Locator;
  readonly requestLoanLink: Locator;
  readonly logOutLink: Locator;
  readonly aboutUsLink: Locator;
  readonly servicesLink: Locator;
  readonly productsLink: Locator;
  readonly locationsLink: Locator;
  readonly adminPageLink: Locator;
  readonly homeLink: Locator;
  readonly contactLink: Locator;

  constructor(page: Page) {
    super(page);
    
    this.openNewAccountLink = page.getByRole('link', { name: 'Open New Account' });
    this.accountsOverviewLink = page.getByRole('link', { name: 'Accounts Overview' });
    this.transferFundsLink = page.getByRole('link', { name: 'Transfer Funds' });
    this.billPayLink = page.getByRole('link', { name: 'Bill Pay' });
    this.findTransactionsLink = page.getByRole('link', { name: 'Find Transactions' });
    this.updateContactInfoLink = page.getByRole('link', { name: 'Update Contact Info' });
    this.requestLoanLink = page.getByRole('link', { name: 'Request Loan' });
    this.logOutLink = page.getByRole('link', { name: 'Log Out' });

    this.aboutUsLink = page.locator('#headerPanel a[href="about.htm"]').first();
    this.servicesLink = page.locator('#headerPanel a[href="services.htm"]').first();
    this.productsLink = page.locator('#headerPanel a[href*="products.jsp"]').first();
    this.locationsLink = page.locator('#headerPanel a[href*="contacts.jsp"]').first();
    this.adminPageLink = page.locator('#headerPanel a[href="admin.htm"]').first();
    this.homeLink = page.locator('#headerPanel a[href="index.htm"]').first();
    this.contactLink = page.locator('#headerPanel a[href="contact.htm"]').first();
  }

  async navigateToOpenNewAccount() {
    await this.openNewAccountLink.click();
    await this.waitForPageLoad();
  }

  async navigateToAccountsOverview() {
    await this.accountsOverviewLink.click();
    await this.waitForPageLoad();
  }

  async navigateToTransferFunds() {
    await this.transferFundsLink.click();
    await this.waitForPageLoad();
  }

  async navigateToBillPay() {
    await this.billPayLink.click();
    await this.waitForPageLoad();
  }

  async navigateToFindTransactions() {
    await this.findTransactionsLink.click();
    await this.waitForPageLoad();
  }

  async logout() {
    await this.logOutLink.click();
    await this.waitForPageLoad();
  }

  async navigateToAboutUs() {
    await this.aboutUsLink.click();
    await this.waitForPageLoad();
  }

  async navigateToServices() {
    await this.servicesLink.click();
    await this.waitForPageLoad();
  }

  async navigateToHome() {
    await this.homeLink.click();
    await this.waitForPageLoad();
  }

  async navigateToContact() {
    await this.contactLink.click();
    await this.waitForPageLoad();
  }

  async verifyAccountServicesMenuVisible() {
    await expect(this.openNewAccountLink).toBeVisible();
    await expect(this.accountsOverviewLink).toBeVisible();
    await expect(this.transferFundsLink).toBeVisible();
    await expect(this.billPayLink).toBeVisible();
    await expect(this.findTransactionsLink).toBeVisible();
    await expect(this.updateContactInfoLink).toBeVisible();
    await expect(this.requestLoanLink).toBeVisible();
    await expect(this.logOutLink).toBeVisible();
  }

  async verifyGlobalNavigationWorking() {
    await expect(this.aboutUsLink).toBeVisible();
    await expect(this.servicesLink).toBeVisible();
    await expect(this.homeLink).toBeVisible();
    await expect(this.contactLink).toBeVisible();
  }
}
