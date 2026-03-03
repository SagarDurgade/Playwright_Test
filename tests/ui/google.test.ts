import { test } from '@playwright/test'
import { createPages } from '../../pages/app'

test('Google Search Test', async ({ page }) => {
    const pages = createPages(page)
    await page.goto(testData.duckduckgoUrl)
    await pages.duckduckgo.searchText(testData.searchData)
    // await pages.duckduckgo.verifySearchResult(testData.verifyText)
    // await pages.duckduckgo.selectSearchResult(testData.verifyText)
    await page.waitForTimeout(5000) // Wait for 5 seconds to observe the result
    // print base url to console
    console.log(`Base URL: ${page.url()}`)
})

test('Open base url and take screenshot', async ({ page }) => {
    const pages = createPages(page)
    console.log(`Current URL: ${page.url()}`)
    await page.goto("/")
    await page.waitForTimeout(5000) // Wait for 5 seconds to observe the result

    // print url

    // screenshot of the page
    await page.screenshot({ path: 'screenshot.png' })
    
})

const testData = {
    duckduckgoUrl: 'https://duckduckgo.com/',
    automationtesting: 'https://demo.automationtesting.in/Register.html',
    searchData: 'playwright test engineer sagardurgade linkedin',
    verifyText: `Sagar Durgade on LinkedIn: I'm excited to announce that I have joined`
}