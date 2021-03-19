import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../../../../_services/APIService/report.service';
import { ReportAttribute, ReportDatarow, ReportIndicator, ReportOject } from '../../../../_models/APIModel/report.model';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-fill-select-report',
  templateUrl: 'fill-select-report.component.html',
  styleUrls: ['../../report_layout.scss'],
})

export class FillSelectReportComponent implements OnInit {

  displayedColumns: string[] = ['index', "obj_code", "obj_name", "org_name", "start_date", "end_date", "edit"];
  dataSource: MatTableDataSource<ReportOject> = new MatTableDataSource();
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public readonly DEFAULT_PERIOD = "Tháng";
  public readonly format = 'dd/MM/yyyy';
  public readonly locale = 'en-US';
  selectedPeriod: string = "Tháng";
  periods = ['Tháng', 'Quý', '6 Tháng', 'Năm'];
  selectedobject: any;
  selectedMonth: number = 1;
  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  selectedYear: number = 2020;
  years: Array<number> = [];
  selectedQuarter: number = 0;
  quarters: Object[] = [{ ma_so: 1, ma_chu: "I" }, { ma_so: 2, ma_chu: "II" }, { ma_so: 3, ma_chu: "III" }, { ma_so: 4, ma_chu: "IV" }];
  halfs: number[] = [1];
  selectedHalf: number = 0;
  errorMessage: any;
  org_id: number = 0;
  orgarnizations: string[] = ['Sở Công thương']

  constructor(
    public reportSevice: ReportService,
    public router: Router,
  ) { }

  ngOnInit() {
    let data: any = JSON.parse(localStorage.getItem('currentUser'));
    this.org_id = parseInt(data.org_id);

    this.selectedPeriod = this.DEFAULT_PERIOD;
    this.selectedYear = this.GetCurrentYear();
    this.selectedMonth = this.GetCurrentMonth();
    this.GetReportByPeriod(this.selectedPeriod, this.selectedYear, this.selectedMonth);
    this.years = this.InitialYears();
  }

  GetReportByPeriod(period: string, year: number, detailPeriod: number) {
    switch (period) {
      case "Tháng":
        this.reportSevice.GetList_ReportMonth(detailPeriod, year, this.org_id).subscribe(
          allrecords => {
            this.dataSource = new MatTableDataSource<ReportOject>(allrecords.data);
            this.dataSource.data.forEach(element => element.end_date = formatDate(element.end_date, this.format, this.locale));
            this.dataSource.data.forEach(element => element.start_date = formatDate(element.start_date, this.format, this.locale));
            this.dataSource.paginator = this.paginator;
            if (this.paginator) {
              this.paginator._intl.itemsPerPageLabel = 'Số hàng';
              this.paginator._intl.firstPageLabel = "Trang Đầu";
              this.paginator._intl.lastPageLabel = "Trang Cuối";
              this.paginator._intl.previousPageLabel = "Trang Trước";
              this.paginator._intl.nextPageLabel = "Trang Tiếp";
            }
          },
          error => this.errorMessage = <any>error
        );
        break;
      case "Quý":
        this.reportSevice.GetList_ReportQuarter(detailPeriod, year, this.org_id).subscribe(
          allrecords => {
            this.dataSource = new MatTableDataSource<ReportOject>(allrecords.data);
            this.dataSource.data.forEach(element => element.end_date = formatDate(element.end_date, this.format, this.locale));
            this.dataSource.data.forEach(element => element.start_date = formatDate(element.start_date, this.format, this.locale));
            this.dataSource.paginator = this.paginator;
            if (this.paginator) {
              this.paginator._intl.itemsPerPageLabel = 'Số hàng';
              this.paginator._intl.firstPageLabel = "Trang Đầu";
              this.paginator._intl.lastPageLabel = "Trang Cuối";
              this.paginator._intl.previousPageLabel = "Trang Trước";
              this.paginator._intl.nextPageLabel = "Trang Tiếp";
            }
          },
          error => this.errorMessage = <any>error
        );
        break;
      case "Năm":
        this.reportSevice.GetList_ReportYear(year, this.org_id).subscribe(
          allrecords => {
            this.dataSource = new MatTableDataSource<ReportOject>(allrecords.data);
            this.dataSource.data.forEach(element => element.end_date = formatDate(element.end_date, this.format, this.locale));
            this.dataSource.data.forEach(element => element.start_date = formatDate(element.start_date, this.format, this.locale));
            this.dataSource.paginator = this.paginator;
            if (this.paginator) {
              this.paginator._intl.itemsPerPageLabel = 'Số hàng';
              this.paginator._intl.firstPageLabel = "Trang Đầu";
              this.paginator._intl.lastPageLabel = "Trang Cuối";
              this.paginator._intl.previousPageLabel = "Trang Trước";
              this.paginator._intl.nextPageLabel = "Trang Tiếp";
            }
          },
          error => this.errorMessage = <any>error
        );
        break;
      case "6 Tháng":
        this.reportSevice.GetList_ReportHalf(year, this.org_id).subscribe(
          allrecords => {
            this.dataSource = new MatTableDataSource<ReportOject>(allrecords.data);
            this.dataSource.data.forEach(element => element.end_date = formatDate(element.end_date, this.format, this.locale));
            this.dataSource.data.forEach(element => element.start_date = formatDate(element.start_date, this.format, this.locale));
            this.dataSource.paginator = this.paginator;
            if (this.paginator) {
              this.paginator._intl.itemsPerPageLabel = 'Số hàng';
              this.paginator._intl.firstPageLabel = "Trang Đầu";
              this.paginator._intl.lastPageLabel = "Trang Cuối";
              this.paginator._intl.previousPageLabel = "Trang Trước";
              this.paginator._intl.nextPageLabel = "Trang Tiếp";
            }
          },
          error => this.errorMessage = <any>error
        );
        break;
      default:
        return null;
    }
  }

  changePeriod() {
    this.selectedHalf = 0;
    this.selectedMonth = 0;
    this.selectedQuarter = 0;
    this.selectedYear = 0;
    switch (this.selectedPeriod) {
      case "Tháng":
        this.selectedMonth = this.GetCurrentMonth();
        this.selectedYear = this.GetCurrentYear();
        break;
      case "Quý":
        this.selectedQuarter = this.GetCurrentQuarter();
        this.selectedYear = this.GetCurrentYear();
        break;
      case "Năm":
        this.selectedYear = this.GetCurrentYear();
        break;
      case "6 Tháng":
        this.selectedYear = this.GetCurrentYear();
        this.selectedHalf = 1;
        break;
      default:
        break;
    }
  }

  OpenDetailObject(obj_id: number) {
    var time_id = "";
    switch (this.selectedPeriod) {
      case "Năm":
        time_id = this.selectedYear.toString();
        break;
      case "Tháng":
        let month = this.selectedMonth <= 9 ? '0' + this.selectedMonth : this.selectedMonth;
        time_id = this.selectedYear.toString() + month;
        break;
      case "Quý":
        time_id = this.selectedYear.toString() + this.selectedQuarter;
        break;
      case "6 Tháng":
        time_id = this.selectedYear.toString();
        break;
      default:
        break;
    }
    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(['/report/edit'], { queryParams: { obj_id: obj_id, org_id: this.org_id, time_id: time_id } })
    // );
    // window.open(url, "_blank");
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/report/edit'], { queryParams: { obj_id: obj_id, org_id: this.org_id, time_id: time_id } })
    );
    window.open(url, "_blank");
  }

  GetCurrentMonth() {
    var currentDate = new Date();
    return currentDate.getMonth() + 1;
  }
  GetCurrentYear() {
    var currentDate = new Date();
    return currentDate.getFullYear();
  }
  GetCurrentQuarter() {
    let currentDate = new Date();
    let month = currentDate.getMonth() + 1;
    return month <= 3 ? 1 : month <= 6 ? 2 : month <= 9 ? 3 : 4;
  }
  InitialYears() {
    let returnYear: Array<any> = [];
    let currentDate = new Date();
    let nextYear = currentDate.getFullYear() + 1;
    for (let index = 0; index < 11; index++) {
      returnYear.push(nextYear - index);
    }
    return returnYear;
  }
  filter() {
    if (this.selectedPeriod == 'Quý')
      this.GetReportByPeriod(this.selectedPeriod, this.selectedYear, this.selectedQuarter);
    if (this.selectedPeriod == '6 Tháng')
      this.GetReportByPeriod(this.selectedPeriod, this.selectedYear, this.selectedHalf);
    else
      this.GetReportByPeriod(this.selectedPeriod, this.selectedYear, this.selectedMonth);
  }
}
