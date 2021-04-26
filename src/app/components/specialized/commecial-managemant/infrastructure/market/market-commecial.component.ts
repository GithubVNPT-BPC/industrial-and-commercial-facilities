//Import Library
import { Component, Injector } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl } from '@angular/forms';

//Import Model
import { MarketModel } from 'src/app/_models/APIModel/commecial-management.model';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';
import { LoginService } from "src/app/_services/APIService/login.service";

@Component({
  selector: "app-market-commecial",
  templateUrl: "./market-commecial.component.html",
  styleUrls: ['../../../special_layout.scss'],
})
export class MarketCommecialManagementComponent extends BaseComponent {
  DB_TABLE = 'QLTM_CHO';
  public dataSource: MatTableDataSource<MarketModel> = new MatTableDataSource<MarketModel>();
  public filteredDataSource: MatTableDataSource<MarketModel> = new MatTableDataSource<MarketModel>();

  filterModel = {
    id_tinh_chat_cho: [],
    id_loai_cho: [],
    id_hang_cho: [],
    id_quan_huyen: []
  }

  marketLevelList = [
    { id_hang_cho: 1, loai_hang_cho: "Hạng I" },
    { id_hang_cho: 2, loai_hang_cho: "Hạng II" },
    { id_hang_cho: 3, loai_hang_cho: "Hạng III" },
    { id_hang_cho: 4, loai_hang_cho: "Làm tạm" },
    { id_hang_cho: 5, loai_hang_cho: "Chưa có" },
  ];

  landUseTypeList = [
    { id_hinh_thuc_su_dung_dat: 1, hinh_thuc_su_dung_dat: "Phường/Xã quản lý" },
    { id_hinh_thuc_su_dung_dat: 2, hinh_thuc_su_dung_dat: "Huyện/Thị xã/Thành phố quản lý" },
    { id_hinh_thuc_su_dung_dat: 3, hinh_thuc_su_dung_dat: "Dự án chợ đầu mối" },
    { id_hinh_thuc_su_dung_dat: 4, hinh_thuc_su_dung_dat: "Giao đất" },
  ]

  marketTypeList = [
    { id_loai_cho: 1, ten_loai_cho: "Thành thị" },
    { id_loai_cho: 2, ten_loai_cho: "Nông thôn" },
    { id_loai_cho: 3, ten_loai_cho: "Chợ đầu mối" },
    { id_loai_cho: 4, ten_loai_cho: "Chợ trong quy hoạch" },
    { id_loai_cho: 5, ten_loai_cho: "Chợ tự phát (lán tạm)" },
    { id_loai_cho: 6, ten_loai_cho: "Chợ khác" },
    { id_loai_cho: 7, ten_loai_cho: "Chưa có chợ" },
  ];

  marketPropTypeList = [
    { id_tinh_chat_cho: 1, tinh_chat_cho: "Kiên cố" },
    { id_tinh_chat_cho: 2, tinh_chat_cho: "Bán kiên cố" },
    { id_tinh_chat_cho: 3, tinh_chat_cho: "Chưa có nhu cầu xây dựng" },
    { id_tinh_chat_cho: 4, tinh_chat_cho: "Đề xuất xây dựng" },
    { id_tinh_chat_cho: 5, tinh_chat_cho: "Đã có kế hoạch xây dựng" },
    { id_tinh_chat_cho: 6, tinh_chat_cho: "Khác" },
    { id_tinh_chat_cho: 7, tinh_chat_cho: "Chợ tạm" },
  ]

  marketPropCommerceList = [
    { id_tinh_chat_kinh_doanh: 1, ten_tinh_chat_kinh_doanh: "Chuyên doanh" },
    { id_tinh_chat_kinh_doanh: 2, ten_tinh_chat_kinh_doanh: "Tổng hợp" },
    { id_tinh_chat_kinh_doanh: 3, ten_tinh_chat_kinh_doanh: "Bán lẻ" }
  ]

  displayedFields = {
    ten_cho: "Tên chợ",
    ten_quan_huyen: "Địa bàn",
    dia_chi: "Địa chỉ",
    ten_tinh_chat_kinh_doanh: "Tính chất kinh doanh",
    loai_hang_cho: "Hạng chợ",
    tinh_chat_cho: "Tính chất công trình",
    ten_loai_cho: "Loại chợ",
    ke_hoach_dau_tu: "Kế hoạch đầu tư",
    hinh_thuc_quan_ly: "Hình thức quản lý",

    xay_moi: "Xây mới",
    nang_cap: "Nâng cấp",
    dau_tu: "Đầu tư",
    so_ho_duoi_30: "Số hộ KD dưới 30%",
    so_chuyen_doi_chuc_nang: "Số chợ chuyển đổi CNHĐ",
    so_chuyen_doi_hinh_thuc_quan_ly: "Số chợ chuyển đổi MHQL",

    tong_von: "Tổng vốn",
    von_nstw: "Vốn NSTW",
    von_nsdp: "Vốn NSĐP",
    von_dn_htx_hkd: "Vốn DN/HTX/HKD",
    von_khac: "Vốn khác",

    so_nguoi: "Số người",
    ban_quan_ly: "Ban quản lý",
    to_quan_ly: "Tổ quản lý",
    doanh_nghiep: "Doanh nghiệp",
    hop_tac_xa: "Hợp tác xã",
    ho_kinh_doanh: "Hộ kinh doanh"
  }

  getFormParams() {
    return {
      id: new FormControl(),
      ten_cho: new FormControl(),
      id_phuong_xa: new FormControl(),
      id_tinh_chat_kinh_doanh: new FormControl(),
      id_hang_cho: new FormControl(),
      id_tinh_chat_cho: new FormControl(),
      id_loai_cho: new FormControl(),
      id_hinh_thuc_quan_ly: new FormControl(0),
      ke_hoach_dau_tu: new FormControl(),
      hinh_thuc_quan_ly: new FormControl(),

      nam_xay_dung: new FormControl(),
      nam_nang_cap: new FormControl(),
      dau_tu: new FormControl(),
      so_ho_duoi_30: new FormControl(),
      so_chuyen_doi_chuc_nang: new FormControl(),
      so_chuyen_doi_hinh_thuc_quan_ly: new FormControl(),

      von_nstw: new FormControl(),
      von_nsdp: new FormControl(),
      von_dn_htx_hkd: new FormControl(),
      von_khac: new FormControl(),

      ban_quan_ly: new FormControl(),
      to_quan_ly: new FormControl(),
      doanh_nghiep: new FormControl(),
      hop_tac_xa: new FormControl(),
      ho_kinh_doanh: new FormControl(),
    }
  }

  setFormParams() {
    if (this.selection.selected.length) {
        let selectedRecord = this.selection.selected[0];
        this.formData.controls['id'].setValue(selectedRecord.id);
        this.formData.controls['ten_cho'].setValue(selectedRecord.ten_cho);
        this.formData.controls['id_phuong_xa'].setValue(selectedRecord.id_phuong_xa);
        this.formData.controls['id_tinh_chat_kinh_doanh'].setValue(selectedRecord.id_tinh_chat_kinh_doanh);
        this.formData.controls['id_hang_cho'].setValue(selectedRecord.id_hang_cho);
        this.formData.controls['id_tinh_chat_cho'].setValue(selectedRecord.id_tinh_chat_cho);
        this.formData.controls['id_loai_cho'].setValue(selectedRecord.id_loai_cho);
        this.formData.controls['id_hinh_thuc_quan_ly'].setValue(selectedRecord.id_hinh_thuc_quan_ly);
        this.formData.controls['ke_hoach_dau_tu'].setValue(selectedRecord.ke_hoach_dau_tu);

        this.formData.controls['hinh_thuc_quan_ly'].setValue(selectedRecord.hinh_thuc_quan_ly);
        this.formData.controls['nam_xay_dung'].setValue(selectedRecord.nam_xay_dung);
        this.formData.controls['nam_nang_cap'].setValue(selectedRecord.nam_nang_cap);
        this.formData.controls['dau_tu'].setValue(selectedRecord.dau_tu);
        this.formData.controls['so_ho_duoi_30'].setValue(selectedRecord.so_ho_duoi_30);
        this.formData.controls['so_chuyen_doi_chuc_nang'].setValue(selectedRecord.so_chuyen_doi_chuc_nang);
        this.formData.controls['so_chuyen_doi_hinh_thuc_quan_ly'].setValue(selectedRecord.so_chuyen_doi_hinh_thuc_quan_ly);
        this.formData.controls['von_nstw'].setValue(selectedRecord.von_nstw);
        this.formData.controls['von_nsdp'].setValue(selectedRecord.von_nsdp);

        this.formData.controls['von_dn_htx_hkd'].setValue(selectedRecord.von_dn_htx_hkd);
        this.formData.controls['von_khac'].setValue(selectedRecord.von_khac);
        this.formData.controls['ban_quan_ly'].setValue(selectedRecord.ban_quan_ly);

        this.formData.controls['to_quan_ly'].setValue(selectedRecord.to_quan_ly);
        this.formData.controls['doanh_nghiep'].setValue(selectedRecord.doanh_nghiep);
        this.formData.controls['hop_tac_xa'].setValue(selectedRecord.hop_tac_xa);
        this.formData.controls['ho_kinh_doanh'].setValue(selectedRecord.ho_kinh_doanh);
    }
  }

  //Variable for Total---------------------------------------------------------------------------
  public numOfMarket: number = 0;
  //--

  public loaihinh_NongThon: number = 0;
  public loaihinh_ThanhThi: number = 0;
  public loaihinh_ChoDauMoi: number = 0;
  public loaihinh_ChoTrongQuyHoach: number = 0;
  public loaihinh_ChoTuPhat: number = 0;
  public loaihinh_ChoKhac: number = 0;
  public loaihinh_ChuaCoCho: number = 0;

  //--
  public hang_HangI: number = 0;
  public hang_HangII: number = 0;
  public hang_HangIII: number = 0;
  public hang_LamTam: number = 0;
  public hang_ChuaCo: number = 0;

  //--
  public congtrinh_KienCo: number = 0;
  public congtrinh_BanKienCo: number = 0;
  public congtrinh_Tam: number = 0;

  //--
  public xaydung_Moi: number = 0;
  public xaydung_CaiTao: number = 0;
  public xaydung_CD_MoHinh: number = 0;
  public xaydung_CD_CongNang: number = 0;
  public xaydung_CD_ChucNang: number = 0;
  public xaydung_HD_Duoi30: number = 0;
  //--
  public quanly_BanTo: number = 0;
  public quanly_DoanhNghiep: number = 0;
  public quanly_HopTacXa: number = 0;
  public quanly_HoKinhDoanh: number = 0;
  //--
  public kinhdoanh_choBanLe: number = 0;
  public kinhdoanh_choDauMoiChuyenDoanh: number = 0;
  public kinhdoanh_choDauMoiTongHop: number = 0;
  //--
  public tongvon_DNHTXHL: number = 0;
  public tongvon_Khac: number = 0;
  public tongvon_VonNganSachTW: number = 0;
  public tongvon_VonNganSachDiaPhuong: number = 0;
  //--
  public chokhac_NgoaiQuyHoach: number = 0;
  public chokhac_ChoDem: number = 0;
  public chokhac_BienGioi: number = 0;


  //Angular FUnction --------------------------------------------------------------------
  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
    public _login: LoginService
  ) {
    super(injector);
  }

  authorize: boolean = true

  ngOnInit(): void {
    super.ngOnInit();
    this.initDistrictWard();
    this.getMarketData();

    if (this._login.userValue.user_role_id == 3  || this._login.userValue.user_role_id == 1) {
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

  getMarketData() {
    this.commerceManagementService.getMarketData().subscribe(
      allrecords => {
        this.filteredDataSource.data = [];
        if (allrecords.data && allrecords.data.length > 0) {
          this.dataSource = new MatTableDataSource<MarketModel>(allrecords.data);
          this.filteredDataSource = new MatTableDataSource<MarketModel>(allrecords.data);
        }
        this._prepareData();
        this.paginatorAgain();
      },
      error => this.errorMessage = <any>error
    );
  }

  _prepareData() {
    let data = this.filteredDataSource.data;
    this.numOfMarket = data.length;

    // Phân theo loại hình
    this.loaihinh_ThanhThi = data.filter(x => x.id_loai_cho == 1).length;
    this.loaihinh_NongThon = data.filter(x => x.id_loai_cho == 2).length;
    this.loaihinh_ChoDauMoi = data.filter(x => x.id_loai_cho == 3).length;
    this.loaihinh_ChoTrongQuyHoach = data.filter(x => x.id_loai_cho == 4).length;
    this.loaihinh_ChoTuPhat = data.filter(x => x.id_loai_cho == 5).length;
    this.loaihinh_ChoKhac = data.filter(x => x.id_loai_cho == 6).length;
    this.loaihinh_ChuaCoCho = data.filter(x => x.id_loai_cho == 7).length;

    // Phân theo hạng chợ
    this.hang_HangI = data.filter(x => x.id_hang_cho == 1).length;
    this.hang_HangII = data.filter(x => x.id_hang_cho == 2).length;
    this.hang_HangIII = data.filter(x => x.id_hang_cho == 3).length;
    this.hang_LamTam = data.filter(x => x.id_hang_cho == 4).length;
    this.hang_ChuaCo = data.filter(x => x.id_hang_cho == 5).length;

    // Phân theo tính chất công trình
    this.congtrinh_KienCo = data.filter(x => x.id_tinh_chat_cho == 1).length;
    this.congtrinh_BanKienCo = data.filter(x => x.id_tinh_chat_cho == 2).length;
    this.congtrinh_Tam = data.filter(x => x.id_tinh_chat_cho == 7).length;

    // Phân theo tính chất kinh doanh
    this.kinhdoanh_choDauMoiChuyenDoanh = data.filter(x => x.id_tinh_chat_kinh_doanh == 1).length;
    this.kinhdoanh_choDauMoiTongHop = data.filter(x => x.id_tinh_chat_kinh_doanh == 2).length;
    this.kinhdoanh_choBanLe = data.filter(x => x.id_tinh_chat_kinh_doanh == 3).length;

    // Phân theo hình thức quản lý
    this.quanly_BanTo = data.map(x => x.ban_quan_ly).reduce((a, b) => a + b, 0) + data.map(x => x.to_quan_ly).reduce((a, b) => a + b, 0);
    this.quanly_DoanhNghiep = data.map(x => x.doanh_nghiep).reduce((a, b) => a + b, 0);
    this.quanly_HoKinhDoanh = data.map(x => x.ho_kinh_doanh).reduce((a, b) => a + b, 0);

    // Tổng vốn đầu tư chợ
    this.tongvon_VonNganSachTW = data.map(x => x.von_nstw).reduce((a, b) => a + b, 0);
    this.tongvon_VonNganSachDiaPhuong = data.map(x => x.von_nsdp).reduce((a, b) => a + b, 0);
    this.tongvon_DNHTXHL = data.map(x => x.von_dn_htx_hkd).reduce((a, b) => a + b, 0);
    this.tongvon_Khac = data.map(x => x.von_khac).reduce((a, b) => a + b, 0);

    // Hoạt động đầu tư phát triển chợ
    this.xaydung_Moi = this.dataSource.data.filter(x => x.nam_xay_dung == this.currentYear.toString()).length;
    this.xaydung_CaiTao = this.dataSource.data.filter(x => x.nam_nang_cap == this.currentYear.toString()).length;
    this.xaydung_CD_MoHinh = data.filter(x => x.so_chuyen_doi_hinh_thuc_quan_ly).length;
    this.xaydung_CD_CongNang = data.filter(x => x.so_chuyen_doi_chuc_nang).length;
    this.xaydung_HD_Duoi30 = data.filter(x => x.so_ho_duoi_30).length;
  }

  prepareData(data) {
    return data;
  }

  callService(data) {
    this.commerceManagementService.postMarket(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.commerceManagementService.deleteMarket(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  private chosenYearHandler(normalizedYear, datepicker) {
    datepicker.close();
    return normalizedYear.year()
  }
}


