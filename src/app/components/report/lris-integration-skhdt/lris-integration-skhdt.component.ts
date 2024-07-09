import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatAccordion, MatPaginator } from "@angular/material";
import { LinkModel } from "src/app/_models/link.model";
import { BreadCrumService } from "src/app/_services/injectable-service/breadcrums.service";
import { InformationService } from 'src/app/shared/information/information.service';

import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
import { MatTableDataSource } from '@angular/material/table';

import { SCTService } from 'src/app/_services/APIService/sct.service';

import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { bcskhdt_thang } from "src/app/_models/APIModel/report.model";

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
  selector: 'app-lris-integration-skhdt',
  templateUrl: './lris-integration-skhdt.component.html',
  styleUrls: ['../report_layout.scss'],
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
export class LrisIntegrationSkhdtComponent implements OnInit {
  private _linkOutput: LinkModel = new LinkModel();

  private readonly LINK_DEFAULT: string = "/report/lris";
  private readonly TITLE_DEFAULT: string = "Báo cáo Kinh Tế Xã Hội";
  private readonly TEXT_DEFAULT: string = "Báo cáo Kinh Tế Xã Hội";

  @ViewChild("TABLE", { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public displayedColumns: string[] = [
    // 'index', 
    'idx',
    // 'indicator',
    'indicatorname',
    'indunit',
    'th_nam_truoc','kh_nam','th_thang_truoc','gc_th_thang_truoc','th_thang','gc_th_thang','luy_ke',
    'ck_th_thang','ck_gc_th_thang','ck_luy_ke',
    'ss_th_thang_sck','ss_th_thang_skh','ss_luy_ke_sck','ss_luy_ke_skh',
  ];

  dataSource: MatTableDataSource<bcskhdt_thang> = new MatTableDataSource();

  public date = new FormControl(_moment());
  public newdate = new FormControl(_moment());
  public theYear: number = parseInt(_moment().format('YYYY'));
  public theMonth: number = parseInt(_moment().format('MM'));
  public stringmonth: string
  public time: string
  public timechange: number = parseInt(_moment().format('YYYYMM'));
  public month: string

  private exportRecord = {};
  private importRecord = {};
  private exportIndicator = 'CTDHTT_04';
  private importIndicator = 'CTDHTT_05';

  access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiaW5ocGh1b2NAMTIzIiwibmFtZSI6ImJpbmhwaHVvYy5zeW5jIiwiaWF0IjoxNTE2MjM5MDEyMywidGVuYW50X2lkIjozOX0.0Znt0dLSvETuB1KimtqrjZQlT26N9EppaJnIQaSBXB0";

  selectedReport = 0;
  reportList = [{
    id: 0,
    name: 'Báo cáo các chỉ tiêu kinh tế xã hội SKHDT | Thực hiện Tháng'
  }]

  constructor(
    public sctService: SCTService,
    public _breadCrumService: BreadCrumService,
    public logger: InformationService,
    public confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit() {
    this.autoOpen()
    this.sendLinkToNext()
    this.getDataFromLris();
  }

  public sendLinkToNext() {
    this._linkOutput.link = this.LINK_DEFAULT;
    this._linkOutput.title = this.TITLE_DEFAULT;
    this._linkOutput.text = this.TEXT_DEFAULT;
    this._linkOutput.type = true;
    this._breadCrumService.sendLink(this._linkOutput);
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  getReportName() {
    let self = this;
    return this.reportList.find(x => x.id == self.selectedReport).name;
  }

  getDataFromSystem() {
    this.importRecord = { ...this.getDefaultValues() };
    this.exportRecord = { ...this.getDefaultValues() };
    this.getImportData(this.timechange);
    this.getExportData(this.timechange);
    // this.getPlanningData();
  }

  getCurrentMonthData() {
    let payload = {
      "func": "getReport",
      "data": {
        "header": {
          "code": "SKHVDT_KTXH_THT",
          "org": "70.SO_CT",
          "period": this.timechange.toString()
        }
      },
      "access_token": this.access_token
    }
    this.sctService.GetLrisReportData(payload).subscribe((result) => {
      if (result) {
        if (result['err_code'] == "0") {
          let data = result['data']['data'];
          let bcdata = new Array<bcskhdt_thang>();
          data.forEach(s => {
            let object = {
              idx: s.idx,
              indicator: s.indicator,
              indicatorname: s.indicatorname,
              indunit: s.indunit,
              th_nam_truoc: s.value[0],
              kh_nam: s.value[1],
              th_thang_truoc: s.value[2],
              gc_th_thang_truoc: s.value[3],
              th_thang: s.value[4],
              gc_th_thang: s.value[5],
              luy_ke: s.value[6],
              ck_th_thang: s.value[7],
              ck_gc_th_thang: s.value[8],
              ck_luy_ke: s.value[9],
              ss_th_thang_sck: s.value[10],
              ss_th_thang_skh: s.value[11],
              ss_luy_ke_sck: s.value[12],
              ss_luy_ke_skh: s.value[13],
            }
            bcdata.push(object)
          });
          console.log(bcdata)
          this.dataSource = new MatTableDataSource<bcskhdt_thang>(bcdata);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.itemsPerPageLabel = 'Số hàng';
          this.paginator._intl.firstPageLabel = "Trang Đầu";
          this.paginator._intl.lastPageLabel = "Trang Cuối";
          this.paginator._intl.previousPageLabel = "Trang Trước";
          this.paginator._intl.nextPageLabel = "Trang Tiếp";
        } else {
          this.logger.msgError(result['err_msg']);
        }
      } else {
        this.logger.msgError("Lỗi khi lấy dữ liệu từ phần mềm Kinh tế xã hội");
      }
    });
  }

  getPlanningData() {
    let payload = {
      "func": "getReport",
      "data": {
        "header": {
          "code": "BPC_SXKD_KHN",
          "org": "70.SO_CT",
          "period": this.theYear.toString()
        }
      },
      "access_token": this.access_token
    }
    this.sctService.GetLrisReportData(payload).subscribe((result) => {
      if (result) {
        let datas = result['data']['data'];
        let filterImportRecord = datas.find(x => x.indicator == 'KHDT_SXKD_146');
        let filterExportRecord = datas.find(x => x.indicator == 'KHDT_SXKD_130');
        this.importRecord['ke_hoach_nam'] = filterImportRecord ? filterImportRecord['value'][1] : 0;
        this.exportRecord['ke_hoach_nam'] = filterExportRecord ? filterExportRecord['value'][1] : 0;
      } else {
        this.logger.msgError("Lỗi khi lấy dữ liệu từ phần mềm Kinh tế xã hội");
      }
    });
  }

  getDataFromLris() {
    this.importRecord = { ...this.getDefaultValues() };
    this.exportRecord = { ...this.getDefaultValues() };
    this.getCurrentMonthData();
    // this.getPlanningData();
  }

  getImportData(time_id: number) {
    this.sctService.GetDanhSachNhapKhau(time_id).subscribe((result) => {
      this.importRecord['thuc_hien_thang'] = result.data[0] && result.data[0].length ? result.data[0][0].tri_gia_thang || 0 : 0;
    });
  }

  getExportData(time_id: number) {
    this.sctService.GetDanhSachXuatKhau(time_id).subscribe((result) => {
      this.exportRecord['thuc_hien_thang'] = result.data[0] && result.data[0].length ? result.data[0][0].tri_gia_thang || 0 : 0;
    });
  }

  getDefaultValues() {
    return {
      'thuc_hien_thang': 0,
      'thuc_hien_thang_truoc': 0,
      'luy_ke': 0,
      'ke_hoach_nam': 0,
      'thuc_hien_thang_cung_ky': 0,
      'luy_ke_cung_ky': 0,
      'thuc_hien_thang_so_voi_cung_ky': 0,
      'thuc_hien_so_voi_ke_hoach': 0,
      'luy_ke_so_voi_cung_ky': 0,
      'luy_ke_so_voi_ke_hoach': 0,
    }
  }

  sendData() {
    let payload = {
      "func": "sndData",
      "data": {
        "Header": {
          "Code": "CTDHTT_THANG",
          "Org": "70.SO_CT",
          "Period": this.timechange.toString()
        },
        "Data": [{
          "Indicator": this.exportIndicator,
          "Value": [
            this.exportRecord['thuc_hien_thang'] || 0,
            this.exportRecord['thuc_hien_thang_truoc'] || 0,
            this.exportRecord['luy_ke'] || 0,
            this.exportRecord['ke_hoach_nam'] || 0,
            this.exportRecord['thuc_hien_thang_cung_ky'] || 0,
            this.exportRecord['luy_ke_cung_ky'] || 0,
            this.exportRecord['thuc_hien_thang_so_voi_cung_ky'] || 0,
            this.exportRecord['thuc_hien_so_voi_ke_hoach'] || 0,
            this.exportRecord['luy_ke_so_voi_cung_ky'] || 0,
            this.exportRecord['luy_ke_so_voi_ke_hoach'] || 0,
          ]
        },
        {
          "Indicator": this.importIndicator,
          "Value": [
            this.importRecord['thuc_hien_thang'] || 0,
            this.importRecord['thuc_hien_thang_truoc'] || 0,
            this.importRecord['luy_ke'] || 0,
            this.importRecord['ke_hoach_nam'] || 0,
            this.importRecord['thuc_hien_thang_cung_ky'] || 0,
            this.importRecord['luy_ke_cung_ky'] || 0,
            this.importRecord['thuc_hien_thang_so_voi_cung_ky'] || 0,
            this.importRecord['thuc_hien_so_voi_ke_hoach'] || 0,
            this.importRecord['luy_ke_so_voi_cung_ky'] || 0,
            this.importRecord['luy_ke_so_voi_ke_hoach'] || 0,
          ]
        }
        ]
      },
      "access_token": this.access_token
    }
    this.sctService.PostLrisReportData(payload).subscribe((result) => {
      if (result) {
        this.logger.msgSuccess("Gửi dữ liệu lên phần mềm Kinh tế xã hội thành công!");
      } else {
        this.logger.msgError("Lỗi khi gửi dữ liệu tới phần mềm Kinh tế xã hội");
      }
    });
  }

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
    this.timechange = parseInt(this.time)

    this.getDataFromLris()

    this.month = this.time.substring(4, 6)
  }
}
