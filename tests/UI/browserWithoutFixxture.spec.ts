import { test, chromium } from '@playwright/test';

test('Open browser manually without built-in fixtures', async () => {
  const browser = await chromium.launch({ headless: false })

  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('https://playwright.dev/')
  await page.close()
})