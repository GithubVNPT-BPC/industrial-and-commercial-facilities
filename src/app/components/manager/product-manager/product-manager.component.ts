//Import library
import { Component, OnInit, ViewChild, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
//Import Service
import { ManagerService } from '../../../_services/APIService/manager.service';
import { InformationService } from 'src/app/shared/information/information.service';
import { MarketService } from 'src/app/_services/APIService/market.service';
import { KeyboardService } from './../../../shared/services/keyboard.service';
//Import Model
import { ProductManagerModelList, ProductManagerModel, MODE } from '../../../_models/APIModel/manager.model';
import { SAVE } from 'src/app/_enums/save.enum';
import { ProductValueModel } from 'src/app/_models/APIModel/domestic-market.model';
//Import Component
import { ExportTopCompanyManager } from '../export-top-company-manager/export-top-company-manager.component';
import { ManagerDirective } from './../../../shared/manager.directive';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';

//Moment
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
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
    selector: 'app-product-manager',
    templateUrl: 'product-manager.component.html',
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

export class ProductManagerComponent implements OnInit {

    //Declare constant
    public readonly FORMAT = 'dd/MM/yyyy';
    public readonly LOCALE = 'en-GB';

    //Declare variable for HTML&TS
    public date = new FormControl(_moment());
    public modeQuery: MODE = MODE.INSERT;
    public columns: number = 1;
    public timeProductManager: string;
    public displayedColumns: string[] = ['index', 'ten_san_pham', 'san_luong', 'tri_gia', 'top_san_xuat'];
    public products: Array<ProductManagerModelList> = new Array<ProductManagerModelList>();
    public dataSource: MatTableDataSource<ProductManagerModel> = new MatTableDataSource<ProductManagerModel>();
    //Declare variable for ONLY TS
    rows: number = 0;
    public currentRow: number = 0;
    public theYear: number = 0;
    public theMonth: number = 0;

    //Viewchild
    @ViewChildren(ManagerDirective) inputs: QueryList<ManagerDirective>
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(public managerService: ManagerService,
        public marketService: MarketService,
        public _infor: InformationService,
        public keyboardservice: KeyboardService,
        public dialog: MatDialog) { }

    ngOnInit() {
        this.timeProductManager = this.getCurrentDate();
        this.theYear = this.getCurrentYear();
        this.theMonth = this.getCurrentMonth();
        this.getListProduct();
        this.getDomesticMarketProduct(this.theMonth, this.theYear);
        this.keyboardservice.keyBoard.subscribe(res => {
            this.move(res)
        })
    }
    //Function for PROCESS-FLOW------------------------------------------------------------------------------------------
    public getDomesticMarketProduct(month: number, year: number) {
        this.managerService.GetProductManager(month, year).subscribe(
            allrecords => {
                console.log(allrecords)
                if (allrecords.data.length > 0) {
                    this.dataSource = new MatTableDataSource<ProductValueModel>(allrecords.data);
                    if (this.dataSource.data.length == 0) {
                        this.createDefault();
                        this.modeQuery = MODE.INSERT;
                    } else {
                        this.modeQuery = MODE.UPDATE;
                    }
                    this.dataSource.paginator = this.paginator;
                    this.paginator._intl.itemsPerPageLabel = 'Số hàng';
                    this.paginator._intl.firstPageLabel = "Trang Đầu";
                    this.paginator._intl.lastPageLabel = "Trang Cuối";
                    this.paginator._intl.previousPageLabel = "Trang Trước";
                    this.paginator._intl.nextPageLabel = "Trang Tiếp";
                }
            },
            //error => this.errorMessage = <any>error
        );
    }
    //Event "Chọn năm"
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
        this.getDomesticMarketProduct(this.theMonth, this.theYear);
        return this.theMonth as number
    }
    //Add event
    public addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        let time = event.value;
        let year = time.getFullYear();
        let month = time.getMonth();
        this.marketService.GetExportedValue(month, year);
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
                'Sản lượng': '',
                'Trị giá': '',
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
                        let datarow: ProductManagerModel = new ProductManagerModel();
                        datarow.san_luong = item['Sản lượng'];
                        datarow.tri_gia = item['Trị giá'];
                        datarow.ten_san_pham = item['Tên sản phẩm'];
                        datarow.id_san_pham = item['Mã sản phẩm'];
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
        // let dataExcel;
        // let jsonFromExcel;
        // const target: DataTransfer = (evt.target) as DataTransfer;
        // const reader: FileReader = new FileReader();

        // reader.onload = (e: any) => {
        //     let bstr: string = e.target.result;

        //     let wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        //     let wsName: string = wb.SheetNames[0];

        //     let ws: XLSX.WorkSheet = wb.Sheets[wsName];

        //     dataExcel = (XLSX.utils.sheet_to_json(ws, { header: 2 }));
        //     console.log('Data: ', dataExcel);
        //     jsonFromExcel = JSON.stringify(dataExcel);

        //     console.log('JsonData: ', jsonFromExcel);

        // };

        // reader.readAsBinaryString(target.files[0]);
    }


    public getListProduct(): void {
        this.managerService.GetListProduct().subscribe(
            allrecords => {
                this.products = allrecords.data as ProductManagerModelList[];
                this.createDefault();
            },
        );
    }
    //Function for HTML EVENT------------------------------------------------------------------------------------------
    //Event "Lọc dữ liệu"
    public applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    //Event "Key Arrown"
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
    //Event "Tạo mặc định"
    public createDefault() {
        const HAT_DIEU: number = 2;
        // const HAT_TIEU: number = 3;
        const CAO_SU: number = 4;
        // const CA_PHE: number = 5;
        // if (this.dataSource.data.length > 0)
        //     if (!confirm("Nếu bạn tạo mặc định sẽ xóa dữ liệu hiện tại! Bạn tiếp tục không?"))
        //         return;
        this.dataSource = new MatTableDataSource<ProductManagerModel>();;
        this.addRow();
        this.addRow();
        this.dataSource.data[0].ten_san_pham = this.products.filter(x => x.ma_san_pham == HAT_DIEU)[0].ten_san_pham;
        // this.dataSource.data[1].ten_san_pham = this.products.filter(x => x.ma_san_pham == HAT_TIEU)[0].ten_san_pham;
        this.dataSource.data[1].ten_san_pham = this.products.filter(x => x.ma_san_pham == CAO_SU)[0].ten_san_pham;
        // this.dataSource.data[3].ten_san_pham = this.products.filter(x => x.ma_san_pham == CA_PHE)[0].ten_san_pham;
        this.dataSource.data[0].id_san_pham = this.products.filter(x => x.ma_san_pham == HAT_DIEU)[0].ma_san_pham;
        // this.dataSource.data[1].id_san_pham = this.products.filter(x => x.ma_san_pham == HAT_TIEU)[0].ma_san_pham;
        this.dataSource.data[1].id_san_pham = this.products.filter(x => x.ma_san_pham == CAO_SU)[0].ma_san_pham;
        // this.dataSource.data[3].id_san_pham = this.products.filter(x => x.ma_san_pham == CA_PHE)[0].ma_san_pham;
        this.rows = this.dataSource.filteredData.length;
    }
    //Event "Thêm dòng"
    public addRow() {
        let newRow: ProductManagerModel = new ProductManagerModel();
        newRow.san_luong;
        newRow.tri_gia;
        newRow.don_vi_tinh = "";
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
        let newRow: ProductManagerModel = new ProductManagerModel();
        newRow.san_luong;
        newRow.tri_gia;
        newRow.don_vi_tinh = "";
        newRow.thang = this.getCurrentMonth();
        newRow.nam = this.getCurrentYear();
        this.dataSource.data.push(newRow);
        data.forEach(element => {
            this.dataSource.data.push(element);
        });
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.rows = this.dataSource.filteredData.length;
    }

    //Event "Top doanh nghiệp"
    public openDialogSelectCompany(data: any) {
        const dialogRef = this.dialog.open(ExportTopCompanyManager, {
            data: {
                message: 'Nhập dữ liệu top doanh nghiệp nhập khẩu',
                buttonText: {
                    ok: 'Lưu',
                    cancel: 'Hủy bỏ'
                },
                product: data,
                typeOfSave: SAVE.PRODUCT,
            }
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
            }
        });
    }
    //Event "Change row"
    public changeRow(index: number) {
        this.currentRow = index;
    }
    //Event "Select combobox"
    public changeProduct(element: any) {
        element.ten_san_pham = this.products.filter(x => x.ma_san_pham == element.id_san_pham)[0].ten_san_pham;
        element.thang = this.getCurrentMonth();
        element.nam = this.getCurrentYear();
    }
    //Event "Lưu"
    public save() {
        let month = this.getCurrentMonth();
        let year = this.getCurrentYear();
        // let data: ProductManagerModel[] = this.dataSource.data.filter(x => x.id == 0);
        // console.log(data)
        this.managerService.PostProductManager(month, year, this.dataSource.data).subscribe(
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
    //Function EXTENTION-----------------------------------------------------------------------------------------
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
        let day = time.substr(6, 2);
        let result = day + "/" + month + "/" + year;
        return result as string;
    }
    public getCurrentDate() {
        let date = new Date;
        return date.toLocaleDateString(this.LOCALE);
        //return this.GetMonthAndYear(date.toISOString().replace('-', '').replace('-', ''));
    }
    public getCurrentMonth() {
        let date = new Date();
        return date.getMonth() + 1;
    }
    public getCurrentYear() {
        let date = new Date();
        return date.getFullYear();
    }

}
