import { test, expect } from '@playwright/test';

test.describe('Settings Polish and Ukrainian', () => {
  test('should show Polish and Ukrainian translations', async ({ page }) => {
    await page.goto('http://localhost:4200/settings');
    await page.waitForLoadState('networkidle');

    // Test Polish
    console.log('📍 Testing Polish');
    const languageSelector = page.locator('select');
    await languageSelector.selectOption('pl');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: '/tmp/settings-polish-test.png', fullPage: true });

    // Check for Polish text
    const departmentsTabPl = page.locator('button:has-text("Działy")');
    const projectsTabPl = page.locator('button:has-text("Projekty")');

    await expect(departmentsTabPl).toBeVisible({ timeout: 5000 });
    await expect(projectsTabPl).toBeVisible();
    console.log('✅ Polish verified');

    // Test Ukrainian
    console.log('📍 Testing Ukrainian');
    await languageSelector.selectOption('uk');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: '/tmp/settings-ukrainian-test.png', fullPage: true });

    // Check for Ukrainian text
    const departmentsTabUk = page.locator('button:has-text("Відділи")');
    const projectsTabUk = page.locator('button:has-text("Проєкти")');

    await expect(departmentsTabUk).toBeVisible({ timeout: 5000 });
    await expect(projectsTabUk).toBeVisible();
    console.log('✅ Ukrainian verified');
  });
});
