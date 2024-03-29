import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material';
import { ExportTopCompanyManager } from '../export-top-company-manager/export-top-company-manager.component';

import { ManagerDirective } from './../../../shared/manager.directive';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { KeyboardService } from './../../../shared/services/keyboard.service';
import { InformationService } from 'src/app/shared/information/information.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { MarketService } from '../../../_services/APIService/market.service';

import { ProductValueModel, ProductModel, DeleteModel1 } from '../../../_models/APIModel/domestic-market.model';
import { SAVE } from 'src/app/_enums/save.enum';

import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';

import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

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
    public dataSource: MatTableDataSource<ProductValueModel> = new MatTableDataSource<ProductValueModel>();
    public displayedColumns: string[] =
        ['select', 'index', 'ten_san_pham', 'id_san_pham', 'san_luong', 'time_id',
            // 'tri_gia', 'top_san_xuat', 'them_top_san_xuat'
        ];

    public queryProductIds = [26, 269, 270, 271, 272, 273, 274]
    @ViewChildren(ManagerDirective) inputs: QueryList<ManagerDirective>
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild("TABLE", { static: true }) table: ElementRef;

    public constructor(
        public marketService: MarketService,
        public _keyboardservice: KeyboardService,
        public _infor: InformationService,
        public excelService: ExcelService,
        public _loginService: LoginService,
        public dialog: MatDialog) {
    }

    selection = new SelectionModel<ProductValueModel>(true, []);

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        // const numRows = this.dataSource.data.length;
        const numRows = this.dataSource.connect().value.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.connect().value.forEach(row => this.selection.select(row));
    }

    checkboxLabel(row?: ProductValueModel): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

    deletemodel1: Array<DeleteModel1> = new Array<DeleteModel1>();
    selectionarray: string[];
    removeRows() {
        if (confirm('Bạn Có Chắc Muốn Xóa?')) {
            this.selection.selected.forEach(x => {
                this.selectionarray = this.selection.selected.map(item => item.id)
                this.deletemodel1.push({
                    id: ''
                })
            })
            for (let index = 0; index < this.selectionarray.length; index++) {
                const element = this.deletemodel1[index];
                element.id = this.selectionarray[index]
            }
            this.marketService.DeleteProductValue(this.deletemodel1).subscribe(res => {
                this._infor.msgSuccess('Xóa thành công')
                this.ngOnInit();
                this.deletemodel1 = []
                this.selection.clear();
                this.paginator.pageIndex = 0;
            })
        }
    }

    public AddCompanyTopPopup(data: any) {
        const dialogRef = this.dialog.open(ExportTopCompanyManager, {
            data: {
                message: 'Dữ liệu top doanh nghiệp sản xuất',
                product_data: data,
                typeOfSave: SAVE.ADD,
            }
        });
    }

    public openCompanyTopPopup(data: any) {
        const dialogRef = this.dialog.open(ExportTopCompanyManager, {
            data: {
                message: 'Dữ liệu top doanh nghiệp sản xuất',
                product_data: data,
                typeOfSave: SAVE.PRODUCT,
            }
        });
    }

    public ngOnInit() {
        this.getListProduct();
        this._keyboardservice.keyBoard.subscribe(res => {
            this.move(res)
        })
        this.getALLProductValueList();
        this.date = null

        this.sanphamfilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterSanpham();
            });
    }

    public _onDestroy = new Subject<void>();

    resetAll() {
        this.ngOnInit();
    }

    public products: Array<ProductModel> = new Array<ProductModel>();
    public filterproducts: ReplaySubject<ProductModel[]> = new ReplaySubject<ProductModel[]>(1);
    public getListProduct(): void {
        this.marketService.GetProductList().subscribe(
            allrecords => {
                this.products = allrecords.data.filter(x => this.queryProductIds.includes(x.id_san_pham)) as ProductModel[];
                this.filterproducts.next(this.products.slice());
            },
        );
    }
    public sanphamfilter: FormControl = new FormControl();
    public filterSanpham() {
        if (!this.products) {
            return;
        }
        let search = this.sanphamfilter.value;
        if (!search) {
            this.filterproducts.next(this.products.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filterproducts.next(
            this.products.filter(x => x.ten_san_pham.toLowerCase().indexOf(search) > -1)
        );
    }

    Convertdate(text: string): string {
        let date: string
        date = text.substr(4, 2) + "-" + text.substring(0, 4)
        return date
    }

    Convertdatetostring(text: string): string {
        let date: string
        date = text.replace('-', '')
        let date1: string
        date1 = date.substring(2, 7) + date.substring(0, 2)
        return date1
    }

    public getCurrentMonth(): string {
        let date = new Date;
        return formatDate(date, 'MM-yyyy', 'en-US');
    }

    public date = new FormControl(_moment());
    public newdate = new FormControl(_moment());
    public theYear: number;
    public theMonth: number;
    public stringmonth: string
    public time: string

    public chosenYearHandler(normalizedYear: Moment) {
        this.date = this.newdate
        const ctrlValue = this.date.value;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
        this.theYear = normalizedYear.year();
    }

    public chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value;
        ctrlValue.month(normalizedMonth.month());
        this.date.setValue(ctrlValue);
        this.theMonth = normalizedMonth.month() + 1;
        datepicker.close();

        if (this.theMonth >= 10) {
            this.stringmonth = this.theMonth.toString();
        }
        else {
            this.stringmonth = "0" + this.theMonth.toString()
        }
        this.time = this.theYear.toString() + this.stringmonth
        this.getProductValueList(this.time);
    }

    public getProductValueList(time: string) {
        this.marketService.GetProductValue(time).subscribe(
            allrecords => {
                let temp = allrecords.data[0].filter(x => this.queryProductIds.includes(x.id_san_pham))

                temp.forEach(element => {
                    element.time_id = this.Convertdate(element.time_id.toString())
                });
                this.dataSource = new MatTableDataSource<ProductValueModel>(temp);
                this.paginatorAgain();

                this._rows = this.dataSource.filteredData.length;
            },
        );
    }

    public getALLProductValueList() {
        this.marketService.GetAllProductValue().subscribe(
            allrecords => {
                let displayedRecords = allrecords.data[0].filter(x => this.queryProductIds.includes(x.id_san_pham))
                displayedRecords.forEach(element => {
                    element.time_id = this.Convertdate(element.time_id.toString())
                });
                this.dataSource = new MatTableDataSource<ProductValueModel>(displayedRecords);
                this.paginatorAgain();

                this._rows = this.dataSource.filteredData.length;
            },
        );
    }

    public _currentRow: number = 0;

    // public addRow(): void {
    //     let newRow: ProductValueModel = new ProductValueModel();
    //     newRow.san_luong;
    //     newRow.tri_gia;
    //     newRow.time_id = this.getCurrentMonth();
    //     // newRow.ma_nguoi_cap_nhat = this._loginService.userValue.user_id;
    //     this.dataSource.data.push(newRow);
    //     this.dataSource = new MatTableDataSource(this.dataSource.data);

    //     this._rows = this.dataSource.filteredData.length;
    // }

    public insertRow(): void {
        let data = this.dataSource.data.slice(this._currentRow);
        this.dataSource.data.splice(this._currentRow, this.dataSource.data.length - this._currentRow + 1);
        let newRow: ProductValueModel = new ProductValueModel();
        newRow.san_luong;
        newRow.time_id = this.getCurrentMonth();
        // newRow.ma_nguoi_cap_nhat = this._loginService.userValue.user_id;
        this.dataSource.data.push(newRow);
        data.forEach(element => {
            this.dataSource.data.push(element);
        });
        this.dataSource = new MatTableDataSource(this.dataSource.data);

        this._rows = this.dataSource.filteredData.length;
    }

    public deleteRow(): void {
        this.dataSource.data.splice(this._currentRow, 1);
        this.dataSource = new MatTableDataSource(this.dataSource.data);

        this._rows = this.dataSource.filteredData.length;
    }

    public save(productvalue: Array<ProductValueModel>) {
        this.dataSource.data.forEach(element => {
            if (element.time_id) {
                element.time_id = this.Convertdatetostring(element.time_id.toString())
            }
        });
        this.marketService.PostProductValue(productvalue).subscribe(
            next => {
                if (next.id == -1) {
                    this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                }
                else {
                    this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                    this.getALLProductValueList();
                }
            },
            error => {
                this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
            }
        );
    }

    // public exportTOExcel(filename: string, sheetname: string) {
    //     this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    // }

    private getExposedTable() {
        let self = this;
        let exposedData = [];
        this.dataSource.filteredData.forEach(function (record, index) {
            let data = {
                "STT": index + 1,
                "Tên sản phẩm": record["ten_san_pham"],
                "Đơn vị tính": record["don_vi_tinh"],
                "Sản lượng": record["san_luong"],
                "Thời gian cập nhật": record["time_id"]
            };
            exposedData.push(data);
        });
        return exposedData;
    }

    public exportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportJsonAsExcelFile(filename, sheetname, this.getExposedTable());
    }

    public productvalue: Array<ProductValueModel> = new Array<ProductValueModel>();

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
                    const bstr: string = e.target.result;
                    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

                    const wsname: string = wb.SheetNames[0];
                    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                    data = XLSX.utils.sheet_to_json(ws);
                    this.dataSource.data = [];
                    data.forEach(item => {
                        let datarow: ProductValueModel = new ProductValueModel();
                        datarow.id_san_pham = item['ID sản phẩm'];
                        datarow.san_luong = item['Sản lượng'];
                        datarow.time_id = this.getCurrentMonth();
                        this.dataSource.data.push(datarow);
                    });
                    this.save(this.dataSource.data)
                    this.getALLProductValueList()
                };

                reader.readAsBinaryString(target.files[0]);

                reader.onloadend = (e) => {
                    this.spinnerEnabled = false;
                    this.keys = Object.keys(data[0]);
                    this.dataSheet.next(data)
                    this.inputFile.nativeElement.value = '';
                }
            }
        }
    }

    public applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    public changeRow(index: number) {
        this._currentRow = index;
    }

    public _rows: number = 0;
    public columns: number = 1;

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
                index -= this._rows;
                break;
            case "RIGHT":
                index += this._rows;
                break;
        }
        if (index >= 0 && index < this.inputs.length) {
            inputToArray[index].element.nativeElement.focus();
        }
    }

    public paginatorAgain() {
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
    }
}
