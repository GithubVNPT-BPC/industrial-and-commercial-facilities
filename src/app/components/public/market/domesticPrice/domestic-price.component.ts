import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelService } from 'src/app/_services/excelUtil.service';

import { DomesticPriceModel } from 'src/app/_models/APIModel/domestic-market.model';

import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { defaultFormat as _rollupMoment } from 'moment';

import { MarketServicePublic } from 'src/app/_services/APIService/market.service public';
import { BaseComponent } from 'src/app/components/specialized/base.component';

import _moment from 'moment';
const moment = _rollupMoment || _moment;
export const DDMMYY_FORMAT = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
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

export class DomesticPriceComponent extends BaseComponent {
  public displayedColumns: string[] = ['index', 'id_san_pham', 'ten_san_pham', 'don_vi_tinh1', 'gia_ca', 'nguon_so_lieu', 'ngay_cap_nhat'];
  public dataSource: MatTableDataSource<DomesticPriceModel>;
  public pickedDate = new Date();
  public EXCEL_NAME = 'Giá cả nông sản';

  constructor(
    private injector: Injector,
    public marketService: MarketServicePublic,
    public excelService: ExcelService,
    public datepipe: DatePipe
  ) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.getDomesticMarketPriceByTime(this.pickedDate);
  }

  public getPriceChange(param: any) {
    this.getDomesticMarketPriceByTime(param._d);
  }

  public getDomesticMarketPriceByTime(time: Date) {
    let datepipe = this.datepipe.transform(this.pickedDate, 'yyyyMMdd')
    this.marketService.GetDomesticMarket(datepipe).subscribe(
      allrecords => {
        this.filteredDataSource.data = [];
        if (allrecords.data && allrecords.data.length > 0) {
          allrecords.data.forEach(row => {
            row.ngay_cap_nhat = this.Convertdate(row.ngay_cap_nhat)
          });
          this.dataSource = new MatTableDataSource<DomesticPriceModel>(allrecords.data);
          this.filteredDataSource.data = [...this.dataSource.data];
        }
        this._prepareData();
        this.paginatorAgain();
      },
      error => this.errorMessage = <any>error
    );
  }

  Convertdate(text: string): string {
    return text ? text.substring(6, 8) + "/" + text.substring(4, 6) + "/" + text.substring(0, 4) : "";
  }

  public exportTOExcel() {
    let datepipe = this.datepipe.transform(this.pickedDate, 'dd-MM-yyyy');
    this.EXCEL_NAME = `Giá cả nông sản ngày ${datepipe}`; 
    this.excelService.exportDomTableAsExcelFile(this.EXCEL_NAME, datepipe, this.table.nativeElement);
  }
}

