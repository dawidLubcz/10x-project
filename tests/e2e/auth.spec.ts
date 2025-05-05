import { expect, test } from '@playwright/test';

test('user can register and login', async ({ page }) => {
  // Generate unique email for testing
  const testEmail = `test-user-${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  
  // Step 1: Navigate to registration page
  await page.goto('/auth?tab=register');
  
  // Wait for the form to be visible
  await page.waitForSelector('[data-testid="register-form"]');
  
  // Step 2: Fill in registration form
  await page.fill('[data-testid="register-email-input"]', testEmail);
  await page.fill('[data-testid="register-password-input"]', testPassword);
  
  // Step 3: Submit registration form
  await page.click('[data-testid="register-submit-button"]');
  
  // Step 4: Wait for success message and auto-switch to login tab
  await page.waitForSelector('[data-testid="registration-success-alert"]');
  await expect(page.locator('[data-testid="registration-success-alert"]')).toBeVisible();
  
  // Verify we're now on the login tab
  await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  
  // Step 5: Login with the newly created credentials
  await page.fill('[data-testid="login-email-input"]', testEmail);
  await page.fill('[data-testid="login-password-input"]', testPassword);
  
  // Step 6: Submit login form
  await page.click('[data-testid="login-submit-button"]');
  
  // Step 7: Verify successful redirect to homepage after login
  await page.waitForURL('/');
  
  // Step 8: Verify user is logged in by checking for email in profile link
  await expect(page.locator('a[href="/profile"]')).toContainText(testEmail);
  // Or check URL parameters, cookies, or local storage as needed
});