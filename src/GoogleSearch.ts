import { BasePage, expect } from './BasePage'

export class GoogleSearch extends BasePage {
    searchTextArea = this.page.locator('[name="q"]')
	textSagar = this.page.locator('//*[text()="Sagar Durgade - Senior Consultant - Capgemini"]')
	signInButton = this.page.getByLabel('View Sagar’s full profile', { exact: true })
	async searchText(searchText: string) {
		await this.searchTextArea.waitFor({state: 'visible'})
		await this.searchTextArea.fill(searchText);
		await this.searchTextArea.press('Enter');
	}
	async selectByText(){
		await this.textSagar.waitFor({state: 'visible'})
		await this.textSagar.click()
		expect(await this.page.title()).toContain('Sagar Durgade - Senior Consultant - Capgemini | LinkedIn')
	}
}
