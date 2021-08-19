import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatTableDataSource,
  MatAccordion,
  MatPaginator,
  MatDialog,
  MatDialogConfig,
} from "@angular/material";

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
import { ModalComponent } from 'src/app/components/specialized/commecial-managemant/export-import-management/dialog-import-export/modal.component';
import { DialogImportExportComponent } from '../dialog-import-export/dialog-import-export.component';

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

export class DomesticImportComponent extends BaseComponent {
  public dataSource: MatTableDataSource<new_import_export_model>;

  constructor(
    public matDialog: MatDialog,
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
      this.getDanhSachNhapKhau(this.timechange)
    }
    else {
      this.getDanhSachNhapKhauTC(this.timechange)
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
    "tt",
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
    "tt",
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
    this.getDanhSachNhapKhau(this.timechange);
    super.ngOnInit();
  }

  getDanhSachNhapKhau(time_id: number) {
    this.sctService.GetDanhSachNhapKhau(time_id).subscribe((result) => {
      this.setDataExport(result.data[0]);
      this.setDatabusiness(result.data[1]);
      this.setDataExportDetail(result.data[2]);
    });
  }

  getDanhSachNhapKhauTC(time_id: number) {
    this.sctService.GetDanhSachNhapKhauTC(time_id).subscribe((result) => {
      this.setDataExport(result.data[0]);
      this.setDatabusiness(result.data[1]);
      this.setDataExportDetail(result.data[2]);
    });
  }

  setDataExport(data) {
    this.dataSource = new MatTableDataSource<new_import_export_model>(data);
    if (data.length) {
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = "Số hàng";
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";
    }
  }

  setDataExportDetail(detail_export: any) {
    this.dataDialog = [...detail_export];
  }

  setDatabusiness(lsBusiness) {
    this.dataBusiness = lsBusiness;
  }

  applyDataTarget(event) {
    this.dataTargetId = event.value
    if (this.dataTargetId == 1) {
      this.getDanhSachNhapKhau(this.timechange)
    }
    else {
      this.getDanhSachNhapKhauTC(this.timechange)
    }
  }

  public ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  dataDialog: any[] = [];
  dataBusiness: any[] = [];

  handleDataDialog(id_mat_hang) {
    let data = this.dataDialog.filter(
      (item) => item.id_san_pham === id_mat_hang
    );
    return data;
  }

  openDialog(id_mat_hang) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      height: '70%',
      width: '70%',
      data: this.handleDataDialog(id_mat_hang),
      id: 1,
    };
    this.matDialog.open(DialogImportExportComponent, dialogConfig);
  }

  openDanh_sach_doanh_nghiep(id_san_pham) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      height: '70%',
      width: '70%',
      data: this.handleDataBusiness(id_san_pham),
      id: 2,
    };
    this.matDialog.open(DialogImportExportComponent, dialogConfig);
  }

  handleDataBusiness(id_san_pham) {
    let data = this.dataBusiness.filter(
      (item) => item.id_san_pham === id_san_pham
    );
    return data;
  }

}
