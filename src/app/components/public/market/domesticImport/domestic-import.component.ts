//import library
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material';
//Import model
import { DomesticPriceModel, ImportMarketModel } from '../../../../_models/APIModel/domestic-market.model';
import { SAVE } from 'src/app/_enums/save.enum';
//Import Service
import { MarketService } from '../../../../_services/APIService/market.service';
//Import Component
import { CompanyTopPopup } from '../company-top-popup/company-top-popup.component';

//Moment
import _moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
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
  selector: 'app-domestic-import',
  templateUrl: 'domestic-import.component.html',
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

export class DomesticImportComponent implements OnInit {
  //Declare constant

  //Declare variable for HTML&TS
  public timeDomesticPrice: string;
  public displayedColumns: string[] = ['index', 'ten_san_pham', 'san_luong', 'tri_gia', 'san_luong_ct', 'tri_gia_ct', 'top_nhap_khau'];
  public dataSource: MatTableDataSource<ImportMarketModel>;
  public dataGet: Array<any>;
  public chartYearModelSelected: number;
  public date = new FormControl(_moment());
  public chartyears: Array<number> = [];
  public mainChartData: Array<any> = new Array<any>();
  //Declare variable for ONLY TS
  public mainChartLegend: boolean;
  public mainChartType: string = 'line';
  public mainChartColours: Array<any> = new Array<any>();
  public mainChartOptions: any;
  public mainChartLabels: Array<any> = new Array<any>();
  public maxSizeChart: number;
  public theYear: number;
  public theMonth: number = 7;
  public mainChartElements = 10;
  public chartYearModel: number;
  //Viewchild
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;


  constructor(public marketService: MarketService,
    public router: Router,
    public dialog: MatDialog) {
    //this.initialData();
  }
  ngOnInit() {
    
    this.chartYearModelSelected = this.getCurrentYear();
    this.chartyears = this.initialYears();
    this.theMonth = (this.getCurrentMonth() - 1) == 0? 12 : this.getCurrentMonth() - 1;
    this.theYear = this.getCurrentYear();
    this.timeDomesticPrice = this.theMonth + "/" + this.theYear;    
    this.date = new FormControl(_moment(this.theYear.toString() + "/" + this.theMonth.toString()));
    this.getDomesticMarketImport(this.theMonth, this.theYear);
  }
  //Function for PROCESS-FLOW -------------------------------------------------------------------------------------------------------
  public getDomesticMarketImport(month: number, year: number) {
    this.marketService.GetImportedValue(month, year).subscribe(
      allrecords => {
        allrecords.data.forEach(element => {
          element.san_luong = element.san_luong || 0;
          element.tri_gia = element.tri_gia || 0;
          element.san_luong_ct = element.san_luong_ct || 0;
          element.tri_gia_ct = element.tri_gia_ct || 0;
        });
        this.dataSource = new MatTableDataSource<ImportMarketModel>(allrecords.data);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
      },
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

  sumSLCT() {
    let sumSLCT: number = 0;
    if (this.dataSource)
      for (let row of this.dataSource.data) {
        if (row.id != 0) sumSLCT += row.san_luong_ct;
      }
    return sumSLCT;
  }

  sumTGCT() {
    let sumTGCT: number = 0;
    if (this.dataSource)
      for (let row of this.dataSource.data) {
        if (row.id != 0) sumTGCT += row.tri_gia_ct;
      }
    return sumTGCT;
  }

  //Function for HTML EVENT-------------------------------------------------------------------------------------------------------
  //Event "Lọc dữ liệu"
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

    this.getDomesticMarketImport(this.theMonth, this.theYear);
    return this.theMonth as number
  }
  //Add Event
  public addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    let time = event.value;
    let year = time.getFullYear();
    let month = time.getMonth();
    this.marketService.GetExportedValue(month, year);
  }
  //Event "Top doanh nghiệp"
  public openCompanyTopPopup(data: any) {
    const dialogRef = this.dialog.open(CompanyTopPopup, {
      data: {
        message: 'Dữ liệu top doanh nghiệp nhập khẩu.',
        buttonText: {
          ok: 'Lưu',
          cancel: 'Hủy bỏ'
        },
        toptop: data,
        typeOfSave: SAVE.IMPORT,
      }
    });
    console.log(data)
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
      }
    });
  }
  //Event "Top doanh nghiệp"
  public openTopExport(productId: string) {
    console.log("Top :" + productId);
    this.router.navigate(['/market/company'], {
      queryParams: {
        action: 'import', product: productId, month: this.theMonth,
        year: this.theYear
      }
    });
  }
  //Event "Xuất Excel"
  public exportTOExcel(filename: string, sheetname: string) {
    sheetname = sheetname.replace('/', '_');
    let excelFileName: string = filename + '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    /* save to file */
    XLSX.writeFile(wb, excelFileName);
  }
  //Event "Chọn năm"
  public changeYear() {
    console.log("changeYear");
  }
  //Function EXTENTION -------------------------------------------------------------------------------------------------------
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
    let year = time.substr(0, 4);
    let month = time.substr(4, 2);
    let day = time.substr(6, 2);
    let result = day + "/" + month + "/" + year;
    return result as string;
  }

  //Function for chart html
  public initialData() {
    this.initialChartColor();
    this.inititalChartOther();
  }
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
