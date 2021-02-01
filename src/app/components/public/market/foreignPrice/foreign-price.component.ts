//import library
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepicker } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
// import { promise } from 'protractor';
// import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
// import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

//Import Services
import { MarketService } from '../../../../_services/APIService/market.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';

//Import Model
import { ForeignMarketModel } from '../../../../_models/APIModel/domestic-market.model';
//Import Component

//Moment
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
  ],
})

export class ForeignMarketPriceComponent implements OnInit {

  //declare variable for HTML----------------------------------------
  public _noData: boolean = true;
  public displayedColumns: string[] = ['index', 'ten_san_pham', 'thi_truong', 'gia', 'nguon_so_lieu', 'ngay_cap_nhat'];
  public pickedDate = {
    date: new Date()
  }
  public dataSource: MatTableDataSource<ForeignMarketModel>;
  public timeDomesticPrice: string;
  public chartYearModelSelected: number;
  public chartyears: Array<number> = [];
  //declare variable for ONLY TS----------------------------------------
  public _theYear: number;
  public _theMonth: number = 4;
  public _dataGet: Array<any>;
  public _mainChartElements: number = 10;
  public _mainChartLabels: Array<any> = new Array<any>();
  public _mainChartData: Array<any> = new Array<any>();
  public _maxSizeChart: number;
  public _mainChartLegend: boolean;
  public _mainChartType: string = 'line';
  public _mainChartColours: Array<any> = new Array<any>();
  public _mainChartOptions: any;
  public _date = new FormControl(moment);
  public _chartYearModel: number;

  //ViewChild----------------------------------------
  @ViewChild('TABLE', { static: false }) table: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public marketService: MarketService,
    public excelService: ExcelService,
    public router: Router,) {
    this.InitialData();
  }

  ngOnInit() {
    this.getForeignMarketPriceByTime(this.pickedDate.date);
    //this.GetDataForChart();
  }
  //Function for Process-flow --------------------------------------------------------------------------------------------------
  InitialData() {
    this.chartYearModelSelected = this.getCurrentYear();
    this.chartyears = this.initialYears();
    this.initialChartColor();
    this.inititalChartOther();
  }
  public getForeignMarketPriceByTime(time: Date) {
    this.marketService.GetForeignMarket(_moment(time).format('DD/MM/YYYY')).subscribe(
      allrecords => {
        console.log(allrecords)
        allrecords.data.forEach(row => {
          row.ngay_cap_nhat = _moment(row.ngay_cap_nhat).format('DD/MM/YYYY')
        });
        this.dataSource = new MatTableDataSource<ForeignMarketModel>(allrecords.data);
        if (this.dataSource.data.length == 0) {
          this._noData = true;
        } else {
          this._noData = false;
        }
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
  //Event for HTML -------------------------------------------------------------------------------------------------------------
  //Event for "Năm xem giá cả"
  public changeYear() {
    console.log("changeYear");
  }
  // Evnet for "Ngày cập nhật giá"
  public getPriceChange(param: any) {
    this.getForeignMarketPriceByTime(param._d);
  }

  //Event for "Lọc dữ liệu"
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  //Event for  "Xuất excel"
  public exportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }
  //Function EXTENTION-------------------------------------------------------------------------------------------------------------
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
  public getMonthAndYear(time: string) {
    //"20200515150503"
    let year = time.substr(0, 4);
    let month = time.substr(5, 2);
    let day = time.substr(8, 2);
    let result = day + "/" + month + "/" + year;
    return result as string;
  }
  //FUNCTION FOR CHART -----------------------------------------------------------------------------------------------------
  //Initalize Color for chart line
  public initialChartColor() {
    this._mainChartColours = [
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
    this._mainChartOptions = {
      tooltips: {
        scaleShowValues: true,
        enabled: false,
        // custom: CustomTooltips,
        intersect: true,
        mode: 'index',
        position: 'nearest',
        callbacks: {
          labelColor: function (tooltipItem, chart) {
            return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          gridLines: {
            drawOnChartArea: false,
          },
          ticks: {
            callback: function (value: any) {
              return value
            }
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5,
            stepSize: Math.ceil(this._maxSizeChart / 5),
            max: this._maxSizeChart
          }
        }]
      },
      elements: {
        line: {
          borderWidth: 2
        },
        point: {
          radius: 2,
          borderWidth: 2,
          hitRadius: 5,
          hoverRadius: 4,
          hoverBorderWidth: 6,
        }
      },
      legend: {
        display: false
      }
    };
  }
  //Initialize Other
  public inititalChartOther() {
    this._mainChartType = 'line';
    this.timeDomesticPrice = _moment(this.pickedDate.date).format('DD/MM/YYYY');
    this._theYear = 2020;
    this._mainChartLegend = false;
  }
  public getDataForChart() {
    console.log("+ Function: GetDataForChart()");
    let chartData1: Array<number> = new Array<number>();
    let chartName1: string;
    let productId: number;
    let periodTime: number;
    let chartData2: Array<number> = new Array<number>();
    let chartName2: string;
    let chartData3: Array<number> = new Array<number>();
    let chartName3: string;
    let chartData4: Array<number> = new Array<number>();
    let chartName4: string;
    productId = 2;
    periodTime = 10;
    this.marketService.GetPriceByProductId(productId, periodTime).subscribe(
      allrecords => {
        allrecords.data.forEach(row => {
          if (chartName1 != '') chartName1 = row.ten_san_pham;
          this._mainChartLabels.unshift(this.getMonthAndYear(row.ngay_cap_nhat));
          chartData1.unshift(row.gia);
          if (row.gia > this._maxSizeChart) this._maxSizeChart = row.gia;
        });
        productId = 3;
        periodTime = 10;
        this.marketService.GetPriceByProductId(productId, periodTime).subscribe(
          allrecords => {
            allrecords.data.forEach(row => {
              if (chartName2 != '') chartName2 = row.ten_san_pham;
              chartData2.unshift(row.gia);
              if (row.gia > this._maxSizeChart) this._maxSizeChart = row.gia;
            });
            productId = 4;
            periodTime = 10;
            this.marketService.GetPriceByProductId(productId, periodTime).subscribe(
              allrecords => {
                allrecords.data.forEach(row => {
                  if (chartName3 != '') chartName3 = row.ten_san_pham;
                  chartData3.unshift(row.gia);
                  if (row.gia > this._maxSizeChart) this._maxSizeChart = row.gia;
                });
                productId = 5;
                periodTime = 10;
                this.marketService.GetPriceByProductId(productId, periodTime).subscribe(
                  allrecords => {
                    allrecords.data.forEach(row => {
                      if (chartName4 != '') chartName4 = row.ten_san_pham;
                      chartData4.unshift(row.gia);
                      if (row.gia > this._maxSizeChart) this._maxSizeChart = row.gia;
                    });
                    this._mainChartData = [
                      {
                        data: chartData1,
                        label: chartName1
                      },
                      {

                        data: chartData2,
                        label: chartName2
                      },
                      {
                        data: chartData3,
                        label: chartName3
                      },
                      {
                        data: chartData4,
                        label: chartName4
                      }
                    ];
                    this.initialChartOption();
                  },
                  //error => this.errorMessage = <any>error
                );
              },
              //error => this.errorMessage = <any>error
            );
          },
          //error => this.errorMessage = <any>error
        );
      },
      //error => this.errorMessage = <any>error
    );
  };
}
