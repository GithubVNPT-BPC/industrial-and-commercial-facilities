import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { dia_diem_km, SDModel } from 'src/app/_models/APIModel/trade-development.model';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';

import moment from 'moment';

import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
  selector: 'app-subscribe-discount',
  templateUrl: './subscribe-discount.component.html',
  styleUrls: ['../../../special_layout.scss'],
})
export class SubscribeDiscountComponent extends BaseComponent {
  dataSource: MatTableDataSource<SDModel> = new MatTableDataSource<SDModel>();
  filteredDataSource: MatTableDataSource<SDModel> = new MatTableDataSource<SDModel>();
  displayedColumns: string[] = ['select', 'index'];

  displayedFields = {
    mst: "Mã số thuế",
    ten_doanh_nghiep: "Tên doanh nghiệp",
    dia_chi_doanh_nghiep: "Địa chỉ",
    ten_chuong_trinh_km: "Tên chương trình KM",
    thoi_gian_bat_dau: "Thời gian bắt đầu",
    thoi_gian_ket_thuc: "Thời gian kết thúc",
    hang_hoa_km: "Hàng hóa KM",
    dia_diem_km: "Địa điểm KM",
    ten_hinh_thuc: "Hình thức KM",
    so_van_ban: "Số văn bản",
    co_quan_ban_hanh: "Cơ quan ban hành",
    ngay_thang_nam_van_ban: "Ngày/tháng/năm",
  }

  filterModel = {
    id_quan_huyen: [],
    ten_hinh_thuc: [],
  }
  sumvalues: number = 0;
  totalEnterprises = 0;

  public promotionTypes: string[] = [];
  form: FormGroup;
  
  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
    public _login: LoginService
  ) {
    super(injector);
    this._breadCrumService.sendLink(this._linkOutput);
  }

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.getPromotionTypes();
    this.getSDList();

    if (this._login.userValue.user_role_id == 3  || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/commecial-management/trade-development/SD";
    this.TITLE_DEFAULT = "Khuyến mãi";
    this.TEXT_DEFAULT = "Khuyến mãi";
  }

  getFormParams() {
    return {
      ten_doanh_nghiep: new FormControl(''),
      dia_chi_doanh_nghiep: new FormControl(''),
      mst: new FormControl(),
      ten_chuong_trinh_km: new FormControl(),
      thoi_gian_bat_dau: new FormControl(),
      thoi_gian_ket_thuc: new FormControl(),
      hang_hoa_km: new FormControl(),
      so_van_ban: new FormControl(),
      co_quan_ban_hanh: new FormControl(),
      ngay_thang_nam_van_ban: new FormControl(),
      id_hinh_thuc: new FormControl(),

      // array address discount
      danh_sach_dia_diem: this.formBuilder.array([]),
      id_temp: new FormControl(1)
    }
  }

  get danh_sach_dia_diem(): FormArray {
    return this.formData.get('danh_sach_dia_diem') as FormArray
  }

  newAddress(): FormGroup {
    return this.formBuilder.group(
      {
        dia_diem: new FormControl(),
        id_quan_huyen: new FormControl(),
        id_xttm_km: new FormControl(1)
      }
    )
  }

  addAddress(event) {
    event.preventDefault();
    this.danh_sach_dia_diem.push(this.newAddress())
  }

  removeAddress(i: number) {
    this.danh_sach_dia_diem.removeAt(i);
  }

  getPromotionTypes(): void {
    this.commerceManagementService.getSubcribeDiscountTypeData().subscribe(
      result => {
        if (result.data && result.data.length > 0) {
          this.promotionTypes = result.data
          console.log(this.promotionTypes);
          
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  getSDList(): void {
    this.commerceManagementService.getSubcribeDiscountData().subscribe(
      result => {
        this.filteredDataSource.data = [];
        if (result.data && result.data.length > 0) {
          let data = this.handleData(result.data);
          this.dataSource = new MatTableDataSource<SDModel>(data);
          this.filteredDataSource = new MatTableDataSource<SDModel>(data);
          console.log(data);
          
        }
        this._prepareData();
        this.paginatorAgain();
      },
      error => this.errorMessage = <any>error
    );
  }

  private handleData(data) {
    let ds_km: SDModel[] = data[0];
    let ds_dd_km: dia_diem_km[] = data[1];
    let dd_km_temp: dia_diem_km[] = [];
    ds_km.filter(k => {
      k.dia_diem_km = [];
      dd_km_temp = [];
      ds_dd_km.filter(d => {
        if (k.id == d.id) {
          dd_km_temp.push(d);
        }
      });
      k.dia_diem_km = [...k.dia_diem_km, ...dd_km_temp];
    });
    return ds_km;
  }

  _prepareData() {
    let data = this.filteredDataSource.data;
    this.totalEnterprises = new Set(data.map(x => x.mst)).size;
  }

  prepareData(data) {
    data['thoi_gian_bat_dau'] = moment(data['thoi_gian_bat_dau']).format('yyyyMMDD');
    data['thoi_gian_ket_thuc'] = moment(data['thoi_gian_ket_thuc']).format('yyyyMMDD');
    data['ngay_thang_nam_van_ban'] = moment(data['ngay_thang_nam_van_ban']).format('yyyyMMDD');
    return data;
  }

  callService(data) {
    this.commerceManagementService.postSubcribeDiscountData([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData() {
    let datas = this.selection.selected.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.commerceManagementService.deletePromo(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

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
          if (key == 'id_quan_huyen') {
            filters[key].forEach(criteria => {
              filterCrits = filterCrits.concat(filteredData.filter(x => x.dia_diem_km.map(y => y.id_quan_huyen).includes(criteria)));
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
}
