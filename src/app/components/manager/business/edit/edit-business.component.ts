import { Component, OnInit, OnDestroy, Input, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import { InformationService } from '../../../../shared/information/information.service';
import { MarketService } from "../../../../_services/APIService/market.service";
import {
  CompanyDetailModel,
  CompanyDetailModel1,
  DomesticPriceModel,
} from "../../../../_models/APIModel/domestic-market.model";
import {
  CareerModel,
  DistrictModel,
  SubDistrictModel,
  BusinessTypeModel,
  CSTTModel,
} from "src/app/_models/APIModel/domestic-market.model";
import { MatDialog } from "@angular/material/dialog";
import { DialogBusinessComponent } from "./../../business/Dialog/Dialog-business.component";

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatTableDataSource, MatDatepicker, MatPaginator } from "@angular/material";
import { formatDate } from "@angular/common";
import { Moment } from "moment";
import moment from "moment";
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { trigger, state, style, transition, animate, group } from '@angular/animations';

export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "DD/MM/YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Component({
  selector: "app-edit-business",
  templateUrl: "./edit-business.component.html",
  styleUrls: ['../../manager_layout.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "vi-VI" },

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  // animations: [
  //   trigger('toggleBox', [
  //     // ...
  //     state('open', style({
  //       height: '200px',
  //       backgroundColor: '#061ff0'
  //     })),
  //     state('closed', style({
  //       height: '70px',
  //       backgroundColor: '#E91E63',
  //     })),
  //     transition('open => closed', [
  //       animate('.3s')
  //     ]),
  //     transition('closed => open', [
  //       animate('0.3s')
  //     ]),
  //   ])
  // ]
})
export class EditBusinessComponent implements OnInit {
  message: String;
  dateNK = new FormControl(moment());
  dateXK = new FormControl(moment());

  @Input() company: CompanyDetailModel1;
  mst: string;
  errorMessage: any;
  public career: Array<CareerModel> = new Array<CareerModel>();
  public subdistrict: Array<SubDistrictModel> = new Array<SubDistrictModel>();
  public district: Array<DistrictModel> = new Array<DistrictModel>();
  public tinh: any[] = [{ id: 93, ten_tinh: "Bình Phước" }];
  public Business: Array<BusinessTypeModel> = new Array<BusinessTypeModel>();
  public CSTT: Array<CSTTModel> = new Array<CSTTModel>();
  defaultLogo: string = "../../../../assets/img/brandlogo/company_ph01.jpg";
  SLCSTT: any;
  isCompany: boolean = false;
  dataSourceKNXK: any = [];
  dataSourceKNNK: any = [];
  displayedColumns: String[] = [
    "index",
    "SAN_PHAM",
    "SAN_LUONG",
    "TRI_GIA",
    "DOI_TAC",
    'ACTION'
  ];
  pickedDate = {
    date: new Date(),
  };
  public readonly formatDate = "dd/MM/yyyy";
  public readonly localeDate = "en-US";

  dataSource: MatTableDataSource<any>;
  paginator: any;
  @ViewChild('ImportPaginators', { static: true }) Importpaginator: MatPaginator;
  @ViewChild('ExportPaginators', { static: true }) Exportpaginator: MatPaginator;

  // NK
  periodsNK = ["Tháng", "Quý", "6 Tháng", "Năm"];
  monthsNK: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  quartersNK: any[] = [
    { ma_so: 1, ma_chu: "I" },
    { ma_so: 2, ma_chu: "II" },
    { ma_so: 3, ma_chu: "III" },
    { ma_so: 4, ma_chu: "IV" },
  ];
  selectedHalfNK: number = 1;
  selectedMonthNK: number = 1;
  selectedQuarterNK: number = 0;
  selectedYearNK: number = 2020;
  selectedPeriodNK: string = "Tháng";
  yearsNK: Array<number> = [];
  halfsNK: number[] = [1, 2];

  // XK
  periodsXK = ["Tháng", "Quý", "6 Tháng", "Năm"];
  monthsXK: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  quartersXK: any[] = [
    { ma_so: 1, ma_chu: "I" },
    { ma_so: 2, ma_chu: "II" },
    { ma_so: 3, ma_chu: "III" },
    { ma_so: 4, ma_chu: "IV" },
  ];
  selectedHalfXK: number = 1;
  selectedMonthXK: number = 1;
  selectedQuarterXK: number = 0;
  selectedYearXK: number = 2020;
  selectedPeriodXK: string = "Tháng";
  yearsXK: Array<number> = [];
  halfsXK: number[] = [1, 2];
  products: any;
  nationals: any;
  messageNK: string = "";
  messageXK: string = "";

  constructor(
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public marketService: MarketService,
    public infor: InformationService
  ) {
    this.route.params.subscribe((params) => {
      this.mst = params["mst"];
    });
    this.company = new CompanyDetailModel1();
  }

  isOpen: boolean = false;
  toggle() {
    this.isOpen = !this.isOpen;
  }

  changePeriod(isNK) {
    if (isNK) {
      switch (this.selectedPeriodNK) {
        case "Tháng":
          this.selectedMonthNK = this.GetCurrentMonth();
          this.selectedYearNK = this.GetCurrentYear();
          break;
        case "Quý":
          this.selectedQuarterNK = this.GetCurrentQuarter();
          this.selectedYearNK = this.GetCurrentYear();
          break;
        case "Năm":
          this.selectedYearNK = this.GetCurrentYear();
          break;
        case "6 Tháng":
          this.selectedYearNK = this.GetCurrentYear();
          this.selectedHalfNK = 1;
          break;
        default:
          break;
      }
    } else {
      switch (this.selectedPeriodXK) {
        case "Tháng":
          this.selectedMonthXK = this.GetCurrentMonth();
          this.selectedYearXK = this.GetCurrentYear();
          break;
        case "Quý":
          this.selectedQuarterXK = this.GetCurrentQuarter();
          this.selectedYearXK = this.GetCurrentYear();
          break;
        case "Năm":
          this.selectedYearXK = this.GetCurrentYear();
          break;
        case "6 Tháng":
          this.selectedYearXK = this.GetCurrentYear();
          this.selectedHalfXK = 1;
          break;
        default:
          break;
      }
    }
  }

  GetCurrentMonth() {
    var currentDate = new Date();
    return currentDate.getMonth() + 1;
  }
  GetCurrentYear() {
    var currentDate = new Date();
    return currentDate.getFullYear();
  }
  GetCurrentQuarter() {
    let currentDate = new Date();
    let month = currentDate.getMonth() + 1;
    return month <= 3 ? 1 : month <= 6 ? 2 : month <= 9 ? 3 : 4;
  }
  InitialYears() {
    let returnYear: Array<any> = [];
    let currentDate = new Date();
    let nextYear = currentDate.getFullYear() + 1;
    for (let index = 0; index < 11; index++) {
      returnYear.push(nextYear - index);
    }
    return returnYear;
  }

  getPriceChange(param: any) {
    this.GetDomesticMarketPriceByTime(param._d);
  }

  GetDomesticMarketPriceByTime(time: Date) {
    let formattedDate = formatDate(time, this.formatDate, this.localeDate);
    this.marketService.GetDomesticMarketByTime(formattedDate).subscribe(
      (allrecords) => {
        allrecords.data.forEach((row) => {
          row.thoi_gian_cap_nhat = formatDate(
            row.thoi_gian_cap_nhat,
            this.formatDate,
            this.localeDate
          ).toString();
        });
        this.dataSource = new MatTableDataSource<DomesticPriceModel>(
          allrecords.data
        );
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = "Số hàng";
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
      }
    );
  }
  format(time: Date, format: any, locale: any) {
    throw new Error("Method not implemented.");
  }
  locale(time: Date, format: any, locale: any) {
    throw new Error("Method not implemented.");
  }

  openDialog(mst: string) {
    const dialogRef = this.dialog.open(DialogBusinessComponent, { data: mst });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  open_confirmDialog(element, dataSource) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '150px',
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Yes') {
        if (dataSource === 'NK') {
          this.dataSourceKNNK.data = this.dataSourceKNNK.data.filter(item => item.id !== element.id);
          this.dataSourceKNNK.paginator = this.Importpaginator;
          if (this.dataSourceKNNK.data.length === 0) {
            this.messageNK = 'Không tìm thấy dữ liệu !!'
          }
        } else {
          this.dataSourceKNXK.data = this.dataSourceKNXK.data.filter(item => item.id !== element.id);
          this.dataSourceKNXK.paginator = this.Exportpaginator;
          if (this.dataSourceKNXK.data.length === 0) {
            this.messageXK = 'Không tìm thấy dữ liệu !!'
          }
        }
      }
    });
  }

  public readonly DEFAULT_PERIOD = "Tháng";

  ngOnInit() {
    // this.kiemtraUser();
    this.GetCompanyInfoById();
    this.GetAllNganhNghe();
    this.GetAllPhuongXa();
    this.getQuan_Huyen();
    this.GetAllLoaiHinh();
    // this.GetAllCSTT();

    this.selectedPeriodNK = this.DEFAULT_PERIOD;
    this.selectedPeriodXK = this.DEFAULT_PERIOD;
    this.selectedYearNK = this.GetCurrentYear();
    this.selectedYearXK = this.GetCurrentYear();
    this.selectedMonthNK = this.GetCurrentMonth();
    this.selectedMonthXK = this.GetCurrentMonth();
    this.yearsNK = this.InitialYears();
    this.yearsXK = this.InitialYears();

    // this.getKNNK();
    // this.getKNXK();

    this.getAllProducts();
  }

  companyList1: Array<CompanyDetailModel1> = new Array<CompanyDetailModel1>();
  companyList2: Array<CompanyDetailModel1> = new Array<CompanyDetailModel1>();
  companyList3: Array<CompanyDetailModel1> = new Array<CompanyDetailModel1>();
  companyList4: Array<CompanyDetailModel1> = new Array<CompanyDetailModel1>();
  companyList5: Array<CompanyDetailModel1> = new Array<CompanyDetailModel1>();

  public GetCompanyInfoById() {
    this.marketService.GetCompanyInfoById(this.mst).subscribe(
      (allrecords) => {
        this.companyList1 = allrecords.data[0]
        this.companyList2 = allrecords.data[1]
        this.companyList3 = this.companyList1.map(x => {
          let temp = this.companyList2.find(y => y.mst === x.mst)
          if (temp) {
            x.ma_nganh_nghe = temp.ma_nganh_nghe
            x.ten_nganh_nghe = temp.ten_nganh_nghe
            x.nganh_nghe_kd_chinh = temp.nganh_nghe_kd_chinh
            x.id_nganh_nghe_kd = temp.id_nganh_nghe_kd
          }
          else {
            x.ma_nganh_nghe = null
            x.ten_nganh_nghe = null
            x.nganh_nghe_kd_chinh = null
            x.id_nganh_nghe_kd = null
          }
          return x
        })

        this.companyList4 = allrecords.data[2]

        this.companyList5 = this.companyList3.map(z => {
          let temp1 = this.companyList4.find(w => w.mst = z.mst)
          if (temp1) {
            z.so_giay_phep = temp1.so_giay_phep
            z.ngay_cap = temp1.ngay_cap
            z.ngay_het_han = temp1.ngay_het_han
          }
          return z
        })

        let temp2 = this.companyList5
        let temp3 = temp2.reduce(Object)
        this.company = temp3
        console.log(this.company)
      },
      (error) => (this.errorMessage = <any>error)
    );
  }

  getAllProducts() {
    this.marketService.GetAllProduct().subscribe(data => {
      if (data['data'].length !== 0) {
        this.products = data['data'];
      }
    })
  }

  GetAllNganhNghe() {
    this.marketService.GetAllCareer().subscribe((allrecords) => {
      this.career = allrecords.data as CareerModel[];
      console.log(this.career)
    });
  }

  GetAllPhuongXa() {
    this.marketService.GetAllSubDistrict().subscribe((allrecords) => {
      this.subdistrict = allrecords.data as SubDistrictModel[];
    });
  }

  getQuan_Huyen() {
    this.marketService.GetAllDistrict().subscribe((allDistrict) => {
      this.district = allDistrict["data"] as DistrictModel[];

    });
  }

  GetAllLoaiHinh() {
    this.marketService.GetAllBusinessType().subscribe((allrecords) => {
      this.Business = allrecords.data as BusinessTypeModel[];
    });
  }

  // handleReportMode(selectedPeriod) {
  //   switch (selectedPeriod) {
  //     case "Tháng":
  //       return 1;
  //     case "Quý":
  //       return 2;
  //     case "6 Tháng":
  //       return 3;
  //     default:
  //       break;
  //   }
  // }

  // handlePeriod(selectedPeriod, type) {
  //   if (selectedPeriod === 'Tháng' && type === 'NK') {
  //     return this.selectedMonthNK;
  //   }
  //   if (selectedPeriod === 'Tháng' && type === 'XK') {
  //     return this.selectedMonthXK;
  //   }

  //   if (selectedPeriod === 'Quý' && type === 'NK') {
  //     return this.selectedQuarterNK;
  //   }
  //   if (selectedPeriod === 'Quý' && type === 'XK') {
  //     return this.selectedQuarterXK;
  //   }

  //   if (selectedPeriod === '6 Tháng' && type === 'NK') {
  //     return this.selectedHalfNK;
  //   }
  //   if (selectedPeriod === '6 Tháng' && type === 'XK') {
  //     return this.selectedHalfXK;
  //   }
  // }

  // kiemtraUser() {
  //   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  //   if (!currentUser.username.includes("admin")) {
  //     this.isCompany = true;
  //   }
  // }

  // findKNNK() {
  //   this.getKNNK()
  // }

  // findKNXK() {
  //   this.getKNXK();
  // }

  // getKNNK() {
  //   let report_mode = this.handleReportMode(this.selectedPeriodNK);
  //   let year = this.selectedYearNK;
  //   let period = this.handlePeriod(this.selectedPeriodNK, 'NK')
  //   this.marketService.GetKNNK(this.mst, report_mode, year, period)
  //     .subscribe((data) => {
  //       if (data["data"]) {
  //         let dataTable = data["data"]
  //         this.dataSourceKNNK = new MatTableDataSource<any>(dataTable)
  //         this.dataSourceKNNK.paginator = this.Importpaginator;
  //         if (this.Importpaginator) {
  //           this.Importpaginator._intl.itemsPerPageLabel = 'Số hàng';
  //           this.Importpaginator._intl.firstPageLabel = "Trang Đầu";
  //           this.Importpaginator._intl.lastPageLabel = "Trang Cuối";
  //           this.Importpaginator._intl.previousPageLabel = "Trang Trước";
  //           this.Importpaginator._intl.nextPageLabel = "Trang Tiếp";
  //         }
  //         this.messageNK = "";
  //       }
  //       if (data['data'].length === 0) {
  //         this.messageNK = "Không tìm thấy dữ liệu !!";
  //       }
  //     });
  // }

  // getKNXK() {
  //   let report_mode = this.handleReportMode(this.selectedPeriodXK);
  //   let year = this.selectedYearXK;
  //   let period = this.handlePeriod(this.selectedPeriodXK, 'XK');
  //   this.marketService.GetKNXK(this.mst, report_mode, year, period)
  //     .subscribe((data) => {
  //       if (data["data"]) {
  //         this.dataSourceKNXK = data["data"];
  //         this.dataSourceKNXK = new MatTableDataSource(data["data"]);
  //         this.dataSourceKNXK.paginator = this.Exportpaginator;
  //         if (this.Exportpaginator) {
  //           this.Exportpaginator._intl.itemsPerPageLabel = 'Số hàng';
  //           this.Exportpaginator._intl.firstPageLabel = "Trang Đầu";
  //           this.Exportpaginator._intl.lastPageLabel = "Trang Cuối";
  //           this.Exportpaginator._intl.previousPageLabel = "Trang Trước";
  //           this.Exportpaginator._intl.nextPageLabel = "Trang Tiếp";
  //         }
  //         this.messageXK = "";
  //       }
  //       if (data['data'].length === 0) {
  //         this.messageXK = "Không tìm thấy dữ liệu !!";
  //       }
  //     });
  // }

  // Them_dong_NK() {
  //   this.messageNK = "";
  //   let dataSource = [...this.dataSourceKNNK.data];
  //   let new_ob = {
  //     id: Math.floor(Math.random() * 100000) + 1,
  //     id_san_pham: 0,
  //     san_luong: 0,
  //     tri_gia: 0,
  //     id_quoc_gia: "",
  //     id_kn_nhap_khau: 2
  //   };
  //   dataSource.push(new_ob);
  //   this.dataSourceKNNK = new MatTableDataSource([...dataSource]);
  //   this.dataSourceKNNK.paginator = this.Importpaginator;
  // }

  // Save_NK() {
  //   let ob_update = [...this.dataSourceKNNK.data];
  //   let data = ob_update.map(item => {
  //     let new_ob = {
  //       id_san_pham: item.id_san_pham,
  //       san_luong: item.san_luong,
  //       tri_gia: item.tri_gia,
  //       thi_truong: item.thi_truong,
  //       id_kn_xuat_nhap_khau: item.id_kn_xuat_nhap_khau
  //     };
  //     return new_ob
  //   });
  //   let report_mode, period;
  //   switch (this.selectedPeriodNK) {
  //     case 'Tháng':
  //       report_mode = 1;
  //       period = this.selectedMonthNK;
  //       break;
  //     case 'Quý':
  //       report_mode = 2;
  //       period = this.selectedQuarterNK;
  //       break;
  //     case '6 Tháng':
  //       report_mode = 3;
  //       period = this.selectedHalfNK;
  //       break;
  //     default:
  //       break;
  //   }
  //   this.marketService.UpdateKNNK(data, report_mode, this.mst, this.selectedYearNK, period).subscribe(data => {
  //     if (data['message']) {
  //       this.infor.msgSuccess(data['message'])
  //     } else {
  //       this.infor.msgError('Lưu thông tin chưa thông công !!')
  //     }
  //   })
  // }

  // Them_dong_XK() {
  //   this.messageXK = "";
  //   let dataSource = [...this.dataSourceKNXK.data];
  //   let new_ob = {
  //     id: Math.floor(Math.random() * 100000) + 1,
  //     id_san_pham: 0,
  //     san_luong: 0,
  //     tri_gia: 0,
  //     thi_truong: "",
  //     id_kn_nhap_khau: 2
  //   };
  //   dataSource.push(new_ob);
  //   this.dataSourceKNXK.data = new MatTableDataSource([...dataSource]);
  //   this.dataSourceKNXK.paginator = this.Exportpaginator;
  // }

  // Save_XK() {
  //   let ob_update = [...this.dataSourceKNXK.data];
  //   let data = ob_update.map(item => {
  //     let new_ob = {
  //       id_san_pham: item.id_san_pham,
  //       san_luong: item.san_luong,
  //       tri_gia: item.tri_gia,
  //       thi_truong: item.thi_truong,
  //       id_kn_xuat_nhap_khau: item.id_kn_xuat_nhap_khau
  //     };
  //     return new_ob
  //   });
  //   let report_mode, period;
  //   switch (this.selectedPeriodXK) {
  //     case 'Tháng':
  //       report_mode = 1;
  //       period = this.selectedMonthXK;
  //       break;
  //     case 'Quý':
  //       report_mode = 2;
  //       period = this.selectedQuarterXK;
  //       break;
  //     case '6 Tháng':
  //       report_mode = 3;
  //       period = this.selectedHalfXK;
  //       break;
  //     default:
  //       break;
  //   }
  //   this.marketService.UpdateKNXK(data, report_mode, this.mst, this.selectedYearNK, period).subscribe(data => {
  //     if (data['message']) {
  //       this.infor.msgSuccess(data['message'])
  //     } else {
  //       this.infor.msgError('Lưu thông tin chưa thông công !!')
  //     }
  //   })
  // }

  // DeleteNK(element) {
  //   this.open_confirmDialog(element, 'NK');
  //   // this.dataSourceKNNK = this.dataSourceKNNK.filter(item => item.id !== element.id);
  // }

  // DeleteXK(element) {
  //   this.open_confirmDialog(element, 'XK');
  //   // this.dataSourceKNXK = this.dataSourceKNXK.filter(item => item.id !== element.id);
  // }

  // GetAllCSTT() {
  //   this.marketService.GetAllBasebyid(this.mst).subscribe((allrecords) => {
  //     this.CSTT = allrecords.data as CSTTModel[];
  //     this.SLCSTT = this.CSTT.length;
  //   });
  // }

  // back() {
  //   window.history.back();
  // }
}
