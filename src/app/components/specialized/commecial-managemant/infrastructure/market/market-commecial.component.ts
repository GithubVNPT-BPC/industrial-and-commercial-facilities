//Import Library
import { Component, Injector } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl } from '@angular/forms';

//Import Model
import { MarketModel } from 'src/app/_models/APIModel/commecial-management.model';

import { BaseComponent } from 'src/app/components/specialized/specialized-base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';

@Component({
  selector: "app-market-commecial",
  templateUrl: "./market-commecial.component.html",
  styleUrls: ['../../../special_layout.scss'],
})
export class MarketCommecialManagementComponent extends BaseComponent {

  public dataSource: MatTableDataSource<MarketModel> = new MatTableDataSource<MarketModel>();
  public filteredDataSource: MatTableDataSource<MarketModel> = new MatTableDataSource<MarketModel>();

  filterModel = {
    id_tinh_chat_cho: [],
    id_hang_cho: [],
    id_quan_huyen: []
  }

  marketTypeList = [
    { id_hang_cho: 1, loai_hang_cho: "Hạng I"},
    { id_hang_cho: 2, loai_hang_cho: "Hạng II"},
    { id_hang_cho: 3, loai_hang_cho: "Hạng III"},
    { id_hang_cho: 4, loai_hang_cho: "Làm tạm"},
    { id_hang_cho: 5, loai_hang_cho: "Chưa có"}, 
  ];
  landUseTypeList = [
    { id_hinh_thuc_su_dung_dat: 1, hinh_thuc_su_dung_dat: "Phường/Xã quản lý"},
    { id_hinh_thuc_su_dung_dat: 2, hinh_thuc_su_dung_dat: "Huyện/Thị xã/Thành phố quản lý"},
    { id_hinh_thuc_su_dung_dat: 3, hinh_thuc_su_dung_dat: "Dự án chợ đầu mối"},
    { id_hinh_thuc_su_dung_dat: 4, hinh_thuc_su_dung_dat: "Giao đất"},
  ]
  marketPropTypeList = [
    {id_tinh_chat_cho: 1, tinh_chat_cho: "Kiên cố"},
    {id_tinh_chat_cho: 2, tinh_chat_cho: "Bán kiên cố"},
    {id_tinh_chat_cho: 3, tinh_chat_cho: "Chưa có nhu cầu xây dựng"},
    {id_tinh_chat_cho: 4, tinh_chat_cho: "Đề xuất xây dựng"},
    {id_tinh_chat_cho: 5, tinh_chat_cho: "Đã có kế hoạch xây dựng"},
    {id_tinh_chat_cho: 6, tinh_chat_cho: "Khác"},
    {id_tinh_chat_cho: 7, tinh_chat_cho: "Chợ tạm"},
  ]
  
  displayedFields = {
    DIA_CHI: "Địa chỉ",
    ten_cho: "Tên chợ",
    is_thanh_thi: "Nông thôn/Thành thị",
    dien_tich: "Diện tích",
    loai_hang_cho: "Loại hạng chợ", 
    tinh_chat_cho: "Tính chất chợ", 
    so_diem_kinh_doanh: "Số điểm kinh doanh",
    so_ho_kinh_doanh_co_dinh: "Số hộ kinh doanh cố định",
    hien_trang_hoat_dong: "Hiện trạng hoạt động",
    de_xuat_thuc_hien: "Đề xuất thực hiện",
    ke_hoach_thuc_hien: "Kế hoặch thực hiện",
    uu_tien_de_xuat_dau_tu: "Ưu tiên đề xuất đầu tư",
    htql_so_nguoi: "Số người",
    htql_ban_ql: "Ban quản lý",
    htql_to_ql: "Tổ quản lý",
    htql_dn_htx: "Doanh nghiệp/Hợp tác xã",
    hinh_thuc_quan_ly: "Cơ quan quản lý",
    hinh_thuc_su_dung_dat: "Hình thức sử dụng đất",
    ttll_cq_ho_ten: "Họ và tên (Cơ quan/BQL chợ)",
    ttll_cq_dien_thoai: "Điện thoại (Cơ quan/BQL chợ)",
    ttll_dn_ho_ten: "Họ và tên (Doanh nghiệp)",
    ttll_dn_dien_thoai: "Điện thoại (Doanh nghiệp)",
    vdt_tong: "Tổng",
    vdt_ngan_sach: "Ngân sách",
    vdt_xa_hoi_hoa: "Xẫ hội hóa",
    nam: "Năm",
    xay_moi: "Xây mới",
    nang_cap: "Nâng cấp",
  }

  getFormParams() {
    return {
      ten_cho: new FormControl(),
      id_phuong_xa: new FormControl(),
      is_thanh_thi: new FormControl(),
      dien_tich: new FormControl(),
      id_hang_cho: new FormControl(),
      id_tinh_chat_cho: new FormControl(),
      so_diem_kinh_doanh: new FormControl(),
      so_ho_kinh_doanh_co_dinh: new FormControl(),
      hien_trang_hoat_dong: new FormControl(),
      de_xuat_thuc_hien: new FormControl(),
      ke_hoach_thuc_hien: new FormControl(),
      uu_tien_de_xuat_dau_tu: new FormControl(),
      htql_so_nguoi: new FormControl(),
      htql_ban_ql: new FormControl(),
      htql_to_ql: new FormControl(),
      htql_dn_htx: new FormControl(),
      hinh_thuc_quan_ly: new FormControl(),
      id_hinh_thuc_su_dung_dat: new FormControl(),
      ttll_cq_ho_ten: new FormControl(),
      ttll_cq_dien_thoai: new FormControl(),
      ttll_dn_ho_ten: new FormControl(),
      ttll_dn_dien_thoai: new FormControl(),
      vdt_tong: new FormControl(),
      vdt_ngan_sach: new FormControl(),
      vdt_xa_hoi_hoa: new FormControl(),
      nam: new FormControl(),
      xay_moi: new FormControl(),
      nang_cap: new FormControl(),
      ghi_chu: new FormControl()
    }
  }

  //Variable for Total---------------------------------------------------------------------------
  public numOfMarket: number = 0;
  //--

  public diaban_NongThon: number = 0;
  public diaban_ThanhThi: number = 0;

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
  public xaydung_CaiTao:number = 0;
  public xaydung_KhongHoatDong: number = 0;
  public xaydung_KhongHoatDong70:number = 0;
  public xaydung_ChuyenDoi: number = 0;
  //--
  public quanly_BanTo:number = 0;
  public quanly_DoanhNghiep:number = 0;
  public quanly_HopTacXa:number = 0;
  public quanly_HoKinhDoanh:number = 0;
  //--
  public kinhdoanh_choBanLe: number = 0;
  public kinhdoanh_choDauMoiChuyenDoanh: number =0;
  public kinhdoanh_choDauMoiTongHop:number =0;
  //--
  public tongvon_DNHTXHL:number =0;
  public tongvon_Khac:number = 0;
  public tongvon_VonNganSachTW: number = 0;
  public tongvon_VonNganSachDiaPhuong: number = 0;
  //--
  public chokhac_NgoaiQuyHoach:number = 0;
  public chokhac_ChoDem:number = 0;
  public chokhac_BienGioi:number = 0;
  
  //Angular FUnction --------------------------------------------------------------------
  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
  ) {
      super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initWards();
    this.getMarketData();
  }

  ngAfterViewInit() {
    this.paginatorAgain();
  }

  switchView() {
    super.switchView();
    // document.querySelector(".main_content").scrollTo(0, 0);
  }

  getMarketData() {
    this.commerceManagementService.getMarketData().subscribe(
      allrecords => {
        if (allrecords.data && allrecords.data.length > 0) {
          this.dataSource = new MatTableDataSource<MarketModel>(allrecords.data);
          this.filteredDataSource = new MatTableDataSource<MarketModel>(allrecords.data);

          this._prepareData(this.dataSource.data);
          this.paginatorAgain();
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  private _prepareData(data) {
    this.numOfMarket = data.length;

    // Phân theo địa bàn
    this.diaban_ThanhThi = data.filter(x => x.is_thanh_thi).length;
    this.diaban_NongThon = data.filter(x => !x.is_thanh_thi).length;

    // Phân theo hạng chợ
    this.hang_HangI = data.filter(x => x.id_hang_cho == 1).length;
    this.hang_HangII = data.filter(x => x.id_hang_cho == 2).length;
    this.hang_HangIII = data.filter(x => x.id_hang_cho == 3).length;
    this.hang_LamTam = data.filter(x => x.id_hang_cho == 4).length;
    this.hang_ChuaCo = data.filter(x => x.id_hang_cho == 5).length;

    this.congtrinh_KienCo = data.filter(x => x.id_tinh_chat_cho == 1).length;
    this.congtrinh_BanKienCo = data.filter(x => x.id_tinh_chat_cho == 2).length;
    this.congtrinh_Tam = data.filter(x => x.id_tinh_chat_cho == 7).length;

  }
  
  prepareData(data) {
    if (data['is_thanh_thi']) data['is_thanh_thi']= parseInt(data['is_thanh_thi']);
    return data;        
  }

  callService(data) {
    this.commerceManagementService.postMarket([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  applyFilter() {
    let filteredData = this.filterArray(this.dataSource.data, this.filterModel);
    // this._prepareData(filteredData);
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


