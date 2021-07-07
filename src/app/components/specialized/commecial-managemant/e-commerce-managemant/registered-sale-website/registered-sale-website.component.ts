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
  DB_TABLE = 'QLTM_TMDT_dang_Ky_website'
  displayedColumns: string[] =
    ['select', 'index', 'ten_tc_cn', 'mst', 'dia_chi', 'nguoi_dai_dien',
      'dien_thoai', 'ten_mien', 'loai_hang_hoa', 'email', 'so_gian_hang', 'ghi_chu', 'thoi_gian_chinh_sua_cuoi'];
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
      id: new FormControl(),
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

  setFormParams(){
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['id'].setValue(selectedRecord.id);
      this.formData.controls['mst_quyet_dinh'].setValue(selectedRecord.mst_quyet_dinh);
      this.formData.controls['to_chu_ca_nhan'].setValue(selectedRecord.to_chu_ca_nhan);
      this.formData.controls['nguoi_dai_dien'].setValue(selectedRecord.nguoi_dai_dien);
      this.formData.controls['dien_thoai'].setValue(selectedRecord.dien_thoai);
      this.formData.controls['ten_mien'].setValue(selectedRecord.ten_mien);
      this.formData.controls['email'].setValue(selectedRecord.email);
      this.formData.controls['san_pham_tren_website'].setValue(selectedRecord.san_pham_tren_website);
      this.formData.controls['ghi_chu'].setValue(selectedRecord.ghi_chu);
      this.formData.controls['dia_diem'].setValue(selectedRecord.dia_diem);
      this.formData.controls['so_gian_hang'].setValue(selectedRecord.so_gian_hang);
      this.formData.controls['id_quan_huyen'].setValue(selectedRecord.id_quan_huyen);  }
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
