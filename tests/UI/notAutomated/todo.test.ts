
// test('Storage the cookies', async () => {
//     const browser = await chromium.launch({ headless: false })
//     const context = await browser.newContext()
//     const page = await context.newPage()

//     await page.goto('https://www.google.co.in')
//     // await page.fill('input[name="q"]', 'Playwright test engineer Sagar Durgade Capgemini')
//     // await page.press('input[name="q"]', 'Enter')
//     await page.waitForTimeout(2000) // Wait for 2 seconds to see the results
//     await page.pause()
//     // Perform login or other actions here

//     await context.storageState({ path: 'storageState.json' })
//     await browser.close()
// })
// test('Google Search Test', async () => {
//     const browser = await chromium.launch()
//     const context = await browser.newContext({ storageState: 'storageState.json' }) // Use cookies from storage
//     const page = await context.newPage()

//     const pages = createPages(page)
//     await page.goto(testData.duckduckgoUrl)
//     await pages.google.searchText(testData.searchData)
//     await pages.google.verifySearchResult(testData.searchData)
// })