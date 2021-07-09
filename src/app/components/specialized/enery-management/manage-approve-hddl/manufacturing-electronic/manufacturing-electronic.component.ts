import { Component, Input, Injector } from "@angular/core";
import { MatTableDataSource } from '@angular/material';
import { ManageAproveElectronic } from 'src/app/_models/APIModel/electric-management.module';
import { FormControl } from '@angular/forms';
import { BaseComponent } from '../../../base.component';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { LoginService } from 'src/app/_services/APIService/login.service';

import moment from "moment";

@Component({
  selector: 'app-manufacturing-electronic',
  templateUrl: './manufacturing-electronic.component.html',
  styleUrls: ['../../../special_layout.scss']
})
export class ManufacturingElectronicComponent extends BaseComponent {
  DB_TABLE = 'QLNL_CAP_PHEP_HOAT_DONG_DIEN_LUC';
  @Input('manufacturingData') input_data: ManageAproveElectronic[];

  //Constant variable
  public readonly displayedColumns: string[] =
    ['select','index', 'ten_doanh_nghiep', 'dia_diem',
      'so_dien_thoai', 'so_giay_phep', 'ngay_cap',
      'ngay_het_han', 'thoi_gian_chinh_sua_cuoi'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<ManageAproveElectronic> = new MatTableDataSource<ManageAproveElectronic>();
  public filteredDataSource: MatTableDataSource<ManageAproveElectronic> = new MatTableDataSource<ManageAproveElectronic>();
  //Only TS Variable
  doanhThu: number;
  congXuat: number;
  sanluongnam: number;
  soLuongDoanhNghiep: number;
  soLuongDoanhNghiepExpired: number = 0;
  isChecked: boolean;

  constructor(
    private injector: Injector,
    private energyService: EnergyService,
    public _login: LoginService
  ) {
    super(injector);
  }

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.getDataManufacturing();

    if (this._login.userValue.user_role_id == 4  || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }





  getDataManufacturing() {
    this.energyService.LayDuLieuTuVanDien().subscribe((result) => {
      this.filteredDataSource.data = [];
      if (result.data && result.data.length > 0) {
        let data = result.data.filter(item => item.id_group == 2);
        
        data.forEach(element => {
          element.ngay_cap = this.formatDate(element.ngay_cap);
          element.ngay_het_han = this.formatDate(element.ngay_het_han);
          element.is_expired = element.ngay_het_han ? new Date(element.ngay_het_han) < new Date() : false;
        });
        
        this.dataSource = new MatTableDataSource<ManageAproveElectronic>(data);
        this.filteredDataSource = new MatTableDataSource<ManageAproveElectronic>(data);
      }
      this._prepareData();
      this.paginatorAgain();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  _prepareData() {
    // this.doanhThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.doanh_thu).reduce((a, b) => a + b) : 0;
    this.soLuongDoanhNghiep = this.dataSource.data.length;
    this.soLuongDoanhNghiepExpired = this.filteredDataSource.data.filter(x => x.is_expired).length;
    // this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_xuat_thiet_ke).reduce((a, b) => a + b) : 0;
    // this.sanluongnam = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_nam).reduce((a, b) => a + b) : 0;
  }

  applyActionCheck(event) {
    if (event.checked) {
      this.filteredDataSource.data = this.filteredDataSource.data.filter(e => {
        return new Date(e.ngay_het_han) < new Date();
      });
    } else {
      this.filteredDataSource.data = [...this.dataSource.data];
    }
    this._prepareData();
    this.paginatorAgain();
  }

  LocDulieuTheoNgayCap(year) {
    this.filteredDataSource.data = [...this.dataSource.data];
    if (year) {
      this.filteredDataSource.data = this.filteredDataSource.data.filter(item => {
        return item.ngay_cap.toString().includes(year);
      })
    }
  }

  getFormParams() {
    return {
      id: new FormControl(),
      ten_doanh_nghiep: new FormControl(''),
      dia_chi: new FormControl(''),
      dien_thoai: new FormControl(''),
      so_giay_phep: new FormControl(''),
      ngay_cap: new FormControl(''),
      ngay_het_han: new FormControl(''),
      id_group: new FormControl(1)
    }
  }

  setFormParams() {
    if (this.selection.selected.length) {
     let selectedRecord = this.selection.selected[0];
     this.formData.controls['ten_doanh_nghiep'].setValue(selectedRecord.ten_doanh_nghiep);
     this.formData.controls['dia_chi'].setValue(selectedRecord.dia_chi);
     this.formData.controls['dien_thoai'].setValue(selectedRecord.dien_thoai);
     this.formData.controls['so_giay_phep'].setValue(selectedRecord.so_giay_phep);
     this.formData.controls['ngay_cap'].setValue(selectedRecord.ngay_cap.toDate());
     this.formData.controls['ngay_het_han'].setValue(selectedRecord.ngay_het_han.toDate());
     this.formData.controls['id'].setValue(selectedRecord.id);
    }
}
public prepareModDataForEdit(data) {
  let modDatas = super.prepareModDataForEdit(data);
  if (modDatas['ngay_cap']) {
    modDatas['ngay_cap'] = moment(data['ngay_cap']).format('yyyyMMDD');
  }
  if (modDatas['ngay_het_han']) {
    modDatas['ngay_het_han'] = moment(data['ngay_het_han']).format('yyyyMMDD');
  }
  return modDatas;
}
  public prepareData(data) {
    data['ngay_cap'] = moment(data['ngay_cap']).format('yyyyMMDD');
    data['ngay_het_han'] = moment(data['ngay_het_han']).format('yyyyMMDD');
    return data;
  }

  public callService(data) {
    this.energyService.CapNhatDuLieuCapPhepHoatDong([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.energyService.DeleteCapPhepDien(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "specialized/enery-management/manage_aprove_hddl";
    this.TITLE_DEFAULT = "Quy hoạch phát triển lưới điện - Cấp phép hoạt động điện";
    this.TEXT_DEFAULT = "Quy hoạch phát triển lưới điện - Cấp phép hoạt động điện";
  }
}
