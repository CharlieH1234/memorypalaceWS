import { chromium } from 'playwright';

(async () => {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to signup page
    await page.goto('http://localhost:5173/signup');
    console.log('✓ Navigated to signup page');

    // Fill out signup form
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('#confirm-password', 'password123');
    console.log('✓ Filled signup form');

    // Submit signup form
    await page.click('button[type="submit"]');
    console.log('✓ Submitted signup form');

    // Wait for redirect to signin
    await page.waitForURL('**/signin');
    console.log('✓ Redirected to signin page');

    // Fill out signin form
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'password123');
    console.log('✓ Filled signin form');

    // Submit signin form
    await page.click('button[type="submit"]');
    console.log('✓ Submitted signin form');

    // Wait for redirect to home
    await page.waitForURL('**/');
    console.log('✓ Redirected to home page');

    // Verify authentication
    await page.waitForSelector('text=Memory Palace');
    console.log('✓ Verified authenticated state');

    // Test protected route
    await page.goto('http://localhost:5173/create');
    await page.waitForSelector('text=Create Memory Palace');
    console.log('✓ Accessed protected route');

    // Sign out
    await page.click('text=Sign Out');
    await page.waitForURL('**/signin');
    console.log('✓ Successfully signed out');

  } catch (error) {
    console.error('Demo failed:', error);
  } finally {
    await browser.close();
  }
})();
