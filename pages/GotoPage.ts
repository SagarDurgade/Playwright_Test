import { BasePage } from './BasePage'

export class GotoPage extends BasePage {

    async gotoUrl(url: string) {
        await this.page.goto(url)
        await this.page.waitForLoadState('networkidle')
    }
}