import { test } from '@playwright/test'
import { createPages } from '../../pages/app'
import { urls } from '../../data/urls'

test('upload resume to naukri',  { tag: '@Naukri' },async ({ page }) => {
     const pages = createPages(page)
    await page.goto(urls.naukriUrl)
    await pages.naukari.login(process.env.NAUKRI_EMAIL!, process.env.NAUKRI_PASSWORD!)
    await pages.naukari.updateResume('data/SagarDurgade_SDET_8years.pdf')
})