// import * as ExcelJS from 'exceljs'
// import { test, expect } from '@playwright/test'
// import * as fs from 'fs'

// const filePath = './download/sd1.xlsx'

// // Function to update Excel file
// async function updateExcel(filePath: string, updates: { [key: string]: string }) {
//     if (!fs.existsSync(filePath)) {
//         throw new Error(`File not found: ${filePath}`)
//     }
    
//     const workbook = new ExcelJS.Workbook()
//     await workbook.xlsx.readFile(filePath)
//     const worksheet = workbook.getWorksheet(1)
    
//     if (!worksheet) {
//         throw new Error('Worksheet not found.')
//     }
    
//     for (const [cell, value] of Object.entries(updates)) {
//         worksheet.getCell(cell).value = value
//     }
    
//     await workbook.xlsx.writeFile(filePath)
// }

// // Function to verify Excel file data
// async function verifyExcel(filePath: string, expectedValues: { [key: string]: string }) {
//     if (!fs.existsSync(filePath)) {
//         throw new Error(`File not found: ${filePath}`)
//     }
    
//     const workbook = new ExcelJS.Workbook()
//     await workbook.xlsx.readFile(filePath)
//     const worksheet = workbook.getWorksheet(1)
    
//     if (!worksheet) {
//         throw new Error('Worksheet not found.')
//     }
    
//     for (const [cell, expectedValue] of Object.entries(expectedValues)) {
//         expect(worksheet.getCell(cell).value).toBe(expectedValue)
//     }
// }

// test('Update and Verify Excel File', async () => {
//     const updates = {
//         'B2': 'Updated Value 2', 'B3': 'Updated Value 3', 'B4': 'Updated Value 4', 'A4': 'Updated Value 4',
//         'A5': 'Updated Value 5',
//         'A6': 'Updated Value 6',
//         'A7': 'Updated Value 7',
//     }
    
//     await updateExcel(filePath, updates)
//     await verifyExcel(filePath, updates)
    
//     console.log('Excel file updated and verified successfully!')
// })
