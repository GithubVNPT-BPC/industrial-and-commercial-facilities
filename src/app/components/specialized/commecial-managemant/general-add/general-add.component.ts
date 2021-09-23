import { Component, Injector } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

// Services
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';

import {
  SubDistrictModel,
} from "src/app/_models/APIModel/domestic-market.model";

import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

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
  selector: 'app-general-add',
  templateUrl: './general-add.component.html',
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
export class GeneralAddComponent extends BaseComponent {

  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
  ) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.GetAllPhuongXa();
    this.getPromotionTypes();

    this.phuongxafilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPhuongxa();
      });
  }

  public _onDestroy = new Subject<void>();

  getLinkDefault() {
    //Constant
    this.LINK_DEFAULT = "/specialized/commecial-management/generaladd";
    this.TITLE_DEFAULT = "THÊM DỮ LIỆU XÚC TIẾN THƯƠNG MẠI VÀ HOẠT ĐỘNG BÁN HÀNG ĐA CẤP";
    this.TEXT_DEFAULT = "THÊM DỮ LIỆU XÚC TIẾN THƯƠNG MẠI VÀ HOẠT ĐỘNG BÁN HÀNG ĐA CẤP";
  }

  getFormParams() {
    return {
      id: new FormControl(),
      ten_doanh_nghiep: new FormControl(),
      dia_chi_doanh_nghiep: new FormControl(),
      mst: new FormControl(),

      dia_diem_to_chuc: new FormControl(),
      thoi_gian_bat_dau: new FormControl(),
      thoi_gian_ket_thuc: new FormControl(),
      so_giay_dkbhdc: new FormControl(),
      co_quan_ban_hanh_giay_dkbhdc: new FormControl(),
      ngay_dang_ky_giay_dkbhdc: new FormControl(),
      so_giay_tchtbhdc: new FormControl(),
      co_quan_ban_hanh_giay_tchtbhdc: new FormControl(),
      ngay_dang_ky_giay_tchtbhdc: new FormControl(),

      ten_hoi_cho: new FormControl(),
      dia_diem_to_chuc1: new FormControl(),
      thoi_gian_bat_dau1: new FormControl(),
      thoi_gian_ket_thuc1: new FormControl(),
      san_pham: new FormControl(),
      so_luong_gian_hang: new FormControl(),
      so_van_ban_hc: new FormControl(),
      co_quan_ban_hanh_hc: new FormControl(),
      ngay_thang_nam_van_ban_hc: new FormControl(),
      id_phuong_xa: new FormControl(25195),
      id_trang_thai: new FormControl('1'),
      time_id: new FormControl(parseInt(this.getCurrentYear())),

      ten_chuong_trinh_km: new FormControl(),
      thoi_gian_bat_dau2: new FormControl(),
      thoi_gian_ket_thuc2: new FormControl(),
      hang_hoa_km: new FormControl(),
      so_van_ban_km: new FormControl(),
      co_quan_ban_hanh_km: new FormControl(),
      ngay_thang_nam_van_ban_km: new FormControl(),
      id_hinh_thuc: new FormControl(1),
      danh_sach_dia_diem: this.formBuilder.array([]),
    }
  }

  get danh_sach_dia_diem(): FormArray {
    return this.formData.get('danh_sach_dia_diem') as FormArray
  }

  newAddress(): FormGroup {
    return this.formBuilder.group(
      {
        dia_diem: new FormControl(),
        id_quan_huyen: new FormControl(688),
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

  getCurrentYear() {
    let date = new Date;
    return formatDate(date, 'yyyy', 'en-US');
  }

  public subdistrict: Array<SubDistrictModel> = new Array<SubDistrictModel>();
  public filtersubdistrict: ReplaySubject<SubDistrictModel[]> = new ReplaySubject<SubDistrictModel[]>(1);
  GetAllPhuongXa() {
    this.commerceManagementService.GetAllSubDistrict().subscribe((allrecords) => {
      this.subdistrict = allrecords.data as SubDistrictModel[];
      this.filtersubdistrict.next(this.subdistrict.slice());
    });
  }
  public phuongxafilter: FormControl = new FormControl();
  public filterPhuongxa() {
    if (!this.subdistrict) {
      return;
    }
    let search = this.phuongxafilter.value;
    if (!search) {
      this.filtersubdistrict.next(this.subdistrict.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filtersubdistrict.next(
      this.subdistrict.filter(x => x.ten_phuong_xa.toLowerCase().indexOf(search) > -1)
    );
  }

  public promotionTypes: string[] = [];
  getPromotionTypes(): void {
    this.commerceManagementService.getSubcribeDiscountTypeData().subscribe(
      result => {
        if (result.data && result.data.length > 0) {
          this.promotionTypes = result.data
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  prepareData(data) {
    data['thoi_gian_bat_dau'] = data['thoi_gian_bat_dau'] ? _moment(data['thoi_gian_bat_dau']).format('yyyyMMDD') : '';
    data['thoi_gian_ket_thuc'] = data['thoi_gian_ket_thuc'] ? _moment(data['thoi_gian_ket_thuc']).format('yyyyMMDD') : '';
    data['ngay_dang_ky_giay_dkbhdc'] = data['ngay_dang_ky_giay_dkbhdc'] ? _moment(data['ngay_dang_ky_giay_dkbhdc']).format('yyyyMMDD') : '';
    data['ngay_dang_ky_giay_tchtbhdc'] = data['ngay_dang_ky_giay_tchtbhdc'] ? _moment(data['ngay_dang_ky_giay_tchtbhdc']).format('yyyyMMDD') : '';

    data['thoi_gian_bat_dau1'] = data['thoi_gian_bat_dau1'] ? _moment(data['thoi_gian_bat_dau1']).format('yyyyMMDD') : '';
    data['thoi_gian_ket_thuc1'] = data['thoi_gian_ket_thuc1'] ? _moment(data['thoi_gian_ket_thuc1']).format('yyyyMMDD') : '';
    data['ngay_thang_nam_van_ban_hc'] = data['ngay_thang_nam_van_ban_hc'] ? _moment(data['ngay_thang_nam_van_ban_hc']).format('yyyyMMDD') : '';

    data['thoi_gian_bat_dau2'] = data['thoi_gian_bat_dau2'] ? _moment(data['thoi_gian_bat_dau2']).format('yyyyMMDD') : '';
    data['thoi_gian_ket_thuc2'] = data['thoi_gian_ket_thuc2'] ? _moment(data['thoi_gian_ket_thuc2']).format('yyyyMMDD') : '';
    data['ngay_thang_nam_van_ban_km'] = data['ngay_thang_nam_van_ban_km'] ? _moment(data['ngay_thang_nam_van_ban_km']).format('yyyyMMDD') : '';

    return data;
  }

  dacapobject = {
    id: null,
    ten_doanh_nghiep: null,
    dia_chi_doanh_nghiep: null,
    mst: null,

    dia_diem_to_chuc: null,
    thoi_gian_bat_dau: null,
    thoi_gian_ket_thuc: null,
    so_giay_dkbhdc: null,
    co_quan_ban_hanh_giay_dkbhdc: null,
    ngay_dang_ky_giay_dkbhdc: null,
    so_giay_tchtbhdc: null,
    co_quan_ban_hanh_giay_tchtbhdc: null,
    ngay_dang_ky_giay_tchtbhdc: null
  }

  hoichoobject = {
    id: null,
    ten_doanh_nghiep: null,
    dia_chi_doanh_nghiep: null,
    mst: null,

    ten_hoi_cho: null,
    dia_diem_to_chuc1: null,
    thoi_gian_bat_dau1: null,
    thoi_gian_ket_thuc1: null,
    san_pham: null,
    so_luong_gian_hang: null,
    so_van_ban_hc: null,
    co_quan_ban_hanh_hc: null,
    ngay_thang_nam_van_ban_hc: null,
    id_phuong_xa: null,
    id_trang_thai: null,
    time_id: null,
  }

  khuyenmaiobject = {
    id: null,
    ten_doanh_nghiep: null,
    dia_chi_doanh_nghiep: null,
    mst: null,

    ten_chuong_trinh_km: null,
    thoi_gian_bat_dau2: null,
    thoi_gian_ket_thuc2: null,
    hang_hoa_km: null,
    so_van_ban_km: null,
    co_quan_ban_hanh_km: null,
    ngay_thang_nam_van_ban_km: null,
    id_hinh_thuc: null,
    danh_sach_dia_diem: []
  }

  callService(data) {
    this.dacapobject.ten_doanh_nghiep = data.ten_doanh_nghiep
    this.dacapobject.dia_chi_doanh_nghiep = data.dia_chi_doanh_nghiep
    this.dacapobject.mst = data.mst
    this.dacapobject.dia_diem_to_chuc = data.dia_diem_to_chuc
    this.dacapobject.thoi_gian_bat_dau = data.thoi_gian_bat_dau
    this.dacapobject.thoi_gian_ket_thuc = data.thoi_gian_ket_thuc
    this.dacapobject.so_giay_dkbhdc = data.so_giay_dkbhdc
    this.dacapobject.co_quan_ban_hanh_giay_dkbhdc = data.co_quan_ban_hanh_giay_dkbhdc
    this.dacapobject.ngay_dang_ky_giay_dkbhdc = data.ngay_dang_ky_giay_dkbhdc
    this.dacapobject.so_giay_tchtbhdc = data.so_giay_tchtbhdc
    this.dacapobject.co_quan_ban_hanh_giay_tchtbhdc = data.co_quan_ban_hanh_giay_tchtbhdc
    this.dacapobject.ngay_dang_ky_giay_tchtbhdc = data.ngay_dang_ky_giay_tchtbhdc

    this.hoichoobject.ten_doanh_nghiep = data.ten_doanh_nghiep
    this.hoichoobject.dia_chi_doanh_nghiep = data.dia_chi_doanh_nghiep
    this.hoichoobject.mst = data.mst
    this.hoichoobject.ten_hoi_cho = data.ten_hoi_cho
    this.hoichoobject.dia_diem_to_chuc1 = data.dia_diem_to_chuc1
    this.hoichoobject.thoi_gian_bat_dau1 = data.thoi_gian_bat_dau1
    this.hoichoobject.thoi_gian_ket_thuc1 = data.thoi_gian_ket_thuc1
    this.hoichoobject.san_pham = data.san_pham
    this.hoichoobject.so_luong_gian_hang = data.so_luong_gian_hang
    this.hoichoobject.so_van_ban_hc = data.so_van_ban_hc
    this.hoichoobject.co_quan_ban_hanh_hc = data.co_quan_ban_hanh_hc
    this.hoichoobject.ngay_thang_nam_van_ban_hc = data.ngay_thang_nam_van_ban_hc
    this.hoichoobject.id_phuong_xa = data.id_phuong_xa
    this.hoichoobject.id_trang_thai = data.id_trang_thai
    this.hoichoobject.time_id = data.time_id

    this.khuyenmaiobject.ten_doanh_nghiep = data.ten_doanh_nghiep
    this.khuyenmaiobject.dia_chi_doanh_nghiep = data.dia_chi_doanh_nghiep
    this.khuyenmaiobject.mst = data.mst
    this.khuyenmaiobject.ten_chuong_trinh_km = data.ten_chuong_trinh_km
    this.khuyenmaiobject.thoi_gian_bat_dau2 = data.thoi_gian_bat_dau2
    this.khuyenmaiobject.thoi_gian_ket_thuc2 = data.thoi_gian_ket_thuc2
    this.khuyenmaiobject.hang_hoa_km = data.hang_hoa_km
    this.khuyenmaiobject.so_van_ban_km = data.so_van_ban_km
    this.khuyenmaiobject.co_quan_ban_hanh_km = data.co_quan_ban_hanh_km
    this.khuyenmaiobject.ngay_thang_nam_van_ban_km = data.ngay_thang_nam_van_ban_km
    this.khuyenmaiobject.id_hinh_thuc = data.id_hinh_thuc
    this.khuyenmaiobject.danh_sach_dia_diem = data.danh_sach_dia_diem

    this.commerceManagementService.postMultiLevelTradeData([this.dacapobject]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    this.commerceManagementService.postExpoData([this.hoichoobject]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    this.commerceManagementService.postSubcribeDiscountData([this.khuyenmaiobject]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }
}
