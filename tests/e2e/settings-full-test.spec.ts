import { test, expect } from '@playwright/test';

test.describe('Settings Page - Departments and Projects', () => {
  test('should load departments tab and add new department', async ({ page }) => {
    // Navigate to settings page
    await page.goto('http://localhost:4200/settings');

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Verify we're on the Avdelinger tab by default
    const departmentsTab = page.locator('button:has-text("Avdelinger")');
    await expect(departmentsTab).toBeVisible();
    await expect(departmentsTab).toHaveClass(/border-blue-600/); // Active tab

    // Verify table is loaded with data
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Count existing departments
    const initialRowCount = await page.locator('tbody tr').count();
    console.log(`Initial department count: ${initialRowCount}`);

    // Click "Legg til avdeling" button
    const addButton = page.locator('button:has-text("Legg til avdeling")');
    await addButton.click();
    await page.waitForTimeout(1000);

    // Fill in the form
    await page.fill('input[name="code"]', 'TEST');
    await page.fill('input[name="name"]', 'Test Department');
    await page.fill('textarea[name="description"]', 'This is a test department');

    // Submit the form
    const saveButton = page.locator('button:has-text("Lagre")');
    await saveButton.click();

    // Wait for the form to close and data to reload
    await page.waitForTimeout(2000);

    // Verify new department appears in table
    const newRowCount = await page.locator('tbody tr').count();
    console.log(`New department count: ${newRowCount}`);
    expect(newRowCount).toBeGreaterThan(initialRowCount);

    // Verify the new department is visible
    const testRow = page.locator('tr:has-text("TEST")');
    await expect(testRow).toBeVisible();
    await expect(testRow).toContainText('Test Department');

    console.log('✅ Department added successfully');
  });

  test('should switch to projects tab and add new project', async ({ page }) => {
    // Navigate to settings page
    await page.goto('http://localhost:4200/settings');
    await page.waitForTimeout(2000);

    // Click on Prosjekter tab
    const projectsTab = page.locator('button:has-text("Prosjekter")');
    await projectsTab.click();
    await page.waitForTimeout(1000);

    // Verify tab is active
    await expect(projectsTab).toHaveClass(/border-blue-600/);

    // Verify projects title is visible
    const projectsTitle = page.locator('h2:has-text("Prosjekter")');
    await expect(projectsTitle).toBeVisible();

    // Verify table is loaded
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Count existing projects
    const initialRowCount = await page.locator('tbody tr').count();
    console.log(`Initial project count: ${initialRowCount}`);

    // Click "Legg til prosjekt" button
    const addButton = page.locator('button:has-text("Legg til prosjekt")');
    await addButton.click();
    await page.waitForTimeout(1000);

    // Fill in the project form
    await page.fill('input[name="code"]', 'TESTPROJ');
    await page.fill('input[name="name"]', 'Test Project');
    await page.fill('textarea[name="description"]', 'This is a test project');
    await page.fill('input[name="startDate"]', '2025-01-01');
    await page.fill('input[name="endDate"]', '2025-12-31');

    // Select status if dropdown exists
    const statusSelect = page.locator('select[name="status"]');
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption('ACTIVE');
    }

    // Submit the form
    const saveButton = page.locator('button:has-text("Lagre")');
    await saveButton.click();

    // Wait for the form to close and data to reload
    await page.waitForTimeout(2000);

    // Verify new project appears in table
    const newRowCount = await page.locator('tbody tr').count();
    console.log(`New project count: ${newRowCount}`);
    expect(newRowCount).toBeGreaterThan(initialRowCount);

    // Verify the new project is visible
    const testRow = page.locator('tr:has-text("TESTPROJ")');
    await expect(testRow).toBeVisible();
    await expect(testRow).toContainText('Test Project');

    console.log('✅ Project added successfully');
  });

  test('should switch between tabs without errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', error => {
      errors.push(`PAGE ERROR: ${error.message}`);
    });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(`CONSOLE ERROR: ${msg.text()}`);
      }
    });

    // Navigate to settings
    await page.goto('http://localhost:4200/settings');
    await page.waitForTimeout(1500);

    // Should start on Avdelinger tab
    const departmentsTab = page.locator('button:has-text("Avdelinger")');
    await expect(departmentsTab).toHaveClass(/border-blue-600/);

    // Switch to Prosjekter
    const projectsTab = page.locator('button:has-text("Prosjekter")');
    await projectsTab.click();
    await page.waitForTimeout(1500);

    // Verify Prosjekter is active
    await expect(projectsTab).toHaveClass(/border-blue-600/);
    await expect(page.locator('h2:has-text("Prosjekter")')).toBeVisible();

    // Switch back to Avdelinger
    await departmentsTab.click();
    await page.waitForTimeout(1500);

    // Verify Avdelinger is active
    await expect(departmentsTab).toHaveClass(/border-blue-600/);
    await expect(page.locator('h2:has-text("Avdelinger")')).toBeVisible();

    // Verify no errors occurred
    if (errors.length > 0) {
      console.log('❌ Errors detected:');
      errors.forEach(err => console.log('  -', err));
    }
    expect(errors.length).toBe(0);

    console.log('✅ Tab switching works without errors');
  });
});
