import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  MatTableDataSource,
  MatAccordion,
  MatPaginator,
  MatDialog,
} from "@angular/material";
import { SCTService } from "src/app/_services/APIService/sct.service";
import { new_model, chartmodel } from "src/app/_models/APIModel/export-import.model";
import { MarketService } from "src/app/_services/APIService/market.service";
import { MatSort } from "@angular/material/sort";
import { LinkModel } from "src/app/_models/link.model";
import { BreadCrumService } from "src/app/_services/injectable-service/breadcrums.service";
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { Chart } from 'chart.js';
import { ActivatedRoute } from "@angular/router";

import { ExcelServicesService } from "src/app/shared/services/excel-services.service";
import { LoginService } from "src/app/_services/APIService/login.service";
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { InformationService } from 'src/app/shared/information/information.service';

import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
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
  selector: 'app-retail-month-new',
  templateUrl: './retail-month-new.component.html',
  styleUrls: ['../../../special_layout.scss'],
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

export class RetailMonthNewComponent implements OnInit {
  public fields: object = {};
  public href_file: string = '';
  private readonly LINK_DEFAULT: string =
    "/specialized/commecial-management/retail";
  private readonly TITLE_DEFAULT: string = "Tổng mức bán lẻ hàng hoá và dịch vụ";
  private readonly TEXT_DEFAULT: string = "Tổng mức bán lẻ hàng hoá và dịch vụ";

  public date = new FormControl(_moment());
  public newdate = new FormControl(_moment());
  d = new Date();
  public theYear: number = this.d.getFullYear();
  public theMonth: number = this.d.getMonth() + 1;
  public stringmonth: string
  public time: string
  public timechange: number
  public month: string

  public duLieuKyBaoCao: Array<new_model> = [];
  public duLieuKyTruoc: Array<new_model> = [];
  public duLieuCungKy: Array<new_model> = [];
  public duLieuThang6CungKy: Array<new_model> = [];
  public duLieuThang12CungKy: Array<new_model> = [];
  public defaultDatasource: Array<new_model> = [];

  convertstringtodate(time: string): Date {
    let year = parseInt(time.substring(0, 4));
    let month = parseInt(time.substring(4, 6));
    let day = 1

    let date = new Date(year, month - 1, day);
    return date
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

    this.GetDanhSachBLHH(this.timechange);

    this.month = this.time.substring(5, 6)
    this.displayedColumns = this.excelService.initialdisplayedColumns(this.theMonth);
    this.href_file = this.excelService.getHref();
  }

  displayedColumns = [
    // "index",
    "stt",
    "ten_chi_tieu",
    "don_vi_tinh"
  ];

  private _linkOutput: LinkModel = new LinkModel();

  dataBusiness: any[] = [];
  dataSource: MatTableDataSource<new_model> = new MatTableDataSource<new_model>();
  dataDialog: any[] = [];
  filteredDataSource: MatTableDataSource<new_model> = new MatTableDataSource<new_model>();

  @ViewChild("TABLE", { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    public sctService: SCTService,
    public matDialog: MatDialog,
    public route: ActivatedRoute,
    public marketService: MarketService,
    public excelService: ExcelService,
    private _breadCrumService: BreadCrumService,
    public _login: LoginService,
    public _infor: InformationService,
  ) { }

  public prototype: Array<new_model> = new Array<new_model>();

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
          this.prototype = this.mappingData(data);
          this.save(this.timechange, this.prototype)
        };

        reader.readAsBinaryString(target.files[0]);

        reader.onloadend = (e) => {
          this.spinnerEnabled = false;
          this.keys = Object.keys(data[0]);
          this.dataSheet.next(data)
          this.inputFile.nativeElement.value = '';
          this.prototype = []
        }
      }
    }
  }

  mappingData(data) {
    switch (this.theMonth) {
      case 1:
        return this.excelService.mappingDataSource1(data, this.timechange);

      case 2:
      case 3:
      case 4:
        return this.excelService.mappingDataSource234(data, this.timechange);

      case 5:
        return this.excelService.mappingDataSource5(data, this.timechange);

      case 6:
      case 7:
      case 8:
      case 9:
      case 11:
        return this.excelService.mappingDataSource678911(data, this.timechange);

      case 10:
        return this.excelService.mappingDataSource10(data, this.timechange);

      case 12:
        return this.excelService.mappingDataSource12(data, this.timechange);
      default:
        break;
    }
  }

  public save(month: number, prototype: Array<new_model>) {
    this.dataSource = new MatTableDataSource<new_model>(prototype);
    this.sctService.CapNhatDuLieuBLHHThang(month, prototype).subscribe(
      next => {
        if (next.id == -1) {
          this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
        }
        else {
          this._infor.msgSuccess("Dữ liệu được lưu thành công!");
          this.GetDanhSachBLHH(this.timechange)
        }
      },
      error => {
        this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
      }
    );
  }

  authorize: boolean = true
  timeparam: number

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.timeparam = params['time_id']
      this.date = new FormControl(this.convertstringtodate(this.timeparam.toString()))
      this.theYear = this.date.value.getFullYear();
      this.theMonth = this.date.value.getMonth() + 1;
      let time_id = params['time_id'];
      if (time_id) {
        this.month = time_id.toString().substring(5, 6);
        this.timechange = Number(time_id);
      }
      else {
        this.month = this.getCurrentMonth().substring(5, 6);
        this.timechange = parseInt(this.getCurrentMonth());
      }
    });

    this.defaultDatasource.push(
      new new_model("A", this.timechange, "Triệu đồng", "TỔNG MỨC BLHH VÀ DTDVTD", 189),
      new new_model("I", this.timechange, "Triệu đồng", "Tổng mức bán lẻ hàng hóa", 190),
      new new_model("II", this.timechange, "Triệu đồng", "Doanh thu hoạt động dịch vụ (trừ lưu trú, ăn uống, dịch vụ lữ hành)", 191),
      new new_model("III", this.timechange, "Triệu đồng", "Doanh thu DV ăn uống, lưu trú, du lịch lữ hành", 192)
    )
    this.GetDanhSachBLHH(this.timechange);
    this.autoOpen();
    this.sendLinkToNext(true);
    if (this._login.userValue.user_role_id == 3 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }

    this.displayedColumns = this.excelService.initialdisplayedColumns(Number(this.month));
    this.fields = this.excelService.fields;
    this.href_file = this.excelService.getHref();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  GetDanhSachBLHH(time_id: number) {
    this.sctService.GetDanhSachBLHH(time_id).subscribe((result) => {
      result.data[0].forEach(x => {
        // x.san_luong_thang = x.san_luong_thang == 0 ? null : x.san_luong_thang
        // x.tri_gia_thang = x.tri_gia_thang == 0 ? null : x.tri_gia_thang
        // x.uoc_thang_so_voi_ki_truoc = x.uoc_thang_so_voi_ki_truoc == 0 ? null : x.uoc_thang_so_voi_ki_truoc
        // x.uoc_thang_so_voi_thang_truoc = x.uoc_thang_so_voi_thang_truoc == 0 ? null : x.uoc_thang_so_voi_thang_truoc
        // x.san_luong_cong_don = x.san_luong_cong_don == 0 ? null : x.san_luong_cong_don
        // x.tri_gia_cong_don = x.tri_gia_cong_don == 0 ? null : x.tri_gia_cong_don
        // x.uoc_cong_don_so_voi_ki_truoc = x.uoc_cong_don_so_voi_ki_truoc == 0 ? null : x.uoc_cong_don_so_voi_ki_truoc
        // x.uoc_cong_don_so_voi_cong_don_truoc = x.uoc_cong_don_so_voi_cong_don_truoc == 0 ? null : x.uoc_cong_don_so_voi_cong_don_truoc
        x.ten_chi_tieu = x.ten_chi_tieu == 0 ? null : x.ten_chi_tieu;
        x.id_chi_tieu = x.id_chi_tieu == 0 ? null : x.id_chi_tieu;
        x.thuc_hien_ky_truoc = x.thuc_hien_ky_truoc == 0 ? null : x.thuc_hien_ky_truoc;
        x.thuc_hien_cung_ky = x.thuc_hien_cung_ky == 0 ? null : x.thuc_hien_cung_ky;
        x.thuc_hien_thang = x.thuc_hien_thang == 0 ? null : x.thuc_hien_thang;
        x.thuc_hien_6_thang_dau_nam_cung_ky = x.thuc_hien_6_thang_dau_nam_cung_ky == 0 ? null : x.thuc_hien_6_thang_dau_nam_cung_ky;
        x.thuc_hien_nam_truoc = x.thuc_hien_nam_truoc == 0 ? null : x.thuc_hien_nam_truoc;
        x.luy_ke_thang = x.luy_ke_thang == 0 ? null : x.luy_ke_thang;
        x.luy_ke_cung_ky = x.luy_ke_cung_ky == 0 ? null : x.luy_ke_cung_ky;
        x.ke_hoach_nam = x.ke_hoach_nam == 0 ? null : x.ke_hoach_nam;
        x.ke_hoach_nam_sau = x.ke_hoach_nam_sau == 0 ? null : x.ke_hoach_nam_sau;
        x.uoc_thuc_hien_nam = x.uoc_thuc_hien_nam == 0 ? null : x.uoc_thuc_hien_nam;
        x.uoc_thuc_hien_thang_6 = x.uoc_thuc_hien_thang_6 == 0 ? null : x.uoc_thuc_hien_thang_6;
        x.uoc_thuc_hien_6_thang = x.uoc_thuc_hien_6_thang == 0 ? null : x.uoc_thuc_hien_6_thang;
        x.so_sanh_uoc_6_thang_cung_ky = x.so_sanh_uoc_6_thang_cung_ky == 0 ? null : x.so_sanh_uoc_6_thang_cung_ky;
        x.so_sanh_uoc_6_thang_ke_hoach_nam = x.so_sanh_uoc_6_thang_ke_hoach_nam == 0 ? null : x.so_sanh_uoc_6_thang_ke_hoach_nam;
        x.so_sanh_ky_truoc = x.so_sanh_ky_truoc == 0 ? null : x.so_sanh_ky_truoc;
        x.so_sanh_cung_ky = x.so_sanh_cung_ky == 0 ? null : x.so_sanh_cung_ky;
        x.so_sanh_luy_ke_cung_ky = x.so_sanh_luy_ke_cung_ky == 0 ? null : x.so_sanh_luy_ke_cung_ky;
        x.so_sanh_luy_ke_ke_hoach_nam = x.so_sanh_luy_ke_ke_hoach_nam == 0 ? null : x.so_sanh_luy_ke_ke_hoach_nam;
        x.so_sanh_uoc_thuc_hien_nam_cung_ky = x.so_sanh_uoc_thuc_hien_nam_cung_ky == 0 ? null : x.so_sanh_uoc_thuc_hien_nam_cung_ky;
        x.so_sanh_ke_hoach_nam_sau_uoc_thuc_hien_nam = x.so_sanh_ke_hoach_nam_sau_uoc_thuc_hien_nam == 0 ? null : x.so_sanh_ke_hoach_nam_sau_uoc_thuc_hien_nam;
        x.so_sanh_ke_hoach_nam_sau_thuc_hien_nam = x.so_sanh_ke_hoach_nam_sau_thuc_hien_nam == 0 ? null : x.so_sanh_ke_hoach_nam_sau_thuc_hien_nam;
        x.time_id = x.time_id == 0 ? null : x.time_id;
        x.thoi_gian_chinh_sua_cuoi = x.thoi_gian_chinh_sua_cuoi == 0 ? null : x.thoi_gian_chinh_sua_cuoi;
        x.don_vi_tinh = x.don_vi_tinh == 0 ? null : x.don_vi_tinh;
        x.stt = x.stt == 0 ? null : x.stt;
      });

      this.duLieuKyBaoCao = result.data[0].filter(x => x.time_id == time_id);

      if (this.duLieuKyBaoCao.length == 0)
        this.duLieuKyBaoCao = this.defaultDatasource;

      let time_id_ky_truoc = time_id % 100 == 1 ? (time_id / 100 - 1) * 100 + 12 : time_id - 1;
      this.duLieuKyTruoc = result.data[0].filter(x => x.time_id == time_id_ky_truoc);

      let time_id_cung_ky = time_id - 100;
      this.duLieuCungKy = result.data[0].filter(x => x.time_id == time_id_cung_ky);

      let time_id_thang_6_cung_ky = (time_id / 100 - 1) * 100 + 6;
      this.duLieuThang6CungKy = result.data[0].filter(x => x.time_id == time_id_thang_6_cung_ky);

      let time_id_thang_12_cung_ky = (time_id / 100 - 1) * 100 + 12;
      this.duLieuThang12CungKy = result.data[0].filter(x => x.time_id == time_id_thang_12_cung_ky);

      this.setDataExport(this.duLieuKyBaoCao);
      this.setSumaryData(this.duLieuKyBaoCao ? this.duLieuKyBaoCao : 0);
    });
  }

  ThucHienThang: number = 0;
  ThucHienSoVoiCungKy: number = 0;
  LuyKeKyBaoCao: number = 0;
  LuyKeSoVoiKeHoachNam: number = 0;

  setSumaryData(data) {
    this.ThucHienThang = data != 0 ? data[0].thuc_hien_thang : 0;
    this.ThucHienSoVoiCungKy = data != 0 ? data[0].so_sanh_cung_ky : 0;
    this.LuyKeKyBaoCao = data != 0 ? data[0].luy_ke_thang : 0;
    this.LuyKeSoVoiKeHoachNam = data != 0 ? data[0].so_sanh_luy_ke_ke_hoach_nam : 0;
  }

  setDataExport(data) {
    this.dataSource = new MatTableDataSource<new_model>(data);
    if (data.length) {
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public getCurrentMonth(): string {
    let date = new Date;
    return formatDate(date, 'yyyyMM', 'en-US');
  }

  public getCurrentYear(): string {
    let date = new Date;
    return formatDate(date, 'yyyy', 'en-US');
  }

  @ViewChild('lineCanvas', { static: false }) lineCanvas: ElementRef;
  lineChart: any;
  timelist: string[] = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
  chart: Array<chartmodel> = new Array<chartmodel>();

  lineChartMethod(time_id: number) {
    this.sctService.GetDanhSachBLHHTongHop(time_id).subscribe(
      res => {
        this.chart = res.data[0]

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
          type: 'line',
          data: {
            labels: this.timelist,
            datasets: [
              {
                label: 'TỔNG MỨC BLHH VÀ DTDVTD',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgb(255, 0, 0)',
                borderColor: 'rgb(255, 0, 0)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgb(255, 0, 0)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgb(255, 0, 0)',
                pointHoverBorderColor: 'rgb(255, 0, 0)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [this.chart[0].thang_01 ? this.chart[0].thang_01 : 0, this.chart[0].thang_02 ? this.chart[0].thang_02 : 0,
                this.chart[0].thang_03 ? this.chart[0].thang_03 : 0, this.chart[0].thang_04 ? this.chart[0].thang_04 : 0,
                this.chart[0].thang_05 ? this.chart[0].thang_05 : 0, this.chart[0].thang_06 ? this.chart[0].thang_06 : 0,
                this.chart[0].thang_07 ? this.chart[0].thang_07 : 0, this.chart[0].thang_08 ? this.chart[0].thang_08 : 0,
                this.chart[0].thang_09 ? this.chart[0].thang_09 : 0, this.chart[0].thang_10 ? this.chart[0].thang_10 : 0,
                this.chart[0].thang_11 ? this.chart[0].thang_11 : 0, this.chart[0].thang_12 ? this.chart[0].thang_12 : 0],
                spanGaps: false,
              }
            ]
          }
        });
      })
  }

  dataSynthesize() {
    this.duLieuKyBaoCao.forEach(row => {
      if (this.duLieuKyTruoc.length != 0) {
        let rowToCopy = this.duLieuKyTruoc.filter(x => x.id_chi_tieu == row.id_chi_tieu)[0];

        row.thuc_hien_ky_truoc = rowToCopy.thuc_hien_thang;

        if (rowToCopy.luy_ke_thang)
          row.luy_ke_thang = row.thuc_hien_thang + rowToCopy.luy_ke_thang;
        else
          row.luy_ke_thang = row.thuc_hien_thang;
      }

      if (this.duLieuCungKy.length != 0) {
        let rowToCopy = this.duLieuCungKy.filter(x => x.id_chi_tieu == row.id_chi_tieu)[0];

        row.thuc_hien_cung_ky = rowToCopy.thuc_hien_thang;
        row.luy_ke_cung_ky = row.luy_ke_cung_ky;
      }

      if (this.duLieuThang6CungKy.length != 0) {
        let rowToCopy = this.duLieuThang6CungKy.filter(x => x.id_chi_tieu == row.id_chi_tieu)[0];

        row.thuc_hien_6_thang_dau_nam_cung_ky = rowToCopy.luy_ke_thang;
      }

      if (this.duLieuThang12CungKy.length != 0) {
        let rowToCopy = this.duLieuThang12CungKy.filter(x => x.id_chi_tieu == row.id_chi_tieu)[0];

        row.thuc_hien_nam_truoc = rowToCopy.luy_ke_thang;
        row.ke_hoach_nam = rowToCopy.ke_hoach_nam_sau;
      }

      row.so_sanh_ky_truoc = this.calculateDivision(row.thuc_hien_thang, row.thuc_hien_ky_truoc);
      row.so_sanh_cung_ky = this.calculateDivision(row.thuc_hien_thang, row.thuc_hien_cung_ky);
      row.so_sanh_luy_ke_cung_ky = this.calculateDivision(row.luy_ke_thang, row.luy_ke_cung_ky);
      row.so_sanh_luy_ke_ke_hoach_nam = this.calculateDivision(row.luy_ke_thang, row.ke_hoach_nam);
      row.so_sanh_uoc_6_thang_cung_ky = this.calculateDivision(row.uoc_thuc_hien_6_thang, row.thuc_hien_6_thang_dau_nam_cung_ky);
      row.so_sanh_uoc_6_thang_ke_hoach_nam = this.calculateDivision(row.uoc_thuc_hien_6_thang, row.ke_hoach_nam);
      row.so_sanh_uoc_thuc_hien_nam_cung_ky = this.calculateDivision(row.uoc_thuc_hien_nam, row.thuc_hien_nam_truoc);
      row.so_sanh_ke_hoach_nam_sau_uoc_thuc_hien_nam = this.calculateDivision(row.ke_hoach_nam_sau, row.uoc_thuc_hien_nam);
      row.so_sanh_ke_hoach_nam_sau_thuc_hien_nam = this.calculateDivision(row.ke_hoach_nam_sau, row.luy_ke_thang);
    });
  }

  calculateDivision(devidend: number, devisor: number) {
    if (!devidend || !devisor || devisor == 0)
      return null;
    else
      return Math.round(devidend / devisor * 100) / 100;
  }

  isNumber(any){
    return !isNaN(any)
  }
}
