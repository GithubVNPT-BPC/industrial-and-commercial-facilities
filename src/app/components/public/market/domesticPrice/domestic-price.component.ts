//Import library
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { formatDate } from '@angular/common';

//Import Service
import { MarketService } from '../../../../_services/APIService/market.service';
//Import Model
import { DomesticPriceModel } from '../../../../_models/APIModel/domestic-market.model';
//Imoport Component

//Moment
import { defaultFormat as _rollupMoment, Moment } from 'moment';
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
  ],
})

export class DomesticPriceComponent implements OnInit {

  //Declare constant
  //Declare variable for TS & HTML
  public noData: boolean = true;
  //Declare variable for ONLY TS

  //ViewChild
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  date = new FormControl(moment);
  pickedDate = {
    date: new Date()
  }

  chartYearModel: number;
  chartYearModelSelected: number;
  chartyears: Array<number> = [];
  public mainChartLegend: boolean;
  public mainChartType: string = 'line';
  public mainChartColours: Array<any> = new Array<any>();
  public mainChartOptions: any;
  public timeDomesticPrice: string;
  public displayedColumns: string[] = ['index', 'ten_san_pham', 'gia', 'nguon_so_lieu', 'ngay_cap_nhat'];
  public mainChartLabels: Array<any> = new Array<any>();
  public mainChartData: Array<any> = new Array<any>();
  public maxSizeChart: number;
  public theYear: string;
  public readonly format = 'dd/MM/yyyy';
  public readonly locale = 'en-US';

  dataSource: MatTableDataSource<DomesticPriceModel>;
  dataGet: Array<any>;
  mainChartElements = 10;

  public defaultProducts: Object[] = [{ ma_san_pham: 2 }, { ma_san_pham: 10 }, { ma_san_pham: 4 }, { ma_san_pham: 5 }];



  constructor(public marketService: MarketService) {
    this.initialData();
  }

  ngOnInit() {
    this.timeDomesticPrice = _moment(this.pickedDate.date).format('DD/MM/YYYY');
    this.chartYearModelSelected = this.getCurrentYear();
    this.chartyears = this.initialYears();
    this.getDomesticMarketPriceByTime(this.pickedDate.date);
    let now: Date = new Date();
    //this.getChartDataByTimePeriod(this.defaultProducts, new Date(now.setDate(now.getDate() - 30)), new Date(Date.now()));
    //this.GetDataForChart(this.chartYearModelSelected);
  }

  //Function for Process-Flow -------------------------------------------------------------------------------------------
  public getDomesticMarketPriceByTime(time: Date) {
    let formattedDate = formatDate(time, this.format, this.locale);
    this.marketService.GetDomesticMarketByTime(formattedDate).subscribe(
      allrecords => {
        console.log(allrecords)
        allrecords.data.forEach(row => {
          row.ngay_cap_nhat = formatDate(row.ngay_cap_nhat, this.format, this.locale).toString();
        });
        this.dataSource = new MatTableDataSource<DomesticPriceModel>(allrecords.data);
        if (this.dataSource.data.length == 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }
        console.log(this.noData);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
      },
      //error => this.errorMessage = <any>error
    );
  }

  //Function for HTML Event -------------------------------------------------------------------------------------------
  //Event for "Lọc dữ liệu"
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  //Event for "Thay đổi năm"
  public changeYear() {
    console.log("Change Year Func.");
    //this.GetDataForChart(this.chartYearModelSelected);
  }
  //Event for "Xuất Excel"
  public exportTOExcel(filename: string, sheetname: string) {
    sheetname = sheetname.replace('/', '_').replace('/', '_');
    let excelFileName: string = filename + '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    /* save to file */
    XLSX.writeFile(wb, excelFileName);
  }
  //Function for Extention-------------------------------------------------------------------------------------------
  public getMonthAndYear(time: string) {
    let formattedDate = formatDate(time, this.format, this.locale);
    return formattedDate as string;
  }
  public initialYears() {
    let returnYear: Array<any> = [];
    let currentDate = new Date();
    let nextYear = currentDate.getFullYear() + 1;
    for (let index = 0; index < 11; index++) {
      returnYear.push(nextYear - index);
    }
    return returnYear;
  }

  public getCurrentYear() {
    var currentDate = new Date();
    return currentDate.getFullYear();
  }
  public formatNgayCapNhat(str: string) {
    let year: string = str.substr(0, 4);
    let month: string = str.substr(4, 2);
    let day: string = str.substr(6, 2);
    let result: string = day + '/' + month + '/' + year;
    return result;
  }
  public getPriceChange(param: any) {
    this.getDomesticMarketPriceByTime(param._d);
  }

  //Function for Chart HTML-------------------------------------------------------------------------------------------
  public initialData() {
    this.initialChartColor();
    this.inititalChartOther();
  }
  //Initalize Color for chart line
  public initialChartColor() {
    this.mainChartColours = [
      { // brandInfo
        // backgroundColor: hexToRgba(getStyle('--success'), 10),
        // borderColor: getStyle('--success'),
        pointHoverBackgroundColor: '#fff'
      },
      { // brandSuccess
        backgroundColor: 'transparent',
        // borderColor: getStyle('--warning'),
        pointHoverBackgroundColor: '#fff'
      },
      { // brandDanger
        backgroundColor: 'transparent',
        // borderColor: getStyle('--primary'),
        pointHoverBackgroundColor: '#fff'
      },
      { // brandDanger
        backgroundColor: 'transparent',
        // borderColor: getStyle('--danger'),
        pointHoverBackgroundColor: '#fff',
      }
    ];
  }

  //Initialize Option for chart line
  public initialChartOption() {
    // this.mainChartOptions = {
    //   tooltips: {
    //     scaleShowValues: true,
    //     enabled: false,
    //     // custom: CustomTooltips,
    //     intersect: true,
    //     mode: 'index',
    //     position: 'nearest',
    //     callbacks: {
    //       labelColor: function (tooltipItem, chart) {
    //         return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
    //       }
    //     }
    //   },
    //   responsive: true,
    //   maintainAspectRatio: false,
    //   scales: {
    //     xAxes: [{
    //       gridLines: {
    //         drawOnChartArea: false,
    //       },
    //       ticks: {
    //         callback: function (value: any) {
    //           return value
    //         }
    //       }
    //     }],
    //     yAxes: [{
    //       ticks: {
    //         beginAtZero: true,
    //         maxTicksLimit: 5,
    //         stepSize: Math.ceil(this.maxSizeChart / 5),
    //         max: this.maxSizeChart
    //       }
    //     }]
    //   },
    //   elements: {
    //     line: {
    //       borderWidth: 2
    //     },
    //     point: {
    //       radius: 2,
    //       borderWidth:2,
    //       hitRadius: 5,
    //       hoverRadius: 4,
    //       hoverBorderWidth: 6,
    //     }
    //   },
    //   legend: {
    //     display: false
    //   }
    // };
  }

  inititalChartOther() {
    this.mainChartType = 'line';
    this.theYear = "2020";
    this.mainChartLegend = false;
  }
  public getChartDataByTimePeriod(listProduct: any[], from_date: Date, to_date: Date) {
    // this.marketService.GetPriceByTimePeriod(listProduct,_moment(from_date).format('DD/MM/YYYY').toString(), _moment(to_date).format('DD/MM/YYYY').toString()).subscribe(
    //   result =>{
    //     console.log(result);
    //   }
    // );
  }

  public getDataForChart(yaer: number) {
    //   let chartData1: Array<number> = new Array<number>();
    //   let chartName1: string;
    //   let productId: number;
    //   let periodTime: number;
    //   let chartData2: Array<number> = new Array<number>();
    //   let chartName2: string;
    //   let chartData3: Array<number> = new Array<number>();
    //   let chartName3: string;
    //   let chartData4: Array<number> = new Array<number>();
    //   let chartName4: string;
    //   productId = 2;
    //   periodTime = 10;
    //   this.marketService.GetPriceByProductId(productId, periodTime).subscribe(
    //     allrecords => {
    //       allrecords.data.forEach(row => {
    //         if (chartName1 != '') chartName1 = row.ten_san_pham;
    //         row.ngay_cap_nhat = this.GetMonthAndYear(row.ngay_cap_nhat);
    //         this.mainChartLabels.unshift(row.ngay_cap_nhat);
    //         chartData1.unshift(row.gia);
    //         if (row.gia > this.maxSizeChart) this.maxSizeChart = row.gia;
    //       });
    //       productId = 3;
    //       periodTime = 10;
    //       this.marketService.GetPriceByProductId(productId, periodTime).subscribe(
    //         allrecords => {
    //           allrecords.data.forEach(row => {
    //             if (chartName2 != '') chartName2 = row.ten_san_pham;
    //             chartData2.unshift(row.gia);
    //             if (row.gia > this.maxSizeChart) this.maxSizeChart = row.gia;
    //           });
    //           productId = 4;
    //           periodTime = 10;
    //           this.marketService.GetPriceByProductId(productId, periodTime).subscribe(
    //             allrecords => {
    //               allrecords.data.forEach(row => {
    //                 if (chartName3 != '') chartName3 = row.ten_san_pham;
    //                 chartData3.unshift(row.gia);
    //                 if (row.gia > this.maxSizeChart) this.maxSizeChart = row.gia;
    //               });
    //               productId = 5;
    //               periodTime = 10;
    //               this.marketService.GetPriceByProductId(productId, periodTime).subscribe(
    //                 allrecords => {
    //                   allrecords.data.forEach(row => {
    //                     if (chartName4 != '') chartName4 = row.ten_san_pham;
    //                     chartData4.unshift(row.gia);
    //                     if (row.gia > this.maxSizeChart) this.maxSizeChart = row.gia;
    //                   });
    //                   this.mainChartData = [
    //                     {
    //                       data: chartData1,
    //                       label: chartName1
    //                     },
    //                     {

    //                       data: chartData2,
    //                       label: chartName2
    //                     },
    //                     {
    //                       data: chartData3,
    //                       label: chartName3
    //                     },
    //                     {
    //                       data: chartData4,
    //                       label: chartName4
    //                     }
    //                   ];
    //                   this.InitialChartOption();
    //                 },
    //                 //error => this.errorMessage = <any>error
    //               );
    //             },
    //             //error => this.errorMessage = <any>error
    //           );
    //         },
    //         //error => this.errorMessage = <any>error
    //       );
    //     },
    //     //error => this.errorMessage = <any>error
    //   );
  };
}

