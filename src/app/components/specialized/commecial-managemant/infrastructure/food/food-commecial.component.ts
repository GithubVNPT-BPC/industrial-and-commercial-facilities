//Import Library
import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

//Import Model
import { FoodCommerceModel } from 'src/app/_models/APIModel/commecial-management.model';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';
import { EnterpriseService } from 'src/app/_services/APIService/enterprise.service';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
  selector: 'app-food-commecial',
  templateUrl: './food-commecial.component.html',
  styleUrls: ['../../../special_layout.scss'],
})

export class FoodManagementComponent extends BaseComponent {
  DB_TABLE = 'QLTM_KINH_DOANH_THUC_PHAM';
  dataSource: MatTableDataSource<FoodCommerceModel> = new MatTableDataSource<FoodCommerceModel>();
  filteredDataSource: MatTableDataSource<FoodCommerceModel> = new MatTableDataSource<FoodCommerceModel>();

  isChecked: boolean;
  isFound: boolean = false;
  isAddLicense: boolean = false;
  tongDoanhNghiep: number;
  //
  filterModel = {
    id_spkd: [],
    id_quan_huyen: [],
  };

  businessProducts = [];

  displayedFields = {
    mst: "Mã số thuế",
    ten_cua_hang: "Tên cơ sở",
    dia_chi_day_du: "Địa chỉ",
    nguoi_dai_dien: "Người đại diện theo pháp luật",
    so_dien_thoai: "Điện thoại",
    ten_san_pham: "Mặt hàng kinh doanh",
    so_giay_phep: "Số GCN ATTP",
    ngay_cap: "Ngày cấp",
    ngay_het_han: "Ngày hết hạn",
    // ngay_het_han: "Ngày hết hạn",
    thoi_gian_chinh_sua_cuoi: "Thời gian cập nhật",
  }
  giayCndkkdList = [];
  _timeout: any = null;
  mstOptions: [];

  //Angular FUnction --------------------------------------------------------------------
  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
    public enterpriseService: EnterpriseService,
    public _login: LoginService
  ) {
    super(injector);
  }

  authorize: boolean = true;

  ngOnInit(): void {
    super.ngOnInit();
    this.getFoodCommerceProductList();
    this.getFoodCommerceData();

    if (this._login.userValue.user_role_id == 3 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/commecial-management/domestic";
    this.TITLE_DEFAULT = "Thương mại nội địa - Hạ tầng thương mại";
    this.TEXT_DEFAULT = "Thương mại nội địa - Hạ tầng thương mại";
  }

  getFoodCommerceProductList() {
    this.commerceManagementService.getFoodCommerceProductList().subscribe(
      allrecords => {
        if (allrecords.data) {
          this.businessProducts = allrecords.data;
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  getFoodCommerceData() {
    this.commerceManagementService.getFoodCommerceData().subscribe(
      allrecords => {
        this.filteredDataSource.data = [];
        if (allrecords.data && allrecords.data.length > 0) {
          allrecords.data.forEach(element => {
            element.ngay_cap = element.ngay_cap ? this.formatDate(element.ngay_cap) : '';
            element.ngay_het_han = element.ngay_het_han ? this.formatDate(element.ngay_het_han) : '';
            element.is_het_han = element.ngay_het_han ? element.ngay_het_han.toDate() < Date.parse(this.getCurrentDate()) : false;
          });
          this.dataSource = new MatTableDataSource<FoodCommerceModel>(allrecords.data);
          this.filteredDataSource.data = [...this.dataSource.data].filter(x => !x.is_het_han)
        }
        this._prepareData();
        this.paginatorAgain();
      },
      error => this.errorMessage = <any>error
    );
  }

  findEnterpriseByMst(mst) {
    let self = this;
    this._timeout = null;
    if (this._timeout) { //if there is already a timeout in process cancel it
      window.clearTimeout(this._timeout);
    }
    this._timeout = window.setTimeout(() => {
      self.enterpriseService.SearchLikeEnterpriseByMst(mst, 5).subscribe(
        results => {
          if (results && results.data && results.data[0].length) {
            self.mstOptions = results.data[0];
            self.giayCndkkdList = results.data[2];
          }
        },
        error => this.errorMessage = <any>error
      );
      self._timeout = null;
    }, 2000);
  }

  public getCurrentDate() {
    let date = new Date;
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  getFormParams() {
    return {
      id: new FormControl(),
      mst: new FormControl('', Validators.required),
      id_spkd: new FormControl('', Validators.required),
      id_giay_phep: new FormControl(''),
    }
  }

  setFormParams() {
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['id'].setValue(selectedRecord.id);
      this.formData.controls['mst'].setValue(selectedRecord.mst);
      this.formData.controls['id_spkd'].setValue(selectedRecord.id_spkd);

      this.enterpriseService.SearchLikeEnterpriseByMst(selectedRecord.mst, 5).subscribe(
        results => {
          if (results && results.data && results.data[0].length) {
            this.mstOptions = results.data[0];
            this.giayCndkkdList = results.data[2];
          }
        },
        error => this.errorMessage = <any>error
      );
      
    }
  }

  prepareData(data) {
    data.id_giay_phep = data.id_giay_phep ? data.id_giay_phep : 0;
    return data;
  }

  callService(data) {
    this.commerceManagementService.postFoodCommerce(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.commerceManagementService.deleteFoodCommerce(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  resetAll() {
    this.isFound = false;
    this.isAddLicense = false;
    super.resetAll();
  }

  _prepareData() {
    this.tongDoanhNghiep = this.dataSource.data.length;
  }

  applyExpireCheck(event) {
    this.filteredDataSource.data = this.dataSource.data.filter(x => x.is_het_han == event.checked)
  }

  addLicenseInfo(event) {
    event.preventDefault();
    let mst = this.formData.controls.mst.value;
    let redirectPage = '/#/specialized/commecial-management/domestic/add-certificate/undefined?mst=' + mst;
    window.open(redirectPage, "_blank");
  }
}
