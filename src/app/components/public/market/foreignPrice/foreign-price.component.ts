import { Component, Injector, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { FormControl } from '@angular/forms';
import { ChartOptions, ChartDataSets, ChartType, Chart } from 'chart.js';
import { DashboardService } from 'src/app/_services/APIService/dashboard.service';
import { foreignchart, ProductModel } from 'src/app/_models/APIModel/domestic-market.model';
import { formatDate } from '@angular/common';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ForeignMarketModel } from 'src/app/_models/APIModel/domestic-market.model';
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

export class ForeignMarketPriceComponent extends BaseComponent {
  public displayedColumns: string[] = ['index', 'id_san_pham', 'ten_san_pham', 'don_vi_tinh', 'thi_truong', 'gia_ca', 'nguon_so_lieu', 'ngay_cap_nhat'];
  public dataSource: MatTableDataSource<ForeignMarketModel>;

  public ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  constructor(
    private injector: Injector,
    public marketService: MarketServicePublic,
    public excelService: ExcelService,
    public datepipe: DatePipe,
    public dashboardService: DashboardService
  ) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.getListProduct();
    this.defaultcode = 1
    this.tungay = this.firstday.value
    this.denngay = this.presentday.value
    this.productcode = 1

    this.getForeignMarketPriceByTime(this.pickedDate2.value._d);
  }

  public getForeignMarketPriceByTime(time: Date) {
    let datepipe = this.datepipe.transform(time, 'yyyyMMdd');
    this.marketService.GetForeignMarket(datepipe).subscribe(
      allrecords => {
        this.filteredDataSource.data = [];
        if (allrecords.data && allrecords.data.length > 0) {
          allrecords.data.forEach(row => {
            row.ngay_cap_nhat = this.Convertdate(row.ngay_cap_nhat)
          });
          this.dataSource = new MatTableDataSource<ForeignMarketModel>(allrecords.data);
          this.filteredDataSource.data = [...this.dataSource.data];
        }
        this._prepareData();
        this.paginatorAgain();
      },
      error => this.errorMessage = <any>error
    );
  }

  public firstday = new FormControl(_moment().startOf('year').format('yyyyMMDD'));
  public presentday = new FormControl(_moment().format('yyyyMMDD'));

  @ViewChild('lineCanvas', { static: false }) lineCanvas: ElementRef;
  lineChart: any;

  defaultcode: number
  tungay: string
  denngay: string
  productcode: number

  timelist: string[]
  giaca: number[]

  ngAfterViewInit(): void {
    this.lineChartMethod(this.tungay, this.denngay, this.productcode);
  }

  foreignchart: Array<foreignchart> = new Array<foreignchart>();

  lineChartMethod(tungay: string, denngay: string, productcode: number) {
    this.dashboardService.GetForeignChart(tungay, denngay, productcode).subscribe(
      all => {
        this.foreignchart = all.data
        this.timelist = this.foreignchart.map(x => this.Convertdate(x.ngay_cap_nhat.toString()))
        this.giaca = this.foreignchart.map(x => x.gia_ca)

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
          type: 'line',
          data: {
            labels: this.timelist,
            datasets: [
              {
                label: 'Giá cả',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgb(255, 0, 0)',
                borderColor: 'rgb(255, 0, 0)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgb(255, 0, 0)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgb(255, 0, 0)',
                pointHoverBorderColor: 'rgb(255, 0, 0)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.giaca,
                spanGaps: false,
              }
            ]
          }
        });
      },
    );
  }

  public products: Array<ProductModel> = new Array<ProductModel>();
  public filterproducts: Array<ProductModel> = new Array<ProductModel>();

  public getListProduct(): void {
    this.dashboardService.GetProductList().subscribe(
      allrecords => {
        this.products = allrecords.data as ProductModel[];
        this.filterproducts = this.products.slice();
      },
    );
  }

  applyfilter(event) {
    this.productcode = event.value
    this.lineChart.config.data.datasets = []
    this.lineChartMethod(this.tungay, this.denngay, this.productcode);
  }

  Convertdate(text: string): string {
    return text ? text.substring(6, 8) + "/" + text.substring(4, 6) + "/" + text.substring(0, 4) : "";
  }

  public pickedDate = new FormControl(_moment().startOf('year'));
  public pickedDate1 = new FormControl(_moment());
  public pickedDate2 = new FormControl(_moment());

  public onChange(param: any) {
    this.tungay = param.format('yyyyMMDD')
    this.lineChart.config.data.datasets = []
    this.lineChartMethod(this.tungay, this.denngay, this.productcode);
  }

  public onChange1(param: any) {
    this.denngay = param.format('yyyyMMDD')
    this.lineChart.config.data.datasets = []
    this.lineChartMethod(this.tungay, this.denngay, this.productcode);
  }

  public onChange2(param: any) {
    this.getForeignMarketPriceByTime(param._d);
  }
}
