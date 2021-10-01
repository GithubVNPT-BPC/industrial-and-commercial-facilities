import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { dia_diem_km, SDModel } from 'src/app/_models/APIModel/trade-development.model';

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
  selector: 'app-subscribe-discount',
  templateUrl: './subscribe-discount.component.html',
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
export class SubscribeDiscountComponent extends BaseComponent {
  DB_TABLE = 'QLTM_XTTM_KM'
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
    thoi_gian_chinh_sua_cuoi: "Thời gian cập nhật"
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

    if (this._login.userValue.user_role_id == 3 || this._login.userValue.user_role_id == 1) {
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
      id: new FormControl(),
      ten_doanh_nghiep: new FormControl(),
      dia_chi_doanh_nghiep: new FormControl(),
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

  setFormParams() {
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['id'].setValue(selectedRecord.id);
      this.formData.controls['ten_doanh_nghiep'].setValue(selectedRecord.ten_doanh_nghiep);
      this.formData.controls['dia_chi_doanh_nghiep'].setValue(selectedRecord.to_chu_ca_nhan);
      this.formData.controls['mst'].setValue(selectedRecord.mst);
      this.formData.controls['ten_chuong_trinh_km'].setValue(selectedRecord.ten_chuong_trinh_km);
      this.formData.controls['thoi_gian_bat_dau'].setValue(selectedRecord.thoi_gian_bat_dau._d);
      this.formData.controls['thoi_gian_ket_thuc'].setValue(selectedRecord.thoi_gian_ket_thuc._d);
      this.formData.controls['hang_hoa_km'].setValue(selectedRecord.hang_hoa_km);
      this.formData.controls['so_van_ban'].setValue(selectedRecord.so_van_ban);
      this.formData.controls['co_quan_ban_hanh'].setValue(selectedRecord.co_quan_ban_hanh);
      this.formData.controls['ngay_thang_nam_van_ban'].setValue(selectedRecord.ngay_thang_nam_van_ban._d);
      this.formData.controls['id_hinh_thuc'].setValue(selectedRecord.id_hinh_thuc);
      let temp1 = this.temp.filter(x => x.id_xttm_km === selectedRecord.id)
      for (let index = 0; index < temp1.length; index++) {
        this.danh_sach_dia_diem.push(this.formBuilder.group(temp1[index]))
      }
    }
  }

  get danh_sach_dia_diem(): FormArray {
    return this.formData.get('danh_sach_dia_diem') as FormArray
  }

  newAddress(): FormGroup {
    return this.formBuilder.group(
      {
        id: new FormControl(),
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

  public onRemove1(temp: any) {
    let data = [temp].map(element => new Object({ id: element }));
    this.callRemoveService1(data);
  }

  removeAddress(i: number) {
    let temp1 = this.temp.filter(x => x.id_xttm_km === this.selection.selected[0].id)
    this.confirmationDialogService.confirm('Xác nhận', 'Bạn chắc chắn muốn xóa?', 'Đồng ý', 'Đóng')
      .then(confirm => {
        if (confirm) {
          this.danh_sach_dia_diem.removeAt(i);
          this.onRemove1(temp1[i].id);
          return;
        }
      })
      .catch((err) => console.log('Hủy không thao tác: \n' + err));
  }

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

  public onCreate1() {
    // Must change to async function
    if (this.formData.invalid) {
      this.logger.msgError("Cần nhập đầy đủ các thông tin cần thiết trên biểu mẫu");
    } else {
      let data = this.formData.value;
      if (this.mode == 'edit') {
        data = this.prepareData(data);
        this.callService(data);
      }
    }
  }

  temp: Array<{
    id: number,
    dia_diem: string,
    id_quan_huyen: number,
    id_xttm_km: number
  }> = new Array<{
    id: number,
    dia_diem: string,
    id_quan_huyen: number,
    id_xttm_km: number
  }>();

  getSDList(): void {
    this.commerceManagementService.getSubcribeDiscountData().subscribe(
      result => {
        this.filteredDataSource.data = [];
        if (result.data && result.data.length > 0) {
          result.data[0].forEach(element => {
            element.thoi_gian_bat_dau = this.formatDate(element.thoi_gian_bat_dau);
            element.thoi_gian_ket_thuc = this.formatDate(element.thoi_gian_ket_thuc);
            element.ngay_thang_nam_van_ban = this.formatDate(element.ngay_thang_nam_van_ban);
          });
          this.temp = result.data[1]
          let data = this.handleData(result.data);
          this.dataSource = new MatTableDataSource<SDModel>(data);
          this.filteredDataSource = new MatTableDataSource<SDModel>(data);
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
      k['time_id'] = this.currentYear;
    });
    return ds_km;
  }

  _prepareData() {
    let data = this.filteredDataSource.data;
    this.totalEnterprises = new Set(data.map(x => x.mst)).size;
  }

  prepareData(data) {
    data['thoi_gian_bat_dau'] = data['thoi_gian_bat_dau'] ? _moment(data['thoi_gian_bat_dau']).format('yyyyMMDD') : ''
    data['thoi_gian_ket_thuc'] = data['thoi_gian_ket_thuc'] ? _moment(data['thoi_gian_ket_thuc']).format('yyyyMMDD') : ''
    data['ngay_thang_nam_van_ban'] = data['ngay_thang_nam_van_ban'] ? _moment(data['ngay_thang_nam_van_ban']).format('yyyyMMDD') : ''
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

  callRemoveService1(data) {
    this.commerceManagementService.deleteAddressPromo(data).subscribe(response => this.successNotify1(response), error => this.errorNotify1(error));
  }

  public successNotify1(response) {
    if (response.id == -1) {
      this.logger.msgError("Lưu lỗi! Lý do: " + response.message);
    }
    else {
      this.logger.msgSuccess("Dữ liệu được xóa thành công!");
    }
  }

  public errorNotify1(error) {
    this.logger.msgError("Không thể thực thi! Lý do: \n" + error);
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

    if (event.value) {
      // const filterValue = (event as HTMLInputElement).value;
      this.filteredDataSource.filter = event.value.toString().trim().toLowerCase();
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
