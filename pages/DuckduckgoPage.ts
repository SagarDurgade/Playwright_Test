
import { BasePage, expect } from "./BasePage"

export class DuckduckgoPage extends BasePage {
    searchInput = this.page.locator('input[name="q"]')
    searchButton = this.page.getByRole('button', { name: 'Search', exact: true })
    searchResult = (id: string) => this.page.locator(`//*[contains(text(),"${id}")]`)	// await this.fundraisingPageId(id).dblclick({ delay: 1000 })
    downloadBrowserButton = this.page.locator('//*[text()="Download DuckDuckGo Browser"]')

    async searchText(text: string) {
        await this.page.waitForTimeout(2000)
        await this.searchInput.fill(text)
        await this.page.waitForTimeout(2000)
        await this.page.keyboard.press('Enter')
        await this.page.waitForTimeout(2000)
    }
    
    async verifySearchResult(text: string) {
        await this.page.waitForTimeout(2000)
        await expect(this.searchResult(text)).toBeVisible({ timeout: 5000 })
        await this.page.waitForTimeout(2000)
    }
    
    async selectSearchResult(text: string) {
        await this.page.waitForTimeout(2000)
        await this.searchResult(text).click()
        await this.page.waitForTimeout(2000)
    }

    async ifDownloadOptionExists() {
        await this.page.waitForTimeout(2000)
        if (await this.downloadBrowserButton.isVisible()) {
            await this.downloadBrowserButton.click()
            console.log("Download button clicked")
        }
    }
}

