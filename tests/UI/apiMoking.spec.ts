import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('*/**/api/tags', async route => {
    const tags = {
      "tags": [
        "Automation",
        "Playwright"
      ]
    }

    await route.fulfill({
      json: tags
    })
  })

  await page.goto('https://conduit.bondaracademy.com/');
})

test('API Mocking', async ({ page }) => {
  await expect(page.locator('.navbar-brand')).toHaveText(/conduit/)
  await expect(page.locator('.sidebar .tag-pill')).toContainText(['Automation', 'Playwright'])
});