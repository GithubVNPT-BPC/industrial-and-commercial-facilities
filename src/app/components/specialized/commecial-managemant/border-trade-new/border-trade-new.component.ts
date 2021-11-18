import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  MatTableDataSource,
  MatAccordion,
  MatPaginator,
  MatDialog,
  MatDialogConfig,
} from "@angular/material";
import { SCTService } from "src/app/_services/APIService/sct.service";
import { new_import_export_model, Task, data_detail_model } from "src/app/_models/APIModel/export-import.model";
import { MarketService } from "src/app/_services/APIService/market.service";
import { MatSort } from "@angular/material/sort";
import { LinkModel } from "src/app/_models/link.model";
import { BreadCrumService } from "src/app/_services/injectable-service/breadcrums.service";
import { ExcelService } from 'src/app/_services/excelUtil.service';

import { ExcelServicesService } from "src/app/shared/services/excel-services.service";
import { LoginService } from "src/app/_services/APIService/login.service";
import { ReplaySubject, Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { InformationService } from 'src/app/shared/information/information.service';

import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
import { MarketServicePublic } from 'src/app/_services/APIService/market.service public';
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { formatDate } from '@angular/common';

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
  selector: 'app-border-trade-new',
  templateUrl: './border-trade-new.component.html',
  styleUrls: ["/../../special_layout.scss"],
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
export class BorderTradeNewComponent implements OnInit {

  private readonly LINK_DEFAULT: string =
    "/specialized/commecial-management/border_trade";
  private readonly TITLE_DEFAULT: string = "Chi tiết - Thương mại biên giới";
  private readonly TEXT_DEFAULT: string = "Chi tiết - Thương mại biên giới";

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

    this.GetDanhSachTMBG(this.timechange)

    this.month = this.time.substring(4, 6)
  }

  displayedColumns = [
    // "index",
    "tt",
    "ten_san_pham",
    "don_vi_tinh",
    "gia_tri_thang",
    // "uoc_th_so_cungky_tht",
    // "uoc_th_so_thg_truoc_tht",

    // "gia_tri_cong_don",
    // "uoc_th_so_cungky_cong_don",
    // "uoc_th_so_thg_truoc_cong_don",
  ];
  // displayRow1Header = [
  //   // "index",
  //   "tt",
  //   "ten_san_pham",
  //   "don_vi_tinh",
  //   "gia_tri_thang",
  //   // "thuc_hien_bao_cao_thang",
  //   // "cong_don_den_ky_bao_cao",
  // ];
  displaRow2Header = [
    // "gia_tri_thang",
    // "uoc_th_so_cungky_tht",
    // "uoc_th_so_thg_truoc_tht",
    // "gia_tri_cong_don",
    // "uoc_th_so_cungky_cong_don",
    // "uoc_th_so_thg_truoc_cong_don",
  ];
  private _linkOutput: LinkModel = new LinkModel();

  dataBusiness: any[] = [];
  dataSource: MatTableDataSource<new_import_export_model> = new MatTableDataSource<new_import_export_model>();
  dataDialog: any[] = [];
  filteredDataSource: MatTableDataSource<new_import_export_model> = new MatTableDataSource<new_import_export_model>();

  @ViewChild("TABLE", { static: true }) table: ElementRef;
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    public sctService: SCTService,
    public matDialog: MatDialog,
    public marketService: MarketService,
    public excelService: ExcelService,
    private _breadCrumService: BreadCrumService,
    private excelServices: ExcelServicesService,
    public _login: LoginService,
    public _infor: InformationService,
  ) { }

  public exportvalue: Array<new_import_export_model> = new Array<new_import_export_model>();

  spinnerEnabled = false;
  keys: string[];
  dataSheet = new Subject();
  @ViewChild('inputFile', { static: true }) inputFile: ElementRef;
  isExcelFile: boolean;
  uploadExcel(evt: any) {
    let isExcelFile: boolean;
    let spinnerEnabled = false;
    let dataSheet = new Subject();
    let keys: string[];
    let data, header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (isExcelFile) {
      let data, header;
      const target: DataTransfer = <DataTransfer>(evt.target);
      this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
      if (target.files.length > 1) {
        this.inputFile.nativeElement.value = '';
      }
      if (this.isExcelFile) {
        this.spinnerEnabled = true;
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          data = XLSX.utils.sheet_to_json(ws);
          this.dataSource.data = [];
          data.forEach(item => {
            let datarow: new_import_export_model = new new_import_export_model();
            datarow.id_san_pham = item['ID'];
            datarow.san_luong_thang = 0;
            datarow.tri_gia_thang = item['Giá trị'] ? item['Giá trị'] : 0;
            datarow.uoc_thang_so_voi_ki_truoc = item['So với cùng kỳ'] ? item['So với cùng kỳ'] : 0;
            datarow.uoc_thang_so_voi_thang_truoc = item['So với tháng trước'] ? item['So với tháng trước'] : 0;
            datarow.san_luong_cong_don = 0;
            datarow.tri_gia_cong_don = item['Giá trị (Cộng dồn)'] ? item['Giá trị (Cộng dồn)'] : 0;
            datarow.uoc_cong_don_so_voi_ki_truoc = item['So với cùng kỳ (Cộng dồn)'] ? item['So với cùng kỳ (Cộng dồn)'] : 0;
            datarow.uoc_cong_don_so_voi_cong_don_truoc = item['So với tháng trước (Cộng dồn)'] ? item['So với tháng trước (Cộng dồn)'] : 0;
            this.exportvalue.push(datarow)
          });
          this.save(this.timechange, this.exportvalue)
        };

        reader.readAsBinaryString(target.files[0]);

        reader.onloadend = (e) => {
          this.spinnerEnabled = false;
          this.keys = Object.keys(data[0]);
          this.dataSheet.next(data)
          this.inputFile.nativeElement.value = '';
          this.exportvalue = []
        }
      }
    }
  }

  public save(month: number, exportvalue: Array<new_import_export_model>) {
    this.sctService.CapNhatDuLieuTMBGThang(month, exportvalue).subscribe(
      next => {
        if (next.id == -1) {
          this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
        }
        else {
          this._infor.msgSuccess("Dữ liệu được lưu thành công!");
          this.GetDanhSachTMBG(this.timechange)
        }
      },
      error => {
        this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
      }
    );
  }

  authorize: boolean = true

  public getCurrentMonth(): string {
    let date = new Date;
    return formatDate(date, 'yyyyMM', 'en-US');
  }

  ngOnInit() {
    this.month = this.getCurrentMonth().substring(4, 6)
    this.timechange = parseInt(this.getCurrentMonth())
    this.GetDanhSachTMBG(this.timechange);
    this.autoOpen();
    this.sendLinkToNext(true);
    if (this._login.userValue.user_role_id == 3 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  public sendLinkToNext(type: boolean) {
    this._linkOutput.link = this.LINK_DEFAULT;
    this._linkOutput.title = this.TITLE_DEFAULT;
    this._linkOutput.text = this.TEXT_DEFAULT;
    this._linkOutput.type = type;
    this._breadCrumService.sendLink(this._linkOutput);
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  GetDanhSachTMBG(time_id: number) {
    this.sctService.GetDanhSachTMBG(time_id).subscribe((result) => {
      result.data[0].forEach(x => {
        x.san_luong_thang = x.san_luong_thang == 0 ? null : x.san_luong_thang
        x.tri_gia_thang = x.tri_gia_thang == 0 ? null : x.tri_gia_thang
        x.uoc_thang_so_voi_ki_truoc = x.uoc_thang_so_voi_ki_truoc == 0 ? null : x.uoc_thang_so_voi_ki_truoc
        x.uoc_thang_so_voi_thang_truoc = x.uoc_thang_so_voi_thang_truoc == 0 ? null : x.uoc_thang_so_voi_thang_truoc
        x.san_luong_cong_don = x.san_luong_cong_don == 0 ? null : x.san_luong_cong_don
        x.tri_gia_cong_don = x.tri_gia_cong_don == 0 ? null : x.tri_gia_cong_don
        x.uoc_cong_don_so_voi_ki_truoc = x.uoc_cong_don_so_voi_ki_truoc == 0 ? null : x.uoc_cong_don_so_voi_ki_truoc
        x.uoc_cong_don_so_voi_cong_don_truoc = x.uoc_cong_don_so_voi_cong_don_truoc == 0 ? null : x.uoc_cong_don_so_voi_cong_don_truoc
      });

      this.setDataExport(result.data[0]);
    });
  }

  TongGiaTriThangThucHien: number = 0;
  TongGiaTriCongDon: number = 0;

  setSumaryData(data) {
    this.TongGiaTriThangThucHien = data[0].tri_gia_thang ? data[0].tri_gia_thang : 0;
    this.TongGiaTriCongDon = data[0].tri_gia_cong_don ? data[0].tri_gia_cong_don : 0;
  }

  setDataExport(data) {
    this.dataSource = new MatTableDataSource<new_import_export_model>(data);
    if (data.length) {
      this.setSumaryData(data);
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = "Số hàng";
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";
    }
  }

  public ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }
}
