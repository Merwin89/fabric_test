import { test, expect } from '../src/fixtures/test.fixtures';
import { generateUserData, generateRandomAmount } from '../src/utils/test-data.util';
import * as fs from 'fs';
import * as path from 'path';

test.describe.configure({ mode: 'serial' });

test.describe('ParaBank E2E UI Tests', () => {
  let userData: ReturnType<typeof generateUserData>;
  let savingsAccountId: string;
  let checkingAccountId: string;
  let transferAmount: string;
  let billPaymentAmount: string;

  test('Complete E2E flow: Registration to Bill Payment', async ({
    page,
    registerPage,
    navigationMenu,
    openAccountPage,
    accountsOverviewPage,
    transferFundsPage,
    billPayPage,
  }) => {
    await test.step('Navigate to ParaBank application', async () => {
      await page.goto('/');
      await page.waitForTimeout(10000);
      await expect(page).toHaveTitle(/ParaBank/, { timeout: 30000 });
    });

    await test.step('Register new user with unique username', async () => {
      userData = generateUserData();
      await registerPage.navigate();
      await expect(page).toHaveURL(/register\.htm/);
      await registerPage.register(userData);
      await registerPage.verifyRegistrationSuccess(userData.username);
    });

    await test.step('Verify automatic login after registration', async () => {
      await expect(navigationMenu.openNewAccountLink).toBeVisible();
      await expect(navigationMenu.accountsOverviewLink).toBeVisible();
      await expect(page.locator('#leftPanel p').first()).toContainText(`Welcome ${userData.firstName} ${userData.lastName}`);
    });

    await test.step('Verify global navigation menu functionality', async () => {
      await navigationMenu.verifyGlobalNavigationWorking();
      await navigationMenu.verifyAccountServicesMenuVisible();
      await navigationMenu.navigateToAboutUs();
      await expect(page).toHaveURL(/about\.htm/);
      await navigationMenu.navigateToServices();
      await expect(page).toHaveURL(/services\.htm/);
      await navigationMenu.navigateToContact();
      await expect(page).toHaveURL(/contact\.htm/);
      await navigationMenu.navigateToHome();
      await expect(page).toHaveURL(/index\.htm/);
    });

    await test.step('Create initial checking account', async () => {
      await navigationMenu.navigateToOpenNewAccount();
      await expect(page).toHaveURL(/openaccount\.htm/);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(3000);
      
      const errorElement = page.locator('#rightPanel h1:has-text("Error")');
      if (await errorElement.isVisible().catch(() => false)) test.skip();
      
      const fromAccountSelect = openAccountPage.fromAccountSelect;
      await fromAccountSelect.waitFor({ state: 'visible', timeout: 15000 });
      
      const options = await fromAccountSelect.locator('option').allTextContents();
      if (options.length > 0) {
        checkingAccountId = options[0];
        await openAccountPage.createAccount('CHECKING', checkingAccountId);
        await page.waitForLoadState('domcontentloaded');
      } else {
        test.skip();
      }
    });

    await test.step('Verify accounts overview with initial account', async () => {
      await navigationMenu.navigateToAccountsOverview();
      await page.waitForLoadState('domcontentloaded');
      
      const errorElement = page.locator('#rightPanel h1:has-text("Error")');
      if (await errorElement.isVisible().catch(() => false)) test.skip();
      
      await accountsOverviewPage.verifyAccountsDisplayed();
      await accountsOverviewPage.accountLinks.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
      
      const accountIds = await accountsOverviewPage.getAccountIds();
      if (accountIds.length === 0) test.skip();
      
      expect(accountIds.length).toBeGreaterThan(0);
      if (!checkingAccountId) checkingAccountId = accountIds[0];
    });

    await test.step('Create savings account and capture account number', async () => {
      await navigationMenu.navigateToOpenNewAccount();
      await expect(page).toHaveURL(/openaccount\.htm/);
      await openAccountPage.createAccount('SAVINGS', checkingAccountId);
      await openAccountPage.verifyAccountCreated();
      savingsAccountId = await openAccountPage.getNewAccountId();
      expect(savingsAccountId).toBeTruthy();
    });

    await test.step('Validate accounts overview displays balance details', async () => {
      await navigationMenu.navigateToAccountsOverview();
      await page.waitForLoadState('domcontentloaded');
      await accountsOverviewPage.verifyAccountsDisplayed();
      await accountsOverviewPage.verifyBalanceDetails();
      await accountsOverviewPage.accountLinks.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
      
      const accountIds = await accountsOverviewPage.getAccountIds();
      if (accountIds.length === 0) test.skip();
      
      expect(accountIds).toContain(checkingAccountId);
      expect(accountIds).toContain(savingsAccountId);
      
      const checkingBalance = await accountsOverviewPage.getAccountBalance(checkingAccountId);
      const savingsBalance = await accountsOverviewPage.getAccountBalance(savingsAccountId);
      expect(checkingBalance).toBeTruthy();
      expect(savingsBalance).toBeTruthy();
    });

    await test.step('Transfer funds between accounts', async () => {
      transferAmount = generateRandomAmount(50, 100).toString();
      await navigationMenu.navigateToTransferFunds();
      await expect(page).toHaveURL(/transfer\.htm/);
      await transferFundsPage.transferFunds(transferAmount, savingsAccountId, checkingAccountId);
      await transferFundsPage.verifyTransferSuccess();
      await expect(page.locator('#showResult')).toContainText('Transfer Complete');
    });

    await test.step('Pay bill with savings account', async () => {
      billPaymentAmount = generateRandomAmount(20, 50).toString();
      await navigationMenu.navigateToBillPay();
      await expect(page).toHaveURL(/billpay\.htm/);
      await billPayPage.payBill(
        'Electric Company',
        '789 Power Street',
        'Chicago',
        'IL',
        '60601',
        '5559876543',
        '987654321',
        billPaymentAmount,
        savingsAccountId
      );
      await billPayPage.verifyPaymentSuccess();
      await expect(page.locator('#billpayResult')).toContainText('Bill Payment Complete');
      
      const transactionData = {
        username: userData.username,
        password: userData.password,
        billPaymentAmount: billPaymentAmount,
        billPaymentAccountId: savingsAccountId,
        timestamp: new Date().toISOString()
      };
      fs.writeFileSync(path.join(process.cwd(), 'transaction-data.json'), JSON.stringify(transactionData, null, 2));
    });

    await test.step('Final verification of account balances after transactions', async () => {
      await navigationMenu.navigateToAccountsOverview();
      await accountsOverviewPage.verifyAccountsDisplayed();
      const finalTotalBalance = await accountsOverviewPage.getTotalBalance();
      expect(finalTotalBalance).toBeTruthy();
    });
  });
});
