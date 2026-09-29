import { test } from '@playwright/test'
import * as XLSX from 'xlsx'
import path from 'path'


// need to install xlsx package
// npm i xlsx --save-dev

const userDataFile = path.join(__dirname, '../../data/userExcelDataFile.xlsx')

test('read and write excel test', async ({ page }) => {
    const workbook = XLSX.readFile(userDataFile)
    const getSheetNames = workbook.SheetNames
    console.log(getSheetNames)
    const worksheed = workbook.Sheets["Sheet1"]
    // first row is treated as headers, so each row becomes { email, password }
    const xlsxToJson = XLSX.utils.sheet_to_json<{ email: string, password: string }>(worksheed)
    console.log(xlsxToJson)

    await page.goto('https://conduit.bondaracademy.com')
    await page.getByRole('link', { name: 'Sign in' }).click()
    await page.getByRole('textbox', { name: 'Email' }).fill(`${xlsxToJson[0].email}`)
    await page.getByRole('textbox', { name: 'Password' }).fill(`${xlsxToJson[0].password}`)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.close()

})