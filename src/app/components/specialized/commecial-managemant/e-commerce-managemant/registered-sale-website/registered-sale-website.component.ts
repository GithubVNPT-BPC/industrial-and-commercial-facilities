import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { regisWebsiteModel } from 'src/app/_models/APIModel/e-commerce.model';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { FormControl } from '@angular/forms';
import { BaseComponent } from '../../../base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
  selector: 'registered-sale-website',
  templateUrl: './registered-sale-website.component.html',
  styleUrls: ['../../../special_layout.scss'],
})
export class RegisteredSaleWebsiteComponent extends BaseComponent {
  displayedColumns: string[] =
    ['select', 'index', 'ten_tc_cn', 'mst', 'dia_chi', 'nguoi_dai_dien',
      'dien_thoai', 'ten_mien', 'loai_hang_hoa', 'email', 'so_gian_hang', 'ghi_chu'];
  dataSource: MatTableDataSource<regisWebsiteModel>;
  filteredDataSource: MatTableDataSource<regisWebsiteModel> = new MatTableDataSource<regisWebsiteModel>();
  filterModel = { id_quan_huyen: [] };
  constructor(
    private inject: Injector,
    public excelService: ExcelService,
    public commerceService: CommerceManagementService,
    public _login: LoginService) {
    super(inject)
  }

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.GetDanhSachWebsiteTMDT();

    if (this._login.userValue.user_role_id == 3  || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  GetDanhSachWebsiteTMDT() {
    this.commerceService.LayDanhSachDangKiWeb().subscribe(response => {
      this.filteredDataSource.data = [];
      if (response.data && response.data.length > 0) {
        this.dataSource = new MatTableDataSource<regisWebsiteModel>(response.data);
        this.dataSource.data.map(x => {
          if (x.ten_mien) {
            x.ten_mien = x.ten_mien.includes('http')? x.ten_mien : 'http://' + x.ten_mien;
          } 
        });
        this.filteredDataSource.data = [...this.dataSource.data];
      }
      this.paginatorAgain();
    })
  }

  getFormParams() {
    return {
      mst_quyet_dinh: new FormControl(),
      to_chu_ca_nhan: new FormControl(),
      dia_diem: new FormControl(),
      nguoi_dai_dien: new FormControl(),
      dien_thoai: new FormControl(),
      ten_mien: new FormControl(),
      san_pham_tren_website: new FormControl(),
      email: new FormControl(),
      so_gian_hang: new FormControl(),
      ghi_chu: new FormControl(),
      id_quan_huyen: new FormControl(),
    }
  }

  getLinkDefault() {
    //Constant
    this.LINK_DEFAULT = "/specialized/commecial-management/e-commerce/register-website";
    this.TITLE_DEFAULT = "Thương mại điện tử - Quản lý đăng ký website cung cấp dịch vụ TMĐT";
    this.TEXT_DEFAULT = "Thương mại điện tử - Quản lý đăng ký website cung cấp dịch vụ TMĐT";
  }

  prepareData(data) {
    return [data];
  }

  callService(data) {
    this.commerceService.CapNhatDanhSachDangKiWeb(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData(){
    let datas = this.selection.selected.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data){
    this.commerceService.XoaDanhSachDangKiWeb(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

}
