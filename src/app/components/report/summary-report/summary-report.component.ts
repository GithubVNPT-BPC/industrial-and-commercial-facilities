import { Component, Injector } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';

import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';

import { SCTService } from 'src/app/_services/APIService/sct.service';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { forkJoin, zip } from "rxjs";

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
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
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
export class SummaryReportComponent extends BaseComponent {

  public date = new FormControl(_moment());
  public newdate = new FormControl(_moment());
  public theYear: number = parseInt(_moment().format('YYYY'));
  public theMonth: number = parseInt(_moment().format('MM'));
  public stringmonth: string
  public time: string
  public timechange: number = parseInt(_moment().format('YYYYMM'));
  public month: string

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  filteredDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  private displayedDatas = [];

  displayedFields = {
    ten_chi_tieu: "Tên chỉ tiêu",
    don_vi_tinh: "Đơn vị tính",
    thuc_hien_cung_ky: "Thực hiện cùng kỳ",
    thuc_hien_ky_truoc: "Thực hiện tháng trước",
    thuc_hien_thang: "Thực hiện tháng",
    so_sanh_ky_truoc: "Thực hiện so với tháng trước",
    so_sanh_cung_ky: "Thực hiện so cùng kỳ",
    bao_cao: "Báo cáo"
  }

  constructor(
    private injector: Injector,
    public sctService: SCTService,
  ) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.getData();
  }

  public getData() {
    this.displayedDatas = [];
    // this.GetDanhSachCSSXCN(this.timechange);
    // this.GetDanhSachBLHH(this.timechange);
    // this.GetImportData(this.timechange);
    // this.GetExportData(this.timechange);

    let call1 = this.sctService.GetDanhSachCSSX(this.timechange);
    let call2 = this.sctService.GetDanhSachBLHH(this.timechange);
    let call3 = this.sctService.GetDanhSachXuatKhau(this.timechange);
    let call4 = this.sctService.GetDanhSachNhapKhau(this.timechange);

    forkJoin([call1, call2, call3, call4]).subscribe(
      ([res1, res2, res3, res4]) => {
        let data1 = res1.data[0].filter(x => x.time_id == this.timechange);
        if (res1 && data1 && data1.length) {
          for (let ind of data1) {
            ind['bao_cao'] = 'Chỉ số SXCN';
          }
          this.displayedDatas = [...this.displayedDatas, ...data1];
          this.dataSource = new MatTableDataSource<any>(this.displayedDatas);
          this.filteredDataSource.data = [...this.dataSource.data];
        }

        let data2 = res2.data[0].filter(x => x.time_id == this.timechange);
        if (res2 && data2 && data2.length) {
          for (let ind of data2) {
            ind['bao_cao'] = 'Tổng mức bán lẻ hàng hoá';
          }
          this.displayedDatas = [...this.displayedDatas, ...data2];
        }

        if (res3.data[0] && res3.data[0].length) {
          let data3 = res3.data[0][0];
          data3 = {
            ...data3, ...{
              'bao_cao': "Xuất khẩu",
              'ten_chi_tieu': data3['ten_san_pham'],
              'thuc_hien_cung_ky': 0,
              'thuc_hien_ky_truoc': 0,
              'thuc_hien_thang': data3['tri_gia_thang'],
              'so_sanh_ky_truoc': data3['uoc_thang_so_voi_thang_truoc'],
              'so_sanh_cung_ky': data3['uoc_thang_so_voi_ki_truoc'],
            }
          }
          this.displayedDatas = [...this.displayedDatas, ...[data3]];
        }

        if (res4.data[0] && res4.data[0].length) {
          let data4 = res4.data[0][0];
          data4 = {
            ...data4, ...{
              'bao_cao': "Nhập khẩu",
              'ten_chi_tieu': data4['ten_san_pham'],
              'thuc_hien_cung_ky': 0,
              'thuc_hien_ky_truoc': 0,
              'thuc_hien_thang': data4['tri_gia_thang'],
              'so_sanh_ky_truoc': data4['uoc_thang_so_voi_thang_truoc'],
              'so_sanh_cung_ky': data4['uoc_thang_so_voi_ki_truoc'],
            }
          };
          this.displayedDatas = [...this.displayedDatas, ...[data4]];
        }

        this.dataSource = new MatTableDataSource<any>(this.displayedDatas);
        this.filteredDataSource.data = [...this.dataSource.data];
      }
    )
  }

  // GetDanhSachBLHH(time_id: number) {
  //   this.sctService.GetDanhSachBLHH(time_id).subscribe((result) => {
  //     let data = result.data[0].filter(x => x.time_id == time_id);
  //     if (result && data && data.length) {
  //       for (let ind of data) {
  //         ind['bao_cao'] = 'Tổng mức bán lẻ hàng hoá';
  //       }
  //       this.displayedDatas = [...this.displayedDatas, ...data];
  //       this.dataSource = new MatTableDataSource<any>(this.displayedDatas);
  //       this.filteredDataSource.data = [...this.dataSource.data];
  //     }
  //   });
  // }

  // GetDanhSachCSSXCN(time_id: number) {
  //   this.sctService.GetDanhSachCSSX(time_id).subscribe((result) => {
  //     let data = result.data[0].filter(x => x.time_id == time_id);
  //     if (result && data && data.length) {
  //       for (let ind of data) {
  //         ind['bao_cao'] = 'Chỉ số SXCN';
  //       }
  //       this.displayedDatas = [...this.displayedDatas, ...data];
  //       this.dataSource = new MatTableDataSource<any>(this.displayedDatas);
  //       this.filteredDataSource.data = [...this.dataSource.data];
  //     }
  //   });
  // }

  // GetImportData(time_id: number) {
  //   this.sctService.GetDanhSachNhapKhau(time_id).subscribe((result) => {
  //     if (result.data[0] && result.data[0].length) {
  //       let data = result.data[0][0];
  //       data = {
  //         ...data, ...{
  //           'bao_cao': "Nhập khẩu",
  //           'ten_chi_tieu': data['ten_san_pham'],
  //           'thuc_hien_cung_ky': 0,
  //           'thuc_hien_ky_truoc': 0,
  //           'thuc_hien_thang': data['tri_gia_thang'],
  //           'so_sanh_ky_truoc': data['uoc_thang_so_voi_thang_truoc'],
  //           'so_sanh_cung_ky': data['uoc_thang_so_voi_ki_truoc'],
  //         }
  //       }
  //       this.displayedDatas = [...this.displayedDatas, ...[data]];
  //       this.dataSource = new MatTableDataSource<any>(this.displayedDatas);
  //       this.filteredDataSource.data = [...this.dataSource.data];
  //     }
  //   });
  // }

  // GetExportData(time_id: number) {
  //   this.sctService.GetDanhSachXuatKhau(time_id).subscribe((result) => {
  //     if (result.data[0] && result.data[0].length) {
  //       let data = result.data[0][0];
  //       data = {
  //         ...data, ...{
  //           'bao_cao': "Xuất khẩu",
  //           'ten_chi_tieu': data['ten_san_pham'],
  //           'thuc_hien_cung_ky': 0,
  //           'thuc_hien_ky_truoc': 0,
  //           'thuc_hien_thang': data['tri_gia_thang'],
  //           'so_sanh_ky_truoc': data['uoc_thang_so_voi_thang_truoc'],
  //           'so_sanh_cung_ky': data['uoc_thang_so_voi_ki_truoc'],
  //         }
  //       };
  //       this.displayedDatas = [...this.displayedDatas, ...[data]];
  //       this.dataSource = new MatTableDataSource<any>(this.displayedDatas);
  //       this.filteredDataSource.data = [...this.dataSource.data];
  //     }
  //   });
  // }

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
      this.stringmonth = this.theMonth.toString();;
    }
    else {
      this.stringmonth = "0" + this.theMonth.toString();
    }
    this.time = this.theYear.toString() + this.stringmonth;
    this.timechange = parseInt(this.time);

    this.getData();

    this.month = this.time.substring(4, 6);

  }

  transform(value: any): string {
    if (typeof value === 'number') {
      value = value.toString();
    }
    if (value && value.trim() != "-") {
      value = value.toString().replace(',', '').replace(',', '').replace(',', '');
      return new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 0
      }).format(Number(value));
    } else {
      return "-";
    }
  }
}
