//Import Library
import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

import { ConvenienceStoreModel } from 'src/app/_models/APIModel/commecial-management.model';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';
import { EnterpriseService } from 'src/app/_services/APIService/enterprise.service';

import moment from 'moment';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
  selector: 'app-stores-commecial',
  templateUrl: './stores-commecial.component.html',
  styleUrls: ['../../../special_layout.scss'],
})
export class StoreManagementComponent extends BaseComponent {
  DB_TABLE = 'QLTM_CUA_HANG_TIEN_LOI';

  message: string;
  isChecked: boolean = false;
  isFound: boolean = false;
  isAddLicense: boolean = false;
  dataSource: MatTableDataSource<ConvenienceStoreModel> = new MatTableDataSource<ConvenienceStoreModel>();
  filteredDataSource: MatTableDataSource<ConvenienceStoreModel> = new MatTableDataSource<ConvenienceStoreModel>();
  filterModel = {
    id_quan_huyen: [],
    ngay_cap_giay_chung_nhan: [],
  };
  //
  public tongCuaHang: number;
  public tongCuaHangDangKyGCN: number = 0;
  public soCuaHangTL: number;
  public soCuaHangKhac: number;
  public soCuaHangDauTuTrongNam: number = 0;
  public soCuaHangDauTuNamTruoc: number = 0;

  displayedFields = {
    ten_cua_hang: "Tên cửa hàng",
    dia_chi_day_du: "Địa chỉ",
    mst: "Mã số thuế",
    so_dien_thoai: "Điện thoại",
    ten_san_pham: "Sản phẩm kinh doanh",
    thoi_gian_chinh_sua_cuoi: "Thời gian cập nhật",
    so_chung_nhan: "Số chứng nhận ĐKKD",
    ngay_cap_giay_chung_nhan: "Ngày cấp",
    noi_cap_giay_chung_nhan: "Nơi cấp",
    so_giay_phep: "Số giấy phép",
    ngay_cap_giay_phep: "Ngày cấp",
    ngay_het_han_giay_phep: "Ngày hết hạn",
  }

  businessProducts = [
    { id_spkd: 1, ten_san_pham: "Thực phẩm tiêu dùng" }
  ];

  giayCndkkdList = [];
  giayAtvstpList = [];

  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
    public enterpriseService: EnterpriseService,
    public _login: LoginService
  ) {
    super(injector);
  }

  authorize: boolean = true

  ngOnInit(): void {
    super.ngOnInit();
    this.initDistrictWard();
    this.getConvenienceStoreData();

    if (this._login.userValue.user_role_id == 3 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  ngAfterViewInit() {
    this.paginator.pageIndex = 0;
    this.paginatorAgain();
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/commecial-management/domestic";
    this.TITLE_DEFAULT = "Thương mại nội địa - Hạ tầng thương mại";
    this.TEXT_DEFAULT = "Thương mại nội địa - Hạ tầng thương mại";
  }

  getConvenienceStoreData() {
    this.commerceManagementService.getConvenienceStoreData().subscribe(
      allrecords => {
        this.filteredDataSource.data = [];
        if (allrecords.data && allrecords.data.length) {
          let data = allrecords.data;

          data.forEach(element => {
            element.ngay_cap_giay_chung_nhan = this.formatDate(element.ngay_cap_giay_chung_nhan);
            element.ngay_cap_giay_phep = this.formatDate(element.ngay_cap_giay_phep);
            element.ngay_het_han_giay_phep = this.formatDate(element.ngay_het_han_giay_phep);
          });

          let currentDate = moment();
          data.map(x => {
            let expiredDate = moment(x.ngay_het_han_giay_phep, "DD/MM/YYYY");
            x.is_expired = currentDate.isAfter(expiredDate, 'day');
          });
          this.dataSource = new MatTableDataSource<ConvenienceStoreModel>(data);
          this.filteredDataSource.data = [...this.dataSource.data];
        }
        this._prepareData();
        this.paginatorAgain();
      },
      error => this.errorMessage = <any>error
    );
  }

  getFormParams() {
    return {
      id: new FormControl(),
      ten_cua_hang: new FormControl(),
      mst: new FormControl(),
      dia_chi: new FormControl(),
      so_dien_thoai: new FormControl(),
      id_spkd: new FormControl(),
      id_giay_cndkkd: new FormControl(),
      id_giay_atvstp: new FormControl(),
      id_phuong_xa: new FormControl(),
    }
  }

  setFormParams() {
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['id'].setValue(selectedRecord.id);
      this.formData.controls['ten_cua_hang'].setValue(selectedRecord.ten_cua_hang);
      this.formData.controls['mst'].setValue(selectedRecord.mst);
      this.formData.controls['dia_chi'].setValue(selectedRecord.dia_chi);
      this.formData.controls['so_dien_thoai'].setValue(selectedRecord.so_dien_thoai);
      this.formData.controls['id_spkd'].setValue(selectedRecord.id_spkd);
      this.formData.controls['id_giay_cndkkd'].setValue(selectedRecord.id_giay_cndkkd);
      this.formData.controls['id_giay_atvstp'].setValue(selectedRecord.id_giay_atvstp);
      this.formData.controls['id_phuong_xa'].setValue(selectedRecord.id_phuong_xa);
    }
  }

  callService(data) {
    this.commerceManagementService.postConvenienceStore(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.commerceManagementService.deleteConvenienceStore(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  resetAll() {
    this.isFound = false;
    this.isAddLicense = false;
    super.resetAll();
  }

  _prepareData() {
    let data = this.filteredDataSource.data;
    this.soCuaHangTL = data.length;
    this.tongCuaHangDangKyGCN = data.length ? data.map(x => x.id_giay_cndkkd).length : 0;
    this.soCuaHangKhac = data.length - this.soCuaHangTL;
    this.tongCuaHang = this.dataSource.data.length;
  }

  filterArray(dataSource, filters) {
    const filterKeys = Object.keys(filters);
    let filteredData = [...dataSource];
    filterKeys.forEach(key => {
      let filterCrits = [];
      if (filters[key].length) {
        if (key == 'ngay_cap_giay_chung_nhan') {
          filters[key].forEach(criteria => {
            if (criteria && criteria != 0) filterCrits = filterCrits.concat(filteredData.filter(x => x[key].toString().includes(criteria)));
            else filterCrits = filterCrits.concat(filteredData);
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

  applyExpireCheck(event) {
    this.filteredDataSource.data = event.checked ? [...this.dataSource.data.filter(d => d.is_expired)] : [...this.dataSource.data];
    this._prepareData();
    this.paginatorAgain();
  }

  findLicenseInfo(event) {
    event.preventDefault();
    let mst = this.formData.controls.mst.value;
    this.enterpriseService.GetLicenseByMst(mst).subscribe(response => {
      if (response.success) {
        if (response.data.length > 0) {

          let giayCndkkdList = response.data.filter(x => x.id_loai_giay_phep == 1);
          let giayAtvstpList = response.data.filter(x => x.id_loai_giay_phep == 4);

          if (giayAtvstpList.length == 0 || giayCndkkdList.length == 0) {
            this.isAddLicense = true;
            this.logger.msgWaring("Không có dữ liệu về giấy phép, hãy thêm giấy phép cho doanh nghiệp này");
          }
          else {
            this.isFound = true;
            this.giayCndkkdList = giayCndkkdList;
            this.giayAtvstpList = giayAtvstpList;
            this.logger.msgSuccess("Hãy tiếp tục nhập dữ liệu");
          }
        } else {
          this.isAddLicense = true;
          this.logger.msgWaring("Không có dữ liệu về giấy phép, hãy thêm giấy phép cho doanh nghiệp này");
        }
      } else {
        this.isFound = false;
        this.isAddLicense = false;
        this.logger.msgSuccess("Không tìm thấy dữ liệu");
      }
    }, error => {
      this.isFound = false;
      this.isAddLicense = false;
      this.logger.msgError("Lỗi khi xử lý \n" + error);
    });
  }

  addLicenseInfo(event) {
    event.preventDefault();
    let mst = this.formData.controls.mst.value;
    let redirectPage = '/#/specialized/commecial-management/domestic/add-certificate/undefined?mst=' + mst;
    window.open(redirectPage, "_blank");
  }

}
