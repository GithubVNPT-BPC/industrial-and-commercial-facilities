import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChartOptions, ChartDataSets, ChartType, Chart } from 'chart.js';
import { DashboardService } from 'src/app/_services/APIService/dashboard.service';
import { productchart, ProductModel } from 'src/app/_models/APIModel/domestic-market.model';
import { formatDate } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
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
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
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

export class DashboardComponent implements OnInit {

  @ViewChild('lineCanvas', { static: false }) lineCanvas: ElementRef;
  lineChart: any;

  defaultcode: number
  tuthang: string
  denthang: string
  productcode: number

  timelist: string[]
  sanluong: number[]
  trigia: number[]

  public ngOnInit() {
    this.getListProduct();
    this.defaultcode = 1
    this.tuthang = '202101'
    this.denthang = '202112'
    this.productcode = 1
  }

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
    this.lineChartMethod(this.tuthang, this.denthang, this.productcode);
  }

  constructor(public dashboardService: DashboardService) {
  }

  Convertdate(text: string): string {
    let date: string
    date = text.substr(4, 2) + "-" + text.substring(0, 4)
    return date
  }

  Convertdatetostring(text: string): string {
    let date: string
    date = text.replace('-', '')
    let date1: string
    date1 = date.substring(2, 7) + date.substring(0, 2)
    return date1
  }

  public getCurrentMonth(): string {
    let date = new Date;
    return formatDate(date, 'MM/yyyy', 'en-US');
  }

  convertstringtodate(time: string): Date {
    let year = parseInt(time.substring(0, 4));
    let month = parseInt(time.substring(4, 6));
    let day = parseInt(time.substring(6, 8));

    let date = new Date(year, month - 1, day);
    return date
  }

  public date = new FormControl(_moment('20210101'));
  public newdate = new FormControl(_moment('20210101'));
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

  public date1 = new FormControl(_moment('20211231'));
  public newdate1 = new FormControl(_moment('20211231'));

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

}
