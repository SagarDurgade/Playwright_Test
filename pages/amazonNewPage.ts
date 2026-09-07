import { BasePage, expect } from "./BasePage"

export class amazonNewPage extends BasePage {
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
