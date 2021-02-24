//Import Library
import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

import { ConvenienceStoreModel } from 'src/app/_models/APIModel/commecial-management.model';

import { BaseComponent } from 'src/app/components/specialized/specialized-base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';

import moment from 'moment';

@Component({
  selector: 'app-stores-commecial',
  templateUrl: './stores-commecial.component.html',
  styleUrls: ['../../../special_layout.scss'],
})
export class StoreManagementComponent extends BaseComponent {  

  years: any[] = [];

  isChecked: boolean = false;

  filterModel = {
    is_expired: false,
    id_quan_huyen: [],
  };
  dataSource: MatTableDataSource<ConvenienceStoreModel> = new MatTableDataSource<ConvenienceStoreModel>();
  filteredDataSource: MatTableDataSource<ConvenienceStoreModel> = new MatTableDataSource<ConvenienceStoreModel>();

  //
  public tongCuaHang: number;
  public soCuaHangTL: number;
  public soCuaHangKhac: number;
  public soCuaHangDauTuTrongNam: number = 0;
  public soCuaHangDauTuNamTruoc: number = 0;

  displayedFields = {
    ten_cua_hang: "Tên cửa hàng",
    dia_chi_day_du: "Địa chỉ",
    mst: "Mã số thuế",
    so_dien_thoai: "Điện thoại",
    ten_san_pham: "Sản phẩm kinh doanh",
    so_chung_nhan: "Số chứng nhận ĐKKD",
    ngay_cap_giay_chung_nhan: "Ngày cấp",
    noi_cap_giay_chung_nhan: "Nơi cấp",
    so_giay_phep: "Số giấy phép",
    ngay_cap_giay_phep: "Ngày cấp",
    ngay_het_han_giay_phep: "Ngày hết hạn",
  }

  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.years = this.getYears();
    this.initDistrictWard();
    this.getConvenienceStoreData();
  }

  ngAfterViewInit() {
    this.paginator.pageIndex = 0;
    this.paginatorAgain();
  }

  getConvenienceStoreData () {
    this.commerceManagementService.getConvenienceStoreData().subscribe(
      allrecords => {
        if (allrecords.data && allrecords.data.length > 0) {
          let data = allrecords.data;
          let currentDate = moment();
          data.map(x => {
              let expiredDate = moment(x.ngay_het_han_giay_phep, "DD/MM/YYYY");
              x.is_expired = currentDate.isAfter(expiredDate, 'day');
          });          
          this.dataSource = new MatTableDataSource<ConvenienceStoreModel>(data);
          
          this._prepareData(this.dataSource.data);
          this.filteredDataSource.data = [...this.dataSource.data];
          this.paginatorAgain();
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  getFormParams() {
    return {
      ten_cua_hang: new FormControl(),
      mst: new FormControl(),
      dia_chi: new FormControl(),
      so_dien_thoai: new FormControl(),
      ten_san_pham: new FormControl(),
      so_chung_nhan: new FormControl(),
      ngay_cap_giay_chung_nhan: new FormControl(),
      noi_cap_giay_chung_nhan: new FormControl(),
      so_giay_phep: new FormControl(),
      ngay_cap_giay_phep: new FormControl(),
      ngay_het_han_giay_phep: new FormControl(),
      id_phuong_xa: new FormControl(),
    }
  }

  callService(data) {
    this.commerceManagementService.postConvenienceStore([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  getYears() {
    return Array(5)
      .fill(1)
      .map((element, index) => new Date().getFullYear() - index);
  }

  private _prepareData(data: ConvenienceStoreModel[]): void {
    this.soCuaHangTL = data.length;
    this.soCuaHangKhac = data.length - this.soCuaHangTL;
    this.tongCuaHang = this.dataSource.data.length;
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter() {
    this.filterModel.is_expired = this.isChecked ? true : null;

    let filteredData = this.filterArray(this.dataSource.data, this.filterModel);
    if (!filteredData.length) {
      if (this.filterModel)
        this.filteredDataSource.data = [];
      else
        this.filteredDataSource.data = this.dataSource.data;
    }
    else {
      this.filteredDataSource.data = filteredData;
    }
    this.paginatorAgain();
    this._prepareData(filteredData);
  }

  filterArray(array, filters) {
    const filterKeys = Object.keys(filters);
    let temp = [...array];
    filterKeys.forEach(key => {
      let temp2 = [];
      if (key == 'is_expired') {
        if (filters[key]) {
          temp2 = temp2.concat(temp.filter(x => x[key] == filters[key]));
          temp = [...temp2];
        }
      }
      // if (key == 'ngaycapgcn') {
      //   if (filters[key] != 0) {
      //     temp2 = temp2.concat(temp.filter(x => x[key].getFullYear() == filters[key]));
      //     temp = [...temp2];
      //   }
      // }
      else {
        if (filters[key])
          if (filters[key].length) {
            filters[key].forEach(criteria => {
              temp2 = temp2.concat(temp.filter(x => x[key] == criteria));
            });
            temp = [...temp2];
          }
      }
    })
    return temp;
  }
}
