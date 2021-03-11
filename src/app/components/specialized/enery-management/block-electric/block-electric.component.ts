import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';

import { BlockElectricModel } from 'src/app/_models/APIModel/electric-management.module';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';

import { EnergyService } from 'src/app/_services/APIService/energy.service';

import { BaseComponent } from 'src/app/components/specialized/base.component';

@Component({
  selector: 'app-block-electric',
  templateUrl: './block-electric.component.html',
  styleUrls: ['/../../special_layout.scss']
})
export class BlockElectricComponent extends BaseComponent {

  //Constant variable
  public readonly displayedColumns: string[] = ['index', 'ten_du_an', 'ten_doanh_nghiep', 'dia_diem', 'cong_xuat_thiet_ke', 'san_luong_6_thang', 'san_luong_nam', 'doanh_thu', 'id_trang_thai_hoat_dong'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<BlockElectricModel> = new MatTableDataSource<BlockElectricModel>();
  public filteredDataSource: MatTableDataSource<BlockElectricModel> = new MatTableDataSource<BlockElectricModel>();

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
    this.getDataBlockElectric(this.currentYear);
  }

  getLinkDefault(){
    this.LINK_DEFAULT = "/specialized/enery-management/block_electric";
    this.TITLE_DEFAULT = "Năng lượng - Điện sinh khối";
    this.TEXT_DEFAULT = "Năng lượng - Điện sinh khối";
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
      this.energyService.PostBlockElectricData([data], this.currentYear).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  getDataBlockElectric(time_id: any) {
    this.energyService.LayDuLieuDienSinhKhoi(time_id).subscribe(res => {
      if (res.data && res.data.length > 0) {
        this.filteredDataSource = new MatTableDataSource<BlockElectricModel>(res['data']);
        this.dataSource = new MatTableDataSource<BlockElectricModel>(res['data']);
        this.caculatorValue();
        this.initPaginator();
      }
    })
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
