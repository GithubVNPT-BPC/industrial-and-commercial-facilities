import { Component, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ElectricityDevelopment35KVModel } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-electricity-development',
  templateUrl: './electricity-development.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class ElectricDevelopmentManagementComponent extends BaseComponent {

  //Constant variable
  public readonly displayedColumns: string[] = ['select', 'index', 'ten_huyen_thi', 'trung_ap_3p', 'trung_ap_1p', 'ha_ap_3p', 'ha_ap_1p', 'so_tram_bien_ap', 'cong_xuat_bien_ap'];
  public readonly dsplayMergeColumns: string[] = ['indexM', 'ten_huyen_thiM', 'trung_apM', 'ha_apM', 'bien_apM'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<ElectricityDevelopment35KVModel> = new MatTableDataSource<ElectricityDevelopment35KVModel>();
  public filteredDataSource: MatTableDataSource<ElectricityDevelopment35KVModel> = new MatTableDataSource<ElectricityDevelopment35KVModel>();

  //Only TS Variable
  trung_ap_3p: number;
  tongSoXa: number;
  trung_ap_1p: number;
  ha_ap_1p: number;
  ha_ap_3p: number;
  so_tram_bien_ap: number;
  cong_xuat_bien_ap: number;
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
    this.getDataQuyHoachDienDuoi35KV();

    if (this._login.userValue.user_role_id == 4  || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getDataQuyHoachDienDuoi35KV() {
    this.energyService.LayDuLieuQuyHoachDien35KV(this.currentYear).subscribe(result => {
      this.filteredDataSource.data = [];
      if (result.data && result.data.length > 0) {
        this.dataSource = new MatTableDataSource<ElectricityDevelopment35KVModel>(result['data']);
        this.filteredDataSource = new MatTableDataSource<ElectricityDevelopment35KVModel>(result['data']);
      }
      this.caculatorValue();
      this.paginatorAgain();
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyDistrictFilter(event) {
    let filteredData = [];

    event.value.forEach(element => {
      this.dataSource.data.filter(x => x.id_quan_huyen == element).forEach(x => filteredData.push(x));
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

  caculatorValue() {
    this.trung_ap_3p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.trung_ap_3_pha).reduce((a, b) => a + b) : 0;
    this.tongSoXa = this.filteredDataSource.data.length;
    this.trung_ap_1p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.trung_ap_1_pha).reduce((a, b) => a + b) : 0;
    this.ha_ap_1p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.ha_ap_1_pha).reduce((a, b) => a + b) : 0;
    this.ha_ap_3p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.ha_ap_3_pha).reduce((a, b) => a + b) : 0;
    this.so_tram_bien_ap = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.so_tram).reduce((a, b) => a + b) : 0;
    this.cong_xuat_bien_ap = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_suat).reduce((a, b) => a + b) : 0;
  }

  applyActionCheck(event) {
    this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.caculatorValue();
    this.paginatorAgain();
  }

  getFormParams() {
    return {
      dia_ban: new FormControl(''),
      trung_ap_3_pha: new FormControl(''),
      trung_ap_1_pha: new FormControl(''),
      ha_ap_3_pha: new FormControl(''),
      ha_ap_1_pha: new FormControl(''),
      so_tram: new FormControl(''),
      cong_suat: new FormControl(''),
      time_id: new FormControl(this.currentYear),
      id_trang_thai_hoat_dong: new FormControl(1),
      id_quan_huyen: new FormControl()
    }
  }

  public prepareData(data) {
    data['trung_ap_3_pha'] = Number(data['trung_ap_3_pha']);
    data['trung_ap_1_pha'] = Number(data['trung_ap_1_pha']);
    data['ha_ap_3_pha'] = Number(data['ha_ap_3_pha']);
    data['ha_ap_1_pha'] = Number(data['ha_ap_1_pha']);
    data['so_tram'] = Number(data['so_tram']);
    data['cong_suat'] = Number(data['cong_suat']);
    data['time_id'] = data['time_id'];
    data['id_trang_thai_hoat_dong'] = 1;
    return data;
  }

  public callService(data) {
    this.energyService.CapNhatDuLieuQuyHoachDien35KV([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.energyService.Delete35KV_ElectricalNet(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  getLinkDefault() {
    //Constant
    this.LINK_DEFAULT = "/specialized/enery-management/35kv_electricity_development";
    this.TITLE_DEFAULT = "Quy hoạch phát triển lưới điện - Công tác phát triển lưới điện 35KV";
    this.TEXT_DEFAULT = "Quy hoạch phát triển lưới điện - Công tác phát triển lưới điện 35KV";
  }
}