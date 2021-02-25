import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SolarEneryManagementModel } from 'src/app/_models/APIModel/electric-management.module';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';

import { FormControl } from '@angular/forms';
import { EnergyService } from 'src/app/_services/APIService/energy.service';

import { BaseComponent } from 'src/app/components/specialized/specialized-base.component';


@Component({
  selector: 'app-solar-enery-management',
  templateUrl: './solor-enery-management.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class SolarEneryManagementComponent extends BaseComponent {
  //Constant variable
  public readonly displayedColumns: string[] = 
  ['select', 'index', 'ten_du_an', 'ten_doanh_nghiep', 'ten_huyen_thi', 'cong_suat_thiet_ke', 
  'san_luong_6_thang', 'san_luong_nam', 'doanh_thu', 'trang_thai'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<SolarEneryManagementModel> = new MatTableDataSource<SolarEneryManagementModel>();
  public filteredDataSource: MatTableDataSource<SolarEneryManagementModel> = new MatTableDataSource<SolarEneryManagementModel>();

  //Only TS Variable
  years: number[] = [];
  doanhThu: number;
  congXuat: number;
  sanluongnam: number;
  soLuongDoanhNghiep: number;
  isChecked: boolean;

  constructor(
    private injector: Injector,
    private energyService: EnergyService
  ) {
      super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.years = this.getYears();
    this.getSolarEnergyData(this.currentYear);
    this.caculatorValue();
  }

  getSolarEnergyData(time_id){
    this.energyService.LayDuLieuDienMatTroi(time_id).subscribe(res => {
      this.dataSource = new MatTableDataSource<SolarEneryManagementModel>(res.data);
      this.filteredDataSource =  new MatTableDataSource<SolarEneryManagementModel>(res.data);
      this.initPaginator();
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  getYears() {
    return Array(5).fill(1).map((element, index) => new Date().getFullYear() - index);
  }

  getFormParams() {
      return {
        ten_du_an: new FormControl(),
        ten_doanh_nghiep: new FormControl(),
        dia_diem: new FormControl(),
        cong_suat_thiet_ke: new FormControl(),
        san_luong_6_thang: new FormControl(),
        san_luong_nam: new FormControl(),
        doanh_thu: new FormControl(),
        id_quan_huyen: new FormControl(),
      }
  }

  prepareData(data) {
      data = {...data, ...{
          id_trang_thai_hoat_dong: 1,
          time_id: this.currentYear,
      }}
      return data;        
  }

  callService(data) {
      this.energyService.PostSolarEnergyData([data], this.currentYear).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
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
    this.initPaginator();
  }

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
    this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_suat_thiet_ke).reduce((a, b) => a + b) : 0;
    this.sanluongnam = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_nam).reduce((a, b) => a + b) : 0;
  }

  applyActionCheck(event) {
    this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.caculatorValue();
    this.initPaginator();
  }
}