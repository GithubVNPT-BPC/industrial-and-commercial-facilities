import { Component, Injector, ViewChild } from '@angular/core';
import { MatTableDataSource, MatAccordion, MatPaginator, MatSort } from '@angular/material';
import { MultiLevelTradeModel } from 'src/app/_models/APIModel/mutillevel-trade.model';
import { FormControl } from '@angular/forms';

// Services
import { MarketService } from 'src/app/_services/APIService/market.service';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { BaseComponent } from 'src/app/components/specialized/specialized-base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';

import { LinkModel } from 'src/app/_models/link.model';
import moment from 'moment';

@Component({
  selector: 'app-multilevel-trade',
  templateUrl: './multilevel-trade.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class MultilevelTradeComponent extends BaseComponent {
  //Constant
  private readonly LINK_DEFAULT: string = "/specialized/commecial-management/multilevel-trade";
  private readonly TITLE_DEFAULT: string = "Hoạt động bán hàng đa cấp";
  private readonly TEXT_DEFAULT: string = "Hoạt động bán hàng đa cấp";
  //Variable for only ts
  private _linkOutput: LinkModel = new LinkModel();

  displayedColumns: string[] = ['select', 'index', 'ten_doanh_nghiep', 'dia_chi_doanh_nghiep', 'mst','thoi_gian_bat_dau', 'thoi_gian_ket_thuc', 'dia_diem_to_chuc',
    'so_giay_dkbhdc', 'co_quan_ban_hanh_giay_dkbhdc', 'ngay_dang_ky_giay_dkbhdc',
    'so_giay_tchtbhdc', 'co_quan_ban_hanh_giay_tchtbhdc', 'ngay_dang_ky_giay_tchtbhdc']
  
  dataSource: MatTableDataSource<MultiLevelTradeModel> = new MatTableDataSource<MultiLevelTradeModel>();
  filteredDataSource: MatTableDataSource<MultiLevelTradeModel> = new MatTableDataSource<MultiLevelTradeModel>();
  dataDialog: any[] = [];
  nhap_khau_chu_yeu = [1, 13, 34, 33, 22, 19, 31, 18, 28, 4, 27, 17, 30, 37, 25, 7, 23];
  isChecked: boolean;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  
  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
    public marketService: MarketService,
    private _breadCrumService: BreadCrumService,
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

  ngOnInit() {
    super.ngOnInit();
    this.getMultiLevelTradeList();
    // this.filteredDataSource.filterPredicate = function (data: multilevel, filter): boolean {
    //     return String(data.is_het_han).includes(filter);
    // };
    this.sendLinkToNext(true);
  }

  public sendLinkToNext(type: boolean) {
    this._linkOutput.link = this.LINK_DEFAULT;
    this._linkOutput.title = this.TITLE_DEFAULT;
    this._linkOutput.text = this.TEXT_DEFAULT;
    this._linkOutput.type = type;
    this._breadCrumService.sendLink(this._linkOutput);
  }

  public getMultiLevelTradeList() {
    this.commerceManagementService.getMultiLevelTradeData().subscribe(
      allrecords => {
        if (allrecords.data && allrecords.data.length > 0) {
          this.dataSource = new MatTableDataSource<MultiLevelTradeModel>(allrecords.data);
          this.filteredDataSource = new MatTableDataSource<MultiLevelTradeModel>(allrecords.data);
          this.filteredDataSource.paginator = this.paginator;
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  handelDataDialog(id_mat_hang) {
    let data = this.dataDialog.filter(item => item.id_mat_hang === id_mat_hang);
    return data;
  }

  prepareData(data) {
    data['thoi_gian_bat_dau'] = moment(data['thoi_gian_bat_dau']).format('DD/MM/yyyy');
    data['thoi_gian_ket_thuc'] = moment(data['thoi_gian_ket_thuc']).format('DD/MM/yyyy');
    data['ngay_dang_ky_giay_dkbhdc'] = moment(data['ngay_dang_ky_giay_dkbhdc']).format('DD/MM/yyyy');
    data['ngay_dang_ky_giay_tchtbhdc'] = moment(data['ngay_dang_ky_giay_tchtbhdc']).format('DD/MM/yyyy');

    data = {...data, ...{
      id_trang_thai: 1,
    }};
    return data;
  }

  callService(data) {
    this.commerceManagementService.postMultiLevelTradeData([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

}
