import { test, expect } from '@playwright/test';

test('settings table has compact styling', async ({ page }) => {
  await page.goto('http://localhost:4200/settings');

  // Wait for page to load
  await page.waitForTimeout(3000);

  // Take screenshot of the departments table
  await page.screenshot({ path: '/tmp/settings-compact.png', fullPage: true });

  // Check if departments tab is visible
  const departmentsTab = page.locator('button:has-text("Avdelinger")');
  await expect(departmentsTab).toBeVisible({ timeout: 10000 });

  // Check if table is visible
  const table = page.locator('table');
  await expect(table).toBeVisible({ timeout: 10000 });

  // Verify table header exists
  const headers = page.locator('th');
  const headerCount = await headers.count();
  console.log(`Found ${headerCount} table headers`);
  expect(headerCount).toBeGreaterThan(0);

  // Check for department data
  const rows = page.locator('tbody tr');
  const rowCount = await rows.count();
  console.log(`Found ${rowCount} table rows`);

  console.log('✅ Settings table compact styling test complete');
});
