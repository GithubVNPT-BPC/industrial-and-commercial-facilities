//Import Library
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, isEmpty } from 'rxjs/operators';
import { MatTableFilter } from 'mat-table-filter';
//Import Component

//Import Model
import { HeaderMerge, ReportAttribute, ReportDatarow, ReportIndicator, ReportOject, ReportTable, ToltalHeaderMerge } from '../../../../../_models/APIModel/report.model';
//Import Service
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ControlService } from '../../../../../_services/APIService/control.service';
import { ReportDirective } from 'src/app/shared/report.directive';
import { KeyboardService } from 'src/app/shared/services/keyboard.service';
import { InformationService } from 'src/app/shared/information/information.service';
import { ReportService } from 'src/app/_services/APIService/report.service';
import * as moment from 'moment';
import { CompanyDetailModel } from 'src/app/_models/APIModel/domestic-market.model';
import { TreeviewConfig, TreeviewItem, TreeviewModule } from 'ngx-treeview';
import { element } from 'protractor';
import { MarketCommonModel, SuperMarketCommonModel, SuperMarketFilterModel } from 'src/app/_models/APIModel/commecial-management.model';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { District } from 'src/app/_models/district.model';

interface HashTableNumber<T> {
  [key: string]: T;
}

@Component({
  selector: 'app-supermarket-commecial',
  templateUrl: './supermarket-commecial.component.html',
  styleUrls: ['../../../special_layout.scss'],
})

export class SuperMarketCommecialManagementComponent implements OnInit {
  //Constant-------------------------------------------------------------------------
  public readonly RANK_LABLE = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) { return `0 của ${length}`; }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} của ${length}`;
  }
  //
  private _conditionArray: HashTableNumber<string[]> = {};
  private _tableData: MatTableDataSource<SuperMarketCommonModel> = new MatTableDataSource<SuperMarketCommonModel>();

  public tongSieuThi: number;
  public sieuThiTongHop: number;
  public sieuThiChuyenDanh: number;
  //
  public sieuThiHangI: number;
  public sieuThiHangII: number;
  public sieuThiHangIII: number;
  //
  public sieuThiDauTuTrongNam: number;
  public sieuThiDauTuNamTruoc: number;
  public sieuThiDauTuNamTruoc1: number;
  public sieuThiNgungHoatDong: number;
  public sieuThiDangXayDung: number;
  //
  public filterModel: SuperMarketFilterModel = new SuperMarketFilterModel();
  public year: number;

  //Viewchild & Input-----------------------------------------------------------------------
  @ViewChildren(ReportDirective) inputs: QueryList<ReportDirective>
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HTTM - Siêu thị');

    XLSX.writeFile(wb, 'HTTM - Siêu thị.xlsx');

  }
  //Variable for HTML&TS-------------------------------------------------------------------------
  public readonly districts: District[] = [{ id: 1, ten_quan_huyen: 'Phước Long' },
  { id: 2, ten_quan_huyen: 'Đồng Xoài' },
  { id: 3, ten_quan_huyen: 'Bình Long' },
  { id: 4, ten_quan_huyen: 'Bù Gia Mập' },
  { id: 5, ten_quan_huyen: 'Lộc Ninh' },
  { id: 6, ten_quan_huyen: 'Bù Đốp' },
  { id: 7, ten_quan_huyen: 'Hớn Quản' },
  { id: 8, ten_quan_huyen: 'Đồng Phú' },
  { id: 9, ten_quan_huyen: 'Bù Đăng' },
  { id: 10, ten_quan_huyen: 'Chơn Thành' },
  { id: 11, ten_quan_huyen: 'Phú Riềng' }];
  public readonly phanloais: any[] = [{ value: "I", text: "Loại I" }
    , { value: "II", text: "Loại II" }
    , { value: "III", text: "Loại III" }]

  // headerArray = ['index', 'tenhuyenthi', 'ten_tttm', 'dientich', 'vondautu', 'namdautuxaydung', 'phanloai'];

  headerArray = ['index', 'ten_sieu_thi_TTTM', 'dia_diem', 'dia_ban', 'nha_nuoc', 'ngoai_nha_nuoc', 'co_von_dau_tu_nuoc_ngoai', 'von_khac', 'tong_hop',
    'chuyen_doanh', 'nam_xay_dung', 'nam_ngung_hoat_dong', 'dien_tich_dat', 'phan_hang', 'so_lao_dong', 'ten_chu_dau_tu',
    'giay_dang_ky_kinh_doanh', 'dia_chi', 'dien_thoai', 'ho_va_ten', 'dia_chi1', 'dien_thoai1',
  ];

  dataHuyenThi: Array<SuperMarketCommonModel> = [
    {
      ten_sieu_thi_TTTM: 'Siêu thị Co.opMart Đồng Xoài',
      dia_diem: 'Đường Phú Riềng Đỏ, phường Tân Bình, thị xã Đồng Xoài, tỉnh Bình Phước',
      id_dia_ban: 2,
      dia_ban: 'Đồng Xoài',
      nha_nuoc: 30000,
      ngoai_nha_nuoc: null,
      co_von_dau_tu_nuoc_ngoai: null,
      von_khac: null,
      tong_hop: 'Hàng tiêu dùng',
      chuyen_doanh: null,
      nam_xay_dung: '2009',
      nam_ngung_hoat_dong: null,
      dien_tich_dat: 3107,
      phan_hang: 'II',
      so_lao_dong: 137,
      ten_chu_dau_tu: 'Công ty TNHH Cao Phong',
      giay_dang_ky_kinh_doanh: null,
      dia_chi: null,
      dien_thoai: null,
      ho_va_ten: null,
      dia_chi1: null,
      dien_thoai1: null
    },
    {
      ten_sieu_thi_TTTM: 'Siêu thị điện máy nội thất Chợ Lớn, chi nhánh Bình Phước',
      dia_diem: '658 Phú Riềng Đỏ, KP.Tân Trà, P. Tân Xuân, TX Đồng Xoài, Bình Phước',
      id_dia_ban: 2,
      dia_ban: 'Đồng Xoài',
      nha_nuoc: null,
      ngoai_nha_nuoc: 5000,
      co_von_dau_tu_nuoc_ngoai: null,
      von_khac: null,
      tong_hop: null,
      chuyen_doanh: 'Điện máy, nội thất',
      nam_xay_dung: '2017',
      nam_ngung_hoat_dong: null,
      dien_tich_dat: 4000,
      phan_hang: 'III',
      so_lao_dong: 20,
      ten_chu_dau_tu: 'DNTN Trọng Ngư',
      giay_dang_ky_kinh_doanh: null,
      dia_chi: null,
      dien_thoai: null,
      ho_va_ten: null,
      dia_chi1: null,
      dien_thoai1: null
    },
    {
      ten_sieu_thi_TTTM: 'Siêu thị Phương Lan',
      dia_diem: 'Phường Phước Bình, thị xã Phước Long, tỉnh Bình Phước',
      id_dia_ban: 1,
      dia_ban: 'Phước Long',
      nha_nuoc: null,
      ngoai_nha_nuoc: 15000,
      co_von_dau_tu_nuoc_ngoai: null,
      von_khac: null,
      tong_hop: 'Hàng tiêu dùng',
      chuyen_doanh: null,
      nam_xay_dung: '2014',
      nam_ngung_hoat_dong: null,
      dien_tich_dat: 800,
      phan_hang: 'III',
      so_lao_dong: 20,
      ten_chu_dau_tu: 'Công ty TNHH TMDV Sài Gòn - Bình Phước',
      giay_dang_ky_kinh_doanh: null,
      dia_chi: null,
      dien_thoai: null,
      ho_va_ten: null,
      dia_chi1: null,
      dien_thoai1: null
    },
    {
      ten_sieu_thi_TTTM: 'Siêu thị Co.opMart Đồng Phú',
      dia_diem: 'thị trấn Tân Phú, huyện Đồng Phú',
      id_dia_ban: 8,
      dia_ban: 'Đồng Phú',
      nha_nuoc: 20000,
      ngoai_nha_nuoc: null,
      co_von_dau_tu_nuoc_ngoai: null,
      von_khac: null,
      tong_hop: 'Hàng tiêu dùng',
      chuyen_doanh: null,
      nam_xay_dung: '2019',
      nam_ngung_hoat_dong: null,
      dien_tich_dat: 3000,
      phan_hang: 'II',
      so_lao_dong: 50,
      ten_chu_dau_tu: 'Công ty Cổ phần TM DV The Gold Mart',
      giay_dang_ky_kinh_doanh: null,
      dia_chi: null,
      dien_thoai: null,
      ho_va_ten: null,
      dia_chi1: null,
      dien_thoai1: null
    },
    {
      ten_sieu_thi_TTTM: 'Siêu thị The Gold Mart ',
      dia_diem: 'đường Tôn Đức Thắng, ấp 2, xã Tiến Thành, thị xã Đồng Xoài, tỉnh Bình Phước',
      id_dia_ban: 2,
      dia_ban: 'Đồng Xoài',
      nha_nuoc: null,
      ngoai_nha_nuoc: 40000,
      co_von_dau_tu_nuoc_ngoai: null,
      von_khac: null,
      tong_hop: 'Hàng tiêu dùng',
      chuyen_doanh: null,
      nam_xay_dung: '2019',
      nam_ngung_hoat_dong: null,
      dien_tich_dat: 4500,
      phan_hang: 'II',
      so_lao_dong: null,
      ten_chu_dau_tu: 'CÔNG TY CỔ PHẦN THẾ GIỚI DI ĐỘNG',
      giay_dang_ky_kinh_doanh: null,
      dia_chi: null,
      dien_thoai: null,
      ho_va_ten: null,
      dia_chi1: null,
      dien_thoai1: null
    },
    {
      ten_sieu_thi_TTTM: 'Siêu thị điện máy xanh Bình Phước',
      dia_diem: 'Phường Tân Thiện, thị xã Đồng Xoài,',
      id_dia_ban: 2,
      dia_ban: 'Đồng Xoài',
      nha_nuoc: null,
      ngoai_nha_nuoc: 50000,
      co_von_dau_tu_nuoc_ngoai: null,
      von_khac: null,
      tong_hop: null,
      chuyen_doanh: 'Điện máy, nội thất',
      nam_xay_dung: '2016',
      nam_ngung_hoat_dong: null,
      dien_tich_dat: 3400,
      phan_hang: 'III',
      so_lao_dong: null,
      ten_chu_dau_tu: 'Công ty TNHH MTV siêu thị Gia Đình',
      giay_dang_ky_kinh_doanh: null,
      dia_chi: null,
      dien_thoai: null,
      ho_va_ten: null,
      dia_chi1: null,
      dien_thoai1: null
    },
    {
      ten_sieu_thi_TTTM: 'Siêu thị Bé Lan',
      dia_diem: 'Phường An Lộc, thị xã Bình Long',
      id_dia_ban: 3,
      dia_ban: 'Bình Long',
      nha_nuoc: null,
      ngoai_nha_nuoc: 15000,
      co_von_dau_tu_nuoc_ngoai: null,
      von_khac: null,
      tong_hop: 'Hàng tiêu dùng',
      chuyen_doanh: null,
      nam_xay_dung: '2017',
      nam_ngung_hoat_dong: null,
      dien_tich_dat: 1000,
      phan_hang: 'III',
      so_lao_dong: 35,
      ten_chu_dau_tu: 'Công ty TNHH TMDV Sài Gòn - Bình Phước',
      giay_dang_ky_kinh_doanh: null,
      dia_chi: null,
      dien_thoai: null,
      ho_va_ten: null,
      dia_chi1: null,
      dien_thoai1: null
    },
    {
      ten_sieu_thi_TTTM: 'Dự  án Siêu thị Co.opMart Bù Đăng',
      dia_diem: 'thị trấn Đức Phong, huyện Bù Đăng, tỉnh Bình Phước',
      id_dia_ban: 9,
      dia_ban: 'Bù Đăng',
      nha_nuoc: null,
      ngoai_nha_nuoc: null,
      co_von_dau_tu_nuoc_ngoai: null,
      von_khac: null,
      tong_hop: null,
      chuyen_doanh: null,
      nam_xay_dung: null,
      nam_ngung_hoat_dong: 'đang được UBND thuận chủ trương thực hiện',
      dien_tich_dat: 6000,
      phan_hang: null,
      so_lao_dong: null,
      ten_chu_dau_tu: 'đang được UBND thuận chủ trương thực hiện',
      giay_dang_ky_kinh_doanh: null,
      dia_chi: null,
      dien_thoai: null,
      ho_va_ten: null,
      dia_chi1: null,
      dien_thoai1: null
    },
    {
      ten_sieu_thi_TTTM: 'Dự án Siêu Thị Bombo và chợ đêm',
      dia_diem: 'thôn 4, xã Bomboo, huyện Bù Đăng, tỉnh Bình Phước',
      id_dia_ban: 9,
      dia_ban: 'Bù Đăng',
      nha_nuoc: null,
      ngoai_nha_nuoc: null,
      co_von_dau_tu_nuoc_ngoai: null,
      von_khac: null,
      tong_hop: null,
      chuyen_doanh: null,
      nam_xay_dung: null,
      nam_ngung_hoat_dong: 'đang được UBND thuận chủ trương thực hiện',
      dien_tich_dat: 4800,
      phan_hang: null,
      so_lao_dong: null,
      ten_chu_dau_tu: null,
      giay_dang_ky_kinh_doanh: null,
      dia_chi: null,
      dien_thoai: null,
      ho_va_ten: null,
      dia_chi1: null,
      dien_thoai1: null
    }
  ]
  //Variable for only TS-------------------------------------------------------------------------
  supermarketTypeI: number = 0;
  supermarketTypeII: number = 0;
  supermarketTypeIII: number = 0;
  supermarketFuture: number = 0;
  generalSupermarket: number = 0;
  specializedSupermarket: number = 0;

  filterTyppeMarket() {
    this.dataHuyenThi.forEach(element => {
      switch (element.phan_hang) {
        case "I":
          this.supermarketTypeI += 1;
          break;
        case "II":
          this.supermarketTypeII += 1;
          break;
        case "III":
          this.supermarketTypeIII += 1;
          break;
        case "":
          this.supermarketFuture += 1;
          break;
        default:
          break;
      }
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // this.accordion.openAll();
    this._paginatorAgain();
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  items: TreeviewItem[] = [];
  values: number[] = [];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  public tableMergeHader: Array<ToltalHeaderMerge> = [];
  public mergeHeadersColumn: Array<string> = [];
  public indexOftableMergeHader: number = 0;
  public dataSource: MatTableDataSource<SuperMarketCommonModel> = new MatTableDataSource<SuperMarketCommonModel>();
  public filteredDataSource: MatTableDataSource<SuperMarketCommonModel> = new MatTableDataSource<SuperMarketCommonModel>();
  columns: number = 1;

  //Angular FUnction --------------------------------------------------------------------
  constructor(
    public excelService: ExcelService,
    public reportSevice: ReportService,
    public route: ActivatedRoute,
    public keyboardservice: KeyboardService,
    public info: InformationService
  ) { }

  ngOnInit(): void {
    let data: any = JSON.parse(localStorage.getItem('currentUser'));
    this.dataSource = new MatTableDataSource<SuperMarketCommonModel>(this.dataHuyenThi);
    this._caculator(this.dataSource.data);
    // this._tableData = new MatTableDataSource<SuperMarketCommonModel>(this.dataHuyenThi);
    this.autoOpen();
  }

  //Xuất excel
  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }
  //FUNCTION FOR ONLY TS _------------------------------
  // applyCondictionFilter(type, event: any) {
  //   this._conditionArray[type] = event.value;
  // this._filterDataSource();
  // }
  // private _filterDataSource() {
  //   if (this._countCondition() > 0) {
  //     let dataFilterOriginal: SuperMarketCommonModel[] = [];
  //     let dataFilterFinal: SuperMarketCommonModel[] = [];
  //     dataFilterOriginal = [... this._tableData.data];
  //     Object.keys(this._conditionArray).forEach(key => {
  //       let array = this._conditionArray[key];
  //       switch (key) {
  //         case "1":
  //           array.forEach((element) => {
  //             dataFilterOriginal.filter((x) => x.huyen.includes(element)).forEach((item) => dataFilterFinal.push(item));
  //           });
  //           break;
  //         case "2":
  //           array.forEach((element) => {

  //             dataFilterOriginal.filter((x) => element.includes(x.phanloai)).forEach((item) => dataFilterFinal.push(item));
  //           });
  //           break;

  //         default:

  //           break;
  //       }
  //       dataFilterOriginal = [...dataFilterFinal];
  //       dataFilterFinal = [];
  //     });
  //     this.dataSource = new MatTableDataSource<SuperMarketCommonModel>(dataFilterOriginal);
  //   } else {
  //     this.dataSource = new MatTableDataSource<SuperMarketCommonModel>(this._tableData.data);
  //   }
  //   this._paginatorAgain();
  //   this._caculator(this.dataSource.data);
  // }
  // private _countCondition(): number {
  //   let countOfCondition = 0;
  //   Object.keys(this._conditionArray).forEach(key => {
  //     if (this._conditionArray[key])
  //       countOfCondition += this._conditionArray[key].length;
  //   });
  //   return countOfCondition;
  // }
  private _autoOpenPanel() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }
  private _caculator(data: Array<SuperMarketCommonModel>) {
    this.tongSieuThi = data.length;
    this.sieuThiHangI = data.filter(x => x.phan_hang == "I").length;
    this.sieuThiHangII = data.filter(x => x.phan_hang == "II").length;
    this.sieuThiHangIII = data.filter(x => x.phan_hang == "III").length;
    this.sieuThiDangXayDung = data.length - this.sieuThiHangI - this.sieuThiHangII - this.sieuThiHangIII;
    this.year = new Date().getFullYear();

    this.sieuThiDauTuTrongNam = data.filter(x => x.nam_xay_dung == this.year.toString()).length;
    this.sieuThiDauTuNamTruoc = data.filter(x => x.nam_xay_dung == (this.year - 1).toString()).length;

    this.sieuThiChuyenDanh = data.filter(x => x.chuyen_doanh != null).length;
    this.sieuThiTongHop = data.filter(x => x.tong_hop != null).length;

    this.filteredDataSource.data = [...data];
  }
  private _paginatorAgain() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Số hàng';
    this.paginator._intl.firstPageLabel = "Trang Đầu";
    this.paginator._intl.lastPageLabel = "Trang Cuối";
    this.paginator._intl.previousPageLabel = "Trang Trước";
    this.paginator._intl.nextPageLabel = "Trang Tiếp";
    this.paginator._intl.getRangeLabel = this.RANK_LABLE;
  }

  applyFilter() {
    console.log(this.filterModel)
    let filteredData = this.filterArray(this.dataSource.data, this.filterModel);
    this._caculator(filteredData);
    if (!filteredData.length) {
      if (this.filterModel)
        this.filteredDataSource.data = [];
      else
        this.filteredDataSource.data = this.dataSource.data;
    }
    else {
      this.filteredDataSource.data = filteredData;
    }
  }

  filterArray(array, filters) {
    const filterKeys = Object.keys(filters);
    let temp = [...array];
    filterKeys.forEach(key => {
      let temp2 = [];
      if (filters[key].length) {
        filters[key].forEach(criteria => {
          temp2 = temp2.concat(temp.filter(x => x[key] == criteria));
        });
        temp = [...temp2];
      }
    })
    return temp;
  }
}
