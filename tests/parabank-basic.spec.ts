import { test, expect } from '../src/fixtures/test.fixtures';
import { generateUserData } from '../src/utils/test-data.util';

test.describe.configure({ mode: 'serial' });

test.describe('ParaBank Basic Tests', () => {
  test('Basic navigation test', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(10000);
    await expect(page).toHaveTitle(/ParaBank/, { timeout: 10000 });
  });

  test('Registration page loads', async ({ page, registerPage }) => {
    await page.goto('/parabank/register.htm');
    await page.waitForTimeout(10000);
    await expect(page).toHaveURL(/register\.htm/, { timeout: 10000 });
    await expect(registerPage.firstNameInput).toBeVisible({ timeout: 30000 });
  });

  test('User registration flow', async ({ page, registerPage }) => {
    const userData = generateUserData();
    await registerPage.navigate();
    await registerPage.fillRegistrationForm(userData);
    await registerPage.submitRegistration();
  });
});
