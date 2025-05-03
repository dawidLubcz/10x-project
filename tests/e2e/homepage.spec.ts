import { expect, test } from '@playwright/test';

test('homepage should load successfully', async ({ page }) => {
  await page.goto('/');
  
  // Check if the page has the correct title
  await expect(page).toHaveTitle(/10xProject/);
}); 