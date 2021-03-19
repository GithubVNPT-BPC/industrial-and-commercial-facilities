import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


import { ExcelService } from 'src/app/_services/excelUtil.service';

import { ForeignMarketModel } from '../../../../_models/APIModel/domestic-market.model';

import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { defaultFormat as _rollupMoment } from 'moment';
import _moment from 'moment';
import { MarketServicePublic } from 'src/app/_services/APIService/market.service public';
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
  selector: 'app-foreign-price',
  templateUrl: 'foreign-price.component.html',
  styleUrls: ['../../public_layout.scss'],
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

export class ForeignMarketPriceComponent implements OnInit {
  public displayedColumns: string[] = ['index', 'ten_san_pham', 'don_vi_tinh', 'thi_truong', 'gia_ca', 'nguon_so_lieu', 'ngay_cap_nhat'];
  public dataSource: MatTableDataSource<ForeignMarketModel>;

  @ViewChild('TABLE', { static: false }) table: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public marketService: MarketServicePublic,
    public excelService: ExcelService,
    public datepipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.getForeignMarketPriceByTime(this.pickedDate.date);
  }

  public pickedDate = {
    date: new Date()
  }

  public getForeignMarketPriceByTime(time: Date) {
    let datepipe = this.datepipe.transform(this.pickedDate.date, 'yyyyMMdd')
    this.marketService.GetForeignMarket(datepipe).subscribe(
      allrecords => {
        allrecords.data.forEach(row => {
          row.ngay_cap_nhat = this.Convertdate(row.ngay_cap_nhat)
        });
        this.dataSource = new MatTableDataSource<ForeignMarketModel>(allrecords.data);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
      },
    );
  }

  Convertdate(text: string): string {
    let date: string
    date = text.substring(6, 8) + "-" + text.substring(4, 6) + "-" + text.substring(0, 4)
    return date
  }

  public getPriceChange(param: any) {
    this.getForeignMarketPriceByTime(param._d);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public exportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }
}
