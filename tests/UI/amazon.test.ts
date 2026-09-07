import { test, expect, chromium } from '@playwright/test';
import { createPages } from '../../pages/app'
import { urls } from '../../data/urls';


test('amazon test', async ({ }) => {
  test.setTimeout(60000)
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  const pages = createPages(page)

  await page.goto(urls.amazonUrl)
  await expect(page).toHaveTitle(/Amazon/)
  await pages.amazon.clickContinueShoppingIfVisible()

  await pages.amazon.selectTheDepartment(testData.departmentName)

  await pages.amazon.searchProductByName('iphone 17')

  // await page.pause()

  // const rows = page.locator("[class='left-pane-results-container'] [role='button']")
  //   for (let i = 0; i < await rows.count(); ++i)
  //     await expect(rows.nth(i)).toContainText('iphone 17')
  // await page.getByPlaceholder('Search Amazon.in').clear()
  // await page.waitForTimeout(2000)

  // await pages.amazon.searchAndSelect('iphone 17 256gb')

  // const pagePromise = context.waitForEvent('page')
  // await page.locator("//*[contains(text(),'Apple iPhone 17')]").first().click()
  // const newPage = await pagePromise

  // // Navigate to next tab and click on Visit the Apple Store
  // await newPage.locator("//*[contains(text(),'Visit the Apple Store')]").click()
  // await newPage.waitForLoadState()
  // // await page.waitForTimeout(2000)
  // await newPage.getByRole("button", { name: "Apple Watch" }).click()
  // await newPage.getByRole("link", { name: "Apple Watch SE (GPS + Cellular)" }).click()
  // await newPage.getByLabel("Quick look, Starlight Sport").first().click()
  // await expect(newPage.getByTestId("product-showcase-title")).toContainText("[GPS + Cellular 40 mm]")
})

const testData = {
  departmentName: 'search-alias=electronics'
}
