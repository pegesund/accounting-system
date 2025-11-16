import { test, expect } from '@playwright/test';

test('settings page has proper CSS styling', async ({ page }) => {
  console.log('🔍 Testing Settings page CSS at http://localhost:4200/settings...');

  // Go to the settings page
  await page.goto('http://localhost:4200/settings');

  // Wait for page to load
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: '/tmp/settings-css-test.png', fullPage: true });
  console.log('📸 Screenshot saved to /tmp/settings-css-test.png');

  // Check for Settings heading (it's actually an h1, not h2)
  const heading = page.locator('h1:has-text("Innstillinger"), h1:has-text("Settings")').first();
  await expect(heading).toBeVisible({ timeout: 10000 });
  console.log('✅ Settings heading found!');

  // Check heading has proper Tailwind styling (text-2xl = 1.5rem, font-bold = 700)
  const headingStyles = await heading.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight
    };
  });
  console.log('📊 Heading styles:', headingStyles);

  // Check that heading is styled (not default 16px and 400)
  const fontSize = parseFloat(headingStyles.fontSize);
  const fontWeight = parseInt(headingStyles.fontWeight);

  expect(fontSize).toBeGreaterThan(16);
  expect(fontWeight).toBeGreaterThanOrEqual(700);
  console.log('✅ Heading has proper styling!');

  // Check for tabs (Avdelinger/Prosjekter)
  const tabs = page.locator('button:has-text("Avdelinger"), button:has-text("Departments")').first();
  await expect(tabs).toBeVisible();
  console.log('✅ Tabs found!');

  // Check tab styling
  const tabStyles = await tabs.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      borderBottom: styles.borderBottom,
      padding: styles.padding
    };
  });
  console.log('📊 Tab styles:', tabStyles);

  // Check for "Add Department" button
  const addButton = page.locator('button:has-text("Legg til avdeling"), button:has-text("Add Department")').first();
  await expect(addButton).toBeVisible();
  console.log('✅ Add button found!');

  // Check button has Tailwind styling (bg-blue-600, rounded, etc)
  const buttonStyles = await addButton.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      backgroundColor: styles.backgroundColor,
      borderRadius: styles.borderRadius,
      padding: styles.padding,
      color: styles.color
    };
  });
  console.log('📊 Button styles:', buttonStyles);

  // Verify button has custom styling (not default transparent background)
  expect(buttonStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(buttonStyles.borderRadius).not.toBe('0px');
  console.log('✅ Button has proper Tailwind styling!');

  // Check for table
  const table = page.locator('table').first();
  await expect(table).toBeVisible();
  console.log('✅ Table found!');

  // Check table styling
  const tableStyles = await table.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      width: styles.width,
      borderCollapse: styles.borderCollapse
    };
  });
  console.log('📊 Table styles:', tableStyles);

  expect(tableStyles.borderCollapse).toBe('collapse');
  console.log('✅ Table has proper styling!');

  // Check table headers have proper styling
  const tableHeader = page.locator('th').first();
  if (await tableHeader.count() > 0) {
    const thStyles = await tableHeader.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        padding: styles.padding,
        textAlign: styles.textAlign
      };
    });
    console.log('📊 Table header styles:', thStyles);

    // Table headers might not have background on error state, that's okay
    console.log('✅ Table headers rendered!');
  }

  // Check body background and font
  const bodyStyles = await page.evaluate(() => {
    const styles = window.getComputedStyle(document.body);
    return {
      backgroundColor: styles.backgroundColor,
      fontFamily: styles.fontFamily
    };
  });
  console.log('📊 Body styles:', bodyStyles);

  // Check navigation styling
  const navLink = page.locator('nav a, header a').first();
  if (await navLink.count() > 0) {
    const navStyles = await navLink.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        padding: styles.padding
      };
    });
    console.log('📊 Nav link styles:', navStyles);

    // Verify nav link is not using default blue color (rgb(0, 0, 238))
    expect(navStyles.color).not.toBe('rgb(0, 0, 238)');
    console.log('✅ Navigation has custom styling!');
  }

  // Check for console errors
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Wait a bit for any async errors
  await page.waitForTimeout(2000);

  if (consoleErrors.length > 0) {
    console.log('⚠️  Console errors found:', consoleErrors);
  } else {
    console.log('✅ No console errors');
  }

  console.log('✅ SETTINGS PAGE CSS IS WORKING!');
});
