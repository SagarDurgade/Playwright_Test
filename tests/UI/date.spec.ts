import { test, expect } from '@playwright/test'

test('datepicker', async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/pages/iot-dashboard')
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    const date = new Date()
    date.setDate(date.getDate() + 100)

    const expectedDay = date.getDate().toString()
    const expectedMonth = date.toLocaleString('En-US', { month: 'short' })
    const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' })
    const expectedYear = date.getFullYear()

    const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`

    let currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`

    while (!currentMonthAndYear?.includes(expectedMonthAndYear)) {
    await page.locator('.next-month').click()
    currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay, { exact: true }).click()
    await expect(calendarInputField).toHaveValue(expectedDate)

})