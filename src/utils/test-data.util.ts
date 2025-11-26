import type { UserData } from '../types/user.types';
import { randomUUID } from 'crypto';

/**
 * Generates a unique username with timestamp to ensure uniqueness across test runs
 */
export function generateUniqueUsername(): string {
  const uuid = randomUUID().split('-')[0];
  const timestamp = Date.now().toString().slice(-6);
  return `user${timestamp}${uuid}`;
}

/**
 * Generates complete user registration data with unique username
 */
export function generateUserData(): UserData {
  return {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phoneNumber: '5551234567',
    ssn: '123456789',
    username: generateUniqueUsername(),
    password: 'Test@1234',
  };
}

/**
 * Generates random amount between min and max for transactions
 */
export function generateRandomAmount(min: number = 10, max: number = 1000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
