import { BasePage, expect } from "./BasePage"

export class amazonPage extends BasePage {
  async gotoUrlAndVerifyTitle(amazonUrl: string) {
    await this.page.goto(amazonUrl);
    expect(await this.page.title()).toContain("Amazon");
  }

  async selectTheDepartment(){
    await this.page.getByLabel('Select the department you').selectOption('search-alias=electronics')
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
}

