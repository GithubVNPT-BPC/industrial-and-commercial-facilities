import { Component, Injector } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

export class dacap {
  id: number
  ten_doanh_nghiep: string
  dia_chi_doanh_nghiep: string
  mst: string

  dia_diem_to_chuc: string
  thoi_gian_bat_dau: string
  thoi_gian_ket_thuc: string
  so_giay_dkbhdc: string
  co_quan_ban_hanh_giay_dkbhdc: string
  ngay_dang_ky_giay_dkbhdc: string
  so_giay_tchtbhdc: string
  co_quan_ban_hanh_giay_tchtbhdc: string
  ngay_dang_ky_giay_tchtbhdc: string
}

export class hoicho {
  id: number
  ten_doanh_nghiep: string
  dia_chi_doanh_nghiep: string
  mst: string

  ten_hoi_cho: string
  dia_diem_to_chuc: string
  thoi_gian_bat_dau: string
  thoi_gian_ket_thuc: string
  san_pham: string
  so_luong_gian_hang: string
  so_van_ban: string
  co_quan_ban_hanh: string
  ngay_thang_nam_van_ban: string
  id_phuong_xa: string
  id_trang_thai: string
  time_id: string
}

export class khuyenmai {
  id: number
  ten_doanh_nghiep: string
  dia_chi_doanh_nghiep: string
  mst: string

  ten_chuong_trinh_km: string
  thoi_gian_bat_dau: string
  thoi_gian_ket_thuc: string
  hang_hoa_km: string
  so_van_ban: string
  co_quan_ban_hanh: string
  ngay_thang_nam_van_ban: string
  id_hinh_thuc: string
  id_temp: number
  danh_sach_dia_diem: []
}

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

  form: FormGroup;

  constructor(
    private injector: Injector,
    private fb: FormBuilder,
    public commerceManagementService: CommerceManagementService,
  ) {
    super(injector);
    this.form = fb.group({
      id: new FormControl(),
      ten_doanh_nghiep: new FormControl('', Validators.required),
      dia_chi_doanh_nghiep: new FormControl(),
      mst: new FormControl('', Validators.required),

      danh_sach_da_cap: this.fb.array([]),
      danh_sach_hoi_cho: this.fb.array([]),
      danh_sach_khuyen_mai: this.fb.array([]),
    })
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

  //** */

  addMulti() {
    let temp = this.fb.group({
      dia_diem_to_chuc: new FormControl('', Validators.required),
      thoi_gian_bat_dau: new FormControl(),
      thoi_gian_ket_thuc: new FormControl(),
      so_giay_dkbhdc: new FormControl(),
      co_quan_ban_hanh_giay_dkbhdc: new FormControl(),
      ngay_dang_ky_giay_dkbhdc: new FormControl(),
      so_giay_tchtbhdc: new FormControl(),
      co_quan_ban_hanh_giay_tchtbhdc: new FormControl(),
      ngay_dang_ky_giay_tchtbhdc: new FormControl(),
    });
    (<FormArray>this.form.get('danh_sach_da_cap')).push(temp);
  }

  removeMulti(index: number) {
    (<FormArray>this.form.get('danh_sach_da_cap')).removeAt(index);
  }

  //** */

  addTFE() {
    let temp = this.fb.group({
      ten_hoi_cho: new FormControl('', Validators.required),
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
    });
    (<FormArray>this.form.get('danh_sach_hoi_cho')).push(temp);
  }

  removeTFE(index: number) {
    (<FormArray>this.form.get('danh_sach_hoi_cho')).removeAt(index);
  }

  //** */

  addSD() {
    let temp = this.fb.group({
      ten_chuong_trinh_km: new FormControl('', Validators.required),
      thoi_gian_bat_dau2: new FormControl(),
      thoi_gian_ket_thuc2: new FormControl(),
      hang_hoa_km: new FormControl(),
      so_van_ban_km: new FormControl(),
      co_quan_ban_hanh_km: new FormControl(),
      ngay_thang_nam_van_ban_km: new FormControl(),
      id_hinh_thuc: new FormControl(1),
      id_temp: new FormControl(1),
      danh_sach_dia_diem: this.fb.array([]),
    });
    (<FormArray>this.form.get('danh_sach_khuyen_mai')).push(temp);
    // let index = (<FormArray>this.form.get('danh_sach_khuyen_mai')).length - 1;
    // this.addAddress(index)
  }

  removeSD(index: number) {
    (<FormArray>this.form.get('danh_sach_khuyen_mai')).removeAt(index);
  }

  //** */

  addAddress(addressindex: number) {
    let temp = this.fb.group(
      {
        dia_diem: new FormControl('', Validators.required),
        id_quan_huyen: new FormControl(688),
        id_xttm_km: new FormControl(1)
      }
    );
    (<FormArray>(<FormGroup>(<FormArray>this.form.controls['danh_sach_khuyen_mai'])
      .controls[addressindex]).controls['danh_sach_dia_diem']).push(temp);
  }

  removeAddress(index1: number, index2: number) {
    (<FormArray>(<FormGroup>(<FormArray>this.form.controls['danh_sach_khuyen_mai']).controls[index1]).controls['danh_sach_dia_diem']).removeAt(index2);
  }

  //** */

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

  dacapinput: Array<dacap> = new Array<dacap>();
  hoichoinput: Array<hoicho> = new Array<hoicho>();
  khuyenmaiinput: Array<khuyenmai> = new Array<khuyenmai>();

  onSubmit(data) {
    if (this.form.invalid) {
      this.logger.msgError("Cần nhập đầy đủ các thông tin cần thiết trên biểu mẫu");
    } else {
      data.danh_sach_da_cap.forEach(element => {
        this.dacapinput.push({
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
        })
      });

      for (let index = 0; index < this.dacapinput.length; index++) {
        this.dacapinput[index].id = null
        this.dacapinput[index].ten_doanh_nghiep = data.ten_doanh_nghiep
        this.dacapinput[index].dia_chi_doanh_nghiep = data.dia_chi_doanh_nghiep
        this.dacapinput[index].mst = data.mst

        this.dacapinput[index].dia_diem_to_chuc = data.danh_sach_da_cap[index].dia_diem_to_chuc
        this.dacapinput[index].thoi_gian_bat_dau = data.danh_sach_da_cap[index].thoi_gian_bat_dau ? _moment(data.danh_sach_da_cap[index].thoi_gian_bat_dau).format('yyyyMMDD') : null
        this.dacapinput[index].thoi_gian_ket_thuc = data.danh_sach_da_cap[index].thoi_gian_ket_thuc ? _moment(data.danh_sach_da_cap[index].thoi_gian_ket_thuc).format('yyyyMMDD') : null
        this.dacapinput[index].so_giay_dkbhdc = data.danh_sach_da_cap[index].so_giay_dkbhdc
        this.dacapinput[index].co_quan_ban_hanh_giay_dkbhdc = data.danh_sach_da_cap[index].co_quan_ban_hanh_giay_dkbhdc
        this.dacapinput[index].ngay_dang_ky_giay_dkbhdc = data.danh_sach_da_cap[index].ngay_dang_ky_giay_dkbhdc ? _moment(data.danh_sach_da_cap[index].ngay_dang_ky_giay_dkbhdc).format('yyyyMMDD') : null
        this.dacapinput[index].so_giay_tchtbhdc = data.danh_sach_da_cap[index].so_giay_tchtbhdc
        this.dacapinput[index].co_quan_ban_hanh_giay_tchtbhdc = data.danh_sach_da_cap[index].co_quan_ban_hanh_giay_tchtbhdc
        this.dacapinput[index].ngay_dang_ky_giay_tchtbhdc = data.danh_sach_da_cap[index].ngay_dang_ky_giay_tchtbhdc ? _moment(data.danh_sach_da_cap[index].ngay_dang_ky_giay_tchtbhdc).format('yyyyMMDD') : null
      }

      data.danh_sach_hoi_cho.forEach(element => {
        this.hoichoinput.push({
          id: null,
          ten_doanh_nghiep: null,
          dia_chi_doanh_nghiep: null,
          mst: null,

          ten_hoi_cho: null,
          dia_diem_to_chuc: null,
          thoi_gian_bat_dau: null,
          thoi_gian_ket_thuc: null,
          san_pham: null,
          so_luong_gian_hang: null,
          so_van_ban: null,
          co_quan_ban_hanh: null,
          ngay_thang_nam_van_ban: null,
          id_phuong_xa: null,
          id_trang_thai: null,
          time_id: null
        })
      });

      for (let index = 0; index < this.hoichoinput.length; index++) {
        this.hoichoinput[index].id = null
        this.hoichoinput[index].ten_doanh_nghiep = data.ten_doanh_nghiep
        this.hoichoinput[index].dia_chi_doanh_nghiep = data.dia_chi_doanh_nghiep
        this.hoichoinput[index].mst = data.mst

        this.hoichoinput[index].ten_hoi_cho = data.danh_sach_hoi_cho[index].ten_hoi_cho
        this.hoichoinput[index].dia_diem_to_chuc = data.danh_sach_hoi_cho[index].dia_diem_to_chuc1
        this.hoichoinput[index].thoi_gian_bat_dau = data.danh_sach_hoi_cho[index].thoi_gian_bat_dau1 ? _moment(data.danh_sach_hoi_cho[index].thoi_gian_bat_dau1).format('yyyyMMDD') : null
        this.hoichoinput[index].thoi_gian_ket_thuc = data.danh_sach_hoi_cho[index].thoi_gian_ket_thuc1 ? _moment(data.danh_sach_hoi_cho[index].thoi_gian_ket_thuc1).format('yyyyMMDD') : null
        this.hoichoinput[index].san_pham = data.danh_sach_hoi_cho[index].san_pham
        this.hoichoinput[index].so_luong_gian_hang = data.danh_sach_hoi_cho[index].so_luong_gian_hang
        this.hoichoinput[index].so_van_ban = data.danh_sach_hoi_cho[index].so_van_ban_hc
        this.hoichoinput[index].co_quan_ban_hanh = data.danh_sach_hoi_cho[index].co_quan_ban_hanh_hc
        this.hoichoinput[index].ngay_thang_nam_van_ban = data.danh_sach_hoi_cho[index].ngay_thang_nam_van_ban_hc ? _moment(data.danh_sach_hoi_cho[index].ngay_thang_nam_van_ban_hc).format('yyyyMMDD') : null
        this.hoichoinput[index].id_phuong_xa = data.danh_sach_hoi_cho[index].id_phuong_xa
        this.hoichoinput[index].id_trang_thai = data.danh_sach_hoi_cho[index].id_trang_thai
        this.hoichoinput[index].time_id = data.danh_sach_hoi_cho[index].time_id
      }

      data.danh_sach_khuyen_mai.forEach(element => {
        this.khuyenmaiinput.push({
          id: null,
          ten_doanh_nghiep: null,
          dia_chi_doanh_nghiep: null,
          mst: null,

          ten_chuong_trinh_km: null,
          thoi_gian_bat_dau: null,
          thoi_gian_ket_thuc: null,
          hang_hoa_km: null,
          so_van_ban: null,
          co_quan_ban_hanh: null,
          ngay_thang_nam_van_ban: null,
          id_hinh_thuc: null,
          id_temp: 1,
          danh_sach_dia_diem: []
        })
      });

      for (let index = 0; index < this.khuyenmaiinput.length; index++) {
        this.khuyenmaiinput[index].id = null
        this.khuyenmaiinput[index].ten_doanh_nghiep = data.ten_doanh_nghiep
        this.khuyenmaiinput[index].dia_chi_doanh_nghiep = data.dia_chi_doanh_nghiep
        this.khuyenmaiinput[index].mst = data.mst

        this.khuyenmaiinput[index].ten_chuong_trinh_km = data.danh_sach_khuyen_mai[index].ten_chuong_trinh_km
        this.khuyenmaiinput[index].thoi_gian_bat_dau = data.danh_sach_khuyen_mai[index].thoi_gian_bat_dau2 ? _moment(data.danh_sach_khuyen_mai[index].thoi_gian_bat_dau2).format('yyyyMMDD') : null
        this.khuyenmaiinput[index].thoi_gian_ket_thuc = data.danh_sach_khuyen_mai[index].thoi_gian_ket_thuc2 ? _moment(data.danh_sach_khuyen_mai[index].thoi_gian_ket_thuc2).format('yyyyMMDD') : null
        this.khuyenmaiinput[index].hang_hoa_km = data.danh_sach_khuyen_mai[index].hang_hoa_km
        this.khuyenmaiinput[index].so_van_ban = data.danh_sach_khuyen_mai[index].so_van_ban_km
        this.khuyenmaiinput[index].co_quan_ban_hanh = data.danh_sach_khuyen_mai[index].co_quan_ban_hanh_km
        this.khuyenmaiinput[index].ngay_thang_nam_van_ban = data.danh_sach_khuyen_mai[index].ngay_thang_nam_van_ban_km ? _moment(data.danh_sach_khuyen_mai[index].ngay_thang_nam_van_ban_km).format('yyyyMMDD') : null
        this.khuyenmaiinput[index].id_hinh_thuc = data.danh_sach_khuyen_mai[index].id_hinh_thuc
        this.khuyenmaiinput[index].danh_sach_dia_diem = data.danh_sach_khuyen_mai[index].danh_sach_dia_diem
      }

      if (this.dacapinput.length != 0) {
        this.commerceManagementService.postMultiLevelTradeData(this.dacapinput).subscribe(response =>
          this.successNotify(response), error => this.errorNotify(error));
      }
      if (this.hoichoinput.length != 0) {
        this.commerceManagementService.postExpoData(this.hoichoinput).subscribe(response =>
          this.successNotify(response), error => this.errorNotify(error));
      }
      if (this.khuyenmaiinput.length != 0) {
        for (let index = 0; index < this.khuyenmaiinput.length; index++) {
          this.commerceManagementService.postSubcribeDiscountData([this.khuyenmaiinput[index]]).subscribe(response =>
            this.successNotify(response), error => this.errorNotify(error));
        }
      }
      setTimeout(() => {
        window.location.reload();
      }, 1500)
    }
  }

  onCancle() {
    this.form.reset();
  }
}
