import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MultiLevelTradeModel } from 'src/app/_models/APIModel/mutillevel-trade.model';
import { FormControl } from '@angular/forms';

// Services
import { MarketService } from 'src/app/_services/APIService/market.service';
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';

import { LoginService } from 'src/app/_services/APIService/login.service';

import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepicker } from '@angular/material';
import { defaultFormat as _rollupMoment } from 'moment';
import _moment from 'moment';
const moment = _rollupMoment || _moment;
export const DDMMYY_FORMAT = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-multilevel-trade',
  templateUrl: './multilevel-trade.component.html',
  styleUrls: ['/../../special_layout.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: DDMMYY_FORMAT },
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    DatePipe
  ],
})
export class MultilevelTradeComponent extends BaseComponent {
  DB_TABLE = 'QLTM_BHDC'
  displayedColumns: string[] = ['select', 'index', 'mst', 'ten_doanh_nghiep', 'dia_chi_doanh_nghiep', 'thoi_gian_bat_dau', 'thoi_gian_ket_thuc', 'dia_diem_to_chuc', 'thoi_gian_chinh_sua_cuoi',
    'so_giay_dkbhdc', 'co_quan_ban_hanh_giay_dkbhdc', 'ngay_dang_ky_giay_dkbhdc',
    'so_giay_tchtbhdc', 'co_quan_ban_hanh_giay_tchtbhdc', 'ngay_dang_ky_giay_tchtbhdc']
  filterModel = {
    thoi_gian_bat_dau: []
  }

  dataSource: MatTableDataSource<MultiLevelTradeModel> = new MatTableDataSource<MultiLevelTradeModel>();
  filteredDataSource: MatTableDataSource<MultiLevelTradeModel> = new MatTableDataSource<MultiLevelTradeModel>();

  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
    public marketService: MarketService,
    public _login: LoginService
  ) {
    super(injector);
  }

  getFormParams() {
    return {
      id: new FormControl(),
      ten_doanh_nghiep: new FormControl(),
      dia_chi_doanh_nghiep: new FormControl(),
      mst: new FormControl(),
      so_giay_dkbhdc: new FormControl(),
      co_quan_ban_hanh_giay_dkbhdc: new FormControl(),
      ngay_dang_ky_giay_dkbhdc: new FormControl(),
      so_giay_tchtbhdc: new FormControl(),
      co_quan_ban_hanh_giay_tchtbhdc: new FormControl(),
      ngay_dang_ky_giay_tchtbhdc: new FormControl(),
      thoi_gian_bat_dau: new FormControl(),
      thoi_gian_ket_thuc: new FormControl(),
      dia_diem_to_chuc: new FormControl(),
    }
  }

  setFormParams() {
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['id'].setValue(selectedRecord.id);
      this.formData.controls['ten_doanh_nghiep'].setValue(selectedRecord.ten_doanh_nghiep);
      this.formData.controls['dia_chi_doanh_nghiep'].setValue(selectedRecord.dia_chi_doanh_nghiep);
      this.formData.controls['mst'].setValue(selectedRecord.mst);
      this.formData.controls['so_giay_dkbhdc'].setValue(selectedRecord.so_giay_dkbhdc);
      this.formData.controls['co_quan_ban_hanh_giay_dkbhdc'].setValue(selectedRecord.co_quan_ban_hanh_giay_dkbhdc);
      this.formData.controls['ngay_dang_ky_giay_dkbhdc'].setValue(selectedRecord.ngay_dang_ky_giay_dkbhdc._d);
      this.formData.controls['so_giay_tchtbhdc'].setValue(selectedRecord.so_giay_tchtbhdc);
      this.formData.controls['co_quan_ban_hanh_giay_tchtbhdc'].setValue(selectedRecord.co_quan_ban_hanh_giay_tchtbhdc);
      this.formData.controls['ngay_dang_ky_giay_tchtbhdc'].setValue(selectedRecord.ngay_dang_ky_giay_tchtbhdc._d);
      this.formData.controls['thoi_gian_bat_dau'].setValue(selectedRecord.thoi_gian_bat_dau._d);
      this.formData.controls['thoi_gian_ket_thuc'].setValue(selectedRecord.thoi_gian_ket_thuc._d);
      this.formData.controls['dia_diem_to_chuc'].setValue(selectedRecord.dia_diem_to_chuc);
    }
  }

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.getMultiLevelTradeList();

    if (this._login.userValue.user_role_id == 3 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getLinkDefault() {
    //Constant
    this.LINK_DEFAULT = "/specialized/commecial-management/multilevel-trade";
    this.TITLE_DEFAULT = "Hoạt động bán hàng đa cấp";
    this.TEXT_DEFAULT = "Hoạt động bán hàng đa cấp";
  }

  public getMultiLevelTradeList() {
    this.commerceManagementService.getMultiLevelTradeData().subscribe(
      allrecords => {
        this.filteredDataSource.data = [];
        if (allrecords.data && allrecords.data.length > 0) {
          allrecords.data.forEach(element => {
            element.ngay_dang_ky_giay_tchtbhdc = this.formatDate(element.ngay_dang_ky_giay_tchtbhdc);
            element.thoi_gian_bat_dau = this.formatDate(element.thoi_gian_bat_dau);
            element.thoi_gian_ket_thuc = this.formatDate(element.thoi_gian_ket_thuc);
            element.ngay_dang_ky_giay_dkbhdc = this.formatDate(element.ngay_dang_ky_giay_dkbhdc);
          });
          this.dataSource = new MatTableDataSource<MultiLevelTradeModel>(allrecords.data);
          this.filteredDataSource = new MatTableDataSource<MultiLevelTradeModel>(allrecords.data);
        }
        this._prepareData();
        this.paginatorAgain();
      },
      error => this.errorMessage = <any>error
    );
  }

  filterArray(dataSource, filters) {
    const filterKeys = Object.keys(filters);
    let filteredData = [...dataSource];
    filterKeys.forEach(key => {
      let filterCrits = [];
      if (filters[key].length) {
        if (key == 'thoi_gian_bat_dau') {
          filters[key].forEach(criteria => {
            if (criteria) filterCrits = filterCrits.concat(filteredData.filter(x => x[key].toString().includes(criteria)));
          });
        } else {
          filters[key].forEach(criteria => {
            filterCrits = filterCrits.concat(filteredData.filter(x => x[key] == criteria));
          });
        }
        filteredData = [...filterCrits];
      }
    })
    return filteredData;
  }

  prepareData(data) {
    data['thoi_gian_bat_dau'] = _moment(data['thoi_gian_bat_dau']).format('yyyyMMDD');
    data['thoi_gian_ket_thuc'] = _moment(data['thoi_gian_ket_thuc']).format('yyyyMMDD');
    data['ngay_dang_ky_giay_dkbhdc'] = _moment(data['ngay_dang_ky_giay_dkbhdc']).format('yyyyMMDD');
    data['ngay_dang_ky_giay_tchtbhdc'] = _moment(data['ngay_dang_ky_giay_tchtbhdc']).format('yyyyMMDD');

    return data;
  }

  callService(data) {
    this.commerceManagementService.postMultiLevelTradeData([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData() {
    let datas = this.selection.selected.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.commerceManagementService.deleteMultiLevel(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

}
