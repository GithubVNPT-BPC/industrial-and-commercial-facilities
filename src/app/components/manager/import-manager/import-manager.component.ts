//Import library
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as XLSX from 'xlsx';
//Import Service
import { ManagerService } from '../../../_services/APIService/manager.service';
import { MarketService } from 'src/app/_services/APIService/market.service';
import { KeyboardService } from './../../../shared/services/keyboard.service';
//Import Model
import { ManagerDirective } from './../../../shared/manager.directive';
import { ProductManagerModelList, ImportManagerModel, MODE } from '../../../_models/APIModel/manager.model';
import { SAVE } from 'src/app/_enums/save.enum';
import { ImportMarketModel } from 'src/app/_models/APIModel/domestic-market.model';
//Import Component
import { ExportTopCompanyManager } from '../export-top-company-manager/export-top-company-manager.component';
import { InformationService } from 'src/app/shared/information/information.service';

//Moment
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
import { Subject } from 'rxjs';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-import-manager',
    templateUrl: 'import-manager.component.html',
    styleUrls: ['../manager_layout.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        { provide: MAT_DATE_LOCALE, useValue: 'vi' },
    ],
})

export class ImportManagerComponent implements OnInit {
    //Declare constance
    public readonly ARRAY_PRODUCT = [1, 27, 13, 34, 25, 33, 22, 4, 31, 28, 18, 38, 19, 30, 7, 17, 37, 32, 21, 24, 23];
    public readonly MAX_PRODUCT = 21;
    //Declare variable for HTML&TS
    public date = new FormControl(_moment());
    public columns: number = 1;
    public timeImportManager: string;
    public displayedColumns: string[] = ['index', 'ten_san_pham', 'san_luong', 'tri_gia', 'san_luong_ct', 'tri_gia_ct', 'top_xuat_khau'];
    public products: Array<ProductManagerModelList> = new Array<ProductManagerModelList>();
    public currentRow: number = 0;
    public dataSource: MatTableDataSource<ImportManagerModel> = new MatTableDataSource<ImportManagerModel>();
    public modeQuery: MODE = MODE.INSERT;
    //Declare variable for ONLY TS   
    rows: number = 0;
    public theYear: number = 0;
    public theMonth: number = 0;

    //ViewChild
    @ViewChildren(ManagerDirective) inputs: QueryList<ManagerDirective>
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(public managerService: ManagerService,
        public marketService: MarketService,
        public keyboardservice: KeyboardService, public dialog: MatDialog,
        public _infor: InformationService) {
    }

    public async ngOnInit(): Promise<void> {
        this.timeImportManager = this.getCurrentDate();
        this.getListProduct();
        this.theYear = this.getCurrentYear();
        this.theMonth = this.getCurrentMonth();
        this.getDomesticMarketImport(this.theMonth, this.theYear);
        this.keyboardservice.keyBoard.subscribe(res => {
            this.move(res)
        })
    }

    //Function for PROCESS-FLOW ----------------------------------------------------------------------------------------------
    public getListProduct(): void {
        this.managerService.GetListProduct().subscribe(
            allrecords => {
                this.products = allrecords.data as ProductManagerModelList[];
               // this.createDefault();
            },
        );
    }
    public getDomesticMarketImport(month: number, year: number) {
        this.marketService.GetImportedValue(month, year).subscribe(
            allrecords => {
                this.dataSource = new MatTableDataSource<ImportMarketModel>(allrecords.data);
                this.rows = this.dataSource.filteredData.length;
                if (allrecords.data.length != 0) {
                    allrecords.data.forEach(element => {
                        element.san_luong = element.san_luong || 0;
                        element.tri_gia = element.tri_gia || 0;
                        element.san_luong_ct = element.san_luong_ct || 0;
                        element.tri_gia_ct = element.tri_gia_ct || 0;
                    });
                    this.modeQuery = MODE.UPDATE;
                }
                else {
                    this.createDefault();
                    this.modeQuery = MODE.INSERT;
                }
                this.dataSource.paginator = this.paginator;
                this.paginator._intl.itemsPerPageLabel = 'Số hàng';
                this.paginator._intl.firstPageLabel = "Trang Đầu";
                this.paginator._intl.lastPageLabel = "Trang Cuối";
                this.paginator._intl.previousPageLabel = "Trang Trước";
                this.paginator._intl.nextPageLabel = "Trang Tiếp";
            }
        );
    }
    //Function for Event HTML ----------------------------------------------------------------------------------------------
    //Evemt "Lọc dữ liệu"
    public applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    //Event "Arrown key"
    public move(object) {
        const inputToArray = this.inputs.toArray()
        let index = inputToArray.findIndex(x => x.element == object.element);
        switch (object.action) {
            case "UP":
                index -= this.columns;
                break;
            case "DOWN":
                index += this.columns;
                break;
            case "LEFT":
                index -= this.rows;
                break;
            case "RIGHT":
                index += this.rows;
                break;
        }
        if (index >= 0 && index < this.inputs.length) {
            inputToArray[index].element.nativeElement.focus();
            // inputToArray[index].element.nativeElement.style.backgroundColor = '#5789D8';
        }
    }
    //EVENT "Chọn năm"
    public chosenYearHandler(normalizedYear: Moment) {
        const ctrlValue = this.date.value;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
        this.theYear = normalizedYear.year();
        return this.theYear as number
    }
    //Event "Chọn tháng"
    public chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value;
        ctrlValue.month(normalizedMonth.month());
        this.date.setValue(ctrlValue);
        this.theMonth = normalizedMonth.month() + 1;
        datepicker.close();
        //
        this.getDomesticMarketImport(this.theMonth, this.theYear);
        return this.theMonth as number
    }
    //Event "Top Doanh Nghiệp"
    public openDialogSelectCompany(data: any) {
        const dialogRef = this.dialog.open(ExportTopCompanyManager, {
            data: {
                message: 'Nhập dữ liệu top doanh nghiệp nhập khẩu.',
                buttonText: {
                    ok: 'Lưu',
                    cancel: 'Hủy bỏ'
                },
                product: data,
                typeOfSave: SAVE.IMPORT,
            }
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
            }
        });
    }
    //Event "Thêm dòng"
    public addRow() {
        let newRow: ImportManagerModel = new ImportManagerModel();
        newRow.san_luong;
        newRow.tri_gia;
        newRow.don_vi_tinh = "";
        newRow.san_luong_ct;
        newRow.tri_gia_ct;
        newRow.thang = this.getCurrentMonth();
        newRow.nam = this.getCurrentYear();
        this.dataSource.data.push(newRow);
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
        this.rows = this.dataSource.filteredData.length;
    }
    //Event "Xóa dòng"
    public deleteRow() {
        this.dataSource.data.splice(this.currentRow, 1);
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.rows = this.dataSource.filteredData.length;
    }
    //Event "Chèn dòng"
    public insertRow() {
        let data = this.dataSource.data.slice(this.currentRow);
        this.dataSource.data.splice(this.currentRow, this.dataSource.data.length - this.currentRow + 1);
        let newRow: ImportManagerModel = new ImportManagerModel();
        newRow.san_luong;
        newRow.tri_gia;
        newRow.don_vi_tinh = "";
        newRow.san_luong_ct;
        newRow.tri_gia_ct;
        newRow.thang = this.getCurrentMonth();
        newRow.nam = this.getCurrentYear();
        this.dataSource.data.push(newRow);
        data.forEach(element => {
            this.dataSource.data.push(element);
        });
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.rows = this.dataSource.filteredData.length;
    }
    //Event "Tạo Mặc định"
    public createDefault() {
        if (this.dataSource.data.length > 0)
            if (!confirm("Nếu bạn tạo mặc định sẽ xóa dữ liệu hiện tại! Bạn tiếp tục không?"))
                return;
        this.dataSource = new MatTableDataSource<ImportManagerModel>();
        let currentProduct;
        for (let i = 0; i < this.MAX_PRODUCT; i++) {
            this.addRow();
            currentProduct = this.products.filter(x => x.id_san_pham == this.ARRAY_PRODUCT[i])[0];
            if (currentProduct) {
                this.dataSource.data[i].ten_san_pham = currentProduct.ten_san_pham;
                this.dataSource.data[i].id_san_pham = currentProduct.ma_san_pham;
            }
        }
        this.rows = this.dataSource.filteredData.length;
        console.log(this.dataSource.data);
    }
    //Event "Change row"
    public changeRow(index: number) {
        this.currentRow = index;
    }
    //Event "Thay đổi sản phẩm"
    public changeProduct(element: any) {
        element.ten_san_pham = this.products.filter(x => x.id_san_pham == element.id_san_pham)[0].ten_san_pham;
        element.thang = this.getCurrentMonth();
        element.nam = this.getCurrentYear();
    }
    //Event "Lưu"
    public save() {
        let month = this.getCurrentMonth();
        let year = this.getCurrentYear();
        // let data: ImportManagerModel[] = this.dataSource.data.filter(x => x.id == 0);
        this.managerService.PostImportManager(month, year, this.dataSource.data).subscribe(
            next => {
                console.log(next);
                if (next.id == -1) {
                    this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                }
                else {
                    this.modeQuery = MODE.UPDATE;
                    this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                }
            },
            error => {
                this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
            }
        );
    }

    public changePeriod() {

    }
    //Event for "Tải template"
    downloadExcelTemplate(filename: string, sheetname: string) {
        let excelFileName: string;
        let newArray: any[] = [];
        //Format name of Excel will be export
        sheetname = sheetname.replace('/', '_');
        excelFileName = filename + '.xlsx';

        //Alias column name
        let data = Object.values(this.dataSource.data);

        Object.keys(data).forEach((key, index) => {
            newArray.push({
                'STT': index,
                'Mã sản phẩm': data[key].id_san_pham,
                'Tên sản phẩm': data[key].ten_san_pham,
                'Sản lượng (Cục Hải Quan)': '',
                'Giá trị (Cục Hải Quan)': '',
                'Sản lượng (Tổng cục)': '',
                'Giá trị (Tổng cục)': '',
            });
        });
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        /* save to file */
        XLSX.utils.book_append_sheet(wb, ws, sheetname);
        XLSX.writeFile(wb, excelFileName);
    }

    //Event for "Nhập từ excel"
    spinnerEnabled = false;
    keys: string[];
    dataSheet = new Subject();
    @ViewChild('inputFile', { static: true }) inputFile: ElementRef;
    isExcelFile: boolean;
    uploadExcel(evt: any) {
        let isExcelFile: boolean;
        let spinnerEnabled = false;
        let dataSheet = new Subject();
        let keys: string[];
        let data, header;
        const target: DataTransfer = <DataTransfer>(evt.target);
        isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
        if (isExcelFile) {
            let data, header;
            const target: DataTransfer = <DataTransfer>(evt.target);
            this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
            if (target.files.length > 1) {
                this.inputFile.nativeElement.value = '';
            }
            if (this.isExcelFile) {
                this.spinnerEnabled = true;
                const reader: FileReader = new FileReader();
                reader.onload = (e: any) => {
                    /* read workbook */
                    const bstr: string = e.target.result;
                    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

                    /* grab first sheet */
                    const wsname: string = wb.SheetNames[0];
                    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                    /* save data */
                    data = XLSX.utils.sheet_to_json(ws);
                    this.dataSource.data = [];
                    data.forEach(item => {
                        let datarow: ImportManagerModel = new ImportManagerModel();
                        datarow.tri_gia = item['Giá trị (Cục Hải Quan)'];
                        datarow.tri_gia_ct = item['Giá trị (Tổng cục)'];
                        datarow.san_luong = item['Sản lượng (Cục Hải Quan)'];
                        datarow.san_luong_ct = item['Sản lượng (Tổng cục)'];
                        datarow.ten_san_pham = item['Tên sản phẩm'];
                        datarow.id_san_pham = item['Mã sản phẩm'];
                        datarow.nam = this.theYear;
                        datarow.thang = this.theMonth;
                        this.dataSource.data.push(datarow);
                    });
                    this.dataSource = new MatTableDataSource(this.dataSource.data);
                    this._infor.msgSuccess("Nhập dữ liệu từ excel thành công!");
                };

                reader.readAsBinaryString(target.files[0]);

                reader.onloadend = (e) => {
                    this.spinnerEnabled = false;
                    this.keys = Object.keys(data[0]);
                    this.dataSheet.next(data)
                }
            } else {
                this.inputFile.nativeElement.value = '';
            }
        }
    }
    //Function for EXTENTION ----------------------------------------------------------------------------------------------
    public formatNgayCapNhat(str: string) {
        let year: string = str.substr(0, 4);
        let month: string = str.substr(4, 2);
        let day: string = str.substr(6, 2);
        let result: string = day + '/' + month + '/' + year;
        return result;
    }
    public getMonthAndYear(time: string) {
        let year = time.substr(0, 4);
        let month = time.substr(4, 2);
        let result = month + "/" + year;
        return result as string;
    }
    public getCurrentDate() {
        let date = new Date;
        return this.getMonthAndYear(date.toISOString().replace('-', '').replace('-', ''));
    }
    public getCurrentMonth() {
        let date = new Date();
        return date.getMonth() + 1;
    }
    public getCurrentYear() {
        let date = new Date();
        return date.getFullYear();
    }
    addEvent(action: string, event) {

    }
}
