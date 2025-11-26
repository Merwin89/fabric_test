import { test, expect } from '../src/fixtures/test.fixtures';
import type { TransactionData } from '../src/types/user.types';
import * as fs from 'fs';
import * as path from 'path';

test.describe('ParaBank API Tests', () => {
  let billPaymentAmount: string;
  let accountId: string;
  let transactionDataFile: string;

  test.beforeAll(() => {
    // Path to transaction data file created by UI test
    transactionDataFile = path.join(process.cwd(), 'transaction-data.json');
  });

  test('API Test: Search transactions by amount from UI test (Step 8)', async ({
    page,
    request,
    loginPage,
  }) => {
    let username: string;
    let password: string;

    await test.step('Login to establish session for API calls', async () => {
      if (!fs.existsSync(transactionDataFile)) test.skip();

      const data = JSON.parse(fs.readFileSync(transactionDataFile, 'utf-8'));
      accountId = data.billPaymentAccountId;
      billPaymentAmount = data.billPaymentAmount;
      username = data.username;
      password = data.password;

      await loginPage.navigate();
      await loginPage.login(username, password);
      await page.waitForURL(/overview\.htm/, { timeout: 30000 });
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Search transactions by amount using Find Transactions API', async () => {
      const response = await page.request.get(
        `/parabank/services_proxy/bank/accounts/${accountId}/transactions/amount/${billPaymentAmount}`
      );

      expect(response.ok()).toBeTruthy();
      const transactions: TransactionData[] = await response.json();
      expect(transactions).toBeDefined();
      expect(Array.isArray(transactions)).toBe(true);
      expect(transactions.length).toBeGreaterThan(0);
    });

    await test.step('Validate transaction JSON response structure', async () => {
      const response = await page.request.get(
        `/parabank/services_proxy/bank/accounts/${accountId}/transactions/amount/${billPaymentAmount}`
      );
      
      const transactions: TransactionData[] = await response.json();
      const transaction = transactions[0];

      expect(transaction.id).toBeDefined();
      expect(typeof transaction.id).toBe('number');
      expect(transaction.id).toBeGreaterThan(0);

      expect(transaction.accountId).toBeDefined();
      expect(typeof transaction.accountId).toBe('number');
      expect(transaction.accountId.toString()).toBe(accountId);

      expect(transaction.type).toBeDefined();
      expect(typeof transaction.type).toBe('string');
      expect(['Debit', 'Credit']).toContain(transaction.type);

      expect(transaction.date).toBeDefined();
      const dateType = typeof transaction.date;
      expect(['string', 'number']).toContain(dateType);
      if (typeof transaction.date === 'string') {
        expect(transaction.date).toMatch(/^\d{4}-\d{2}-\d{2}/);
      } else {
        expect(transaction.date as number).toBeGreaterThan(0);
      }

      expect(transaction.amount).toBeDefined();
      expect(typeof transaction.amount).toBe('number');
      expect(Math.abs(transaction.amount)).toBe(parseFloat(billPaymentAmount));

      expect(transaction.description).toBeDefined();
      expect(typeof transaction.description).toBe('string');
      expect(transaction.description.length).toBeGreaterThan(0);
    });

    await test.step('Get transaction by ID and validate', async () => {
      const response = await page.request.get(
        `/parabank/services_proxy/bank/accounts/${accountId}/transactions/amount/${billPaymentAmount}`
      );
      
      const transactions: TransactionData[] = await response.json();
      const transactionId = transactions[0].id;

      const txResponse = await page.request.get(
        `/parabank/services_proxy/bank/transactions/${transactionId}`
      );
      
      expect(txResponse.ok()).toBeTruthy();
      const transaction: TransactionData = await txResponse.json();
      expect(transaction).toBeDefined();
      expect(transaction.id).toBe(transactionId);
      expect(transaction.accountId.toString()).toBe(accountId);
      expect(Math.abs(transaction.amount)).toBe(parseFloat(billPaymentAmount));
    });

    await test.step('Get all account transactions and verify bill payment exists', async () => {
      const response = await page.request.get(
        `/parabank/services_proxy/bank/accounts/${accountId}/transactions`
      );
      
      expect(response.ok()).toBeTruthy();
      const allTransactions: TransactionData[] = await response.json();
      expect(allTransactions).toBeDefined();
      expect(Array.isArray(allTransactions)).toBe(true);
      expect(allTransactions.length).toBeGreaterThan(0);

      const billPayment = allTransactions.find(
        t => Math.abs(t.amount) === parseFloat(billPaymentAmount)
      );
      expect(billPayment).toBeDefined();
    });
  });
});
