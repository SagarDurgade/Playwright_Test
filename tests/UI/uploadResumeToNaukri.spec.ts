import { test } from '@playwright/test'
import { createPages } from '../../pages/app'
import { urls } from '../../data/urls'
import * as fs from 'node:fs'
import * as path from 'node:path'

test.use({ headless: false })
const storageStatePath = path.resolve('storageState.json') 

// test('upload resume to naukri', { tag: '@Naukri' }, async ({ page }) => {
//   const pages = createPages(page)
//   await page.goto(urls.naukriUrl)
//   await pages.naukari.login(process.env.NAUKRI_EMAIL!, process.env.NAUKRI_PASSWORD!)
//   await pages.naukari.updateResume('data/SagarDurgade_SDET_8years.pdf')
// })


test('Login to Naukri and reuse the saved session', { tag: '@Naukri' }, async ({ browser }) => {
  const context = await browser.newContext({ storageState: fs.existsSync(storageStatePath) ? storageStatePath : undefined })

  try {
    const page = await context.newPage()
    const pages = createPages(page)

    await page.goto(urls.naukriUrl)

    if (await pages.naukari.isLoginRequired()) {
      const email = process.env.NAUKRI_EMAIL
      const password = process.env.NAUKRI_PASSWORD

      if (!email || !password) {
        throw new Error('NAUKRI_EMAIL or NAUKRI_PASSWORD is missing')
      }

      await pages.naukari.login(email, password)
      await context.storageState({ path: storageStatePath, indexedDB: true })

      console.log('Logged in and saved the session')
    } else {
      console.log('Reusing the saved session')
    }

    await pages.naukari.updateResume('data/SagarDurgade_SDET_8years.pdf')
  } finally {
    await context.close()
  }
})
