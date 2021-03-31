import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MultiLevelTradeModel } from 'src/app/_models/APIModel/mutillevel-trade.model';
import { FormControl } from '@angular/forms';

// Services
import { MarketService } from 'src/app/_services/APIService/market.service';
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';

import moment from 'moment';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
  selector: 'app-multilevel-trade',
  templateUrl: './multilevel-trade.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class MultilevelTradeComponent extends BaseComponent {

  displayedColumns: string[] = ['select', 'index', 'mst', 'ten_doanh_nghiep', 'dia_chi_doanh_nghiep',  'thoi_gian_bat_dau', 'thoi_gian_ket_thuc', 'dia_diem_to_chuc',
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

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.getMultiLevelTradeList();

    if (this._login.userValue.user_role_id == 3  || this._login.userValue.user_role_id == 1) {
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

  _prepareData() {}

  applyFilter(event) {
    if (event.target) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    } else {
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

    }
    this._prepareData();
    this.paginatorAgain();
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
    data['thoi_gian_bat_dau'] = moment(data['thoi_gian_bat_dau']).format('yyyyMMDD');
    data['thoi_gian_ket_thuc'] = moment(data['thoi_gian_ket_thuc']).format('yyyyMMDD');
    data['ngay_dang_ky_giay_dkbhdc'] = moment(data['ngay_dang_ky_giay_dkbhdc']).format('yyyyMMDD');
    data['ngay_dang_ky_giay_tchtbhdc'] = moment(data['ngay_dang_ky_giay_tchtbhdc']).format('yyyyMMDD');
    
    data = {
      ...data, ...{
        id_trang_thai: 1,
      }
    };
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
