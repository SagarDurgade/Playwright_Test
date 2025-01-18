import { test, expect } from '@playwright/test';
import { createPages } from '../src/app'


test.describe('Administrators', () => {
	test('Sd1', { tag: ['@Pod=Regression'] }, async ({ page }) => {
        const pages = createPages(page)
        await page.goto(testData.googleUrl, { waitUntil: 'load' })
        await pages.google.searchText(testData.searchData)
        await pages.google.selectByText()
    });
});

const testData = {
    googleUrl: 'https://www.google.co.in/',
    searchData: 'Playwright test engineer Sagar Durgade Capgemini',
}
