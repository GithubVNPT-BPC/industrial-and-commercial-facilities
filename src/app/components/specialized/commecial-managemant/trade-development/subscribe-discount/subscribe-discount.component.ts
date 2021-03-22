import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { District } from 'src/app/_models/district.model';
import { dia_diem_km, SDModel } from 'src/app/_models/APIModel/trade-development.model';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';

import moment from 'moment';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
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
    ten_doanh_nghiep: "Tên doanh nghiệp",
    dia_chi_doanh_nghiep: "Địa chỉ",
    mst: "Mã số thuế",
    ten_chuong_trinh_km: "Tên chương trình KM",
    thoi_gian_bat_dau: "Thời gian bắt đầu",
    thoi_gian_ket_thuc: "Thời gian kết thúc",
    hang_hoa_km: "Hàng hóa KM",
    dia_diem_km: "Địa điểm KM",
    ten_hinh_thuc: "Hình thức KM",
    so_van_ban: "Số văn bản",
    co_quan_ban_hanh: "Cơ quan ban hành",
    ngay_thang_nam_van_ban: "Ngày tháng năm",
  }

  filterComponents = {
    id_phuong_xa: [],
    ten_hinh_thuc: [],
  }
  sumvalues: number = 0;
  // districts: District[] = [{ id: 1, ten_quan_huyen: 'Thị xã Phước Long' },
  // { id: 2, ten_quan_huyen: 'Thành phố Đồng Xoài' },
  // { id: 3, ten_quan_huyen: 'Thị xã Bình Long' },
  // { id: 4, ten_quan_huyen: 'Huyện Bù Gia Mập' },
  // { id: 5, ten_quan_huyen: 'Huyện Lộc Ninh' },
  // { id: 6, ten_quan_huyen: 'Huyện Bù Đốp' },
  // { id: 7, ten_quan_huyen: 'Huyện Hớn Quản' },
  // { id: 8, ten_quan_huyen: 'Huyện Đồng Phú' },
  // { id: 9, ten_quan_huyen: 'Huyện Bù Đăng' },
  // { id: 10, ten_quan_huyen: 'Huyện Chơn Thành' },
  // { id: 11, ten_quan_huyen: 'Huyện Phú Riềng' }];

  public promotionTypes: string[] = [];
  form: FormGroup;
  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
    public _login: LoginService
  ) {
    super(injector);
    this._breadCrumService.sendLink(this._linkOutput);
    this.initDisplayColumns();
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

  initDisplayColumns() {
    this.displayedColumns = this.displayedColumns.concat(Object.keys(this.displayedFields));
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

  addAddress() {
    this.danh_sach_dia_diem.push(this.newAddress())
  }

  removeAddress(i: number) {
    this.danh_sach_dia_diem.removeAt(i);
  }

  applyFilter(event) {
    let filterValues = event.target ? event.target.value : event.value;
    if (filterValues instanceof Array) {
      let filteredData = this.filterArray(this.dataSource.data, this.filterComponents);
      if (!filteredData.length) {
        this.filteredDataSource.data = this.filterComponents ? [] : this.dataSource.data;
      }
      else {
        this.filteredDataSource.data = filteredData;
      }
    }
    else {
      this.filteredDataSource.filter = filterValues.trim().toLowerCase();
    }
  }

  filterArray(array, filters) {
    const filterKeys = Object.keys(filters);
    let temp = [...array];
    filterKeys.forEach(key => {
      let temp2 = [];
      switch (key) {
        case 'Id_quan_huyen':
          if (filters[key].length) {
            filters[key].forEach(criteria => {
              temp2 = temp2.concat(temp.filter(x => x[key] == criteria || x[key] == 99));
            });
            temp = [...temp2];
          }
          break;
        default:
          if (filters[key].length) {
            filters[key].forEach(criteria => {
              temp2 = temp2.concat(temp.filter(x => x[key] == criteria));
            });
            temp = [...temp2];
          }
          break;
      }
    })
    return temp;
  }

  getPromotionTypes(): void {
    this.commerceManagementService.getSubcribeDiscountTypeData().subscribe(
      result => {
        if (result.data && result.data.length > 0) {
          this.promotionTypes = result.data
          // result.data.map((element, index) => { 
          //   this.promotionTypes.push(element.ten_hinh_thuc);
          // })
          this.autopaging();
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  getSDList(): void {
    this.commerceManagementService.getSubcribeDiscountData().subscribe(
      result => {
        if (result.data && result.data.length > 0) {
          this.dataSource = new MatTableDataSource<SDModel>(this.handleData(result.data));
          this.filteredDataSource = new MatTableDataSource<SDModel>(this.handleData(result.data));
          // this.filteredDataSource.paginator = this.paginator;
          console.log(this.dataSource.data)
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  handleData(data: SDModel) {
    let ds_km: SDModel[] = data[0];
    let ds_dd_km: dia_diem_km[] = data[1];
    let dd_km_temp: dia_diem_km[] = [];
    ds_km.filter(k => {
      k.dia_diem_km = [];
      dd_km_temp = [];
      ds_dd_km.filter(d => {
        if (k.id == d.id_xttm_km) {
          dd_km_temp.push(d);
        }
      });
      k.dia_diem_km = [...k.dia_diem_km, ...dd_km_temp];
    });
    // console.log(ds_km);
    return ds_km;
  }

  countBusiness(): number {
    return this.dataSource.data.map(x => x.ngay_thang_nam_van_ban.slice(0, 4) == this.currentYear.toString()).length;
  }

  // onCreate(){
  //   // this.addAddress();
  //   // console.log(this.formData)

  // }

  prepareData(data) {
    data['thoi_gian_bat_dau'] = moment(data['thoi_gian_bat_dau']).format('yyyyMMDD');
    data['thoi_gian_ket_thuc'] = moment(data['thoi_gian_ket_thuc']).format('yyyyMMDD');
    data['ngay_thang_nam_van_ban'] = moment(data['ngay_thang_nam_van_ban']).format('yyyyMMDD');
    return data;
    // data = {...data, ...{
    //   id_trang_thai: 1,
    // }};

    return data;
  }

  callService(data) {

    // console.log(data)
    this.commerceManagementService.postSubcribeDiscountData([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  removeSkill(i: number) {
    this.danh_sach_dia_diem.removeAt(i);
  }

  prepareRemoveData() {
    let datas = this.selection.selected.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.commerceManagementService.deletePromo(data).subscribe(res => {
      this.successNotify(res);
    });
  }
}
