//Import Library
import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

//Import Service
import { SuperMarketCommonModel } from 'src/app/_models/APIModel/commecial-management.model';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';
import { FilterService } from 'src/app/_services/filter.service';

import { MarketTypeModel } from 'src/app/_models/APIModel/commecial-management.model';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
  selector: 'app-supermarket-commecial',
  templateUrl: './supermarket-commecial.component.html',
  styleUrls: ['../../../special_layout.scss'],
})

export class SuperMarketCommecialManagementComponent extends BaseComponent {
  DB_TABLE = 'QLTM_ST_TTTM';
  //
  public tongSieuThi: number = 0;
  public sieuThiTongHop: number = 0;
  public sieuThiChuyenDanh: number = 0;
  //
  public sieuThiHangI: number = 0;
  public sieuThiHangII: number = 0;
  public sieuThiHangIII: number = 0;
  //
  public sieuThiDauTuTrongNam: number = 0;
  public sieuThiDauTuNamTruoc: number = 0;
  public sieuThiDangXayDung: number = 0;

  public sieuThi_ThanhLapMoi: number = 0;
  public sieuThi_NgungHoatDong: number = 0;

  public VonNhaNuoc = 0;
  public VonNgoaiNhaNuoc = 0;
  public VonNuocNgoai = 0;
  public VonKhac = 0;

  public businessType = 0;
  //
  public filterModel = {
    id_dia_ban: [],
    id_phan_hang: [],
    business_area_id: [],
    nam_xay_dung: [],
    nam_ngung_hoat_dong: [],
    chuyen_doanh: [],
    tong_hop: []
  }
  public marketTypeList: MarketTypeModel[] = [
    { id: 1, name: "Hạng I" },
    { id: 2, name: "Hạng II" },
    { id: 3, name: "Hạng III" }
  ]

  public businessTypeList: MarketTypeModel[] = [
    { id: 1, name: "Tổng hợp" },
    { id: 2, name: "Chuyên doanh" },
    { id: 3, name: "Tổng hợp/Chuyên doanh" }
  ]

  public businessTypeFilterList: MarketTypeModel[] = [
    { id: 1, name: "Tổng hợp" },
    { id: 2, name: "Chuyên doanh" }
  ]

  public businessAreaList = [
    { id: 1, name: "Nhà nước" },
    { id: 2, name: "Ngoài nhà nước" },
    { id: 3, name: "Có vốn đầu tư nước ngoài" },
    { id: 4, name: "Vốn khác" },
  ]

  private builtYears = [];
  private holdYears = [];

  //Viewchild & Input-----------------------------------------------------------------------
  headerArray = ['select', 'index', 'ten_sieu_thi_TTTM', 'dia_diem', 'nha_nuoc', 'ngoai_nha_nuoc', 'co_von_dau_tu_nuoc_ngoai', 'von_khac', 'tong_hop',
    'chuyen_doanh', 'nam_xay_dung', 'nam_ngung_hoat_dong', 'dien_tich_dat', 'phan_hang', 'so_lao_dong', 'ten_chu_dau_tu',
    'giay_dang_ky_kinh_doanh', 'dia_chi', 'dien_thoai', 'ho_va_ten', 'dia_chi1', 'dien_thoai1', 'thoi_gian_chinh_sua_cuoi'
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
    public filterService: FilterService,
    public _login: LoginService,
    public commerceManagementService: CommerceManagementService,
  ) {
    super(injector);
  }

  authorize: boolean = true

  ngOnInit(): void {
    super.ngOnInit();
    this.getSuperMarketData();
    this.businessType = 0;

    if (this._login.userValue.user_role_id == 3 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  ngAfterViewInit() {
    this.paginatorAgain();
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/commecial-management/domestic";
    this.TITLE_DEFAULT = "Thương mại nội địa - Hạ tầng thương mại";
    this.TEXT_DEFAULT = "Thương mại nội địa - Hạ tầng thương mại";
  }

  getSuperMarketData() {
    this.commerceManagementService.getMarketPlaceData(false).subscribe(
      allrecords => {
        this.filteredDataSource.data = [];
        if (allrecords.data && allrecords.data.length > 0) {
          this.dataSource = new MatTableDataSource<SuperMarketCommonModel>(allrecords.data);
          this.filteredDataSource = new MatTableDataSource<SuperMarketCommonModel>(allrecords.data);
          this.builtYears = this.dataSource.data.map(x => x.nam_xay_dung).filter(this.filterService.onlyUnique);
          this.holdYears = this.dataSource.data.map(x => x.nam_ngung_hoat_dong).filter(this.filterService.onlyUnique);
        }
        this._prepareData();
        this.paginatorAgain();
      },
      error => this.errorMessage = <any>error
    );
  }

  _prepareData() {
    let data = this.filteredDataSource.data;
    this.tongSieuThi = data.length;
    this.sieuThiHangI = data.filter(x => x.id_phan_hang == 1).length;
    this.sieuThiHangII = data.filter(x => x.id_phan_hang == 2).length;
    this.sieuThiHangIII = data.filter(x => x.id_phan_hang == 3).length;
    this.sieuThiDangXayDung = data.length - this.sieuThiHangI - this.sieuThiHangII - this.sieuThiHangIII;

    this.sieuThiChuyenDanh = data.filter(x => x.chuyen_doanh != null && x.chuyen_doanh == '1').length;
    this.sieuThiTongHop = data.filter(x => x.tong_hop != null && x.tong_hop == '1').length;

    this.sieuThi_ThanhLapMoi = this.dataSource.data.filter(x => x.nam_xay_dung == this.currentYear.toString()).length;
    this.sieuThi_NgungHoatDong = this.dataSource.data.filter(x => x.nam_ngung_hoat_dong == this.currentYear.toString()).length;

    // Compute Business Area ID
    data.map(x => {
      if (x.nha_nuoc) x.business_area_id = 1;
      else if (x.ngoai_nha_nuoc) x.business_area_id = 2;
      else if (x.co_von_dau_tu_nuoc_ngoai) x.business_area_id = 3;
      else if (x.von_khac) x.business_area_id = 4;
      else x.business_area_id = 0;
    });

    this.VonNhaNuoc = data.map(x => x.nha_nuoc).reduce((a, b) => a + b, 0);
    this.VonNgoaiNhaNuoc = data.map(x => x.ngoai_nha_nuoc).reduce((a, b) => a + b, 0);
    this.VonNuocNgoai = data.map(x => x.co_von_dau_tu_nuoc_ngoai).reduce((a, b) => a + b, 0);
    this.VonKhac = data.map(x => x.von_khac).reduce((a, b) => a + b, 0);
  }

  getFormParams() {
    return {
      id: new FormControl(),
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
      
      kinh_do: new FormControl(''),
      vi_do: new FormControl('')
    }
  }

  setFormParams() {
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['id'].setValue(selectedRecord.id);
      this.formData.controls['id_phan_hang'].setValue(selectedRecord.id_phan_hang);
      this.formData.controls['ten_sieu_thi_TTTM'].setValue(selectedRecord.ten_sieu_thi_TTTM);
      this.formData.controls['dia_diem'].setValue(selectedRecord.dia_diem);
      this.formData.controls['id_dia_ban'].setValue(selectedRecord.id_dia_ban);
      this.formData.controls['nha_nuoc'].setValue(selectedRecord.nha_nuoc);
      this.formData.controls['ngoai_nha_nuoc'].setValue(selectedRecord.ngoai_nha_nuoc);
      this.formData.controls['co_von_dau_tu_nuoc_ngoai'].setValue(selectedRecord.co_von_dau_tu_nuoc_ngoai);
      this.formData.controls['von_khac'].setValue(selectedRecord.von_khac);
      this.formData.controls['tong_hop'].setValue(selectedRecord.tong_hop);
      this.formData.controls['chuyen_doanh'].setValue(selectedRecord.chuyen_doanh);
      if (selectedRecord.tong_hop == '1' && selectedRecord.chuyen_doanh == '0')
        this.businessType = 1;
      if (selectedRecord.tong_hop == '0' && selectedRecord.chuyen_doanh == '1')
        this.businessType = 2;
      if (selectedRecord.tong_hop == '1' && selectedRecord.chuyen_doanh == '1')
        this.businessType = 3;
      this.formData.controls['nam_xay_dung'].setValue(selectedRecord.nam_xay_dung);
      this.formData.controls['nam_ngung_hoat_dong'].setValue(selectedRecord.nam_ngung_hoat_dong);
      this.formData.controls['dien_tich_dat'].setValue(selectedRecord.dien_tich_dat);
      this.formData.controls['so_lao_dong'].setValue(selectedRecord.so_lao_dong);
      this.formData.controls['ten_chu_dau_tu'].setValue(selectedRecord.ten_chu_dau_tu);
      this.formData.controls['giay_dang_ky_kinh_doanh'].setValue(selectedRecord.giay_dang_ky_kinh_doanh);
      this.formData.controls['dia_chi'].setValue(selectedRecord.dia_chi);
      this.formData.controls['dien_thoai'].setValue(selectedRecord.dien_thoai);
      this.formData.controls['ho_va_ten'].setValue(selectedRecord.ho_va_ten);
      this.formData.controls['dia_chi1'].setValue(selectedRecord.dia_chi1);
      this.formData.controls['dien_thoai1'].setValue(selectedRecord.dien_thoai1);
      this.formData.controls['kinh_do'].setValue(selectedRecord.kinh_do);
      this.formData.controls['vi_do'].setValue(selectedRecord.vi_do);
    }
  }

  prepareData(data) {
    data = {
      ...data, ...{
        is_tttm: "false",
      }
    }
    return data;
  }

  callService(data) {
    this.commerceManagementService.postMarketPlace([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.commerceManagementService.deleteSuperMarket(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  changeBussinessType(event) {
    if (event.value == 1) {
      this.formData.controls['tong_hop'].setValue('1');
      this.formData.controls['chuyen_doanh'].setValue('0');
    }
    if (event.value == 2) {
      this.formData.controls['tong_hop'].setValue('0');
      this.formData.controls['chuyen_doanh'].setValue('1');
    }
    if (event.value == 3) {
      this.formData.controls['tong_hop'].setValue('1');
      this.formData.controls['chuyen_doanh'].setValue('1');
    }
  }

  applyBusinessFilter(event) {
    if (event.value){
    if (event.value == 1) {
      this.filterModel.tong_hop = ['1'];
      this.filterModel.chuyen_doanh = [];
    }
    else {
      this.filterModel.tong_hop = [];
      this.filterModel.chuyen_doanh = ['1'];
    }}
    else{
      this.filterModel.tong_hop = [];
      this.filterModel.chuyen_doanh = [];
    }
    this.applyFilter(event);
  }
}
