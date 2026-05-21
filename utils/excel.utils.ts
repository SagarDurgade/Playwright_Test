import ExcelJS from 'exceljs'
import * as fs from 'fs'
import { expect } from '@playwright/test'

type ExcelRow = ExcelJS.CellValue[]
type ExcelData = ExcelRow[]

export class readAndwrightExcel {

    async readExcel(filePath: string): Promise<ExcelData> {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(filePath)
        const worksheet = workbook.getWorksheet(1)
        if (!worksheet) throw new Error(`Worksheet not found in: ${filePath}`)
        const data: ExcelData = []
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return
            const rowData: ExcelRow = []
            row.eachCell((cell) => {
                rowData.push(cell.value)
            })
            data.push(rowData)
        })
        return data
    }

    async writeExcel(filePath: string, sheetName: string, data: ExcelData) {

        if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`)
            }
        
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet(sheetName)
        data.forEach((row) => {
            worksheet.addRow(row)
        })
        await workbook.xlsx.writeFile(filePath)
    }

    async verifyExcelData(filePath: string, data: ExcelData) {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(filePath)
        const worksheet = workbook.getWorksheet(1)
        if (!worksheet) throw new Error(`Worksheet not found in: ${filePath}`)
        const actualData: ExcelData = []
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return
            const rowData: ExcelRow = []
            row.eachCell((cell) => {
                rowData.push(cell.value)
            })
            actualData.push(rowData)
        })
        expect(actualData).toEqual(data)
    }
}