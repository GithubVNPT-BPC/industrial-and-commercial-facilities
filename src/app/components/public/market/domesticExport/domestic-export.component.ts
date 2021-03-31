import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material';
import { ExcelService } from 'src/app/_services/excelUtil.service';

import { ExportMarketModel } from '../../../../_models/APIModel/domestic-market.model';
import { SAVE } from 'src/app/_enums/save.enum';

import { CompanyTopPopup } from '../company-top-popup/company-top-popup.component';

import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
import { MarketServicePublic } from 'src/app/_services/APIService/market.service public';
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
  selector: 'app-domestic-export',
  templateUrl: 'domestic-export.component.html',
  styleUrls: ['../../public_layout.scss'],
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

export class DomesticExportComponent implements OnInit {
  public displayedColumns: string[] = ['index', 'ten_san_pham', 'don_vi_tinh', 'san_luong_thang', 'tri_gia_thang', 'san_luong_thang_tc', 'tri_gia_thang_tc', 'top_xuat_khau'];
  public dataSource: MatTableDataSource<ExportMarketModel>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  public stringmonth: string;
  public time: string;

  constructor(
    public marketService: MarketServicePublic,
    public excelService: ExcelService,
    public router: Router,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.theYear = this.getCurrentYear();
    this.theMonth = this.getCurrentMonth();
    if (this.theMonth >= 10) {
      this.stringmonth = this.theMonth.toString();
    }
    else {
      this.stringmonth = "0" + this.theMonth.toString()
    }
    this.time = this.theYear.toString() + this.stringmonth
    this.getExportlist(this.time);
  }

  exportlist1: Array<ExportMarketModel> = new Array<ExportMarketModel>();
  exportlist2: Array<ExportMarketModel> = new Array<ExportMarketModel>();

  public getExportlist(time: string) {
    this.marketService.GetExportValue(time).subscribe(
      all => {
        this.dataSource = new MatTableDataSource<ExportMarketModel>(all.data[0]);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
      },
    );
  }

  sumSL() {
    let sumSL: number = 0;
    if (this.dataSource)
      for (let row of this.dataSource.data) {
        if (row.id != '') sumSL += row.san_luong_thang;
      }
    return sumSL;
  }

  sumTG() {
    let sumTG: number = 0;
    if (this.dataSource)
      for (let row of this.dataSource.data) {
        if (row.id != '') sumTG += row.tri_gia_thang;
      }
    return sumTG;
  }

  sumSLCT() {
    let sumSLCT: number = 0;
    if (this.dataSource)
      for (let row of this.dataSource.data) {
        if (row.id != '') sumSLCT += row.san_luong_thang_tc;
      }
    return sumSLCT;
  }

  sumTGCT() {
    let sumTGCT: number = 0;
    if (this.dataSource)
      for (let row of this.dataSource.data) {
        if (row.id != '') sumTGCT += row.tri_gia_thang_tc;
      }
    return sumTGCT;
  }

  public date = new FormControl(_moment());
  public theYear: number;
  public theMonth: number;

  public getCurrentMonth(): number {
    var currentDate = new Date();
    return currentDate.getMonth() + 1;
  }

  public getCurrentYear() {
    var currentDate = new Date();
    return currentDate.getFullYear();
  }

  public chosenYearHandler(normalizedYear: Moment) {
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
    this.getExportlist(this.time);
  }

  public exportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public openCompanyTopPopup(data: any) {
    const dialogRef = this.dialog.open(CompanyTopPopup, {
      data: {
        message: 'Dữ liệu top doanh nghiệp xuất khẩu',
        export_data: data,
        typeOfSave: SAVE.EXPORT,
      }
    });
  }
}
