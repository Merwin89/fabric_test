import { APIRequestContext } from '@playwright/test';
import type { TransactionData } from '../types/user.types';

/**
 * API Helper for ParaBank transactions
 */
export class TransactionAPIHelper {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext, baseURL: string = 'https://parabank.parasoft.com/parabank') {
    this.request = request;
    this.baseURL = baseURL;
  }

  /**
   * Find transactions by account ID and amount
   * GET /services_proxy/bank/accounts/{accountId}/transactions/amount/{amount}
   */
  async findTransactionsByAmount(accountId: string, amount: string): Promise<TransactionData[]> {
    const response = await this.request.get(
      `${this.baseURL}/services_proxy/bank/accounts/${accountId}/transactions/amount/${amount}`
    );
    
    if (!response.ok()) {
      throw new Error(`API request failed with status ${response.status()}`);
    }

    return await response.json();
  }

  /**
   * Get all transactions for an account
   * GET /services_proxy/bank/accounts/{accountId}/transactions
   */
  async getAccountTransactions(accountId: string): Promise<TransactionData[]> {
    const response = await this.request.get(
      `${this.baseURL}/services_proxy/bank/accounts/${accountId}/transactions`
    );
    
    if (!response.ok()) {
      throw new Error(`API request failed with status ${response.status()}`);
    }

    return await response.json();
  }

  /**
   * Get transaction by ID
   * GET /services_proxy/bank/transactions/{transactionId}
   */
  async getTransactionById(transactionId: number): Promise<TransactionData> {
    const response = await this.request.get(
      `${this.baseURL}/services_proxy/bank/transactions/${transactionId}`
    );
    
    if (!response.ok()) {
      throw new Error(`API request failed with status ${response.status()}`);
    }

    return await response.json();
  }

  /**
   * Get account details
   * GET /services_proxy/bank/accounts/{accountId}
   */
  async getAccountDetails(accountId: string) {
    const response = await this.request.get(
      `${this.baseURL}/services_proxy/bank/accounts/${accountId}`
    );
    
    if (!response.ok()) {
      throw new Error(`API request failed with status ${response.status()}`);
    }

    return await response.json();
  }

  /**
   * Validate transaction data structure
   */
  validateTransactionData(transaction: TransactionData): boolean {
    return (
      typeof transaction.id === 'number' &&
      typeof transaction.accountId === 'number' &&
      typeof transaction.type === 'string' &&
      typeof transaction.date === 'string' &&
      typeof transaction.amount === 'number' &&
      typeof transaction.description === 'string'
    );
  }
}
