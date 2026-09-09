import { test } from '@playwright/test'
import { createPages } from '../../pages/app'
import { testData } from '../../data/index'
import { dateTime } from '../../utils/utilities'

test('Find LinkedIn profile in DuckDuckGo search results', async ({ page }) => {
    const pages = createPages(page)
    await page.goto(testData.urls.duckduckgoUrl)
    await page.waitForLoadState('networkidle')
    await pages.duckduckgo.searchText(testData.userData.searchData)
    await pages.duckduckgo.verifySearchResult(testData.userData.verifyText)
    await pages.duckduckgo.selectSearchResult(testData.userData.verifyText)
    await page.waitForTimeout(5000) // Wait for 5 seconds to observe the result
    console.log(`Current URL: ${page.url()}`)
})

test('Get the currect date and time', async () => {
    const currentTime = await dateTime.getCurrentTime()
    const currentTimeAndSeconds = await dateTime.getCurrentTimeAndSeconds()
    console.log(`Current Time: ${currentTime}`)
    console.log(`Current Time with Seconds: ${currentTimeAndSeconds}`)
})
