import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { SCTService } from "src/app/_services/APIService/sct.service";

import { new_import_export_model, Task, data_detail_model } from "src/app/_models/APIModel/export-import.model";
import { SAVE } from 'src/app/_enums/save.enum';

import { CompanyTopPopup } from '../company-top-popup/company-top-popup.component';

import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { formatDate } from '@angular/common';

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
  selector: 'app-domestic-export',
  templateUrl: 'domestic-export.component.html',
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

export class DomesticExportComponent extends BaseComponent {
  public dataSource: MatTableDataSource<new_import_export_model>;

  constructor(
    public sctService: SCTService,
    private injector: Injector,
    public excelService: ExcelService,
    public router: Router,
    public dialog: MatDialog) {
    super(injector);
  }

  public date = new FormControl(_moment());
  public newdate = new FormControl(_moment());
  public theYear: number;
  public theMonth: number;
  public stringmonth: string
  public time: string
  public timechange: number
  public month: string

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

    if (this.dataTargetId == 1) {
      this.getDanhSachXuatKhau(this.timechange)
    }
    else {
      this.getDanhSachXuatKhauTC(this.timechange)
    }

    this.month = this.time.substring(5, 6)
  }

  dataTargets: any[] = [
    { id: 1, unit: "Cục hải quan" },
    { id: 2, unit: "Tổng cục hải quan" },
  ];
  dataTargetId = 1;

  displayedColumns = [
    // "index",
    "ten_san_pham",
    "don_vi_tinh",
    "gia_tri_thang",
    "uoc_th_so_cungky_tht",
    "uoc_th_so_thg_truoc_tht",

    "gia_tri_cong_don",
    "uoc_th_so_cungky_cong_don",
    "uoc_th_so_thg_truoc_cong_don",
    "danh_sach_doanh_nghiep",
    "chi_tiet_doanh_nghiep",
  ];
  displayRow1Header = [
    // "index",
    "ten_san_pham",
    "don_vi_tinh",
    "thuc_hien_bao_cao_thang",
    "cong_don_den_ky_bao_cao",

    "danh_sach_doanh_nghiep",
    "chi_tiet_doanh_nghiep",
  ];
  displaRow2Header = [
    "gia_tri_thang",
    "uoc_th_so_cungky_tht",
    "uoc_th_so_thg_truoc_tht",
    "gia_tri_cong_don",
    "uoc_th_so_cungky_cong_don",
    "uoc_th_so_thg_truoc_cong_don",
  ];

  public getCurrentMonth(): string {
    let date = new Date;
    return formatDate(date, 'yyyyMM', 'en-US');
  }

  ngOnInit() {
    this.month = this.getCurrentMonth().substring(5, 6)
    this.timechange = parseInt(this.getCurrentMonth())
    this.getDanhSachXuatKhau(this.timechange);
    super.ngOnInit();
  }

  getDanhSachXuatKhau(time_id: number) {
    this.sctService.GetDanhSachXuatKhau(time_id).subscribe((result) => {
      this.setDataExport(result.data[0]);
    });
  }

  getDanhSachXuatKhauTC(time_id: number) {
    this.sctService.GetDanhSachXuatKhauTC(time_id).subscribe((result) => {
      this.setDataExport(result.data[0]);
    });
  }

  setDataExport(data) {
    this.dataSource = new MatTableDataSource<new_import_export_model>(data);
    if (data.length) {
      this.dataSource.paginator = this.paginator;
    }
  }

  private sumTG: number = 0;

  _prepareData() {
    let data = this.dataSource.data;
    this.sumTG = data.length ? data.map(item => item.tri_gia_thang).reduce((a, b) => a + b) : 0;
  }

  public ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  public openCompanyTopPopup(data: any) {
    const dialogRef = this.dialog.open(CompanyTopPopup, {
      height: '70%',
      width: '70%',
      data: {
        message: 'Dữ liệu top doanh nghiệp xuất khẩu',
        export_data: data,
        typeOfSave: SAVE.EXPORT,
      }
    });
  }
}
