//Import Library
import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

//Import Services
import { ReportService } from 'src/app/_services/APIService/report.service';

import { SuperMarketCommonModel, SuperMarketFilterModel } from 'src/app/_models/APIModel/commecial-management.model';

import { BaseComponent } from 'src/app/components/specialized/specialized-base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';

import { marketTypeList } from '../common/common-commecial.component';

@Component({
  selector: 'app-shoppingcentre',
  templateUrl: './shoppingcentre.component.html',
  styleUrls: ['../../../special_layout.scss'],
})
export class ShoppingcentreComponent extends BaseComponent {
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
  public marketTypeList = marketTypeList;

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

  //Angular FUnction --------------------------------------------------------------------
  constructor(
    private injector: Injector,
    public reportSevice: ReportService,
    public commerceManagementService: CommerceManagementService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getShoppingCenterData();
  }

  ngAfterViewInit() {
    this.paginatorAgain();
  }

  getShoppingCenterData() {
    this.commerceManagementService.getMarketPlaceData().subscribe(
      allrecords => {
        if (allrecords.data && allrecords.data.length > 0) {
          this.dataSource = new MatTableDataSource<SuperMarketCommonModel>(allrecords.data);
          this._prepareData(this.dataSource.data);
          this.paginatorAgain();
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  getFormParams() {
    return {
      id_phan_hang: new FormControl(),
      ten_sieu_thi_TTTM: new FormControl(),
      dia_diem: new FormControl(),
      id_dia_ban: new FormControl(),
      nha_nuoc: new FormControl(),
      ngoai_nha_nuoc: new FormControl(),
      co_von_dau_tu_nuoc_ngoai: new FormControl(),
      von_khac: new FormControl(),
      
      tong_hop: new FormControl(),
      chuyen_doanh: new FormControl(),

      nam_xay_dung: new FormControl(),
      nam_ngung_hoat_dong: new FormControl(),
      
      dien_tich_dat: new FormControl(),
      so_lao_dong: new FormControl(),

      ten_chu_dau_tu: new FormControl(),
      giay_dang_ky_kinh_doanh: new FormControl(),
      dia_chi: new FormControl(),
      dien_thoai: new FormControl(),

      ho_va_ten: new FormControl(),
      dia_chi1: new FormControl(),
      dien_thoai1: new FormControl(),
    }
  }

  prepareData(data) {
    data = {...data, ...{
        is_tttm: "true",
    }}
    return data;        
  }

  callService(data) {
    this.commerceManagementService.postMarketPlace([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  private _prepareData(data) {
    this.tongSieuThi = data.length;
    this.sieuThiHangI = data.filter(x => x.id_phan_hang == 1).length;
    this.sieuThiHangII = data.filter(x => x.id_phan_hang == 2).length;
    this.sieuThiHangIII = data.filter(x => x.id_phan_hang == 3).length;
    this.sieuThiDangXayDung = data.length - this.sieuThiHangI - this.sieuThiHangII - this.sieuThiHangIII;

    this.sieuThiDauTuTrongNam = data.filter(x => x.nam_xay_dung == this.currentYear.toString()).length;
    this.sieuThiDauTuNamTruoc = data.filter(x => x.nam_xay_dung == (this.currentYear - 1).toString()).length;

    this.sieuThiChuyenDanh = data.filter(x => x.chuyen_doanh != null).length;
    this.sieuThiTongHop = data.filter(x => x.tong_hop != null).length;

    this.filteredDataSource.data = [...data];
  }

  applyFilter() {
    let filteredData = this.filterArray(this.dataSource.data, this.filterModel);
    this._prepareData(filteredData);
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