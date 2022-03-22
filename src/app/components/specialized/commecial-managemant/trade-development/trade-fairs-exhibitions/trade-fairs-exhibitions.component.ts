import { Component, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { formatDate } from '@angular/common';

import { TFEModel } from 'src/app/_models/APIModel/trade-development.model';
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';
import { LoginService } from 'src/app/_services/APIService/login.service';

import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {
  SubDistrictModel,
} from "src/app/_models/APIModel/domestic-market.model";

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
  selector: 'app-trade-fairs-exhibitions',
  templateUrl: './trade-fairs-exhibitions.component.html',
  styleUrls: ['../../../special_layout.scss'],
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

export class TradeFairsExhibitionsComponent extends BaseComponent {
  DB_TABLE = 'QLTM_XTTM_HCTL'
  displayedColumns: string[] = ['select', 'index'];
  dataSource: MatTableDataSource<TFEModel> = new MatTableDataSource<TFEModel>();
  filteredDataSource: MatTableDataSource<TFEModel> = new MatTableDataSource<TFEModel>();
  @ViewChild(MatDatepicker, { static: true }) filteredDatePicker;

  displayedFields = {
    mst: "Mã số thuế",
    ten_doanh_nghiep: "Tên doanh nghiệp",
    dia_chi_doanh_nghiep: "Địa chỉ doanh nghiệp",
    ten_hoi_cho: "Tên hội chợ",
    thoi_gian_bat_dau: "Thời gian bắt đầu",
    thoi_gian_ket_thuc: "Thời gian kết thúc",
    dia_diem_to_chuc: "Địa điểm tổ chức",
    so_luong_gian_hang: "Số lượng gian hàng",
    san_pham: "SP bán tại hội chợ",
    so_van_ban: "Số văn bản",
    co_quan_ban_hanh: "Cơ quan ban hành",
    ngay_thang_nam_van_ban: "Ngày tháng năm",
    thoi_gian_chinh_sua_cuoi: "Thời gian cập nhật",
    id_trang_thai: "Tình trạng",
  }

  // Modify to get districts from API
  sanLuongBanRa: number;
  soLuongDoanhNghiep: number;
  isChecked: boolean;
  filteredDate = new FormControl(new Date());

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
    // this.displayedColumns = this.displayedColumns.concat(Object.keys(this.displayedFields));
    // this.getTFEList(new Date().getFullYear());
    this.getTFEList(0)
    this.GetAllPhuongXa()

    if (this._login.userValue.user_role_id == 3 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }

    this.phuongxafilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPhuongxa();
      });
  }

  public _onDestroy = new Subject<void>();

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

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/commecial-management/trade-development/TFE";
    this.TITLE_DEFAULT = "Hội chợ triển lãm";
    this.TEXT_DEFAULT = "Hội chợ triển lãm";
  }

  getFormParams() {
    return {
      id: new FormControl(),
      ten_doanh_nghiep: new FormControl(),
      dia_chi_doanh_nghiep: new FormControl(),
      id_phuong_xa: new FormBuilder(),
      mst: new FormControl(),
      ten_hoi_cho: new FormControl(),
      thoi_gian_bat_dau: new FormControl(),
      thoi_gian_ket_thuc: new FormControl(),
      dia_diem_to_chuc: new FormControl(),
      so_luong_gian_hang: new FormControl(),
      san_pham: new FormControl(),
      so_van_ban: new FormControl(),
      co_quan_ban_hanh: new FormControl(),
      ngay_thang_nam_van_ban: new FormControl(),
      id_trang_thai: new FormControl(),
      time_id: new FormControl(),
    }
  }

  setFormParams() {
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['id'].setValue(selectedRecord.id);
      this.formData.controls['ten_doanh_nghiep'].setValue(selectedRecord.ten_doanh_nghiep);
      this.formData.controls['dia_chi_doanh_nghiep'].setValue(selectedRecord.to_chu_ca_nhan);
      this.formData.controls['id_phuong_xa'].setValue(selectedRecord.id_phuong_xa);
      this.formData.controls['mst'].setValue(selectedRecord.mst);
      this.formData.controls['ten_hoi_cho'].setValue(selectedRecord.ten_hoi_cho);
      this.formData.controls['thoi_gian_bat_dau'].setValue(selectedRecord.thoi_gian_bat_dau._d);
      this.formData.controls['thoi_gian_ket_thuc'].setValue(selectedRecord.thoi_gian_ket_thuc._d);
      this.formData.controls['dia_diem_to_chuc'].setValue(selectedRecord.dia_diem_to_chuc);
      this.formData.controls['so_luong_gian_hang'].setValue(selectedRecord.so_luong_gian_hang);
      this.formData.controls['san_pham'].setValue(selectedRecord.san_pham);
      this.formData.controls['so_van_ban'].setValue(selectedRecord.so_van_ban);
      this.formData.controls['co_quan_ban_hanh'].setValue(selectedRecord.co_quan_ban_hanh);
      this.formData.controls['ngay_thang_nam_van_ban'].setValue(selectedRecord.ngay_thang_nam_van_ban._d);
      this.formData.controls['time_id'].setValue(selectedRecord.time_id);
      this.formData.controls['id_trang_thai'].setValue(selectedRecord.id_trang_thai.toString())
    }
  }

  private chosenYearHandler(normalizedYear, datepicker) {
    this.filteredDate.setValue(normalizedYear);
    datepicker.close();
  }

  public onFiltededDateChange(event): void {
    this.getTFEList(event.getFullYear()
    );
  }

  applyFilter(event) {
    let filterValues = event.target ? event.target.value : event.value;
    if (filterValues instanceof Array) {
      let filteredData = [];
      filterValues.forEach(element => {
        this.dataSource.data.filter(x => x.id_phuong_xa == element).forEach(x => filteredData.push(x));
      });
      if (!filteredData.length) {
        this.filteredDataSource.data = filterValues.length ? [] : this.dataSource.data;
      }
      else {
        this.filteredDataSource.data = filteredData;
      }
    }
    else {
      this.filteredDataSource.filter = filterValues.trim().toLowerCase();
    }
  }

  getTFEList(time_id): void {
    this.commerceManagementService.getExpoData(time_id).subscribe(
      result => {
        if (result.data && result.data.length > 0) {
          result.data.forEach(element => {
            element.thoi_gian_bat_dau = this.formatDate(element.thoi_gian_bat_dau);
            element.thoi_gian_ket_thuc = this.formatDate(element.thoi_gian_ket_thuc);
            element.ngay_thang_nam_van_ban = this.formatDate(element.ngay_thang_nam_van_ban);
          });
        }
        this.dataSource = new MatTableDataSource<TFEModel>(result.data);
        this.filteredDataSource = new MatTableDataSource<TFEModel>(result.data);
        if (result.data && result.data.length > 0) {
          this.filteredDataSource.paginator = this.paginator;
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  countBusiness(): number {
    return new Set(this.filteredDataSource.data.map(x => x.mst)).size;
  }

  prepareData(data) {
    data['thoi_gian_bat_dau'] = data['thoi_gian_bat_dau'] ? _moment(data['thoi_gian_bat_dau']).format('yyyyMMDD') : ''
    data['thoi_gian_ket_thuc'] = data['thoi_gian_ket_thuc'] ? _moment(data['thoi_gian_ket_thuc']).format('yyyyMMDD') : ''
    data['ngay_thang_nam_van_ban'] = data['ngay_thang_nam_van_ban'] ? _moment(data['ngay_thang_nam_van_ban']).format('yyyyMMDD') : ''

    return data;
  }

  callService(data) {
    this.commerceManagementService.postExpoData([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData() {
    let datas = this.selection.selected.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.commerceManagementService.deleteTradeFairs(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

}
