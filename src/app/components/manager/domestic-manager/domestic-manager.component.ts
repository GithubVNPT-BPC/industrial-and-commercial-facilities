import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';
import { ReplaySubject, Subject } from 'rxjs';

import { ManagerDirective } from './../../../shared/manager.directive';
import { KeyboardService } from './../../../shared/services/keyboard.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { InformationService } from 'src/app/shared/information/information.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { MarketService } from '../../../_services/APIService/market.service';

import { DomesticPriceModel, ProductModel, DeleteModel1 } from '../../../_models/APIModel/domestic-market.model';

import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { defaultFormat as _rollupMoment } from 'moment';
import _moment from 'moment';
import { element } from 'protractor';
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
  selector: 'app-domestic-manager',
  templateUrl: 'domestic-manager.component.html',
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

export class DomesticManagerComponent implements OnInit {
  public products: Array<ProductModel> = new Array<ProductModel>();
  public dataSource: MatTableDataSource<DomesticPriceModel> = new MatTableDataSource<DomesticPriceModel>();
  public displayedColumns: string[] = ['select', 'index', 'ten_san_pham', 'id_san_pham', 'gia_ca', 'nguon_so_lieu', 'ngay_cap_nhat'];

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

  selection = new SelectionModel<DomesticPriceModel>(true, []);

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

  checkboxLabel(row?: DomesticPriceModel): string {
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
      this.marketService.DeleteDomesticMarket(this.deletemodel1).subscribe(res => {
        this._infor.msgSuccess('Xóa thành công')
        this.getALLDomesticMarketPrice();
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
    this.getALLDomesticMarketPrice();
    this.pickedDate.date = null
  }

  resetAll() {
    this.getALLDomesticMarketPrice()
    this.pickedDate.date = null
  }

  public getListProduct(): void {
    this.marketService.GetProductList().subscribe(
      allrecords => {
        this.products = allrecords.data as ProductModel[];
      },
    );
  }

  public getChange(param: any) {
    this.getDomesticMarketPrice(param._d)
  }

  Convertdate(text: string): string {
    let date: string
    date = text.substring(6, 8) + "/" + text.substring(4, 6) + "/" + text.substring(0, 4)
    return date
  }

  Convertdatetostring(text: string): string {
    let date: string
    date = text.replace('/', '').replace('/', '')
    let date1: string
    date1 = date.substring(4, 9) + date.substring(2, 4) + date.substring(0, 2)
    return date1
  }

  public getCurrentDate() {
    let date = new Date;
    return formatDate(date, 'dd/MM/yyyy', 'en-US');
  }

  public getDomesticMarketPrice(time: Date) {
    let datepipe = this.datepipe.transform(this.pickedDate.date, 'yyyyMMdd')
    this.marketService.GetDomesticMarket(datepipe).subscribe(
      allrecords => {
        allrecords.data.forEach(element => {
          element.ngay_cap_nhat = this.Convertdate(element.ngay_cap_nhat)
        });
        this.dataSource = new MatTableDataSource<DomesticPriceModel>(allrecords.data);
        if (this.dataSource.data.length == 0) {
          this.createDefault();
        }
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

  public getALLDomesticMarketPrice() {
    this.marketService.GetAllDomesticMarket().subscribe(
      allrecords => {
        allrecords.data.forEach(element => {
          element.ngay_cap_nhat = this.Convertdate(element.ngay_cap_nhat)
        });
        this.dataSource = new MatTableDataSource<DomesticPriceModel>(allrecords.data);
        if (this.dataSource.data.length == 0) {
          this.createDefault();
        }
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

  public addRow(): void {
    let newRow: DomesticPriceModel = new DomesticPriceModel();
    newRow.gia_ca;
    newRow.nguon_so_lieu = "";
    newRow.ngay_cap_nhat = this.getCurrentDate();
    // newRow.ma_nguoi_cap_nhat = this._loginService.userValue.user_id;
    this.dataSource.data.push(newRow);
    this.dataSource = new MatTableDataSource(this.dataSource.data);

    this._rows = this.dataSource.filteredData.length;
  }

  public insertRow(): void {
    let data = this.dataSource.data.slice(this._currentRow);
    this.dataSource.data.splice(this._currentRow, this.dataSource.data.length - this._currentRow + 1);
    let newRow: DomesticPriceModel = new DomesticPriceModel();
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

  public createDefault() {
    const Product1: number = 1;
    const Product2: number = 2;
    const Product3: number = 3;
    const Product4: number = 4;
    this.dataSource = new MatTableDataSource<DomesticPriceModel>();
    this.addRow();
    this.addRow();
    this.addRow();
    this.addRow();
    this.dataSource.data[0].id_san_pham = this.products.filter(x => x.id_san_pham == Product1)[0].id_san_pham;
    this.dataSource.data[1].id_san_pham = this.products.filter(x => x.id_san_pham == Product2)[0].id_san_pham;
    this.dataSource.data[2].id_san_pham = this.products.filter(x => x.id_san_pham == Product3)[0].id_san_pham;
    this.dataSource.data[3].id_san_pham = this.products.filter(x => x.id_san_pham == Product4)[0].id_san_pham;

    this._rows = this.dataSource.filteredData.length;
  }

  public save() {
    this.dataSource.data.forEach(element => {
      if (element.ngay_cap_nhat) {
        let x = this.Convertdatetostring(element.ngay_cap_nhat)
        element.ngay_cap_nhat = x;
      }
      element.id = null;
    });
    this.marketService.PostDomesticMarket(this.dataSource.data).subscribe(
      next => {
        if (next.id == -1) {
          this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
        }
        else {
          this._infor.msgSuccess("Dữ liệu được lưu thành công!");
          this.getALLDomesticMarketPrice();
        }
      },
      error => {
        this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
      }
    );
  }

  // downloadExcelTemplate(filename: string, sheetname: string) {
  //   let excelFileName: string;
  //   let newArray: any[] = [];

  //   sheetname = sheetname.replace('/', '_');
  //   excelFileName = filename + '.xlsx';

  //   let data = Object.values(this.dataSource.data);

  //   Object.keys(data).forEach((key, index) => {
  //     newArray.push({
  //       'STT': index,
  //       'Tên sản phẩm': data[key].ten_san_pham,
  //       'ID sản phẩm': data[key].id_san_pham,
  //       'Giá': '',
  //       'Nguồn số liệu': '',
  //     });
  //   });
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();

  //   XLSX.utils.book_append_sheet(wb, ws, sheetname);
  //   XLSX.writeFile(wb, excelFileName);
  // }

  // public exportTOExcel(filename: string, sheetname: string) {
  //   this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  // }

  public exportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
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
            let datarow: DomesticPriceModel = new DomesticPriceModel();
            datarow.gia_ca = item['Giá'];
            datarow.nguon_so_lieu = item['Nguồn số liệu'];
            datarow.id_san_pham = item['ID sản phẩm'];
            datarow.ngay_cap_nhat = this.getCurrentDate();
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
