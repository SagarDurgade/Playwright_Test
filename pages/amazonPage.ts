import { BasePage, expect } from "./BasePage"

export class amazonPage extends BasePage {
  // locators for the Amazon page
  continueShopping = this.page.getByRole('button', { name: 'Continue shopping' })
  selectDepartment = this.page.getByLabel('Select the department you')
  searchBox = this.page.getByPlaceholder('Search Amazon.in')
  goButton = this.page.getByRole('button', { name: 'Go', exact: true })


  // Methods for interacting with the Amazon page

  // in case contine shopping buton is visible, click it
  async clickContinueShoppingIfVisible() {
    if (await this.continueShopping.isVisible()) {
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

















  async searchTextAndVerify(search: string) {
    await this.page.getByPlaceholder('Search Amazon.in').fill("iphone 13")
  
    const rows = this.page.locator("[class='left-pane-results-container'] [role='button']")
      for (let i = 0; i < await rows.count(); ++i)
        await expect(rows.nth(i)).toContainText('iphone 13')
    this.page.getByPlaceholder('Search Amazon.in').clear
    await this.page.waitForTimeout(2000)
  }
  async selectIphone() {
    await this.page.locator("//*[contains(text(),'Apple iPhone 13')]").first().click()  
  }
  async searchAndSelect(searchText: string) {
    await this.page.getByPlaceholder("Search Amazon.in").fill('iphone 13 128GB')
    await this.page.getByLabel('iphone 13 128GB').first().click()
    await this.page.waitForTimeout(2000)
  }

// amazon new page
  async visitTheAppleLinkStore() {
    await this.page.locator("//*[contains(text(),'Visit the Apple Store')]").click()
    await this.page.waitForLoadState()
  }
  async selectAppleWatch()
  {
    await this.page.waitForTimeout(2000)
    await this.page.getByRole("button", { name: "Apple Watch" }).click()
  }
  async selectQuickLook(watch:string)
  {
    await this.page.getByRole("link", { name: "Apple Watch SE (GPS + Cellular)" }).click()
    await this.page.getByLabel("Quick look, Starlight Sport").first().click()
    await expect(this.page.getByTestId("product-showcase-title")).toContainText(watch)
  }
}

