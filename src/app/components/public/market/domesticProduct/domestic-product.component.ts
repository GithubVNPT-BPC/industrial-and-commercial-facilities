import { Component, Injector, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { ChartOptions, ChartDataSets, ChartType, Chart } from 'chart.js';
import { DashboardService } from 'src/app/_services/APIService/dashboard.service';
import { productchart, ProductModel } from 'src/app/_models/APIModel/domestic-market.model';
import { formatDate } from '@angular/common';

import { ProductValueModel } from 'src/app/_models/APIModel/domestic-market.model';
import { SAVE } from 'src/app/_enums/save.enum';

import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { CompanyTopPopup } from '../company-top-popup/company-top-popup.component';

import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
import { MarketServicePublic } from 'src/app/_services/APIService/market.service public';
import { BaseComponent } from 'src/app/components/specialized/base.component';

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
  selector: 'app-domestic-product',
  templateUrl: 'domestic-product.component.html',
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

export class DomesticProductComponent extends BaseComponent {
  public displayedColumns: string[] = ['index', 'id_san_pham', 'ten_san_pham', 'don_vi_tinh2', 'san_luong', 
  // 'tri_gia', 'top_san_xuat'
];
  public dataSource: MatTableDataSource<ProductValueModel>;

  public ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  constructor(
    private injector: Injector,
    public marketService: MarketServicePublic,
    public excelService: ExcelService,
    public router: Router,
    public dialog: MatDialog,
    public dashboardService: DashboardService) {
    super(injector);
  }

  ngOnInit() {
    this.GetProduct();
    this.defaultcode = 1
    this.tuthang = this.firstmonth.value
    this.denthang = this.presentmonth.value
    this.productcode = 1

    this.getDomesticMarketProduct(this.currentTime.format('YYYYMM'));

    this.profilter.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterThuongnhan();
    });
  }

  public _onDestroy = new Subject<void>();

  public firstmonth = new FormControl(_moment().startOf('year').format('yyyyMM'));
  public presentmonth = new FormControl(_moment().format('yyyyMM'));

  public getDomesticMarketProduct(time: string) {
    this.marketService.GetProductValue(time).subscribe(
      allrecords => {
        this.filteredDataSource.data = [];
        if (allrecords.data && allrecords.data.length > 0) {
          let data = allrecords.data[0];
          this.dataSource = new MatTableDataSource<ProductValueModel>(data);
          this.filteredDataSource.data = [...this.dataSource.data];
        }
        this._prepareData();
        this.paginatorAgain();
      },
      error => this.errorMessage = <any>error
    );
  }

  @ViewChild('lineCanvas', { static: false }) lineCanvas: ElementRef;
  lineChart: any;

  defaultcode: number
  tuthang: string
  denthang: string
  productcode: number

  timelist: string[]
  sanluong: number[]
  trigia: number[]

  ngAfterViewInit(): void {
    this.lineChartMethod(this.tuthang, this.denthang, this.productcode);
  }

  productchart: Array<productchart> = new Array<productchart>();

  lineChartMethod(tuthang: string, denthang: string, productcode: number) {
    this.dashboardService.GetProductChart(tuthang, denthang, productcode).subscribe(
      all => {
        this.productchart = all.data
        this.timelist = this.productchart.map(x => this.Convertdate(x.time_id.toString()))
        this.sanluong = this.productchart.map(x => x.san_luong)
        this.trigia = this.productchart.map(x => x.tri_gia)

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
          type: 'line',
          data: {
            labels: this.timelist,
            datasets: [
              {
                label: 'Sản lượng',
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
                data: this.sanluong,
                spanGaps: false,
              },
              {
                label: 'Trị giá',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgb(0, 0, 255)',
                borderColor: 'rgb(0, 0, 255)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgb(0, 0, 255)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgb(0, 0, 255)',
                pointHoverBorderColor: 'rgb(0, 0, 255)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.trigia,
                spanGaps: false,
              }
            ]
          }
        });
      },
    );
  }

  products: Array<ProductModel> = new Array<ProductModel>();
  filterproducts: ReplaySubject<ProductModel[]> = new ReplaySubject<ProductModel[]>(1);
  GetProduct() {
    this.dashboardService.GetProductList().subscribe((allrecords) => {
      this.products = allrecords.data as ProductModel[];
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
    this.lineChartMethod(this.tuthang, this.denthang, this.productcode);
  }

  Convertdate(text: string): string {
    let date: string
    date = text.substr(4, 2) + "-" + text.substring(0, 4)
    return date
  }

  public date = new FormControl(_moment().startOf('year').format('yyyyMM'));
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

    this.tuthang = this.time
    this.lineChart.config.data.datasets = []
    this.lineChartMethod(this.tuthang, this.denthang, this.productcode);
  }

  public date1 = new FormControl(_moment());
  public newdate1 = new FormControl(_moment());

  public chosenYearHandler1(normalizedYear: Moment) {
    this.date1 = this.newdate1
    const ctrlValue = this.date1.value;
    ctrlValue.year(normalizedYear.year());
    this.date1.setValue(ctrlValue);
    this.theYear = normalizedYear.year();
  }

  public chosenMonthHandler1(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date1.value;
    ctrlValue.month(normalizedMonth.month());
    this.date1.setValue(ctrlValue);
    this.theMonth = normalizedMonth.month() + 1;
    datepicker.close();

    if (this.theMonth >= 10) {
      this.stringmonth = this.theMonth.toString();
    }
    else {
      this.stringmonth = "0" + this.theMonth.toString()
    }
    this.time = this.theYear.toString() + this.stringmonth

    this.denthang = this.time
    this.lineChart.config.data.datasets = []
    this.lineChartMethod(this.tuthang, this.denthang, this.productcode);
  }

  public date2 = new FormControl(_moment());
  public newdate2 = new FormControl(_moment());

  public chosenYearHandler2(normalizedYear: Moment) {
    this.date2 = this.newdate2
    const ctrlValue = this.date2.value;
    ctrlValue.year(normalizedYear.year());
    this.date1.setValue(ctrlValue);
    this.theYear = normalizedYear.year();
  }

  public chosenMonthHandler2(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date2.value;
    ctrlValue.month(normalizedMonth.month());
    this.date2.setValue(ctrlValue);
    this.theMonth = normalizedMonth.month() + 1;
    datepicker.close();

    if (this.theMonth >= 10) {
      this.stringmonth = this.theMonth.toString();
    }
    else {
      this.stringmonth = "0" + this.theMonth.toString()
    }
    this.time = this.theYear.toString() + this.stringmonth

    this.getDomesticMarketProduct(this.time);
  }

  private sumSL: number = 0;
  private sumTG: number = 0;

  _prepareData() {
    let data = this.dataSource.data;
    this.sumSL = data.length ? data.map(item => item.san_luong).reduce((a, b) => a + b) : 0;
    this.sumTG = data.length ? data.map(item => item.tri_gia).reduce((a, b) => a + b) : 0;
  }

  public openCompanyTopPopup(data: any) {
    const dialogRef = this.dialog.open(CompanyTopPopup, {
      height: '70%',
      width: '70%',
      data: {
        message: 'Dữ liệu top doanh nghiệp sản xuất',
        product_data: data,
        typeOfSave: SAVE.PRODUCT,
      }
    });
  }
}
