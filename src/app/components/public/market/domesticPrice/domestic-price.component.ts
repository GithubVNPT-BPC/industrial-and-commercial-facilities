import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MarketService } from '../../../../_services/APIService/market.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';

import { DomesticPriceModel } from '../../../../_models/APIModel/domestic-market.model';

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
  selector: 'app-domestic-price',
  templateUrl: 'domestic-price.component.html',
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

export class DomesticPriceComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  public displayedColumns: string[] = ['index', 'ten_san_pham', 'don_vi_tinh', 'gia_ca', 'nguon_so_lieu', 'ngay_cap_nhat'];
  dataSource: MatTableDataSource<DomesticPriceModel>;

  constructor(
    public marketService: MarketService,
    public excelService: ExcelService,
    public datepipe: DatePipe
  ) {
  }

  pickedDate = {
    date: new Date()
  }

  ngOnInit() {
    this.getDomesticMarketPriceByTime(this.pickedDate.date);
  }

  public getPriceChange(param: any) {
    this.getDomesticMarketPriceByTime(param._d);
  }

  public getDomesticMarketPriceByTime(time: Date) {
    let datepipe = this.datepipe.transform(this.pickedDate.date, 'yyyyMMdd')
    this.marketService.GetDomesticMarket(datepipe).subscribe(
      allrecords => {
        allrecords.data.forEach(element => {
          element.ngay_cap_nhat = this.Convertdate(element.ngay_cap_nhat)
        });
        this.dataSource = new MatTableDataSource<DomesticPriceModel>(allrecords.data);
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

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public exportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }
}

