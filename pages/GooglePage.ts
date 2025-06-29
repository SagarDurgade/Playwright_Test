import { BasePage, expect } from './BasePage'

export class GooglePage extends BasePage {
    searchInput = this.page.getByRole('combobox', { name: 'Search' })
    searchButton = this.page.getByRole('button', { name: 'Google Search' })

    async searchText(text: string) {
        await this.page.waitForTimeout(4000)
        await this.searchInput.fill(text)
        await this.page.keyboard.press('Escape')
        await this.page.waitForTimeout(4000)
        await this.searchButton.click()
    }

    async verifySearchResult(text: string) {
        await this.page.pause()
        await expect(this.page.locator('h3')).toContainText(text, { timeout: 5000 })
    }
}

export default GooglePage