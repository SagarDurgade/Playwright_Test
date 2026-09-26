import { test } from '@playwright/test'

test('pop up test', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts')

    page.on('dialog', async dialog => {
        console.log(dialog.message())
        await dialog.accept()
    })

    // page.on('dialog', async alert => {
    // console.log(alert.message())
    // await alert.accept()
    // })

    await page.getByRole('button', { name: 'Click for JS Alert' }).click()
    await page.getByRole('button', { name: 'Click for JS Confirm' }).click()
    await page.getByRole('button', { name: 'Click for JS Prompt' }).click()
})


// const [popup] = await Promise.all([
//     page.waitForEvent('dialog'),
//     page.getByRole('button', { name: 'Click for JS Alert' }).click()
// ])
// console.log(popup.message())
// await popup.accept()


// alert
// page.on('dialog', async alert => {
//     console.log(alert.message())
//     await alert.accept()
// })