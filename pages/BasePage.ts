import { Page, Locator } from '@playwright/test'

export class BasePage {
    constructor(protected readonly page: Page) {}

    protected async isVisibleSafe(locator: Locator, timeout = 5000): Promise<boolean> {
        try {
            return await locator.isVisible({ timeout })
        } catch {
            return false
        }
    }
}

export { expect, Page, Locator } from '@playwright/test'