//import library
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material';
import { promise } from 'protractor';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
//Import Model
import { DomesticPriceModel, ProductValueModel } from '../../../../_models/APIModel/domestic-market.model';
import { SAVE } from 'src/app/_enums/save.enum';
//Import Services
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { MarketService } from '../../../../_services/APIService/market.service';
//Import Component
import { CompanyTopPopup } from '../company-top-popup/company-top-popup.component';

//Moment
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

export class DomesticProductComponent implements OnInit {

  //Declare variable for HTML&TS
  public timeDomesticPrice: string;
  public displayedColumns: string[] = ['index', 'ten_san_pham', 'san_luong', 'tri_gia', 'top_san_xuat'];
  public dataSource: MatTableDataSource<ProductValueModel>;
  public dataGet: Array<any>;
  public chartYearModelSelected: number;
  public chartyears: Array<number> = [];
  public date = new FormControl(_moment());
  //Derclare variable for TS  
  public mainChartLegend: boolean;
  public mainChartType: string = 'line';
  public mainChartColours: Array<any> = new Array<any>();
  public mainChartOptions: any;
  public mainChartLabels: Array<any> = new Array<any>();
  public mainChartData: Array<any> = new Array<any>();
  public maxSizeChart: number;
  public theYear: number = 0;
  public theMonth: number = 0;
  public mainChartElements = 10;
  public chartYearModel: number;

  //ViewChild
  @ViewChild('TABLE', { static: false }) table: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public marketService: MarketService,
    public excelService: ExcelService, 
    public router: Router,
    public dialog: MatDialog) {

    //this.initialData();
  }

  ngOnInit() {
    this.chartYearModelSelected = this.getCurrentYear();
    this.theYear = this.getCurrentYear();
    this.theMonth = (this.getCurrentMonth() - 1) == 0? 12 : this.getCurrentMonth() - 1;
    this.chartyears = this.initialYears();
    this.date.setValue(new Date(this.theYear, this.theMonth -1));
    this.timeDomesticPrice = this.theMonth + "/" + this.theYear;
    this.date = new FormControl(_moment(this.theYear.toString() + "/" + this.theMonth.toString()));
    this.getDomesticMarketProduct(this.theMonth, this.theYear);
    //this.GetDataForChart();
  }

  //Function for PROCESS-FLOW----------------------------------------------------------------------------------
  //Get domestic market price
  public getDomesticMarketProduct(month: number, year: number) {
    this.marketService.GetProductValue(month, year).subscribe(
      allrecords => {
        console.log(allrecords)
        this.dataSource = new MatTableDataSource<ProductValueModel>(allrecords.data);
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

  sumSL() {
    let sumSL: number = 0;
    if (this.dataSource)
      for (let row of this.dataSource.data) {
        if (row.id != 0) sumSL += row.san_luong;
      }
    return sumSL;
  }

  sumTG() {
    let sumTG: number = 0;
    if (this.dataSource)
      for (let row of this.dataSource.data) {
        if (row.id != 0) sumTG += row.tri_gia;
      }
    return sumTG;
  }
  //Function for HTML-EVENT----------------------------------------------------------------------------------
  //Event "Lọc dữ liệu"
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  //Event "Mở top doanh nghiệp"
  public openCompanyTopPopup(data: any) {
    const dialogRef = this.dialog.open(CompanyTopPopup, {
      data: {
        message: 'Dữ liệu top doanh nghiệp sản xuất.',
        buttonText: {
          ok: 'Lưu',
          cancel: 'Hủy bỏ'
        },
        toptop: data,
        typeOfSave: SAVE.PRODUCT,
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
      }
    });
  }
  //Event "Change year"
  public changeYear() {
    console.log("changeYear");
  }
  //Event "Chọn năm"
  public chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.theYear = normalizedYear.year();
    return this.theYear as number
  }
  //Event "Chọn tháng"
  public chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.theMonth = normalizedMonth.month() + 1;
    datepicker.close();
    this.getDomesticMarketProduct(this.theMonth, this.theYear);
    return this.theMonth as number
  }
  //Add event
  public addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    let time = event.value;
    let year = time.getFullYear();
    let month = time.getMonth();
    this.marketService.GetExportedValue(month, year);
  }
  //Event "Xuất excel"
  public exportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }
  //Event "Top doanh nghiệp"
  public openTopProduct(productId: string) {
    console.log("Top :" + productId);
    let url: string = "/market/company?action=&product=" + productId + '&month=' + this.theMonth + '&year=' + this.theYear;
    this.router.navigate(['/market/company'], {
      queryParams: {
        action: 'product', product: productId, month: this.theMonth,
        year: this.theYear
      }
    });
  }
  //Function for EXTENTION----------------------------------------------------------------------------------
  public getCurrentMonth(): number {
    var currentDate = new Date();
    return currentDate.getMonth() + 1;
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
  public getMonthAndYear(time: string) {
    //"20200515150503"
    let year = time.substr(0, 4);
    let month = time.substr(4, 2);
    let day = time.substr(6, 2);
    let result = day + "/" + month + "/" + year;
    return result as string;
  }
  //Function for HTML CHART ------------------------------------------------------------------------------
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
    this.mainChartOptions = {
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
            stepSize: Math.ceil(this.maxSizeChart / 5),
            max: this.maxSizeChart
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
    this.mainChartType = 'line';
    this.mainChartLegend = false;
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
          this.mainChartLabels.unshift(this.getMonthAndYear(row.ngay_cap_nhat));
          chartData1.unshift(row.gia);
          if (row.gia > this.maxSizeChart) this.maxSizeChart = row.gia;
        });
        console.log("chartData1: ", chartData1);
        productId = 3;
        periodTime = 10;
        this.marketService.GetPriceByProductId(productId, periodTime).subscribe(
          allrecords => {
            allrecords.data.forEach(row => {
              if (chartName2 != '') chartName2 = row.ten_san_pham;
              chartData2.unshift(row.gia);
              if (row.gia > this.maxSizeChart) this.maxSizeChart = row.gia;
            });
            console.log("chartData2: ", chartData2);
            productId = 4;
            periodTime = 10;
            this.marketService.GetPriceByProductId(productId, periodTime).subscribe(
              allrecords => {
                allrecords.data.forEach(row => {
                  if (chartName3 != '') chartName3 = row.ten_san_pham;
                  chartData3.unshift(row.gia);
                  if (row.gia > this.maxSizeChart) this.maxSizeChart = row.gia;
                });
                console.log("chartData3: ", chartData3);
                productId = 5;
                periodTime = 10;
                this.marketService.GetPriceByProductId(productId, periodTime).subscribe(
                  allrecords => {
                    allrecords.data.forEach(row => {
                      if (chartName4 != '') chartName4 = row.ten_san_pham;
                      chartData4.unshift(row.gia);
                      if (row.gia > this.maxSizeChart) this.maxSizeChart = row.gia;
                    });
                    console.log("chartData4: ", chartData4);
                    this.mainChartData = [
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
                    console.log("mainChartData: ", this.mainChartData);
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
