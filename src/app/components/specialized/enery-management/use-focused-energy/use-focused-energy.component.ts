import { Component, OnInit, ViewChild, ElementRef, Injector } from '@angular/core';
import { MatAccordion, MatPaginator, MatTable, MatTableDataSource } from '@angular/material';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
import { UserForcusEnergy } from 'src/app/_models/APIModel/electric-management.module';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { FormControl } from '@angular/forms';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { BaseComponent } from '../../base.component';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
  selector: 'app-use-focused-energy',
  templateUrl: './use-focused-energy.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class UseFocusedEnergyComponent extends BaseComponent {
  //ViewChild 
  // @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('district', { static: false }) district: ElementRef

  public readonly displayedColumns: string[] = ['select','index', 'ten_doanh_nghiep', 'dia_chi', 'nganh_nghe', 'nang_luong_tieu_thu', 'nang_luong_quy_doi', 'suat_tieu_hao'];
  public readonly displayMergeColumns: string[] = ['indexM', 'ten_doanh_nghiepM', 'nganh_ngheM', 'nang_luong_trong_diemM'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<UserForcusEnergy> = new MatTableDataSource<UserForcusEnergy>();
  public filteredDataSource: MatTableDataSource<UserForcusEnergy> = new MatTableDataSource<UserForcusEnergy>();

  //Only TS Variable
  nangLuongTieuThu: number;
  nangLuongQuyDoi: number;
  congXuat: number;
  doanhNghiep: number;
  isChecked: boolean;
  
  constructor(
    private injector: Injector,
    public excelService: ExcelService,
    private energyService: EnergyService,
    public _login: LoginService
  ) {
    super(injector);
  }

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.getDataSaveElectric();
    this.initWards();

    if (this._login.userValue.user_role_id == 4  || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getDataSaveElectric() {
    this.energyService.LayDuLieuTietKiemNangLuong(this.currentYear).subscribe(result => {
      this.filteredDataSource.data = [];
      if (result.data && result.data.length > 0) {
        this.dataSource = new MatTableDataSource<UserForcusEnergy>(result.data);
        this.filteredDataSource.data = [...this.dataSource.data];
      }
      this.caculatorValue();
      this.paginatorAgain();
    })
  }

  getLinkDefault() {
    //Constant variable
    this.LINK_DEFAULT = "/specialized/enery-management/countryside_electric";
    this.TITLE_DEFAULT = "Tiết kiệm năng lượng";
    this.TEXT_DEFAULT = "Tiết kiệm năng lượng";
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
    this.nangLuongQuyDoi = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.nang_luong_quy_doi).reduce((a, b) => a + b) : 0;
    this.nangLuongTieuThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.nang_luong_tieu_thu).reduce((a, b) => a + b) : 0;
    this.doanhNghiep = this.filteredDataSource.data.length;
    this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.suat_tieu_hao_1_dv_sp).reduce((a, b) => a + b) : 0;
  }

  applyActionCheck(event) {
    this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.caculatorValue();
    this.paginatorAgain();
  }

  getFormParams() {
    return {
      ten_doanh_nghiep: new FormControl(''),
      dia_diem: new FormControl(''),
      nganh_nghe_san_xuat: new FormControl(''),
      nang_luong_tieu_thu: new FormControl(0),
      nang_luong_quy_doi: new FormControl(0),
      suat_tieu_hao_1_dv_sp: new FormControl(0),
      time_id: new FormControl(this.currentYear),
      id_quan_huyen: new FormControl(''),
    }
  }

  public prepareData(data) {
    data['dia_diem'] = data['dia_diem'];
    data['nang_luong_tieu_thu'] = Number(data['nang_luong_tieu_thu']);
    data['suat_tieu_hao_1_dv_sp'] = Number(data['suat_tieu_hao_1_dv_sp']);
    data['nang_luong_quy_doi'] = Number(data['nang_luong_quy_doi']);
    return data;
  }

  public callService(data) {
    this.energyService.CapNhatDuLieutietKiemNL([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
      this.energyService.DeleteFocusedEnergy(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  id_quan_huyen: number;

  autoDistric(event) {
    this.id_quan_huyen = event.value['id_quan_huyen'];
    this.concatAddress(event.value['ten_phuong_xa'], this.id_quan_huyen);
  }

  name_ward: string = '';
  address: string = '';
  concatAddress(ten_phuong_xa: string, id_quan_huyen: number) {
    let item = this.districts.find(district =>
      district.id == id_quan_huyen
    )
    this.address = ten_phuong_xa + " , " + item['ten_quan_huyen'];
  }
}