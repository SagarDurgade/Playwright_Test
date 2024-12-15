import { BasePage, expect } from './BasePage'

export class GoogleSearch extends BasePage {
    searchTextArea = this.page.locator('[name="q"]')
	textSagar = this.page.locator('//*[text()="Sagar Durgade - Senior Consultant - Capgemini"]')
	async searchText(searchText: string) {
		await this.searchTextArea.fill(searchText);
		await this.page.waitForTimeout(100)
		await this.searchTextArea.press('Enter')
		await this.page.waitForTimeout(1000)
		// await page.keyboard.press('Enter');
	}
	async selectByText(){
		await this.textSagar.click()
	}
}
