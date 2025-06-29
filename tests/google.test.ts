import { chromium, test } from '@playwright/test'
import { createPages } from '../pages/app'
import { verify } from 'crypto'

test('Google Search Test', async ({ page }) => {
    const pages = createPages(page)
    await page.goto(testData.duckduckgoUrl)
    await pages.duckduckgo.searchText(testData.searchData)
    // await pages.duckduckgo.verifySearchResult(testData.verifyText)
    // await pages.duckduckgo.selectSearchResult(testData.verifyText)
    await page.waitForTimeout(5000) // Wait for 5 seconds to observe the result
})



const testData = {
    duckduckgoUrl: 'https://duckduckgo.com/',
    automationtesting: 'https://demo.automationtesting.in/Register.html',
    searchData: 'playwright test engineer sagardurgade linkedin',
    verifyText: `Sagar Durgade on LinkedIn: I'm excited to announce that I have joined`
}