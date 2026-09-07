import { test, expect, chromium } from "@playwright/test";
import { createPages } from '../../pages/app'

test.describe('Search moblie', () =>{

test("Verify the apple product on amazon website", async () => {
  test.setTimeout(60000)
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  const pages = createPages(page)

  // Go to url and verify title
  pages.amazon.gotoUrlAndVerifyTitle(testData.url)

  // Select dropdown
  pages.amazon.selectTheDepartment()

  // Search text and verify dropdown
  pages.amazon.searchTextAndVerify(testData.search)

  // Search text and open first result
  pages.amazon.searchAndSelect(testData.seatchText)

  // Select iphone and handel new tab
  const pagePromise = context.waitForEvent('page')
  pages.amazon.selectIphone()
  const newTab = await pagePromise
  const newPage = createPages(newTab)

  // Navigate to next tab and click on Visit the Apple Store
  newPage.amazonNewPage.visitTheAppleLinkStore
  newPage.amazonNewPage.selectAppleWatch()

  // Verify same product is open
  newPage.amazonNewPage.selectQuickLook(testData.watch)
})

const testData = {
  url: "https://www.amazon.in/",
  search: "iphone 17",
  seatchText: "iphone 17 256GB",
  watch: "[GPS + Cellular 40 mm]",
}

test("test", async ({ page }) => {
  test.setTimeout(30000)
  await page.goto("https://www.amazon.in/");
  await page.getByLabel("Select the department you want to search in").selectOption("search-alias=electronics")
  await page.getByPlaceholder("Search Amazon.in").fill("apple iphone 15 pro max 1tb gold")
  await page.getByLabel("apple iphone 15 pro max 1tb gold").filter().click();
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("link", { name: "Apple iPhone 15 Pro"}).nth(1).click()
  const newPage = await popupPromise;
  await page.waitForLoadState()
  await newPage.getByRole("link", {name: "Visit the Apple Store"}).click()
  const printTitle = await newPage.title()
  console.log(printTitle)
  page.waitForTimeout(5000)
  await newPage.getByRole('button', { name: 'Apple Watch' }).click()
  await newPage.getByRole('link', { name: 'Apple Watch Series 9 (GPS +' }).click()

  // await page.pause()
})

})




































// import { test, expect } from "@playwright/test";

