import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';

import { ManagerDirective } from './../../../shared/manager.directive';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { KeyboardService } from './../../../shared/services/keyboard.service';
import { InformationService } from 'src/app/shared/information/information.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { MarketService } from '../../../_services/APIService/market.service';

import { ForeignMarketModel, ProductModel, DeleteModel1 } from '../../../_models/APIModel/domestic-market.model';

import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { defaultFormat as _rollupMoment } from 'moment';
import _moment from 'moment';

import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

const moment = _rollupMoment || _moment;
export const DDMMYY_FORMAT = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-foreign-manager',
  templateUrl: 'foreign-manager.component.html',
  styleUrls: ['../manager_layout.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: DDMMYY_FORMAT },
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    DatePipe
  ],
})

export class ForeignManagerComponent implements OnInit {
  public dataSource: MatTableDataSource<ForeignMarketModel> = new MatTableDataSource<ForeignMarketModel>();
  public displayedColumns: string[] = ['select', 'index', 'ten_san_pham', 'id_san_pham', 'thi_truong', 'gia_ca', 'nguon_so_lieu', 'ngay_cap_nhat'];

  @ViewChildren(ManagerDirective) inputs: QueryList<ManagerDirective>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("TABLE", { static: true }) table: ElementRef;

  public constructor(
    public marketService: MarketService,
    public _keyboardservice: KeyboardService,
    public _infor: InformationService,
    public datepipe: DatePipe,
    public excelService: ExcelService,
    public _loginService: LoginService) {
  }

  date = new FormControl(moment);
  pickedDate = {
    date: new Date()
  }

  selection = new SelectionModel<ForeignMarketModel>(true, []);

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

  checkboxLabel(row?: ForeignMarketModel): string {
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
      this.marketService.DeleteForeignMarket(this.deletemodel1).subscribe(res => {
        this._infor.msgSuccess('Xóa thành công')
        this.ngOnInit();
        this.deletemodel1 = []
        this.selection.clear();
        this.paginator.pageIndex = 0;
      })
    }
  }

  public ngOnInit() {
    this.getListProduct();
    this._keyboardservice.keyBoard.subscribe(res => {
      this.move(res)
    })
    this.GetAllForeignMarketPrice();
    this.pickedDate.date = null

    this.sanphamfilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSanpham();
      });
  }

  public _onDestroy = new Subject<void>();

  resetAll() {
    this.GetAllForeignMarketPrice()
    this.pickedDate.date = null
  }

  public products: Array<ProductModel> = new Array<ProductModel>();
  public filterproducts: ReplaySubject<ProductModel[]> = new ReplaySubject<ProductModel[]>(1);
  public getListProduct(): void {
    this.marketService.GetProductList().subscribe(
      // allrecords => {
      //   this.products = allrecords.data as ProductModel[];
      //   this.filterproducts.next(this.products.slice());
      // },
      allrecords => {
        this.products = allrecords.data.filter(x => x.id_san_pham == 24 || x.id_san_pham == 25 || x.id_san_pham == 1
          || x.id_san_pham == 4 || x.id_san_pham == 26 || x.id_san_pham == 23 || x.id_san_pham == 27) as ProductModel[];
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

  public getChange(param: any) {
    this.GetForeignMarketPrice(param._d)
  }

  Convertdate(text: string): string {
    let date: string
    date = text.substring(6, 8) + "-" + text.substring(4, 6) + "-" + text.substring(0, 4)
    return date
  }

  Convertdatetostring(text: string): string {
    let date: string
    date = text.replace('-', '').replace('-', '')
    let date1: string
    date1 = date.substring(4, 9) + date.substring(2, 4) + date.substring(0, 2)
    return date1
  }

  public getCurrentDate() {
    let date = new Date;
    return formatDate(date, 'dd-MM-yyyy', 'en-US');
  }

  public GetForeignMarketPrice(time: Date) {
    let datepipe = this.datepipe.transform(this.pickedDate.date, 'yyyyMMdd')
    this.marketService.GetForeignMarket(datepipe).subscribe(
      allrecords => {
        allrecords.data.forEach(element => {
          element.ngay_cap_nhat = this.Convertdate(element.ngay_cap_nhat)
        });
        this.dataSource = new MatTableDataSource<ForeignMarketModel>(allrecords.data);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";

        this._rows = this.dataSource.filteredData.length;
      },
    );
  }

  public GetAllForeignMarketPrice() {
    this.marketService.GetAllForeignMarket().subscribe(
      allrecords => {
        allrecords.data.forEach(element => {
          element.ngay_cap_nhat = this.Convertdate(element.ngay_cap_nhat)
        });
        this.dataSource = new MatTableDataSource<ForeignMarketModel>(allrecords.data);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";

        this._rows = this.dataSource.filteredData.length;
      },
    );
  }

  public _currentRow: number = 0;

  // public addRow(): void {
  //   let newRow: ForeignMarketModel = new ForeignMarketModel();
  //   newRow.gia_ca;
  //   newRow.nguon_so_lieu = "";
  //   newRow.ngay_cap_nhat = this.getCurrentDate();
  //   // newRow.ma_nguoi_cap_nhat = this._loginService.userValue.user_id;
  //   this.dataSource.data.push(newRow);
  //   this.dataSource = new MatTableDataSource(this.dataSource.data);

  //   this._rows = this.dataSource.filteredData.length;
  // }

  public insertRow(): void {
    let data = this.dataSource.data.slice(this._currentRow);
    this.dataSource.data.splice(this._currentRow, this.dataSource.data.length - this._currentRow + 1);
    let newRow: ForeignMarketModel = new ForeignMarketModel();
    newRow.gia_ca;
    newRow.nguon_so_lieu = "";
    newRow.ngay_cap_nhat = this.getCurrentDate();
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

  public save(foreign: Array<ForeignMarketModel>) {
    this.dataSource.data.forEach(element => {
      if (element.ngay_cap_nhat) {
        let x = this.Convertdatetostring(element.ngay_cap_nhat)
        element.ngay_cap_nhat = x;
      }
    });
    this.marketService.PostForeignMarket(foreign).subscribe(
      next => {
        this._infor.msgSuccess("Lưu thông tin thành công");
        this.GetAllForeignMarketPrice();
      },
      error => {
        this._infor.msgError("Lưu thông tin không thành công");
      }
    );
  }

  // public exportTOExcel(filename: string, sheetname: string) {
  //   this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  // }

  private getExposedTable() {
    let self = this;
    let exposedData = [];
    this.dataSource.filteredData.forEach(function (record, index) {
      let data = {
        "STT": index + 1,
        "Tên sản phẩm": record["ten_san_pham"],
        "Giá cả": record["gia_ca"],
        "Thị trường": record["thi_truong"],
        "Nguồn số liệu": record["nguon_so_lieu"],
        "Ngày cập nhật": record["ngay_cap_nhat"]
      };
      exposedData.push(data);
    });
    return exposedData;
  }

  public exportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportJsonAsExcelFile(filename, sheetname, this.getExposedTable());
  }

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
            let datarow: ForeignMarketModel = new ForeignMarketModel();
            datarow.id_san_pham = item['ID sản phẩm'];
            datarow.gia_ca = item['Giá'];
            datarow.nguon_so_lieu = item['Nguồn số liệu'];
            datarow.thi_truong = item['Thị trường'];
            datarow.ngay_cap_nhat = this.getCurrentDate();
            this.dataSource.data.push(datarow);
          });
          this.save(this.dataSource.data)
          this.GetAllForeignMarketPrice()
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
}
