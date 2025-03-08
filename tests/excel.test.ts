import { test, expect } from '@playwright/test'
import ExcelJS from 'exceljs'
import fs from 'fs'
import { GetDateTime } from '../utils/getDateTime'
const getDateTime = new GetDateTime()

test('Edit Excel file columnA row 1 and row 2', async ({}) => {
    const filePath = './download/sd.xlsx'
    const sheetName = 'Sheet1'

    const getTime = getDateTime.getCurrentTime()

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
    }

    // Load the workbook
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(filePath)
    const worksheet = workbook.getWorksheet(sheetName)

    if (!worksheet) {
        throw new Error(`Worksheet '${sheetName}' not found.`)
    }

    // Update values in column B
    worksheet.getCell('B2').value = getTime
    worksheet.getCell('B3').value = 'Updated Value 3'

    // Save the changes
    await workbook.xlsx.writeFile(filePath)

    // Reload workbook to verify changes
    const newWorkbook = new ExcelJS.Workbook()
    await newWorkbook.xlsx.readFile(filePath)
    const newWorksheet = newWorkbook.getWorksheet(sheetName)

    expect(newWorksheet?.getCell('B2').value).toBe(getTime)
    expect(newWorksheet?.getCell('B3').value).toBe('Updated Value 3')

    console.log('Excel file updated and verified successfully!')
})

