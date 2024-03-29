import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelService } from 'src/app/_services/excelUtil.service';

import { DomesticPriceModel } from 'src/app/_models/APIModel/domestic-market.model';

import { ChartOptions, ChartDataSets, ChartType, Chart } from 'chart.js';
import { DashboardService } from 'src/app/_services/APIService/dashboard.service';
import { domesticchart, ProductModel } from 'src/app/_models/APIModel/domestic-market.model';
import { formatDate } from '@angular/common';
import { numberWithDot } from 'src/app/_services/stringUtils.service';

import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  public displayedColumns: string[] = ['index', 'id_san_pham', 'ten_san_pham', 'nguon_so_lieu', 'ngay_cap_nhat'];
  public dataSource: MatTableDataSource<DomesticPriceModel>;

  private getExposedTable() {
    let self = this;
    let exposedData = [];
    this.filteredDataSource.filteredData.forEach(function (record, index) {
      let data = {
        "STT": index + 1,
        "Sản phẩm": record["ten_san_pham"],
        "Đơn vị tính": record["don_vi_tinh1"],
        "Giá cả": numberWithDot(record["gia_ca"]),
        "Nguồn số liệu": record["nguon_so_lieu"],
        "Ngày cập nhật": record["ngay_cap_nhat"],
      };
      exposedData.push(data);
    });
    return exposedData;
  }

  public ExportToExcel() {
    let filename = 'Thông tin về giá cả trong nước';
    let sheetname = 'Thông tin về giá cả trong nước';
    this.excelService.exportJsonAsExcelFile(filename, sheetname, this.getExposedTable());
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
    this.GetProduct();
    this.defaultcode = 1
    this.tungay = this.firstday.value
    this.denngay = this.presentday.value
    this.productcode = 1

    this.getDomesticMarketPriceByTime(this.pickedDate2.value._d);

    this.profilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterThuongnhan();
      });
  }

  public _onDestroy = new Subject<void>();

  public getDomesticMarketPriceByTime(time: Date) {
    let datepipe = this.datepipe.transform(time, 'yyyyMMdd')
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

  domesticchart: Array<domesticchart> = new Array<domesticchart>();

  lineChartMethod(tungay: string, denngay: string, productcode: number) {
    let self = this;
    this.dashboardService.GetDomesticChart(tungay, denngay, productcode).subscribe(
      all => {
        this.domesticchart = all.data
        this.timelist = this.domesticchart.map(x => this.Convertdate(x.ngay_cap_nhat.toString()))
        this.giaca = this.domesticchart.map(x => x.gia_ca)

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
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  callback: function(value, index, values) {
                    return numberWithDot(value) + ' đ';
                  }
                },
              }],
            }
          }
        });
      },
    );
  }

  products: Array<ProductModel> = new Array<ProductModel>();
  filterproducts: ReplaySubject<ProductModel[]> = new ReplaySubject<ProductModel[]>(1);
  GetProduct() {
    this.dashboardService.GetProductList().subscribe((allrecords) => {
      this.products = allrecords.data.filter( x => x.id_field == 1) as ProductModel[];
      this.filterproducts.next(this.products.slice());
    });
  }
  public profilter: FormControl = new FormControl();
  public filterThuongnhan() {
    if (!this.products) {
      return;
    }
    let search = this.profilter.value;
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
    this.getDomesticMarketPriceByTime(param._d);
  }
}

