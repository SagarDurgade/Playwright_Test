import { test, chromium, expect } from '@playwright/test';

test.skip('Open browser manually without built-in fixtures', async () => {
  const browser = await chromium.launch({ headless: false, channel: 'msedge' })

  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('https://playwright.dev/')
  await expect(page).toHaveTitle("Fast and reliable end-to-end testing for modern web apps | Playwright" )
  await browser.close()
})