import { BasePage, expect } from "./BasePage"

export class DuckduckgoPage extends BasePage {
    searchInput = this.page.getByRole('combobox', { name: 'Search with DuckDuckGo' })
    searchButton = this.page.getByRole('button', { name: 'Search', exact: true })
    searchResult = (id: string) => this.page.locator(`//*[contains(text(),"${id}")]`)
    downloadBrowserButton = this.page.locator('//*[text()="Download DuckDuckGo Browser"]')
    searchError = this.page.locator('text=Unexpected error. Please try again.')

    async searchText(text: string) {
        await this.searchInput.fill(text)
        await this.page.keyboard.press('Enter')
        await this.page.waitForLoadState('networkidle')
    }

    async verifySearchResult(text: string) {
        await expect(this.searchError).not.toBeVisible({ timeout: 5000 })
        await expect(this.searchResult(text)).toBeVisible({ timeout: 10000 })
    }

    async selectSearchResult(text: string) {
        await this.searchResult(text).click()
    }

    async ifDownloadOptionExists() {
        if (await this.downloadBrowserButton.isVisible()) {
            await this.downloadBrowserButton.click()
            console.log("Download button clicked")
        }
    }
}

