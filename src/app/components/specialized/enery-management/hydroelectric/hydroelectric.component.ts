import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { HydroEnergyModel } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';

import { FormControl } from '@angular/forms';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
  selector: 'app-hydroelectric',
  templateUrl: './hydroelectric.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class HydroelectricComponent extends BaseComponent {

  constructor(
    private injector: Injector,
    private energyService: EnergyService,
    public _login: LoginService
  ) {
    super(injector);
  }

  //Constant variable
  public readonly displayedColumns: string[] = ['select', 'index', 'Tdn', 'Dd', 'Cx', 'Dthc', 'Sl6tck',
    'Slnck', 'Dt', 'Paupttcctvhd', 'Pdpauptt', 'Paupvthkcdhctd', 'Qtvhhctd', 'Qtdhctd', 'Kdd', 'Ldhtcbvhd',
    'Btct', 'Lcsdlhctd', 'Pabvdhctd', 'Bcdgatdhctd', 'Bchtatdhctd', 'Tkdkatdhctd'
  ];

  //TS & HTML Variable
  public dataSource: MatTableDataSource<HydroEnergyModel>;
  public filteredDataSource: MatTableDataSource<HydroEnergyModel> = new MatTableDataSource<HydroEnergyModel>();;

  //Only TS Variable
  doanhThu: number;
  congXuat: number;
  sanluongnam: number;
  soLuongDoanhNghiep: number;
  isChecked: boolean;

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.laydulieuThuyDien();

    if (this._login.userValue.user_role_id == 4  || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/enery-management/hydroelectric";
    this.TITLE_DEFAULT = "Năng lượng - Thủy điện";
    this.TEXT_DEFAULT = "Năng lượng - Thủy điện";
  }

  laydulieuThuyDien() {
    this.energyService.LayDuLieuThuyDien().subscribe(res => {
      this.dataSource = new MatTableDataSource<HydroEnergyModel>(res.data);
      this.filteredDataSource = new MatTableDataSource<HydroEnergyModel>(res.data);
      this.caculatorValue();
      this.initPaginator();
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  getFormParams() {
    return {
      ten_doanh_nghiep: new FormControl(),
      dia_diem: new FormControl(),
      cong_suat_thiet_ke: new FormControl(),
      dung_tich_ho_chua: new FormControl(),
      san_luong_6_thang: new FormControl(),
      san_luong_nam: new FormControl(),
      doanh_thu: new FormControl(),
      phuong_an_ung_pho_thien_tai_ha_du: new FormControl(),
      phe_duyet_phuong_an_ung_pho_thien_tai: new FormControl(),
      phuong_an_ung_pho_khan_cap: new FormControl(),
      quy_trinh_van_hanh_ho_chua: new FormControl(),
      quan_trac_dap_ho: new FormControl(),
      kiem_dinh_dap: new FormControl(),
      lap_dat_he_thong_canh_bao_ha_du: new FormControl(),
      bao_trinh_cong_trinh: new FormControl(),
      lap_co_so_du_lieu_ho_chua_thuy_dien: new FormControl(),
      phuong_an_bao_ve_dap_ho_chua_thuy_dien: new FormControl(),
      bao_cao_danh_gia_an_toan: new FormControl(),
      bao_cao_hien_trang_an_toan_dap_ho: new FormControl(),
      to_khai_dang_ky_an_toan_dap_ho: new FormControl()
    }
  }

  callService(data) {
    this.energyService.PostHydroEnergyData([data], this.currentYear).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  // applyDistrictFilter(event) {
  //   let filteredData = [];

  //   event.value.forEach(element => {
  //     this.dataSource.data.filter(x => x.ma_huyen_thi == element).forEach(x => filteredData.push(x));
  //   });

  //   if (!filteredData.length) {
  //     if (event.value.length)
  //       this.filteredDataSource.data = [];
  //     else
  //       this.filteredDataSource.data = this.dataSource.data;
  //   }
  //   else {
  //     this.filteredDataSource.data = filteredData;
  //   }
  //   this.caculatorValue();
  //   this.paginatorAgain();
  // }

  initPaginator() {
    if (this.filteredDataSource.data.length) {
      this.filteredDataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Số hàng';
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";
    }
  }

  caculatorValue() {
    this.doanhThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.doanh_thu).reduce((a, b) => a + b) : 0;
    this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
    // // this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.Cx).reduce((a, b) => a + b) : 0;
    this.sanluongnam = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_nam).reduce((a, b) => a + b) : 0;
  }
  isHidden(row: any) {
    return (this.isChecked) ? (row.is_het_han) : false;
  }

  applyActionCheck(event) {
    this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.caculatorValue();
    this.initPaginator();
  }
}