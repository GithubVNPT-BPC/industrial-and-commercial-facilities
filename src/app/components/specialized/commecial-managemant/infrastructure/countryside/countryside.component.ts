//Import Library
import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

import { CountrySideModel } from 'src/app/_models/APIModel/commecial-management.model';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';
import { EnterpriseService } from 'src/app/_services/APIService/enterprise.service';
import { FilterService } from 'src/app/_services/filter.service';


@Component({
  selector: 'app-countryside',
  templateUrl: './countryside.component.html',
  styleUrls: ['../../../special_layout.scss'],
})
export class CountrysideComponent extends BaseComponent {
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

  filterModel = {
    nam_dat_TC_7: [],
    nam_dat_NTM: [],
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
  }

  getFormParams() {
    return {
      cho_truyen_thong: new FormControl(),
      id_phuong_xa: new FormControl(),
      id_giay_phep: new FormControl(),
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

  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
    public filterService: FilterService,
    public enterpriseService: EnterpriseService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initDistrictWard();
    this.getCountrySideData();
  }

  getLinkDefault(){
    this.LINK_DEFAULT = "/specialized/commecial-management/domestic";
    this.TITLE_DEFAULT = "Thương mại nội địa - Hạ tầng thương mại";
    this.TEXT_DEFAULT = "Thương mại nội địa - Hạ tầng thương mại";
  }

  getCountrySideData () {
    this.commerceManagementService.getCountrySideData().subscribe(
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
  }

  _prepareData() {
    let data = this.filteredDataSource.data;
    // Need to modify
    this.yearOfTC7 = data.map(x => x.nam_dat_TC_7).filter(this.filterService.onlyUnique);
    this.yearOfStd = data.map(x => x.nam_dat_NTM).filter(this.filterService.onlyUnique);

    this.sumOfMarket = data.map(x => x.cho_truyen_thong).length;
    this.sumOfWards = data.map(x => x.id_phuong_xa).length;

    // Tiêu chí NTM
    this.sumOf7thStandard = data.filter(x => x.nam_dat_TC_7).length;
    this.sumOfImplStandard = data.filter(x => x.nam_dat_NTM).length;
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
    this.commerceManagementService.postCountrySide([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
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

}
