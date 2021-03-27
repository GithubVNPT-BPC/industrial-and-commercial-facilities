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

  constructor(
    private injector: Injector,
    private energyService: EnergyService,
    public _login: LoginService
  ) {
    super(injector);
  }

  //Constant variable
  public readonly displayedColumns: string[] = ['select', 'index', 'ten_khach_hang', 'dia_chi', 'nganh_nghe', 'dien', 'than',
    'DO', 'FO', 'xang', 'LPG', 'go', 'nang_luong_quy_doi'];

  //TS & HTML Variable
  public dataSource: MatTableDataSource<KeyEnergyModel>;
  public filteredDataSource: MatTableDataSource<KeyEnergyModel> = new MatTableDataSource<KeyEnergyModel>();;

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
    this.TITLE_DEFAULT = "Năng lượng - Năng lượng trọng điểm";
    this.TEXT_DEFAULT = "Năng lượng - Năng lượng trọng điểm";
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
      ten_khach_hang: new FormControl(),
      dia_chi: new FormControl(),
      nganh_nghe: new FormControl(),
      dien: new FormControl(),
      than: new FormControl(),
      DO: new FormControl(),
      FO: new FormControl(),
      xang: new FormControl(),
      LPG: new FormControl(),
      go: new FormControl(),
      nang_luong_quy_doi: new FormControl(),
      time_id: new FormControl()
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