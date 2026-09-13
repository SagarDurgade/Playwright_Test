import { test } from '@playwright/test'

test('pop up test', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts')

    page.on('dialog', async dialog => {
        console.log(dialog.message())
        await dialog.accept()
    })

    await page.getByRole('button', { name: 'Click for JS Alert' }).click()
    await page.getByRole('button', { name: 'Click for JS Confirm' }).click()
    await page.getByRole('button', { name: 'Click for JS Prompt' }).click()
})

