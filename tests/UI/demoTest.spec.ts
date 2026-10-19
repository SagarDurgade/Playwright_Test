import { chromium, test } from '@playwright/test'
import * as XLSX from 'xlsx'
import path from 'path'

const excelFilePath = path.join(__dirname, '../../data/userExcelDataFile.xlsx')

test('should read user data from excel file', async () => {
    const workbook = XLSX.readFile(excelFilePath)
    const sheetNames = workbook.SheetNames

    const worksheet = workbook.Sheets[sheetNames[0]]
    const userData = XLSX.utils.sheet_to_json(worksheet)
    console.log(userData)
})



test('should launch chrome browser and open google', async () => {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('https://www.google.com/')
})



