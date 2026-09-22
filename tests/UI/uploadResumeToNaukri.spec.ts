import { test, expect } from '@playwright/test'
// import { urls } from '../../data/urls'

test('upload resume to naukri', async ({ page }) => {
    await page.goto('https://www.naukri.com/')
    await page.getByRole('link', { name: 'Login' }).click()
    await page.getByRole('textbox', { name: 'Email ID / Username' }).fill('sagardurgade@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('N@ukri2210')
    await page.getByRole('button', { name: 'Login', exact: true }).click()
    await page.getByRole('link', { name: 'View profile' }).click()
    // await page.getByRole('button', { name: 'Update resume' }).waitFor({ state: 'visible' })
    // await page.pause()
    // await page.locator('input[type="file"]').setInputFiles('data/SagarDurgade_SDET_8years.pdf')
    // await expect(page.getByText('Resume has been successfully uploaded.')).toBeVisible()
})