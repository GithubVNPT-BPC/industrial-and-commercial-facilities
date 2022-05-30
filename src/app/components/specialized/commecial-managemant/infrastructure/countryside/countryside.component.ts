//Import Library
import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';

import { CountrySideModel } from 'src/app/_models/APIModel/commecial-management.model';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';
import { EnterpriseService } from 'src/app/_services/APIService/enterprise.service';
import { FilterService } from 'src/app/_services/filter.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { throwToolbarMixedModesError } from '@angular/material';

@Component({
  selector: 'app-countryside',
  templateUrl: './countryside.component.html',
  styleUrls: ['../../../special_layout.scss'],
})
export class CountrysideComponent extends BaseComponent {
  DB_TABLE = 'QLTM_HTM_NTM';
  public dataSource: MatTableDataSource<CountrySideModel> = new MatTableDataSource<CountrySideModel>();
  public filteredDataSource: MatTableDataSource<CountrySideModel> = new MatTableDataSource<CountrySideModel>();

  private sumOfMarket = 0;
  private sumOfWards = 0;
  private sumOf7thStandard = 0;
  private sumOfImplStandard = 0;
  private sumOf7thStandardPrevYear = 0;
  private sumOfImplStandardPrevYear = 0;
  private sumOf7thStandardReportYearByPlan = 0;
  private sumOfImplStandardReportYearByPlan = 0;
  private sumOf7thStandardReportYearByPrepare = 0;
  private sumOfImplStandardReportYearByPrepare = 0;

  private yearOfTC7 = [];
  private yearOfStd = [];

  private time_id: number
  private new_data_time_id: number

  filterModel = {
    id_quan_huyen: [],
    nam_dat_TC_7: [],
    nam_dat_NTM: []
  };

  displayedFields = {
    cho_truyen_thong: "Chợ truyền thống",
    ten_phuong_xa: "Tên Phường Xã",
    ten_quan_huyen: "Tên Huyện/Thị xã/Thành phố",
    nam_dat_TC_7: "Năm đạt TC số 7",
    nam_dat_NTM: "Năm thực hiện đạt chuẩn NTM",
    th_6_thang_nam_cung_ky_dat_TC_7: "Số xã đạt tiêu chí số 7",
    th_6_thang_nam_cung_ky_cho_dat_NTM: "Số xã có chợ đạt chuẩn nông thôn mới",
    nam_bc_kh_6_thang_nam_dat_TC_7: "Số xã đạt tiêu chí số 7 (Kế hoạch 6 tháng/năm)",
    nam_bc_kh_6_thang_nam_cho_dat_NTM: "Số xã có chợ đạt chuẩn nông thôn mới (Kế hoạch 6 tháng/năm)",
    nam_bc_ut_6_thang_nam_dat_TC_7: "Số xã đạt tiêu chí số 7 (Ước thực hiện 6 tháng/năm)",
    nam_bc_ut_6_thang_nam_cho_dat_NTM: "Số xã có chợ đạt chuẩn nông thôn mới (Ước thực hiện 6 tháng/năm)",
    thoi_gian_chinh_sua_cuoi: 'Thời gian cập nhật',
  }

  getFormParams() {
    return {
      id: new FormControl(),
      cho_truyen_thong: new FormControl(''),
      id_phuong_xa: new FormControl('', Validators.required),
      nam_dat_TC_7: new FormControl(),
      nam_dat_NTM: new FormControl(),
      th_6_thang_nam_cung_ky_dat_TC_7: new FormControl(),
      th_6_thang_nam_cung_ky_cho_dat_NTM: new FormControl(),
      nam_bc_kh_6_thang_nam_dat_TC_7: new FormControl(),
      nam_bc_kh_6_thang_nam_cho_dat_NTM: new FormControl(),
      nam_bc_ut_6_thang_nam_dat_TC_7: new FormControl(),
      nam_bc_ut_6_thang_nam_cho_dat_NTM: new FormControl(),
    }
  }

  setFormParams() {
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['id'].setValue(selectedRecord.id);
      this.formData.controls['cho_truyen_thong'].setValue(selectedRecord.cho_truyen_thong);
      this.formData.controls['id_phuong_xa'].setValue(selectedRecord.id_phuong_xa);
      this.formData.controls['nam_dat_TC_7'].setValue(selectedRecord.nam_dat_TC_7);
      this.formData.controls['nam_dat_NTM'].setValue(selectedRecord.nam_dat_NTM);
      this.formData.controls['th_6_thang_nam_cung_ky_dat_TC_7'].setValue(selectedRecord.th_6_thang_nam_cung_ky_dat_TC_7);
      this.formData.controls['th_6_thang_nam_cung_ky_cho_dat_NTM'].setValue(selectedRecord.th_6_thang_nam_cung_ky_cho_dat_NTM);
      this.formData.controls['nam_bc_kh_6_thang_nam_dat_TC_7'].setValue(selectedRecord.nam_bc_kh_6_thang_nam_dat_TC_7);
      this.formData.controls['nam_bc_kh_6_thang_nam_cho_dat_NTM'].setValue(selectedRecord.nam_bc_kh_6_thang_nam_cho_dat_NTM);
      this.formData.controls['nam_bc_ut_6_thang_nam_dat_TC_7'].setValue(selectedRecord.nam_bc_ut_6_thang_nam_dat_TC_7);
      this.formData.controls['nam_bc_ut_6_thang_nam_cho_dat_NTM'].setValue(selectedRecord.nam_bc_ut_6_thang_nam_cho_dat_NTM);
      this.new_data_time_id = this.time_id
    }
  }

  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
    public filterService: FilterService,
    public enterpriseService: EnterpriseService,
    public _login: LoginService
  ) {
    super(injector);
  }

  authorize: boolean = true;

  ngOnInit(): void {
    super.ngOnInit();
    this.time_id = new Date().getFullYear() - 1
    this.new_data_time_id = this.time_id + 1
    this.initDistrictWard();
    this.getCountrySideData(this.time_id);

    if (this._login.userValue.user_role_id == 3 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/commecial-management/domestic";
    this.TITLE_DEFAULT = "Thương mại nội địa - Hạ tầng thương mại";
    this.TEXT_DEFAULT = "Thương mại nội địa - Hạ tầng thương mại";
  }

  getCountrySideData(time_id) {
    this.commerceManagementService.getCountrySideData(time_id).subscribe(
      allrecords => {
        this.filteredDataSource.data = [];
        if (allrecords.data && allrecords.data.length > 0) {
          let data = allrecords.data;
          this.dataSource = new MatTableDataSource<CountrySideModel>(data);
          this.filteredDataSource.data = [...this.dataSource.data];
        }
        this._prepareData();
        this.paginatorAgain();
      },
      error => this.errorMessage = <any>error
    );
    this.filterModel = {
      id_quan_huyen: [],
      nam_dat_TC_7: [],
      nam_dat_NTM: []
    };
  }

  _prepareData() {
    let data = this.filteredDataSource.data;
    // Need to modify
    this.yearOfTC7 = data.map(x => x.nam_dat_TC_7).filter(this.filterService.onlyUnique);
    this.yearOfStd = data.map(x => x.nam_dat_NTM).filter(this.filterService.onlyUnique);

    this.sumOfMarket = data.filter(x => x.cho_truyen_thong != "").length;
    this.sumOfWards = data.map(x => x.id_phuong_xa).length;

    // Tiêu chí NTM
    this.sumOf7thStandard = data.filter(x => x.nam_dat_TC_7).length;
    this.sumOfImplStandard = data.filter(x => x.nam_dat_NTM && x.cho_truyen_thong).length;
    // Thực hiện 6 tháng/năm cùng ký năm trước
    this.sumOf7thStandardPrevYear = data.filter(x => x.th_6_thang_nam_cung_ky_dat_TC_7).length;
    this.sumOfImplStandardPrevYear = data.filter(x => x.th_6_thang_nam_cung_ky_cho_dat_NTM).length;
    // Năm báo cáo: Kế hoạch 6 tháng/năm
    this.sumOf7thStandardReportYearByPlan = data.filter(x => x.nam_bc_kh_6_thang_nam_dat_TC_7).length;
    this.sumOfImplStandardReportYearByPlan = data.filter(x => x.nam_bc_kh_6_thang_nam_cho_dat_NTM).length;
    // Năm báo cáo: Ước thực hiện 6 tháng/năm
    this.sumOf7thStandardReportYearByPrepare = data.filter(x => x.nam_bc_ut_6_thang_nam_dat_TC_7).length;
    this.sumOfImplStandardReportYearByPrepare = data.filter(x => x.nam_bc_ut_6_thang_nam_cho_dat_NTM).length;
  }

  callService(data) {
    data.id_quan_huyen = this.findDistrictId(data.id_phuong_xa);
    var finalData = {
      time_id: this.new_data_time_id,
      data: [data]
    }
    console.log(finalData)
    this.commerceManagementService.postCountrySide(finalData).subscribe(response => {
      this.successNotify(response)
      this.new_data_time_id = new Date().getFullYear()
    }, error => this.errorNotify(error));
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.commerceManagementService.deleteCountrySide(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

}
