import { BasePage, expect } from './BasePage'

export class GooglePage extends BasePage {
    searchInput = this.page.getByRole('combobox', { name: 'Search' })
    searchButton = this.page.getByRole('button', { name: 'Google Search' })
    doNotUseChromeButton = this.page.getByRole('button', { name: 'Do not use Chrome' })

    async searchText(text: string) {
        await this.searchInput.pressSequentially(text, { delay: 200 })
        await this.searchInput.press('Enter')
    }

    async verifySearchResult(text: string) {
        await expect(this.page.locator('h3')).toContainText(text, { timeout: 5000 })
    }
}

export default GooglePage