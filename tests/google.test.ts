import { test, expect } from '@playwright/test';
import { createPages } from '../src/app'


test.describe('Administrators', () => {
	test('Sd', { tag: ['@Pod=Regression'] }, async ({ page }) => {
        const pages = createPages(page)
        await page.goto(testData.googleUrl)
        
        pages.google.searchText(testData.searchData)
        pages.google.selectByText()
        // await page.waitForTimeout(5000)
    });
    test('Sd Test case fail', async ({ page }) => {
        const pages = createPages(page)
        await page.goto(testData.googleUrl)
        
        pages.google.searchText(testData.searchData)
        pages.google.selectByText()
        page.locator('//[@class="chatgpt"]').click()
        // await page.waitForTimeout(5000)
    });
});

const testData = {
    googleUrl: 'https://www.google.com/',
    searchData: 'Automation test engineer Sagar Durgade',
}
