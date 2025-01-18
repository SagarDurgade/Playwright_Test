import { BasePage, expect } from './BasePage'

export class GoogleSearch extends BasePage {
    searchTextArea = this.page.locator('[name="q"]')
	textSagar = this.page.locator('[data-testid="result-title-a"]').first()
	signInButton = this.page.getByLabel('View Sagar’s full profile', { exact: true })
	profileName = this.page.locator('//*[contains(text(),"View Sagar’s full profile")]')
	async searchText(searchText: string) {
		await this.searchTextArea.waitFor({state: 'visible'})
		await this.searchTextArea.fill(searchText);
		await this.searchTextArea.press('Enter');
	}
	async selectByText(){
		await this.textSagar.waitFor({state: 'visible'})
		await this.textSagar.first().click()
		// await this.profileName.first().waitFor({state: 'visible'})
		// expect(await this.page.title()).toContain('Sagar Durgade - Senior Consultant - Capgemini | LinkedIn')
	}
}
