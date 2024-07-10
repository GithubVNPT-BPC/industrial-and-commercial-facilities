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
import { BehaviorSubject } from "rxjs";

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
    'th_nam_truoc', 'kh_nam', 'th_thang_truoc', 'gc_th_thang_truoc', 'th_thang', 'gc_th_thang', 'luy_ke',
    'ck_th_thang', 'ck_gc_th_thang', 'ck_luy_ke',
    'ss_th_thang_sck', 'ss_th_thang_skh', 'ss_luy_ke_sck', 'ss_luy_ke_skh',
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

  access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiaW5ocGh1b2NAMTIzIiwibmFtZSI6ImJpbmhwaHVvYy5zeW5jIiwiaWF0IjoxNTE2MjM5MDEyMywidGVuYW50X2lkIjozOX0.0Znt0dLSvETuB1KimtqrjZQlT26N9EppaJnIQaSBXB0";

  selectedReport = 0;
  reportList = [{
    id: 0,
    name: 'Báo cáo các chỉ tiêu Kinh tế Xã hội SKHDT | Thực hiện Tháng'
  }]

  inputdata = new BehaviorSubject<Array<bcskhdt_thang>>(null);
  sctdata = new BehaviorSubject<[]>(null);
  planningdata = new BehaviorSubject<any[]>(null);

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
          this.dataSource = new MatTableDataSource<bcskhdt_thang>(bcdata);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.itemsPerPageLabel = 'Số hàng';
          this.paginator._intl.firstPageLabel = "Trang Đầu";
          this.paginator._intl.lastPageLabel = "Trang Cuối";
          this.paginator._intl.previousPageLabel = "Trang Trước";
          this.paginator._intl.nextPageLabel = "Trang Tiếp";
        } else {
          this.dataSource = new MatTableDataSource<bcskhdt_thang>([]);
          this.logger.msgError(result['err_msg']);
        }
      } else {
        this.dataSource = new MatTableDataSource<bcskhdt_thang>([]);
        this.logger.msgError("Lỗi khi lấy dữ liệu từ phần mềm Kinh tế xã hội");
      }
    });
  }

  getInputData() {
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
          this.inputdata.next(bcdata)
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
          "code": "SKHVDT_KTXH_KHN",
          "org": "70.SO_CT",
          "period": this.timechange.toString().substring(0, 4)
        }
      },
      "access_token": this.access_token
    }
    this.sctService.GetLrisReportData(payload).subscribe((result) => {
      if (result) {
        if (result['err_code'] == "0") {
          let data = result['data']['data'];
          let bcdata = []
          data.forEach(s => {
            let object = {
              idx: s.idx,
              indicator: s.indicator,
              indicatorname: s.indicatorname,
              indunit: s.indunit,
              kh_nam: s.value[1],
            }
            bcdata.push(object)
          });
          this.planningdata.next(bcdata)
        } else {
          this.logger.msgError(result['err_msg']);
        }
      } else {
        this.logger.msgError("Lỗi khi lấy dữ liệu từ phần mềm Kinh tế xã hội");
      }
    });
  }

  getDataFromLris() {
    this.getCurrentMonthData();
    this.getInputData();
    this.getPlanningData();
    this.getThucHienThang(this.timechange);
  }

  getThucHienThang(time_id: number) {
    this.sctService.GetMonthlyReportSKHDT(time_id).subscribe((result) => {
      this.sctdata.next(result.data)
    });
  }

  sendData() {
    let inputdata_t = []
    let sctdata_t = []
    let planningdata_t = []
    inputdata_t = this.inputdata.value
    sctdata_t = this.sctdata.value
    planningdata_t = this.planningdata.value
    let input = []

    if (sctdata_t.length < 60) {
      this.logger.msgError("Dữ liệu tổng hợp SCT chưa đầy đủ!");
      return
    } else {
      inputdata_t.forEach(function (s, i) {
        let obj = {
          "Indicator": s.indicator,
          "Value": [
            s.th_nam_truoc ? parseFloat(s.th_nam_truoc) : null,
            planningdata_t[i].kh_nam ? parseFloat(planningdata_t[i].kh_nam) : null,
            s.th_thang_truoc ? parseFloat(s.th_thang_truoc) : null,
            s.gc_th_thang_truoc ? parseFloat(s.gc_th_thang_truoc) : null,
            sctdata_t[i].thuc_hien_thang ? parseFloat(sctdata_t[i].thuc_hien_thang) : null,
            null,
            s.luy_ke ? parseFloat(s.luy_ke) + (sctdata_t[i].thuc_hien_thang ? parseFloat(sctdata_t[i].thuc_hien_thang) : 0) : null,
            s.ck_th_thang ? parseFloat(s.ck_th_thang) : null,
            s.ck_gc_th_thang ? parseFloat(s.ck_gc_th_thang) : null,
            s.ck_luy_ke ? parseFloat(s.ck_luy_ke) : null,
            s.ck_th_thang ? (sctdata_t[i].thuc_hien_thang ? parseFloat(sctdata_t[i].thuc_hien_thang) : 0) / (s.ck_th_thang ? parseFloat(s.ck_th_thang) : 0) * 100 : null,
            planningdata_t[i].kh_nam ? (sctdata_t[i].thuc_hien_thang ? parseFloat(sctdata_t[i].thuc_hien_thang) : 0) / (planningdata_t[i].kh_nam ? parseFloat(planningdata_t[i].kh_nam) : 0) * 100 : null,
            s.ck_luy_ke ? (parseFloat(s.luy_ke) + (sctdata_t[i].thuc_hien_thang ? parseFloat(sctdata_t[i].thuc_hien_thang) : 0)) / (s.ck_luy_ke ? parseFloat(s.ck_luy_ke) : 0) * 100 : null,
            planningdata_t[i].kh_nam ? (parseFloat(s.luy_ke) + (sctdata_t[i].thuc_hien_thang ? parseFloat(sctdata_t[i].thuc_hien_thang) : 0)) / (planningdata_t[i].kh_nam ? parseFloat(planningdata_t[i].kh_nam) : 0) * 100 : null,
          ]
        }
        input.push(obj)
      })
    }

    let payload = {
      "func": "sndData",
      "data": {
        "Header": {
          "Code": "SKHVDT_KTXH_THT",
          "Org": "70.SO_CT",
          "Period": this.timechange.toString()
        },
        "Data": input
      },
      "access_token": this.access_token
    }
    this.sctService.PostLrisReportData(payload).subscribe((result) => {
      if (result) {
        this.getCurrentMonthData();
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
