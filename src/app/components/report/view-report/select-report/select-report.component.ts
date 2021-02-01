import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { ReportService } from '../../../../_services/APIService/report.service';

import { ReportAttribute, ReportDatarow, ReportIndicator, ReportOject } from '../../../../_models/APIModel/report.model';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from '@angular/common';
import { MatTableFilter } from 'mat-table-filter';
import { element } from 'protractor';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-select-report',
  templateUrl: 'select-report.component.html',
  styleUrls: ['select-report.component.scss'],
})

export class ViewSelectReportComponent implements OnInit {

  displayedColumns: string[] = ['index', "obj_code", "obj_name", "org_name", "submit_type", "status_name", "time_id", "edit"];
  dataSource: MatTableDataSource<any>;
  tempObject: ReportOject;
  filterObject: ReportOject;
  filterType: MatTableFilter;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild('reportPaginators', { static: true }) paginator: MatPaginator;
  public readonly DEFAULT_PERIOD = "Tháng";
  public readonly format = 'dd/MM/yyyy';
  public readonly locale = 'en-US';
  reportTypes = [{ ma_so: null, noi_dung: '' }, { ma_so: 1, noi_dung: 'Tháng' }, { ma_so: 2, noi_dung: 'Quý' }, { ma_so: 3, noi_dung: '6 Tháng' }, { ma_so: 4, noi_dung: 'Năm' }];
  months: number[] = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  selectedYear: number = 2020;
  years: number[] = [2020, 2019, 2018];
  quarters: number[] = [null, 1, 2, 3, 4];
  halfs: number[] = [1];
  org_id: number = 0;
  orgarnizations: string[] = ['', 'Sở Công thương', 'Văn Phòng Sở Công Thương', 'Thanh Tra Sở Công Thương', 'Phòng Quản Lý Công Nghiệp', 'Phòng Quản Lý Thương Mại', 'Phòng Quản Lý Năng Lượng'];
  periods: Object[];
  selectedPeriod: number = 0;

  constructor(
    public reportSevice: ReportService,
    public router: Router,
    public confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit() {
    this.filterObject = new ReportOject();
    this.tempObject = new ReportOject();
    this.filterType = MatTableFilter.ANYWHERE;

    let data: any = JSON.parse(localStorage.getItem('currentUser'));
    this.org_id = parseInt(data.org_id);
    this.GetViewAllReport();
  }
  GetViewAllReport() {
    console.log("+ Function GetAllReport()");
    this.reportSevice.GetViewAllReport().subscribe(response => {
      response.data.forEach(element => {
        element.time_id_text = this.TimeIDToText(element.time_id.toString());
      })
      this.dataSource = null;
      this.dataSource = new MatTableDataSource<ReportOject>(response.data);
      this.dataSource.paginator = this.paginator;
      console.log("Data mới");
      console.log(this.dataSource);
        if (this.paginator) {
          this.paginator._intl.itemsPerPageLabel = 'Số hàng';
          this.paginator._intl.firstPageLabel = "Trang Đầu";
          this.paginator._intl.lastPageLabel = "Trang Cuối";
          this.paginator._intl.previousPageLabel = "Trang Trước";
          this.paginator._intl.nextPageLabel = "Trang Tiếp";
        }
    })
  }

  ApproveReport(obj : ReportOject){
    console.log("+ Function ApproveReport(obj)");
    this.reportSevice.ApproveReport(obj.obj_id, obj.org_id, obj.time_id).subscribe(
      response =>{
        console.log(response);
        this.GetViewAllReport();
      }
    );
  }

  DeclineReport(obj : ReportOject){
    console.log("+ Function DeclineReport(obj)");
    this.reportSevice.DeclineReport(obj.obj_id, obj.org_id, obj.time_id).subscribe(
      response =>{
        console.log(response);
        this.GetViewAllReport();
      }
    );
  }

  TimeIDToText(time_id: string) {
    let result: string;
    switch (time_id.length) {
      case 4: result = 'Năm ' + time_id;
        break;
      case 5: result = 'Quý ' + time_id.substr(4) + '/' + time_id.substr(0, 4);
        break;
      case 6: result = 'Tháng ' + time_id.substr(4) + '/' + time_id.substr(0, 4);
        break;
      default:
    }
    return result;
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

  click() {
    this.filterObject = { ...this.tempObject };
    console.log(this.filterObject);
    console.log(this.dataSource);
  }

  changeReportType() {
    switch (this.tempObject.submit_type) {
      case 1: this.periods = this.months;
        this.tempObject.submit_type_name = 'Báo cáo tháng';
        break;
      case 2: this.periods = this.quarters;
        this.tempObject.submit_type_name = 'Báo cáo quý';
        break;
      case 3: this.periods = this.halfs;
        this.tempObject.submit_type_name = 'Báo cáo 6 tháng';
        break;
      case 4: this.periods = this.halfs;
        this.tempObject.submit_type_name = 'Báo cáo năm';
        break;
      default: this.periods = [];
        this.tempObject.submit_type_name = '';
    }
    this.tempObject.time_id = null;
    this.selectedPeriod = null;
  }

  changePeriod() {
    switch (this.tempObject.submit_type) {
      case 1: this.tempObject.time_id = this.selectedYear.toString() + ((this.selectedPeriod < 10) ? '0' : '') + this.selectedPeriod.toString();
        break;
      case 2: this.tempObject.time_id = this.selectedYear.toString() + this.selectedPeriod.toString();
        break;
      default: this.tempObject.time_id = this.selectedYear.toString();
    }
    console.log(this.tempObject.time_id);
  }

  OpenDetailObject(obj: ReportOject){
    //window.open(this.router.url, '_blank');
    const url = this.router.serializeUrl(
      this.router.createUrlTree([encodeURI('#') + '/report/view'], { queryParams: { obj_id: obj.obj_id, org_id: this.org_id, time_id: obj.time_id } })
    );
    window.open(url.replace('%23','#'), "_blank");
  }

  OpenDialog(obj:ReportOject){
    this.confirmationDialogService.confirm('Xác nhận', 'Bạn muốn phê duyệt hay từ chối báo cáo này?', 'Phê duyệt','Từ chối')
    .then(confirm => {
      if (confirm)
      {
        console.log('Phê duyệt báo cáo');
        this.ApproveReport(obj);
      }
      else{
        console.log('Từ chối báo cáo');
        this.DeclineReport(obj);
      }
      console.log("Cập nhật lại data");
    })
    .catch(() => console.log('Hủy không thao tác'));
  }
}
