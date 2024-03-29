import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { ReportService } from '../../../../_services/APIService/report.service';

import { ReportAttribute, ReportDatarow, ReportIndicator, ReportOject } from '../../../../_models/APIModel/report.model';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from '@angular/common';
import { MatTableFilter } from 'mat-table-filter';
import { element } from 'protractor';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-select-report',
  templateUrl: 'select-report.component.html',
  styleUrls: ['../../report_layout.scss'],
})

export class ViewSelectReportComponent implements OnInit {

  title: string = "Danh sách báo cáo";

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
  selectedYear: number;
  years: number[] = [];
  quarters: number[] = [null, 1, 2, 3, 4];
  org_id: number = 0;
  orgarnizations: string[] = ['', 'Sở Công thương', /**'Văn Phòng Sở Công Thương', 'Thanh Tra Sở Công Thương',**/ 'Phòng Quản Lý Công Nghiệp', 'Phòng Quản Lý Thương Mại', 'Phòng Quản Lý Năng Lượng'];
  periods: Object[];
  selectedPeriod: number = 0;
  submit_type: number = 0;

  constructor(
    public reportSevice: ReportService,
    public router: Router,
    public confirmationDialogService: ConfirmationDialogService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.filterObject = new ReportOject();
    this.tempObject = new ReportOject();
    this.route.queryParams.subscribe((params) => {
      this.tempObject.submit_type = Number.parseInt(params['submit_type'] ? params['submit_type'] : 1);
    });
    this.changeReportType();
    this.filterType = MatTableFilter.ANYWHERE;

    this.years = this.InitialYears();
    this.selectedYear = this.GetCurrentYear();
    let data: any = JSON.parse(localStorage.getItem('currentUser'));
    this.org_id = parseInt(data.org_id);
    this.GetViewAllReport();
  }
  GetViewAllReport() {
    this.reportSevice.GetViewAllReport().subscribe(response => {
      response.data.forEach(element => {
        element.time_id_text = this.TimeIDToText(element.time_id.toString());
      })
      this.dataSource = null;
      this.dataSource = new MatTableDataSource<ReportOject>(response.data.filter(x => x.submit_type == this.tempObject.submit_type)
        .filter(x => this.org_id != 1 ? x.org_id == this.org_id : x));
      this.dataSource.paginator = this.paginator;
      if (this.paginator) {
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
      }
    })
  }

  ApproveReport(obj: ReportOject) {
    this.reportSevice.ApproveReport(obj.obj_id, obj.org_id, obj.time_id).subscribe(
      response => {
        this.GetViewAllReport();
      }
    );
  }

  DeclineReport(obj: ReportOject) {
    this.reportSevice.DeclineReport(obj.obj_id, obj.org_id, obj.time_id).subscribe(
      response => {
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
    let nextYear = currentDate.getFullYear() - 1;
    for (let index = 0; index < 5; index++) {
      returnYear.push(nextYear + index);
    }
    return returnYear;
  }

  click() {
    this.filterObject = { ...this.tempObject };
  }

  changeReportType() {
    switch (this.tempObject.submit_type) {
      case 1: this.periods = this.months;
        this.tempObject.submit_type_name = 'Báo cáo tháng';
        this.title = "Danh sách báo cáo tháng";
        break;
      case 2: this.periods = this.quarters;
        this.tempObject.submit_type_name = 'Báo cáo quý';
        this.title = "Danh sách báo cáo quý";
        break;
      case 4: this.periods = null;
        this.tempObject.submit_type_name = 'Báo cáo 6 tháng';
        this.title = "Danh sách báo cáo 6 tháng";
        break;
      case 3: this.periods = null;
        this.tempObject.submit_type_name = 'Báo cáo năm';
        this.title = "Danh sách báo cáo năm";
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
  }

  OpenDetailObject(obj: ReportOject) {
    let url = '/#/report/view?obj_id=' + obj.obj_id + '&org_id=' + obj.org_id + '&time_id=' + obj.time_id
    window.open(url, "_blank");
  }

  OpenDialog(obj: ReportOject) {
    this.confirmationDialogService.confirm('Xác nhận', 'Bạn muốn phê duyệt hay từ chối báo cáo này?', 'Phê duyệt', 'Từ chối')
      .then(confirm => {
        if (confirm) {
          this.ApproveReport(obj);
        }
        else {
          this.DeclineReport(obj);
        }
      })
      .catch(() => console.log('Hủy không thao tác'));
  }
}
