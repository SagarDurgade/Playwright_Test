const context = await browser.newContext();
const page = await context.newPage();
await page.goto('https://example.com');

// ... perform login actions here ...

// Save cookies and local storage to a file
await context.storageState({ path: 'playwright/.auth/state.json' });
await browser.close();