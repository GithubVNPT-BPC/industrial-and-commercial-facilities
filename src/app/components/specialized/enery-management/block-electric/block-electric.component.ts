import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';

import { BlockElectricModel } from 'src/app/_models/APIModel/electric-management.module';

import { EnergyService } from 'src/app/_services/APIService/energy.service';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
  selector: 'app-block-electric',
  templateUrl: './block-electric.component.html',
  styleUrls: ['/../../special_layout.scss']
})
export class BlockElectricComponent extends BaseComponent {
  DB_TABLE  = 'QLNL_DIENSINHKHOI'
  //Constant variable
  public readonly displayedColumns: string[] = ['select', 'index', 'ten_du_an', 'ten_doanh_nghiep','ten_quan_huyen', 'cong_suat_thiet_ke', 'san_luong_6_thang',
   'san_luong_nam', 'doanh_thu','id_trang_thai_hoat_dong', 'thoi_gian_chinh_sua_cuoi'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<BlockElectricModel> = new MatTableDataSource<BlockElectricModel>();
  public filteredDataSource: MatTableDataSource<BlockElectricModel> = new MatTableDataSource<BlockElectricModel>();

  //Only TS Variable
  doanhThu: number;
  congXuat: number;
  sanluongnam: number;
  soLuongDoanhNghiep: number;
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
    this.getDataBlockElectric(this.currentYear);

    if (this._login.userValue.user_role_id == 4  || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/enery-management/block_electric";
    this.TITLE_DEFAULT = "Năng lượng - Điện sinh khối";
    this.TEXT_DEFAULT = "Năng lượng - Điện sinh khối";
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  getFormParams() {
    return {
      id: new FormControl(),
      ten_du_an: new FormControl(),
      ten_doanh_nghiep: new FormControl(),
      id_quan_huyen: new FormControl(),
      cong_suat_thiet_ke: new FormControl(),
      san_luong_6_thang: new FormControl(),
      san_luong_nam: new FormControl(),
      doanh_thu: new FormControl(),
      time_id: new FormControl(),
      id_trang_thai_hoat_dong: new FormControl(),
    }
  }
  
  setFormParams() {
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['id'].setValue(selectedRecord.id);
      this.formData.controls['ten_du_an'].setValue(selectedRecord.ten_du_an);
      this.formData.controls['id_quan_huyen'].setValue(selectedRecord.id_quan_huyen);
      this.formData.controls['cong_suat_thiet_ke'].setValue(selectedRecord.cong_suat_thiet_ke);
      this.formData.controls['san_luong_6_thang'].setValue(selectedRecord.san_luong_6_thang);
      this.formData.controls['san_luong_nam'].setValue(selectedRecord.san_luong_nam);
      this.formData.controls['doanh_thu'].setValue(selectedRecord.doanh_thu);
      this.formData.controls['time_id'].setValue(selectedRecord.time_id);
      this.formData.controls['id_trang_thai_hoat_dong'].setValue(selectedRecord.id_trang_thai_hoat_dong);
      this.formData.controls['ten_doanh_nghiep'].setValue(selectedRecord.ten_doanh_nghiep);
    }
  }

  prepareData(data) {
    return data;
  }

  callService(data) {
    this.energyService.PostBlockElectricData([data], this.currentYear).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.energyService.DeleteBlockElectric(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  getDataBlockElectric(time_id: any) {
    this.energyService.LayDuLieuDienSinhKhoi(time_id).subscribe(res => {
      this.filteredDataSource.data = [];
      if (res.data && res.data.length > 0) {
        this.filteredDataSource = new MatTableDataSource<BlockElectricModel>(res['data']);
        this.dataSource = new MatTableDataSource<BlockElectricModel>(res['data']);
      }
      this.caculatorValue();
      this.paginatorAgain();
    })
  }
  
  caculatorValue() {
    this.doanhThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.doanh_thu).reduce((a, b) => a + b) : 0;
    this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
    this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_suat_thiet_ke).reduce((a, b) => a + b) : 0;
    this.sanluongnam = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_nam).reduce((a, b) => a + b) : 0;
  }

  applyActionCheck(event) {
    event.checked
      ? this.filteredDataSource.data = this.filteredDataSource.data.filter(item => item.id_trang_thai_hoat_dong = 0)
      : this.filteredDataSource.data = this.dataSource.data;
    // this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.caculatorValue();
  }

  applyDistrictFilter(event) {
    let filteredData = [];

    event.value.forEach(element => {
      this.dataSource.data.filter(x => x['id_quan_huyen'] == element).forEach(x => filteredData.push(x));
    });

    if (!filteredData.length) {
      if (event.value.length)
        this.filteredDataSource.data = [];
      else
        this.filteredDataSource.data = this.dataSource.data;
    }
    else {
      this.filteredDataSource.data = filteredData;
    }
    this.caculatorValue();
    this.paginatorAgain();
  }

}
