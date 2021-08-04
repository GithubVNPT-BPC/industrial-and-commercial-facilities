import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';
import { Subject } from 'rxjs';

import { ManagerDirective } from 'src/app/shared/manager.directive';
import { KeyboardService } from 'src/app/shared/services/keyboard.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { InformationService } from 'src/app/shared/information/information.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { MarketService } from 'src/app/_services/APIService/market.service';

import { domesticchart, DomesticPriceModel, ProductModel } from 'src/app/_models/APIModel/domestic-market.model';

import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { defaultFormat as _rollupMoment } from 'moment';
import _moment from 'moment';

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
  public _currentRow: number = 0;
  pickedDate = new Date();

  selection = new SelectionModel<DomesticPriceModel>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
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

  removeRows() {
    if (!this.selection.selected.length) {
      this._infor.msgError('Hãy chọn sản phẩm cần xóa');
    }
    else if (confirm('Bạn Có Chắc Muốn Xóa?')) {
      let datas = this.selection.selected.map(element => new Object({ id: element.id }));
      this.marketService.DeleteDomesticMarket(datas).subscribe(res => {
        this._infor.msgSuccess('Xóa thành công')
        this.ngOnInit();
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
    this.pickedDate = null
  }

  resetAll() {
    this.getALLDomesticMarketPrice()
    this.pickedDate = null
  }

  public products: Array<ProductModel> = new Array<ProductModel>();
  public filterproducts: Array<ProductModel> = new Array<ProductModel>();

  public getListProduct(): void {
    this.marketService.GetProductList().subscribe(
      allrecords => {
        this.products = allrecords.data as ProductModel[];
        this.filterproducts = this.products.slice();
      },
    );
  }

  public getChange(param: any) {
    this.getDomesticMarketPrice(param._d)
  }

  Convertdate(text: string): string {
    return text.substring(6, 8) + "-" + text.substring(4, 6) + "-" + text.substring(0, 4);
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

  public getDomesticMarketPrice(time: Date) {
    // TODO: Need to check the value of time
    let datepipe = this.datepipe.transform(this.pickedDate, 'yyyyMMdd')
    this.marketService.GetDomesticMarket(datepipe).subscribe(
      allrecords => {
        allrecords.data.forEach(element => {
          element.ngay_cap_nhat = this.Convertdate(element.ngay_cap_nhat)
        });
        this.dataSource = new MatTableDataSource<DomesticPriceModel>(allrecords.data);
        this.paginatorAgain();
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
        this.paginatorAgain()

        this._rows = this.dataSource.filteredData.length;
      },
    );
  }

  public addRow(): void {
    let newRow: DomesticPriceModel = new DomesticPriceModel();
    newRow.gia_ca;
    newRow.nguon_so_lieu = "";
    newRow.ngay_cap_nhat = this.getCurrentDate();
    // newRow.ma_nguoi_cap_nhat = this._loginService.userValue.user_id;
    this.dataSource.data.push(newRow);
    this.dataSource = new MatTableDataSource(this.dataSource.data);

    this.filterproducts = this.products.slice();

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

    this.filterproducts = this.products.slice();

    this._rows = this.dataSource.filteredData.length;
  }

  public deleteRow(): void {
    this.dataSource.data.splice(this._currentRow, 1);
    this.dataSource = new MatTableDataSource(this.dataSource.data);

    this._rows = this.dataSource.filteredData.length;
  }

  public save(domestic: Array<DomesticPriceModel>) {
    this.dataSource.data.forEach(element => {
      if (element.ngay_cap_nhat) {
        let x = this.Convertdatetostring(element.ngay_cap_nhat)
        element.ngay_cap_nhat = x;
      }
    });
    this.marketService.PostDomesticMarket(domestic).subscribe(
      next => {
        this._infor.msgSuccess("Lưu thông tin thành công");
        this.getALLDomesticMarketPrice();
      },
      error => {
        this._infor.msgError("Lưu thông tin không thành công");
      }
    );
  }

  public exportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  public domestic: Array<DomesticPriceModel> = new Array<DomesticPriceModel>();

  keys: string[];
  dataSheet = new Subject();
  @ViewChild('inputFile', { static: true }) inputFile: ElementRef;
  uploadExcel(evt: any) {
    let data;
    let isExcelFile: boolean;
    const target: DataTransfer = <DataTransfer>(evt.target);
    isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length != 1) {
      this.inputFile.nativeElement.value = '';
    }
    else if (isExcelFile) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        let importedData = [];

        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        data = XLSX.utils.sheet_to_json(ws);
        data.forEach(item => {
          let datarow: DomesticPriceModel = new DomesticPriceModel();
          datarow.id_san_pham = item['ID sản phẩm'];
          datarow.gia_ca = item['Giá (VNĐ)'];
          datarow.nguon_so_lieu = item['Nguồn số liệu'];
          datarow.ngay_cap_nhat = this.getCurrentDate();
          importedData.push(datarow);
        });
        this.domestic = importedData
        this.domestic.forEach(x => {
          x.ngay_cap_nhat = this.Convertdatetostring(x.ngay_cap_nhat)
        })

        this.save(this.domestic)
        // this.dataSource = new MatTableDataSource(importedData);
        this.paginatorAgain();
        // this._infor.msgSuccess("Nhập dữ liệu từ excel thành công!");
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.keys = Object.keys(data[0]);
        this.dataSheet.next(data)
        this.inputFile.nativeElement.value = '';
      }
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
