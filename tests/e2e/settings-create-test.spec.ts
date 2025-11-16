import { test, expect } from '@playwright/test';

test.describe('Settings Create Tests', () => {
  test('should create a new department without 401 error', async ({ page }) => {
    const apiErrors: { url: string; status: number; method: string }[] = [];

    // Intercept all API calls
    page.on('response', response => {
      const url = response.url();
      if (url.includes('/api/')) {
        const status = response.status();
        const method = response.request().method();
        console.log(`${method} ${status} ${url}`);

        if (status === 401) {
          apiErrors.push({ url, status, method });
        }
      }
    });

    // Navigate to settings
    await page.goto('http://localhost:4200/settings');
    await page.waitForTimeout(2000);

    // Verify on departments tab
    const departmentsTab = page.locator('button:has-text("Avdelinger")');
    await expect(departmentsTab).toBeVisible();

    // Get initial count
    const initialRowCount = await page.locator('tbody tr').count();
    console.log(`Initial departments: ${initialRowCount}`);

    // Click "Legg til avdeling"
    const addButton = page.locator('button:has-text("Legg til avdeling")');
    await addButton.click();
    await page.waitForTimeout(1000);

    // Fill form with unique code to avoid conflicts
    const uniqueCode = `TEST${Date.now()}`;
    await page.fill('input[name="code"]', uniqueCode);
    await page.fill('input[name="name"]', 'Test Department');
    await page.fill('textarea[name="description"]', 'Created by automated test');

    // Submit form
    const saveButton = page.locator('button:has-text("Lagre")');
    await saveButton.click();

    // Wait for API call and page update
    await page.waitForTimeout(3000);

    // Check for API errors
    if (apiErrors.length > 0) {
      console.log('❌ API Errors detected:');
      apiErrors.forEach(err => {
        console.log(`  ${err.method} ${err.status} ${err.url}`);
      });
    }

    // Verify no 401 errors on POST
    const postErrors = apiErrors.filter(e => e.method === 'POST' && e.url.includes('/api/departments'));
    expect(postErrors).toHaveLength(0);

    // Verify form closed (success)
    const form = page.locator('form:has-text("Opprett avdeling")');
    await expect(form).not.toBeVisible();

    // Verify new department appears in table
    const newRowCount = await page.locator('tbody tr').count();
    console.log(`After creation: ${newRowCount} departments`);
    expect(newRowCount).toBeGreaterThan(initialRowCount);

    // Verify the new department is in the table
    const newRow = page.locator(`tr:has-text("${uniqueCode}")`);
    await expect(newRow).toBeVisible();

    console.log(`✅ Department "${uniqueCode}" created successfully without 401 errors`);
  });

  test('should create a new project without 401 error', async ({ page }) => {
    const apiErrors: { url: string; status: number; method: string }[] = [];

    page.on('response', response => {
      const url = response.url();
      if (url.includes('/api/')) {
        const status = response.status();
        const method = response.request().method();
        console.log(`${method} ${status} ${url}`);

        if (status === 401) {
          apiErrors.push({ url, status, method });
        }
      }
    });

    // Navigate to settings
    await page.goto('http://localhost:4200/settings');
    await page.waitForTimeout(2000);

    // Switch to projects tab
    const projectsTab = page.locator('button:has-text("Prosjekter")');
    await projectsTab.click();
    await page.waitForTimeout(2000);

    // Get initial count
    const initialRowCount = await page.locator('tbody tr').count();
    console.log(`Initial projects: ${initialRowCount}`);

    // Click "Legg til prosjekt"
    const addButton = page.locator('button:has-text("Legg til prosjekt")');
    await addButton.click();
    await page.waitForTimeout(1000);

    // Fill form with unique code
    const uniqueCode = `PROJ${Date.now()}`;
    await page.fill('input[name="code"]', uniqueCode);
    await page.fill('input[name="name"]', 'Test Project');
    await page.fill('textarea[name="description"]', 'Created by automated test');
    await page.fill('input[name="startDate"]', '2025-01-01');
    await page.fill('input[name="endDate"]', '2025-12-31');

    // Submit form
    const saveButton = page.locator('button:has-text("Lagre")');
    await saveButton.click();

    // Wait for API call and page update
    await page.waitForTimeout(3000);

    // Check for API errors
    if (apiErrors.length > 0) {
      console.log('❌ API Errors detected:');
      apiErrors.forEach(err => {
        console.log(`  ${err.method} ${err.status} ${err.url}`);
      });
    }

    // Verify no 401 errors on POST
    const postErrors = apiErrors.filter(e => e.method === 'POST' && e.url.includes('/api/projects'));
    expect(postErrors).toHaveLength(0);

    // Verify form closed (success)
    const form = page.locator('form:has-text("Opprett prosjekt")');
    await expect(form).not.toBeVisible();

    // Verify new project appears in table
    const newRowCount = await page.locator('tbody tr').count();
    console.log(`After creation: ${newRowCount} projects`);
    expect(newRowCount).toBeGreaterThan(initialRowCount);

    // Verify the new project is in the table
    const newRow = page.locator(`tr:has-text("${uniqueCode}")`);
    await expect(newRow).toBeVisible();

    console.log(`✅ Project "${uniqueCode}" created successfully without 401 errors`);
  });
});
