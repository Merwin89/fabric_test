import { test as base, APIRequestContext } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage';
import { OpenAccountPage } from '../pages/OpenAccountPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';
import { BillPayPage } from '../pages/BillPayPage';
import { FindTransactionsPage } from '../pages/FindTransactionsPage';
import { NavigationMenu } from '../pages/NavigationMenu';
import { TransactionAPIHelper } from '../utils/api.util';
import { generateUserData } from '../utils/test-data.util';
import type { UserData } from '../types/user.types';

/**
 * Extended test fixtures with Page Objects and custom fixtures
 */
type CustomFixtures = {
  registerPage: RegisterPage;
  loginPage: LoginPage;
  accountsOverviewPage: AccountsOverviewPage;
  openAccountPage: OpenAccountPage;
  transferFundsPage: TransferFundsPage;
  billPayPage: BillPayPage;
  findTransactionsPage: FindTransactionsPage;
  navigationMenu: NavigationMenu;
  transactionAPI: TransactionAPIHelper;
  authenticatedUser: { userData: UserData; accountId: string };
};

export const test = base.extend<CustomFixtures>({
  // Page Object fixtures
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  accountsOverviewPage: async ({ page }, use) => {
    await use(new AccountsOverviewPage(page));
  },

  openAccountPage: async ({ page }, use) => {
    await use(new OpenAccountPage(page));
  },

  transferFundsPage: async ({ page }, use) => {
    await use(new TransferFundsPage(page));
  },

  billPayPage: async ({ page }, use) => {
    await use(new BillPayPage(page));
  },

  findTransactionsPage: async ({ page }, use) => {
    await use(new FindTransactionsPage(page));
  },

  navigationMenu: async ({ page }, use) => {
    await use(new NavigationMenu(page));
  },

  // API helper fixture
  transactionAPI: async ({ request }, use) => {
    await use(new TransactionAPIHelper(request));
  },

  // Authenticated user fixture - automatically registers and logs in
  authenticatedUser: async ({ page, registerPage, accountsOverviewPage }, use) => {
    const userData = generateUserData();
    
    // Register new user
    await registerPage.navigate();
    await registerPage.register(userData);
    
    // User is automatically logged in after registration
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Get the first account ID (created automatically on registration)
    await accountsOverviewPage.navigate();
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for account links to appear
    await accountsOverviewPage.accountLinks.first().waitFor({ state: 'visible', timeout: 30000 });
    
    const accountIds = await accountsOverviewPage.getAccountIds();
    const accountId = accountIds[0] || '';

    await use({ userData, accountId });
  },
});

export { expect } from '@playwright/test';
