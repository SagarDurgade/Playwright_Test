import { test, expect } from '@playwright/test';
import { createPages } from '../../pages/app'
import { urls } from '../../data/urls';
import { amazonData } from '../../data/amazonData';


test('amazon test', async ({ page, context }) => {
  test.setTimeout(60000)
  const pages = createPages(page)

  await page.goto(urls.amazonUrl)
  await pages.amazon.searchBox.waitFor({ state: 'visible' })
  await expect(page).toHaveTitle(/Amazon/)
  await pages.amazon.clickContinueShoppingIfVisible()

  await pages.amazon.selectTheDepartment(amazonData.departmentName)
  await pages.amazon.searchProductByName(amazonData.searchProduct)

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    pages.amazon.iphone17Locator('iPhone 18').click()
  ])

  await newPage.waitForLoadState()
  console.log(await newPage.title())

  // Navigate to next tab and click on Visit the Apple Store
  const newTabPages = createPages(newPage)
  await newTabPages.amazon.visitTheAppleLinkStore()
  // await newTabPages.amazon.selectAppleWatch(amazonData.appleWatchLinkName)
  // await newTabPages.amazon.selectQuickLook(amazonData.appleWatchThumbnailTitle)
  // await newTabPages.amazon.verifyWatchShowcaseText(amazonData.appleWatchShowcaseText)
})

