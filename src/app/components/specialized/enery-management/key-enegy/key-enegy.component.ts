import { Component, Injector, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { KeyEnergyModel } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-key-enegy',
  templateUrl: './key-enegy.component.html',
  styleUrls: ['../../special_layout.scss']
})
export class KeyEnegyComponent extends BaseComponent {

  DB_TABLE = 'QLNL_NANG_LUONG_TRONG_DIEM'
  constructor(
    private injector: Injector,
    private energyService: EnergyService,
    public _login: LoginService
  ) {
    super(injector);
  }

  //Constant variable
  public readonly displayedColumns: string[] = ['select', 'index', 'ten_khach_hang', 'dia_chi', 'nganh_nghe', 'dien', 'than',
    'DO', 'FO', 'xang', 'LPG', 'go', 'nang_luong_quy_doi', 'thoi_gian_chinh_sua_cuoi'];

  //TS & HTML Variable
  public dataSource: MatTableDataSource<KeyEnergyModel>;
  public filteredDataSource: MatTableDataSource<KeyEnergyModel> = new MatTableDataSource<KeyEnergyModel>();

  //Only TS Variable
  TongNangLuongQuyDoi: number = 0;
  TongDienTieuThu: number = 0;
  soLuongDoanhNghiep: number = 0;
  isChecked: boolean;

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.laydulieuNLTD();

    if (this._login.userValue.user_role_id == 4  || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/enery-management/key_enegy";
    this.TITLE_DEFAULT = "Hiện trạng các nguồn điện sơ cấp - Năng lượng trọng điểm";
    this.TEXT_DEFAULT = "Hiện trạng các nguồn điện sơ cấp - Năng lượng trọng điểm";
  }

  laydulieuNLTD() {
    this.energyService.LayDuLieuNangLuongTrongDiem(this.currentYear).subscribe(res => {
      this.filteredDataSource.data = [];
      if (res.data && res.data.length) {
        this.dataSource = new MatTableDataSource<KeyEnergyModel>(res.data);
        this.filteredDataSource = new MatTableDataSource<KeyEnergyModel>(res.data);
      }
      
      this._prepareData();
      this.paginatorAgain();
    })
  }

  _prepareData(){
    let data = this.filteredDataSource.data;
    this.soLuongDoanhNghiep = data.length;
    this.TongDienTieuThu = data.length ? data.map(item => item.dien).reduce((a, b) => a + b) : 0;
    this.TongNangLuongQuyDoi = data.length ? data.map(item => item.nang_luong_quy_doi).reduce((a, b) => a + b) : 0;
  }

  getFormParams() {
    return {
      id: new FormControl(),
      ten_khach_hang: new FormControl(),
      dia_chi: new FormControl(),
      nganh_nghe: new FormControl(),
      dien: new FormControl(),
      than: new FormControl(),
      DO: new FormControl(),
      FO: new FormControl(),
      xang: new FormControl(),
      LPG: new FormControl(),
      _go: new FormControl(),
      nang_luong_quy_doi: new FormControl(),
      time_id: new FormControl()
    }
  }
  setFormParams() {
    if (this.selection.selected.length) {
     let selectedRecord = this.selection.selected[0];
     this.formData.controls['ten_khach_hang'].setValue(selectedRecord.ten_khach_hang);
     this.formData.controls['dia_chi'].setValue(selectedRecord.dia_chi);
     this.formData.controls['nganh_nghe'].setValue(selectedRecord.nganh_nghe);
     this.formData.controls['dien'].setValue(selectedRecord.dien);
     this.formData.controls['than'].setValue(selectedRecord.than);
     this.formData.controls['DO'].setValue(selectedRecord.DO);
     this.formData.controls['FO'].setValue(selectedRecord.FO);
     this.formData.controls['xang'].setValue(selectedRecord.xang);
     this.formData.controls['LPG'].setValue(selectedRecord.LPG);
     this.formData.controls['_go'].setValue(selectedRecord._go);
     this.formData.controls['nang_luong_quy_doi'].setValue(selectedRecord.nang_luong_quy_doi);
     this.formData.controls['time_id'].setValue(selectedRecord.time_id);
     this.formData.controls['id'].setValue(selectedRecord.id);
    }
}
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  callService(data) {
    this.energyService.ThemDuLieuNangLuongTrongDiem([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(IDs: any){
    this.energyService.XoaDuLieuNangLuongTrongDiem(IDs).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }
}