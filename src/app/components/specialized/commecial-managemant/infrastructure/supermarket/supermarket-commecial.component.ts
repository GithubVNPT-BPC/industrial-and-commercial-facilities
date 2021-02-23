//Import Library
import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

//Import Service
import { SuperMarketCommonModel, SuperMarketFilterModel } from 'src/app/_models/APIModel/commecial-management.model';

import { BaseComponent } from 'src/app/components/specialized/specialized-base.component';

@Component({
  selector: 'app-supermarket-commecial',
  templateUrl: './supermarket-commecial.component.html',
  styleUrls: ['../../../special_layout.scss'],
})

export class SuperMarketCommecialManagementComponent extends BaseComponent {
  //
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

  //Viewchild & Input-----------------------------------------------------------------------

  //Variable for HTML&TS-------------------------------------------------------------------------
  public readonly phanloais: any[] = [{ value: "I", text: "Loại I" }
    , { value: "II", text: "Loại II" }
    , { value: "III", text: "Loại III" }]

  headerArray = ['select', 'index', 'ten_sieu_thi_TTTM', 'dia_diem', 'nha_nuoc', 'ngoai_nha_nuoc', 'co_von_dau_tu_nuoc_ngoai', 'von_khac', 'tong_hop',
    'chuyen_doanh', 'nam_xay_dung', 'nam_ngung_hoat_dong', 'dien_tich_dat', 'phan_hang', 'so_lao_dong', 'ten_chu_dau_tu',
    'giay_dang_ky_kinh_doanh', 'dia_chi', 'dien_thoai', 'ho_va_ten', 'dia_chi1', 'dien_thoai1',
  ];

  //Variable for only TS-------------------------------------------------------------------------
  supermarketTypeI: number = 0;
  supermarketTypeII: number = 0;
  supermarketTypeIII: number = 0;
  supermarketFuture: number = 0;
  generalSupermarket: number = 0;
  specializedSupermarket: number = 0;

  public dataSource: MatTableDataSource<SuperMarketCommonModel> = new MatTableDataSource<SuperMarketCommonModel>();
  public filteredDataSource: MatTableDataSource<SuperMarketCommonModel> = new MatTableDataSource<SuperMarketCommonModel>();
  columns: number = 1;

  //Angular FUnction --------------------------------------------------------------------
  constructor(
    private injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getSuperMarketData();
  }

  ngAfterViewInit() {
    this.paginatorAgain();
  }

  getSuperMarketData() {
    this.dataSource = new MatTableDataSource<SuperMarketCommonModel>(this.dataHuyenThi);
    this._caculator(this.dataSource.data);
  }

  private _caculator(data: Array<SuperMarketCommonModel>) {
    this.tongSieuThi = data.length;
    this.sieuThiHangI = data.filter(x => x.phan_hang == "I").length;
    this.sieuThiHangII = data.filter(x => x.phan_hang == "II").length;
    this.sieuThiHangIII = data.filter(x => x.phan_hang == "III").length;
    this.sieuThiDangXayDung = data.length - this.sieuThiHangI - this.sieuThiHangII - this.sieuThiHangIII;

    this.sieuThiDauTuTrongNam = data.filter(x => x.nam_xay_dung == this.currentYear.toString()).length;
    this.sieuThiDauTuNamTruoc = data.filter(x => x.nam_xay_dung == (this.currentYear - 1).toString()).length;

    this.sieuThiChuyenDanh = data.filter(x => x.chuyen_doanh != null).length;
    this.sieuThiTongHop = data.filter(x => x.tong_hop != null).length;

    this.filteredDataSource.data = [...data];
  }

  applyFilter() {
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
}
