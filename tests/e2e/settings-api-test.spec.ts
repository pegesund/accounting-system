import { test, expect } from '@playwright/test';

test.describe('Settings API Tests', () => {
  test('should load departments without 401 error', async ({ page }) => {
    const apiErrors: string[] = [];

    // Intercept API calls to check for 401 errors
    page.on('response', response => {
      if (response.url().includes('/api/departments')) {
        console.log(`Departments API: ${response.status()} ${response.url()}`);
        if (response.status() === 401) {
          apiErrors.push(`401 Unauthorized on departments endpoint`);
        }
      }
    });

    // Navigate to settings
    await page.goto('http://localhost:4200/settings');
    await page.waitForTimeout(3000);

    // Verify departments tab is visible and active
    const departmentsTab = page.locator('button:has-text("Avdelinger")');
    await expect(departmentsTab).toBeVisible();

    // Verify table loaded with data (not showing an error message)
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Check that we have some data rows (at least the 3 existing departments)
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    console.log(`Found ${rowCount} departments`);
    expect(rowCount).toBeGreaterThan(0);

    // Verify no 401 errors occurred
    if (apiErrors.length > 0) {
      console.log('❌ API Errors:', apiErrors);
    }
    expect(apiErrors).toHaveLength(0);

    console.log('✅ Departments load without 401 errors');
  });

  test('should load projects without 401 error', async ({ page }) => {
    const apiErrors: string[] = [];

    // Intercept API calls to check for 401 errors
    page.on('response', response => {
      if (response.url().includes('/api/projects')) {
        console.log(`Projects API: ${response.status()} ${response.url()}`);
        if (response.status() === 401) {
          apiErrors.push(`401 Unauthorized on projects endpoint`);
        }
      }
    });

    // Navigate to settings
    await page.goto('http://localhost:4200/settings');
    await page.waitForTimeout(2000);

    // Switch to projects tab
    const projectsTab = page.locator('button:has-text("Prosjekter")');
    await projectsTab.click();
    await page.waitForTimeout(3000);

    // Verify projects tab is active
    await expect(projectsTab).toHaveClass(/border-blue-600/);

    // Verify table loaded
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Check that we have some data rows
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    console.log(`Found ${rowCount} projects`);
    expect(rowCount).toBeGreaterThan(0);

    // Verify no 401 errors occurred
    if (apiErrors.length > 0) {
      console.log('❌ API Errors:', apiErrors);
    }
    expect(apiErrors).toHaveLength(0);

    console.log('✅ Projects load without 401 errors');
  });

  test('should switch between tabs and load data for both', async ({ page }) => {
    const apiErrors: string[] = [];

    page.on('response', response => {
      const url = response.url();
      if (url.includes('/api/departments') || url.includes('/api/projects')) {
        console.log(`API Call: ${response.status()} ${url}`);
        if (response.status() === 401) {
          apiErrors.push(`401 error on ${url}`);
        }
      }
    });

    // Navigate to settings
    await page.goto('http://localhost:4200/settings');
    await page.waitForTimeout(2000);

    // Verify departments loaded
    let table = page.locator('table');
    await expect(table).toBeVisible();
    let rowCount = await page.locator('tbody tr').count();
    console.log(`Departments: ${rowCount} rows`);
    expect(rowCount).toBeGreaterThan(0);

    // Switch to projects
    const projectsTab = page.locator('button:has-text("Prosjekter")');
    await projectsTab.click();
    await page.waitForTimeout(2000);

    // Verify projects loaded
    await expect(table).toBeVisible();
    rowCount = await page.locator('tbody tr').count();
    console.log(`Projects: ${rowCount} rows`);
    expect(rowCount).toBeGreaterThan(0);

    // Switch back to departments
    const departmentsTab = page.locator('button:has-text("Avdelinger")');
    await departmentsTab.click();
    await page.waitForTimeout(2000);

    // Verify departments still loaded
    await expect(table).toBeVisible();
    rowCount = await page.locator('tbody tr').count();
    console.log(`Departments (2nd load): ${rowCount} rows`);
    expect(rowCount).toBeGreaterThan(0);

    // Verify no 401 errors
    if (apiErrors.length > 0) {
      console.log('❌ API Errors:', apiErrors);
    }
    expect(apiErrors).toHaveLength(0);

    console.log('✅ All API calls successful without 401 errors');
  });
});
