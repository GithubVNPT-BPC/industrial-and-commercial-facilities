import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatTableDataSource,
  MatDialog,
  MatDialogConfig,
} from "@angular/material";

import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { SCTService } from "src/app/_services/APIService/sct.service";
import { Chart } from 'chart.js';
import { DashboardService } from 'src/app/_services/APIService/dashboard.service';

import { new_import_export_model } from "src/app/_models/APIModel/export-import.model";
import { exportimportchart, ProductModel } from 'src/app/_models/APIModel/domestic-market.model';

import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { formatDate } from '@angular/common';
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
    public dialog: MatDialog,
    public dashboardService: DashboardService) {
    super(injector);
  }

  public date = new FormControl();
  public newdate = new FormControl(_moment());
  public theYear: number;
  public theMonth: number;
  public stringmonth: string
  public time: string
  public timechange: number
  public month: string

  convertstringtodate(time: string): Date {
    let year = parseInt(time.substring(0, 4));
    let month = parseInt(time.substring(4, 6));
    let day = parseInt(time.substring(6, 8));

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

    if (this.dataTargetId == 1) {
      this.getDanhSachNhapKhau(this.timechange)
    }
    else {
      this.getDanhSachNhapKhauTC(this.timechange)
    }

    this.month = this.time.substring(4, 6)
  }

  dataTargets: any[] = [
    { id: 1, unit: "Cục hải quan" },
    { id: 2, unit: "Tổng cục hải quan" },
  ];
  dataTargetId = 1;
  dataTargetId1 = 1;

  displayedColumns = [
    // "index",
    "tt",
    "ten_san_pham",
    "don_vi_tinh",
    "gia_tri_thang",
    // "uoc_th_so_cungky_tht",
    // "uoc_th_so_thg_truoc_tht",

    "gia_tri_cong_don",
    // "uoc_th_so_cungky_cong_don",
    // "uoc_th_so_thg_truoc_cong_don",
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
    this.GetProduct();
    this.defaultcode = 55
    this.tuthang = this.firstmonth.value
    this.denthang = this.presentmonth.value
    this.productcode = 55

    // this.month = this.getCurrentMonth().substring(4, 6)
    // this.timechange = parseInt(this.getCurrentMonth())
    this.getDanhSachNhapKhau(0);
    super.ngOnInit();

    this.profilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterThuongnhan();
      });
  }

  public _onDestroy = new Subject<void>();

  getDanhSachNhapKhau(time_id: number) {
    this.sctService.GetDanhSachNhapKhau(time_id).subscribe((result) => {
      this.setDataExport(result.data[0]);
      this.setDatabusiness(result.data[1]);
      this.setDataExportDetail(result.data[2]);
      if(time_id == 0){
        this.month = result.data[3][0].timechange.toString().substring(4, 6)
        this.date = new FormControl(_moment(this.convertstringtodate((result.data[3][0].timechange.toString() + '01'))))
      }
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

  applyDataTarget1(event) {
    this.dataTargetId1 = event.value

    this.lineChart.config.data.datasets = []
    this.lineChartMethod(this.tuthang, this.denthang, this.productcode, this.dataTargetId1);
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

  public firstmonth = new FormControl(_moment().startOf('year').format('yyyyMM'));
  public presentmonth = new FormControl(_moment().format('yyyyMM'));

  @ViewChild('lineCanvas', { static: false }) lineCanvas: ElementRef;
  lineChart: any;

  defaultcode: number
  tuthang: string
  denthang: string
  productcode: number

  timelist: string[]
  trigiathang: number[]
  trigiacongdon: number[]

  ngAfterViewInit(): void {
    this.lineChartMethod(this.tuthang, this.denthang, this.productcode, this.dataTargetId1);
  }

  importchart: Array<exportimportchart> = new Array<exportimportchart>();

  lineChartMethod(tuthang: string, denthang: string, productcode: number, istongcuc: number) {
    let self = this;
    this.dashboardService.GetImportChart(tuthang, denthang, productcode, istongcuc).subscribe(
      all => {
        this.importchart = all.data
        this.timelist = this.importchart.map(x => this.Convertdate(x.time_id.toString()))
        this.trigiathang = this.importchart.map(x => x.tri_gia_thang)
        this.trigiacongdon = this.importchart.map(x => x.tri_gia_cong_don)

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
          type: 'line',
          data: {
            labels: this.timelist,
            datasets: [
              {
                label: 'Thực hiện tháng ' + self.month,
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
                data: this.trigiathang,
                spanGaps: false,
              },
              {
                label: 'Thực hiện ' + self.month + ' tháng',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgb(0, 0, 255)',
                borderColor: 'rgb(0, 0, 255)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgb(0, 0, 255)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgb(0, 0, 255)',
                pointHoverBorderColor: 'rgb(0, 0, 255)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.trigiacongdon,
                spanGaps: false,
              }
            ]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  callback: function(value, index, values) {
                    return self.numberWithDot(value) + ' tr $';
                  }
                },
              }],
            }
          }
        });
      },
    );
  }

  numberWithDot(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  products: Array<ProductModel> = new Array<ProductModel>();
  filterproducts: ReplaySubject<ProductModel[]> = new ReplaySubject<ProductModel[]>(1);
  GetProduct() {
    this.dashboardService.GetProductListAll().subscribe((allrecords) => {
      this.products = allrecords.data.filter(x => x.xnk == 2) as ProductModel[];
      this.filterproducts.next(this.products.slice());
    });
  }
  public profilter: FormControl = new FormControl();
  public filterThuongnhan() {
    if (!this.products) {
      return;
    }
    let search = this.profilter.value;
    if (!search) {
      this.filterproducts.next(this.products.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filterproducts.next(
      this.products.filter(x => x.ten_san_pham.toLowerCase().indexOf(search) > -1)
    );
  }

  applyfilter(event) {
    this.productcode = event.value
    this.lineChart.config.data.datasets = []
    this.lineChartMethod(this.tuthang, this.denthang, this.productcode, this.dataTargetId1);
  }

  Convertdate(text: string): string {
    let date: string
    date = text.substr(4, 2) + "-" + text.substring(0, 4)
    return date
  }

  public date1 = new FormControl(_moment().startOf('year').format('yyyyMM'));
  public newdate1 = new FormControl(_moment());

  public chosenYearHandler1(normalizedYear: Moment) {
    this.date1 = this.newdate1
    const ctrlValue = this.date1.value;
    ctrlValue.year(normalizedYear.year());
    this.date1.setValue(ctrlValue);
    this.theYear = normalizedYear.year();
  }

  public chosenMonthHandler1(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date1.value;
    ctrlValue.month(normalizedMonth.month());
    this.date1.setValue(ctrlValue);
    this.theMonth = normalizedMonth.month() + 1;
    datepicker.close();

    if (this.theMonth >= 10) {
      this.stringmonth = this.theMonth.toString();
    }
    else {
      this.stringmonth = "0" + this.theMonth.toString()
    }
    this.time = this.theYear.toString() + this.stringmonth

    this.tuthang = this.time
    this.lineChart.config.data.datasets = []
    this.lineChartMethod(this.tuthang, this.denthang, this.productcode, this.dataTargetId1);
  }

  public date2 = new FormControl(_moment());
  public newdate2 = new FormControl(_moment());

  public chosenYearHandler2(normalizedYear: Moment) {
    this.date2 = this.newdate2
    const ctrlValue = this.date2.value;
    ctrlValue.year(normalizedYear.year());
    this.date1.setValue(ctrlValue);
    this.theYear = normalizedYear.year();
  }

  public chosenMonthHandler2(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date2.value;
    ctrlValue.month(normalizedMonth.month());
    this.date2.setValue(ctrlValue);
    this.theMonth = normalizedMonth.month() + 1;
    datepicker.close();

    if (this.theMonth >= 10) {
      this.stringmonth = this.theMonth.toString();
    }
    else {
      this.stringmonth = "0" + this.theMonth.toString()
    }
    this.time = this.theYear.toString() + this.stringmonth

    this.denthang = this.time
    this.lineChart.config.data.datasets = []
    this.lineChartMethod(this.tuthang, this.denthang, this.productcode, this.dataTargetId1);
  }

}
