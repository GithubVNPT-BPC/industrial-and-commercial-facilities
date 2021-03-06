import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { Workbook } from 'exceljs';
import * as XLSX from 'xlsx';
import { domain } from 'process';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    private DOMtable = undefined;

    constructor() { }

    public exportJsonAsExcelFile(filename: string, sheetname: string, datas: any) {
        if (!datas || datas.length == 0 ) throw new Error("Không có dữ liệu trên bảng");

        let parseDatas = XLSX.utils.json_to_sheet(datas);

        sheetname = this.formatSheetname(sheetname);
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet(sheetname);

        this.formatBody(worksheet, parseDatas);

        this.formatHeader(worksheet);

        this.formatWorksheetLength(worksheet);

        this.saveAsExcelFile(workbook, filename);
    }

    public exportDomTableAsExcelFile(filename: string, sheetname: string, DOMtable: any) {
        // Get data from DOM and ignore data from source
        if (!DOMtable || DOMtable === undefined ) throw new Error("Không có dữ liệu trên bảng");
        let table = this.formatNumberInDOM(DOMtable);
        let datas = XLSX.utils.table_to_sheet(table);
        this.setDOMtable(DOMtable);

        if (!datas || datas.length == 0 ) throw new Error("Lỗi khi truy xuất thông tin trên bảng");

        sheetname = this.formatSheetname(sheetname);
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet(sheetname);

        this.mergeCellsInTable(worksheet, datas['!merges'])

        this.formatBody(worksheet, datas);

        this.formatHeader(worksheet);

        this.formatWorksheetLength(worksheet);

        this.saveAsExcelFile(workbook, filename);
    }

    public formatNumberInDOM(table) {
        var rows = table.getElementsByTagName('tr');
        var R = 0, _C = 0, C = 0;
        for(; R < rows.length; ++R) {
            var row = rows[R];
            var elts = row.children;
            for(_C = C = 0; _C < elts.length; ++_C) {
                var elt = elts[_C], 
                v = elt.innerText;
                if (v != null && v.length && !isNaN(Number(v))) {
                    elt.innerHTML = String(v).replace('.', ',');
                }
            }
        }
        return table;
    }

    private formatSheetname(sheetname: string): string{
        if (sheetname.includes('/')) sheetname = sheetname.replace('/', '_').replace('/', '_');
        return sheetname;
    }

    private formatHeader(worksheet: any): void {
        let headerLen = 1;
        if (this.getDOMtable()) {
            let thead = this.DOMtable.getElementsByTagName('thead');
            headerLen = thead ? thead[0].getElementsByTagName('tr').length : 0;
        }
    
        let headerRows = worksheet.getRows(1, headerLen);
        for (let h in headerRows) {
            headerRows[h].eachCell((cell, number) => {
                cell.font = { bold: true, color: { argb: '000000'}};
                cell.alignment = { wrapText: false };
            });
        }
    }

    private formatBody(worksheet: any, bodyDatas: any): void {
        for (let cVal in bodyDatas) {
            if (!cVal.includes('!')) {
                let cell = worksheet.getCell(cVal);
                cell.value = bodyDatas[cVal]['v'];
                cell.border = {
                    top: { style:'thin' },
                    left: { style:'thin' },
                    bottom: { style:'thin'},
                    right: { style:'thin'}
                }
                cell.alignment = { wrapText: true };
            } 
        }
    }

    private mergeCellsInTable(worksheet: any, mergeRows: any): void {
        if (mergeRows) {
            mergeRows.forEach(row => {
                worksheet.mergeCells(row.s.r + 1, row.s.c + 1, row.e.r + 1, row.e.c + 1);
            });
        }
    }

    private saveAsExcelFile(workbook: any, filename: string): void {
        if (!filename.includes(EXCEL_EXTENSION)) {
            filename = filename + EXCEL_EXTENSION
        }
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: EXCEL_TYPE });
            FileSaver.saveAs(blob, filename);
        });
    }

    private formatWorksheetLength(ws: any): void {
        // Format length of columns
        ws.columns.forEach((column, i) => {
            let maxLength = 0;
            column["eachCell"]({ includeEmpty: true }, (cell) => {
                if (!cell.isMerged) {   
                    let columnLength = cell.value ? (cell.value.toString().length) + 1 : 10;
                    if (columnLength > maxLength ) {
                        maxLength = columnLength;
                    }
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength;
        });
    }

    private setDOMtable(table: any) {
        this.DOMtable = table;
    }

    private getDOMtable() {
        return this.DOMtable;
    }
}