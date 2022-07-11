import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { Workbook } from 'exceljs';
import * as XLSX from 'xlsx';
import { new_model } from '../_models/APIModel/export-import.model';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    private DOMtable = undefined;
    href: string = '';

    constructor() { }

    public exportJsonAsExcelFile(filename: string, sheetname: string, datas: any) {
        if (!datas || datas.length == 0) throw new Error("Không có dữ liệu trên bảng");

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
        if (!DOMtable || DOMtable === undefined) throw new Error("Không có dữ liệu trên bảng");
        let table = this.formatNumberInDOM(DOMtable);
        let datas = XLSX.utils.table_to_sheet(table,{raw: true});
        this.setDOMtable(DOMtable);

        if (!datas || datas.length == 0) throw new Error("Lỗi khi truy xuất thông tin trên bảng");

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
        for (; R < rows.length; ++R) {
            var row = rows[R];
            var elts = row.children;
            for (_C = C = 0; _C < elts.length; ++_C) {
                var elt = elts[_C],
                    v = elt.innerText;
                if (v != null && v.length && !isNaN(Number(v))) {
                    elt.innerHTML = String(v).replace('.', ',');
                }
            }
        }
        return table;
    }

    private formatSheetname(sheetname: string): string {
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
                cell.font = { bold: true, color: { argb: '000000' } };
                cell.alignment = { wrapText: true };
            });
        }
    }

    private formatBody(worksheet: any, bodyDatas: any): void {
        for (let cVal in bodyDatas) {
            if (!cVal.includes('!')) {
                let cell = worksheet.getCell(cVal);
                cell.value = bodyDatas[cVal]['v'];
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
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

    private saveAsExcelFile(workbook: Workbook, filename: string): void {
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
                    let columnLength = cell.value ? (cell.value.toString().length) - 10 : 10;
                    if (columnLength > maxLength) {
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


    // reported common functions 
    public setHref(href: string) {
        this.href = href;
    }

    public getHref() {
        return this.href;
    }

    fields = {
        stt: "STT",
        ten_chi_tieu: "Tên tiêu chí",
        don_vi_tinh: "Đơn vị tính",
        thuc_hien_ky_truoc: 'Thực hiện kỳ trước',
        thuc_hien_cung_ky: 'Thực hiện cùng kỳ',
        thuc_hien_thang: 'Thực hiện kỳ báo cáo',
        ke_hoach_nam: 'Kế hoạch năm',
        luy_ke_thang: 'Lũy kế kỳ báo cáo',
        luy_ke_cung_ky: 'Lũy kế cùng kỳ',
        so_sanh_ky_truoc: 'Thực hiện kỳ báo cáo so với kỳ trước',
        so_sanh_cung_ky: 'Thực hiện so với cùng kỳ  năm trước',
        so_sanh_luy_ke_cung_ky: 'Lũy kế kỳ báo cáo so với cùng kỳ năm trước',
        so_sanh_luy_ke_ke_hoach_nam: 'Lũy kế kỳ báo cáo so với kế hoạch năm',
        ke_hoach_nam_sau: 'Kế hoạch năm sau',
        thuc_hien_6_thang_dau_nam_cung_ky: 'Thực hiện 6 tháng đầu năm cùng kỳ',
        uoc_thuc_hien_thang_6: 'Ước thực hiện tháng 6',
        uoc_thuc_hien_6_thang: 'Ước thực hiện 6 tháng',
        so_sanh_uoc_6_thang_cung_ky: 'Ước thực hiện 6 tháng so với cùng kỳ',
        so_sanh_uoc_6_thang_ke_hoach_nam: 'Ước thực hiện 6 tháng so với kế hoạch năm',
        thuc_hien_nam_truoc: 'Thực hiện năm trước',
        uoc_thuc_hien_nam: 'Ước thực hiện năm',
        so_sanh_uoc_thuc_hien_nam_cung_ky: 'Ước thực hiện năm so với cùng kỳ năm trước',
        so_sanh_ke_hoach_nam_sau_uoc_thuc_hien_nam: 'Kế hoạch năm sau so với ước thực hiện năm',
        so_sanh_ke_hoach_nam_sau_thuc_hien_nam: 'Kế hoạch năm sau so với thực hiện năm'
    }

    public initialdisplayedColumns(month: number): string[] {
        let displayedColumns = [];
        switch (month) {
            case 1:
                this.setHref('/assets/ExcelSample/BLHH_CSSXCN/1.xlsx');
                displayedColumns = [
                    // "index",
                    "stt",
                    "ten_chi_tieu",
                    "don_vi_tinh",

                    "thuc_hien_ky_truoc",
                    "thuc_hien_cung_ky",
                    "thuc_hien_thang",
                    'so_sanh_ky_truoc',
                    'so_sanh_cung_ky'
                ];
                break;

            case 2:
            case 3:
            case 4:
                this.setHref('/assets/ExcelSample/BLHH_CSSXCN/234.xlsx');
                displayedColumns = [
                    "stt",
                    "ten_chi_tieu",
                    "don_vi_tinh",

                    "thuc_hien_cung_ky",
                    "luy_ke_cung_ky",
                    "ke_hoach_nam",

                    "thuc_hien_ky_truoc",
                    "thuc_hien_thang",
                    "luy_ke_thang",

                    "so_sanh_ky_truoc",
                    "so_sanh_cung_ky",
                    "so_sanh_luy_ke_cung_ky"
                ]
                break;

            case 5:
                this.setHref('/assets/ExcelSample/BLHH_CSSXCN/5.xlsx');
                displayedColumns = [
                    "stt",
                    "ten_chi_tieu",
                    "don_vi_tinh",

                    "thuc_hien_cung_ky",
                    "thuc_hien_6_thang_dau_nam_cung_ky",
                    "ke_hoach_nam",

                    "thuc_hien_ky_truoc",
                    "thuc_hien_thang",
                    "uoc_thuc_hien_thang_6",

                    "uoc_thuc_hien_6_thang",
                    "so_sanh_ky_truoc",
                    "so_sanh_uoc_6_thang_cung_ky",
                    "so_sanh_uoc_6_thang_ke_hoach_nam"

                ]
                break;

            case 6:
            case 7:
            case 8:
            case 9:
            case 11:
                this.setHref('/assets/ExcelSample/BLHH_CSSXCN/678911.xlsx');
                displayedColumns = [
                    "stt",
                    "ten_chi_tieu",
                    "don_vi_tinh",

                    "thuc_hien_cung_ky",
                    "luy_ke_cung_ky",
                    "ke_hoach_nam",

                    "thuc_hien_ky_truoc",
                    "thuc_hien_thang",
                    "luy_ke_thang",

                    "so_sanh_ky_truoc",
                    "so_sanh_cung_ky",
                    "so_sanh_luy_ke_cung_ky",
                    "so_sanh_luy_ke_ke_hoach_nam"
                ]
                break;

            case 10:
                this.setHref('/assets/ExcelSample/BLHH_CSSXCN/10.xlsx');
                displayedColumns = [
                    "stt",
                    "ten_chi_tieu",
                    "don_vi_tinh",

                    "thuc_hien_nam_truoc",
                    "thuc_hien_cung_ky",
                    "luy_ke_cung_ky",

                    "ke_hoach_nam",
                    "thuc_hien_ky_truoc",
                    "thuc_hien_thang",

                    "luy_ke_thang",
                    "uoc_thuc_hien_nam",
                    "ke_hoach_nam_sau",
                    "so_sanh_ky_truoc",

                    "so_sanh_cung_ky",
                    "so_sanh_luy_ke_cung_ky",
                    "so_sanh_uoc_thuc_hien_nam_cung_ky",
                    "so_sanh_ke_hoach_nam_sau_uoc_thuc_hien_nam",
                ]
                break;

            case 12:
                this.setHref('/assets/ExcelSample/BLHH_CSSXCN/12.xlsx');
                displayedColumns = [
                    "stt",
                    "ten_chi_tieu",
                    "don_vi_tinh",

                    "thuc_hien_nam_truoc",
                    "ke_hoach_nam",
                    "thuc_hien_ky_truoc",

                    "thuc_hien_thang",
                    "luy_ke_thang",
                    "ke_hoach_nam_sau",

                    "so_sanh_luy_ke_cung_ky",
                    "so_sanh_luy_ke_ke_hoach_nam",
                    "so_sanh_ke_hoach_nam_sau_thuc_hien_nam"
                ]
                break;
            default:
                break;
        }
        return displayedColumns
    }

    mappingDataSource1(data, time_id) {
        let ls = [];
        data.forEach(item => {
            let datarow: new_model = new new_model();
            datarow['id_chi_tieu'] = item['ID'];
            datarow['thuc_hien_ky_truoc'] = item['Thực hiện kỳ trước'] ? item['Thực hiện kỳ trước'] : 0;
            datarow['thuc_hien_cung_ky'] = item['Thực hiện cùng kỳ'] ? item['Thực hiện cùng kỳ'] : 0;
            datarow['thuc_hien_thang'] = item['Thực hiện kỳ báo cáo'] ? item['Thực hiện kỳ báo cáo'] : 0;
            datarow['so_sanh_ky_truoc'] = item['Thực hiện kỳ báo cáo so với kỳ trước'] ? item['Thực hiện kỳ báo cáo so với kỳ trước'] : 0;
            datarow['so_sanh_cung_ky'] = item['Thực hiện so với cùng kỳ  năm trước'] ? item['Thực hiện so với cùng kỳ  năm trước'] : 0;

            datarow['don_vi_tinh'] = item['ĐVT'];
            datarow['stt'] = item['STT'];
            datarow['ten_chi_tieu'] = item['Chỉ tiêu chủ yếu'];
            datarow['time_id'] = time_id;
            ls.push(datarow);
        });
        return ls;
    }

    mappingDataSource234(data, time_id) {
        let ls = [];
        data.forEach(item => {
            let datarow: new_model = new new_model();
            datarow['id_chi_tieu'] = item['ID'];
            datarow['thuc_hien_cung_ky'] = item['Thực hiện cùng kỳ'] ? item['Thực hiện cùng kỳ'] : 0;
            datarow['luy_ke_cung_ky'] = item['Lũy kế cùng kỳ'] ? item['Lũy kế cùng kỳ'] : 0;
            datarow['ke_hoach_nam'] = item['Kế hoạch năm'] ? item['Kế hoạch năm'] : 0;
            datarow['thuc_hien_ky_truoc'] = item['Thực hiện kỳ trước'] ? item['Thực hiện kỳ trước'] : 0;
            datarow['thuc_hien_thang'] = item['Thực hiện kỳ báo cáo'] ? item['Thực hiện kỳ báo cáo'] : 0;
            datarow['luy_ke_thang'] = item['Lũy kế kỳ báo cáo'] ? item['Lũy kế kỳ báo cáo'] : 0;
            datarow['so_sanh_ky_truoc'] = item['Thực hiện kỳ báo cáo so với kỳ trước'] ? item['Thực hiện kỳ báo cáo so với kỳ trước'] : 0;
            datarow['so_sanh_cung_ky'] = item['Thực hiện kỳ báo cáo so với cùng kỳ năm trước'] ? item['Thực hiện kỳ báo cáo so với cùng kỳ năm trước'] : 0;
            datarow['so_sanh_luy_ke_cung_ky'] = item['Lũy kế kỳ báo cáo so với cùng kỳ năm trước'] ? item['Lũy kế kỳ báo cáo so với cùng kỳ năm trước'] : 0;

            datarow['don_vi_tinh'] = item['ĐVT'];
            datarow['stt'] = item['STT'];
            datarow['ten_chi_tieu'] = item['Chỉ tiêu chủ yếu'];
            datarow['time_id'] = time_id;
            ls.push(datarow);
        });
        return ls;
    }

    mappingDataSource5(data, time_id) {
        let ls = [];
        data.forEach(item => {
            let datarow: new_model = new new_model();
            datarow['id_chi_tieu'] = item['ID'];
            datarow['thuc_hien_cung_ky'] = item['Thực hiện cùng kỳ'] ? item['Thực hiện cùng kỳ'] : 0;
            datarow['thuc_hien_6_thang_dau_nam_cung_ky'] = item['Thực hiện 6 tháng đầu năm cùng kỳ'] ? item['Thực hiện 6 tháng đầu năm cùng kỳ'] : 0;
            datarow['ke_hoach_nam'] = item['Kế hoạch năm'] ? item['Kế hoạch năm'] : 0;
            datarow['thuc_hien_ky_truoc'] = item['Thực hiện kỳ trước'] ? item['Thực hiện kỳ trước'] : 0;
            datarow['thuc_hien_thang'] = item['Thực hiện kỳ báo cáo'] ? item['Thực hiện kỳ báo cáo'] : 0;
            datarow['uoc_thuc_hien_thang_6'] = item['Ước thực hiện tháng 6'] ? item['Ước thực hiện tháng 6'] : 0;
            datarow['uoc_thuc_hien_6_thang'] = item['Ước thực hiện 6 tháng'] ? item['Ước thực hiện 6 tháng'] : 0;
            datarow['so_sanh_ky_truoc'] = item['Thực hiện kỳ báo cáo so với kỳ trước'] ? item['Thực hiện kỳ báo cáo so với kỳ trước'] : 0;
            datarow['so_sanh_uoc_6_thang_cung_ky'] = item['Ước thực hiện 6 tháng so với cùng kỳ'] ? item['Ước thực hiện 6 tháng so với cùng kỳ'] : 0;
            datarow['so_sanh_uoc_6_thang_ke_hoach_nam'] = item['Ước thực hiện 6 tháng so với kế hoạch năm'] ? item['Ước thực hiện 6 tháng so với kế hoạch năm'] : 0;

            datarow['don_vi_tinh'] = item['ĐVT'];
            datarow['stt'] = item['STT'];
            datarow['ten_chi_tieu'] = item['Chỉ tiêu chủ yếu'];
            datarow['time_id'] = time_id;
            ls.push(datarow);
        });
        return ls;
    }

    mappingDataSource678911(data, time_id) {
        let ls = [];
        data.forEach(item => {
            let datarow: new_model = new new_model();
            datarow['id_chi_tieu'] = item['ID'];
            datarow['thuc_hien_cung_ky'] = item['Thực hiện cùng kỳ'] ? item['Thực hiện cùng kỳ'] : 0;
            datarow['luy_ke_cung_ky'] = item['Lũy kế cùng kỳ'] ? item['Lũy kế cùng kỳ'] : 0;
            datarow['ke_hoach_nam'] = item['Kế hoạch năm'] ? item['Kế hoạch năm'] : 0;
            datarow['thuc_hien_ky_truoc'] = item['Thực hiện kỳ trước'] ? item['Thực hiện kỳ trước'] : 0;
            datarow['thuc_hien_thang'] = item['Thực hiện kỳ báo cáo'] ? item['Thực hiện kỳ báo cáo'] : 0;
            datarow['luy_ke_thang'] = item['Lũy kế kỳ báo cáo'] ? item['Lũy kế kỳ báo cáo'] : 0;
            datarow['so_sanh_ky_truoc'] = item['Thực hiện kỳ báo cáo so với kỳ trước'] ? item['Thực hiện kỳ báo cáo so với kỳ trước'] : 0;
            datarow['so_sanh_cung_ky'] = item['Thực hiện kỳ báo cáo so với cùng kỳ năm trước'] ? item['Thực hiện kỳ báo cáo so với cùng kỳ năm trước'] : 0;
            datarow['so_sanh_luy_ke_cung_ky'] = item['Lũy kế kỳ báo cáo so với cùng kỳ năm trước'] ? item['Lũy kế kỳ báo cáo so với cùng kỳ năm trước'] : 0;
            datarow['so_sanh_luy_ke_ke_hoach_nam'] = item['Lũy kế kỳ báo cáo so với kế hoạch năm'] ? item['Lũy kế kỳ báo cáo so với kế hoạch năm'] : 0;

            datarow['don_vi_tinh'] = item['ĐVT'];
            datarow['stt'] = item['STT'];
            datarow['ten_chi_tieu'] = item['Chỉ tiêu chủ yếu'];
            datarow['time_id'] = time_id;
            ls.push(datarow);
        });
        return ls;
    }

    mappingDataSource10(data, time_id) {
        let ls = [];
        data.forEach(item => {
            let datarow: new_model = new new_model();
            datarow['id_chi_tieu'] = item['ID'];
            datarow['thuc_hien_nam_truoc'] = item['Thực hiện năm trước'] ? item['Thực hiện năm trước'] : 0;
            datarow['thuc_hien_cung_ky'] = item['Thực hiện cùng kỳ'] ? item['Thực hiện cùng kỳ'] : 0;
            datarow['luy_ke_cung_ky'] = item['Lũy kế cùng kỳ'] ? item['Lũy kế cùng kỳ'] : 0;
            datarow['ke_hoach_nam'] = item['Kế hoạch năm'] ? item['Kế hoạch năm'] : 0;
            datarow['thuc_hien_ky_truoc'] = item['Thực hiện kỳ trước'] ? item['Thực hiện kỳ trước'] : 0;
            datarow['thuc_hien_thang'] = item['Thực hiện kỳ báo cáo'] ? item['Thực hiện kỳ báo cáo'] : 0;
            datarow['luy_ke_thang'] = item['Lũy kế kỳ báo cáo'] ? item['Lũy kế kỳ báo cáo'] : 0;
            datarow['uoc_thuc_hien_nam'] = item['Ước thực hiện năm'] ? item['Ước thực hiện năm'] : 0;
            datarow['ke_hoach_nam_sau'] = item['Kế hoạch năm sau'] ? item['Kế hoạch năm sau'] : 0;
            datarow['so_sanh_ky_truoc'] = item['Thực hiện kỳ báo cáo so với kỳ trước'] ? item['Thực hiện kỳ báo cáo so với kỳ trước'] : 0;
            datarow['so_sanh_cung_ky'] = item['Thực hiện kỳ báo cáo so với cùng kỳ năm trước'] ? item['Thực hiện kỳ báo cáo so với cùng kỳ năm trước'] : 0;
            datarow['so_sanh_luy_ke_cung_ky'] = item['Lũy kế kỳ báo cáo so với cùng kỳ năm trước'] ? item['Lũy kế kỳ báo cáo so với cùng kỳ năm trước'] : 0;
            datarow['so_sanh_uoc_thuc_hien_nam_cung_ky'] = item['Ước thực hiện năm so với cùng kỳ năm trước'] ? item['Ước thực hiện năm so với cùng kỳ năm trước'] : 0;
            datarow['so_sanh_ke_hoach_nam_sau_uoc_thuc_hien_nam'] = item['Kế hoạch năm sau so với ước thực hiện năm'] ? item['Kế hoạch năm sau so với ước thực hiện năm'] : 0;

            datarow['don_vi_tinh'] = item['ĐVT'];
            datarow['stt'] = item['STT'];
            datarow['ten_chi_tieu'] = item['Chỉ tiêu chủ yếu'];
            datarow['time_id'] = time_id;
            ls.push(datarow);
        });
        return ls;
    }

    mappingDataSource12(data, time_id) {
        let ls = [];
        data.forEach(item => {
            let datarow: object = {};
            datarow['id_chi_tieu'] = item['ID'];
            datarow['thuc_hien_cung_ky'] = item['Thực hiện cùng kỳ'] ? item['Thực hiện cùng kỳ'] : 0;
            datarow['luy_ke_cung_ky'] = item['Lũy kế cùng kỳ'] ? item['Lũy kế cùng kỳ'] : 0;
            datarow['ke_hoach_nam'] = item['Kế hoạch năm'] ? item['Kế hoạch năm'] : 0;
            datarow['thuc_hien_ky_truoc'] = item['Thực hiện kỳ trước'] ? item['Thực hiện kỳ trước'] : 0;
            datarow['thuc_hien_thang'] = item['Thực hiện kỳ báo cáo'] ? item['Thực hiện kỳ báo cáo'] : 0;
            datarow['luy_ke_thang'] = item['Lũy kế kỳ báo cáo'] ? item['Lũy kế kỳ báo cáo'] : 0;
            datarow['so_sanh_ky_truoc'] = item['Thực hiện kỳ báo cáo so với kỳ trước'] ? item['Thực hiện kỳ báo cáo so với kỳ trước'] : 0;
            datarow['so_sanh_cung_ky'] = item['Thực hiện kỳ báo cáo so với cùng kỳ năm trước'] ? item['Thực hiện kỳ báo cáo so với cùng kỳ năm trước'] : 0;
            datarow['so_sanh_luy_ke_cung_ky'] = item['Lũy kế kỳ báo cáo so với cùng kỳ năm trước'] ? item['Lũy kế kỳ báo cáo so với cùng kỳ năm trước'] : 0;
        
            datarow['don_vi_tinh'] = item['ĐVT'];
            datarow['stt'] = item['STT'];
            datarow['ten_chi_tieu'] = item['Chỉ tiêu chủ yếu'];
            datarow['time_id'] = time_id;
            ls.push(datarow);
        });
        return ls;
    }
}