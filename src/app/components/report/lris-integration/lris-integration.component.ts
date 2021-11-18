import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {MatAccordion,MatPaginator} from "@angular/material";
import { LinkModel } from "src/app/_models/link.model";
import { BreadCrumService } from "src/app/_services/injectable-service/breadcrums.service";
import { InformationService } from 'src/app/shared/information/information.service';

import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';

import { SCTService } from 'src/app/_services/APIService/sct.service';

import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

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
  selector: 'app-lris-integration',
  templateUrl: './lris-integration.component.html',
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
export class LrisIntegrationComponent implements OnInit {
  private _linkOutput: LinkModel = new LinkModel();

  private readonly LINK_DEFAULT: string ="/report/lris";
  private readonly TITLE_DEFAULT: string = "Báo cáo Kinh Tế Xã Hội";
  private readonly TEXT_DEFAULT: string = "Báo cáo Kinh Tế Xã Hội";

  @ViewChild("TABLE", { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;

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
    name: 'Cung cấp thông tin phục vụ chỉ đạo, điều hành của Chính phủ, Thủ tướng Chính phủ (Tháng) | TỈNH BÌNH PHƯỚC'
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
      this.importRecord = {...this.getDefaultValues()};
      this.exportRecord = {...this.getDefaultValues()};
      this.getImportData(this.timechange);
      this.getExportData(this.timechange);
      this.getPlanningData();
  }

  getCurrentMonthData() {
    let payload = {
      "func": "getReport",
      "data": {
          "header": {
              "code": "CTDHTT_THANG",
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
          for (let record of data) {
            if (record['indicator'] == this.exportIndicator) {
              let value = record['value'];
              this.exportRecord = {...this.exportRecord, ...{
                'thuc_hien_thang': value[0],
                'thuc_hien_thang_truoc': value[1],
                'luy_ke': value[2],
                'thuc_hien_thang_cung_ky': value[4],
                'luy_ke_cung_ky': value[5],
                'thuc_hien_thang_so_voi_cung_ky ': value[6],
                'thuc_hien_so_voi_ke_hoach': value[7],
                'luy_ke_so_voi_cung_ky': value[8],
                'luy_ke_so_voi_ke_hoach': value[9],
              }}
            }
            if (record['indicator'] == this.importIndicator) {
              let value = record['value'];
              this.importRecord = {...this.importRecord, ...{
                'thuc_hien_thang': value[0],
                'thuc_hien_thang_truoc': value[1],
                'luy_ke': value[2],
                'thuc_hien_thang_cung_ky': value[4],
                'luy_ke_cung_ky': value[5],
                'thuc_hien_thang_so_voi_cung_ky ': value[6],
                'thuc_hien_so_voi_ke_hoach': value[7],
                'luy_ke_so_voi_cung_ky': value[8],
                'luy_ke_so_voi_ke_hoach': value[9],
              }}
            }
          }
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
    this.importRecord = {...this.getDefaultValues()};
    this.exportRecord = {...this.getDefaultValues()};
    this.getCurrentMonthData();
    this.getPlanningData();
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
            ]}, 
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
