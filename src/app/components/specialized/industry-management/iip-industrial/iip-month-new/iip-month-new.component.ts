import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  MatTableDataSource,
  MatAccordion,
  MatPaginator,
  MatDialog,
  MatDialogConfig,
} from "@angular/material";
import { SCTService } from "src/app/_services/APIService/sct.service";
import { new_model, chartmodel } from "src/app/_models/APIModel/export-import.model";
import { MarketService } from "src/app/_services/APIService/market.service";
import { MatSort } from "@angular/material/sort";
import { LinkModel } from "src/app/_models/link.model";
import { BreadCrumService } from "src/app/_services/injectable-service/breadcrums.service";
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ChartOptions, ChartDataSets, ChartType, Chart } from 'chart.js';

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
  selector: 'app-iip-month-new',
  templateUrl: './iip-month-new.component.html',
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
export class IipMonthNewComponent implements OnInit {

  private readonly LINK_DEFAULT: string ="/specialized/industry-management/iip/iip-detail";
  private readonly TITLE_DEFAULT: string = "Chỉ số sản xuất công nghiệp";
  private readonly TEXT_DEFAULT: string = "Chỉ số sản xuất công nghiệp";

  public date = new FormControl(_moment());
  public newdate = new FormControl(_moment());
  d = new Date();
  public theYear: number = this.d.getFullYear();
  public theMonth: number = this.d.getMonth() + 1;
  public stringmonth: string
  public time: string
  public timechange: number
  public month: string
  fields: { stt: string; ten_chi_tieu: string; don_vi_tinh: string; thuc_hien_ky_truoc: string; thuc_hien_cung_ky: string; thuc_hien_thang: string; ke_hoach_nam: string; luy_ke_thang: string; luy_ke_cung_ky: string; so_sanh_ky_truoc: string; so_sanh_cung_ky: string; so_sanh_luy_ke_cung_ky: string; so_sanh_luy_ke_ke_hoach_nam: string; ke_hoach_nam_sau: string; thuc_hien_6_thang_dau_nam_cung_ky: string; uoc_thuc_hien_thang_6: string; uoc_thuc_hien_6_thang: string; so_sanh_uoc_6_thang_cung_ky: string; so_sanh_uoc_6_thang_ke_hoach_nam: string; thuc_hien_nam_truoc: string; uoc_thuc_hien_nam: string; so_sanh_uoc_thuc_hien_nam_cung_ky: string; so_sanh_ke_hoach_nam_sau_uoc_thuc_hien_nam: string; so_sanh_ke_hoach_nam_sau_thuc_hien_nam: string; };
  public href_file: string = '';
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

    this.GetDanhSachCSSXCN(this.timechange)
    this.lineChart.config.data.datasets = []
    this.lineChartMethod(this.theYear);

    this.month = this.time.substring(5, 6);
    this.displayedColumns = this.excelService.initialdisplayedColumns(this.theMonth);
    this.href_file = this.excelService.getHref();
  }

  displayedColumns = [
    // "index",
    "stt",
    "ten_chi_tieu",
    "don_vi_tinh",
    
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
    public marketService: MarketService,
    public excelService: ExcelService,
    private _breadCrumService: BreadCrumService,
    private excelServices: ExcelServicesService,
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
          // data.forEach(item => {
          //   let datarow: new_model = new new_model();
          //   datarow.id_chi_tieu = item['ID'];
          //   datarow.san_luong_thang = 0;
          //   datarow.tri_gia_thang = item['TH tháng'] ? item['TH tháng'] : 0;
          //   datarow.uoc_thang_so_voi_ki_truoc = item['ƯTH so Tháng cùng kỳ'] ? item['ƯTH so Tháng cùng kỳ'] : 0;
          //   datarow.uoc_thang_so_voi_thang_truoc = item['ƯTH so tháng trước'] ? item['ƯTH so tháng trước'] : 0;
          //   datarow.san_luong_cong_don = 0;
          //   datarow.tri_gia_cong_don = item['TH tháng (Cộng dồn)'] ? item['TH tháng (Cộng dồn)'] : 0;
          //   datarow.uoc_cong_don_so_voi_ki_truoc = item['ƯTH so với cùng kỳ (Cộng dồn)'] ? item['ƯTH so với cùng kỳ (Cộng dồn)'] : 0;
          //   datarow.uoc_cong_don_so_voi_cong_don_truoc = item['ƯTH so kế hoạch năm (Cộng dồn)'] ? item['ƯTH so kế hoạch năm (Cộng dồn)'] : 0;
          //   this.prototype.push(datarow)
          // });
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
        return this.excelService.mappingDataSource1(data);

      case 2:
      case 3:
      case 4:
        return this.excelService.mappingDataSource234(data);

      case 5:
      case 6:
        return this.excelService.mappingDataSource56(data);

      case 7:
      case 8:
      case 9:
      case 11:
        return this.excelService.mappingDataSource78911(data);

      case 10:
        return this.excelService.mappingDataSource78911(data);

      case 12:
        return this.excelService.mappingDataSource12(data);
      default:
        break;
    }
  }

  public save(month: number, prototype: Array<new_model>) {
    this.sctService.CapNhatDuLieuCSSXThang(month, prototype).subscribe(
      next => {
        if (next.id == -1) {
          this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
        }
        else {
          this._infor.msgSuccess("Dữ liệu được lưu thành công!");
          this.GetDanhSachCSSXCN(this.timechange)
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
    this.month = this.getCurrentMonth().substring(5, 6)
    this.timechange = parseInt(this.getCurrentMonth())
    this.GetDanhSachCSSXCN(this.timechange);
    this.autoOpen();
    this.sendLinkToNext(true);
    if (this._login.userValue.user_role_id == 5 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }

    this.displayedColumns = this.excelService.initialdisplayedColumns(new Date().getMonth() + 1);
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

  GetDanhSachCSSXCN(time_id: number) {
    this.sctService.GetDanhSachCSSX(time_id).subscribe((result) => {
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
      this.setSumaryData(result.data[0] ? result.data[0] : 0)
    });
  }

  TongGiaTriThangThucHien: number = 0;
  uth_so_cungky: number = 0;
  TongGiaTriCongDon: number = 0;
  uth_so_khn: number = 0;

  setSumaryData(data) {
    this.TongGiaTriThangThucHien = data != 0 ? data[0].tri_gia_thang : 0;
    this.uth_so_cungky = data != 0 ? data[0].uoc_thang_so_voi_ki_truoc : 0;
    this.TongGiaTriCongDon = data != 0 ? data[0].tri_gia_cong_don : 0;
    this.uth_so_khn = data != 0 ? data[0].uoc_cong_don_so_voi_cong_don_truoc : 0;
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

  @ViewChild('lineCanvas', { static: false }) lineCanvas: ElementRef;
  lineChart: any;

  timelist: string[] = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
  thuchienthang: any[]

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.lineChartMethod(parseInt(this.getCurrentYear()));
  }

  public getCurrentYear(): string {
    let date = new Date;
    return formatDate(date, 'yyyy', 'en-US');
  }

  chart: Array<chartmodel> = new Array<chartmodel>();

  lineChartMethod(time_id: number) {
    this.sctService.GetDanhSachCSSXTongHop(time_id).subscribe(
      res => {
        this.chart = res.data[0]

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
          type: 'line',
          data: {
            labels: this.timelist,
            datasets: [
              {
                label: 'Chỉ số sản xuất công nghiệp (IIP) so với cùng kỳ theo giá so sánh năm 2010',
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

}
