import { BasePage, expect } from "./BasePage"

export class amazonPage extends BasePage {
  continueShopping = this.page.getByRole('button', { name: 'Continue shopping' })
  selectDepartment = this.page.getByLabel('Select the department you')
  searchBox = this.page.getByPlaceholder('Search Amazon.in')
  goButton = this.page.getByRole('button', { name: 'Go', exact: true })
  iphone17Locator = (iPhoneName: string) => this.page.locator(`h2[aria-label*="${iPhoneName}"]`).first()
  appleWatchLink = (watchName: string) => this.page.getByRole('link', { name: watchName })
  appleWatchThumbnail = (title: string) => this.page.locator(`//a[contains(@title, "${title}")]`).first()
  quickLookButton = this.page.getByTestId('quick-look-button').first()
  productShowcaseTitle = this.page.getByTestId('product-showcase-title')
  // visitTheAppleStoreLink = this.page.locator("//*[contains(text(),'Visit the Apple Store')]")
  visitTheAppleStoreLink = this.page.getByText("Visit the Apple Store", { exact: false })
  addToCartButton = this.page.getByRole('button', { name: 'Add to Cart' })

  


  async clickContinueShoppingIfVisible() {
    if (await this.continueShopping.isVisible().catch(() => false)) {
      await this.continueShopping.click()
    }
  }

  async selectTheDepartment(selectValue: string){
    await this.selectDepartment.selectOption(selectValue)
  }

  async searchProductByName(name: string) {
    await this.searchBox.fill(name)
    await this.goButton.click()
  }

  async visitTheAppleLinkStore() {
    await this.visitTheAppleStoreLink.click()
    await this.page.waitForLoadState()
  }

  async selectAppleWatch(appleWatchLinkName: string) {
    await this.page.getByRole('button', { name: 'Apple Watch' }).click()
    await this.appleWatchLink(appleWatchLinkName).click()
  }

  async selectQuickLook(appleWatchThumbnailTitle: string) {
    await this.appleWatchThumbnail(appleWatchThumbnailTitle).hover()
    await expect(this.quickLookButton).toBeVisible()
    await expect(this.quickLookButton).toBeEnabled()
    await this.quickLookButton.click()
  }

  async verifyWatchShowcaseText(expectedShowcaseText: string) {
    await expect(this.productShowcaseTitle).toBeVisible()
    await expect(this.productShowcaseTitle).toContainText(expectedShowcaseText)
  }
}