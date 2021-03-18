//Import Library
import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

import { ConvenienceStoreModel } from 'src/app/_models/APIModel/commecial-management.model';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';
import { EnterpriseService } from 'src/app/_services/APIService/enterprise.service';

import moment from 'moment';

@Component({
  selector: 'app-stores-commecial',
  templateUrl: './stores-commecial.component.html',
  styleUrls: ['../../../special_layout.scss'],
})
export class StoreManagementComponent extends BaseComponent {  

  years: any[] = [];
  message: string;
  isChecked: boolean = false;
  isFound: boolean = false;
  filterModel = {
    is_expired: false,
    id_quan_huyen: [],
  };
  dataSource: MatTableDataSource<ConvenienceStoreModel> = new MatTableDataSource<ConvenienceStoreModel>();
  filteredDataSource: MatTableDataSource<ConvenienceStoreModel> = new MatTableDataSource<ConvenienceStoreModel>();

  //
  public tongCuaHang: number;
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
    so_chung_nhan: "Số chứng nhận ĐKKD",
    ngay_cap_giay_chung_nhan: "Ngày cấp",
    noi_cap_giay_chung_nhan: "Nơi cấp",
    so_giay_phep: "Số giấy phép",
    ngay_cap_giay_phep: "Ngày cấp",
    ngay_het_han_giay_phep: "Ngày hết hạn",
  }
  
  businessProducts = [
    {id_spkd: 1, ten_san_pham: "Thực phẩm tiêu dùng"}
  ];

  giayCndkkdList = [];
  giayAtvstpList = [];

  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
    public enterpriseService: EnterpriseService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initDistrictWard();
    this.getConvenienceStoreData();
  }

  ngAfterViewInit() {
    this.paginator.pageIndex = 0;
    this.paginatorAgain();
  }

  getLinkDefault(){
    this.LINK_DEFAULT = "/specialized/commecial-management/domestic";
    this.TITLE_DEFAULT = "Thương mại nội địa - Hạ tầng thương mại";
    this.TEXT_DEFAULT = "Thương mại nội địa - Hạ tầng thương mại";
  }

  getConvenienceStoreData () {
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

  callService(data) {
    this.commerceManagementService.postConvenienceStore(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData(data) { 
    let datas = data.map(element => new Object({id: element.id}));
    return datas;
  }

  callRemoveService(data) {
    this.commerceManagementService.deleteConvenienceStore(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }
  
  resetAll() {
    this.isFound = false;
    super.resetAll();
  }

  _prepareData() {
    let data = this.filteredDataSource.data;
    this.soCuaHangTL = data.length;
    this.soCuaHangKhac = data.length - this.soCuaHangTL;
    this.tongCuaHang = this.dataSource.data.length;
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter() {
    this.filterModel.is_expired = this.isChecked ? true : null;

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
    this.paginatorAgain();
    this._prepareData();
  }

  filterArray(array, filters) {
    const filterKeys = Object.keys(filters);
    let temp = [...array];
    filterKeys.forEach(key => {
      let temp2 = [];
      if (key == 'is_expired') {
        if (filters[key]) {
          temp2 = temp2.concat(temp.filter(x => x[key] == filters[key]));
          temp = [...temp2];
        }
      }
      else {
        if (filters[key])
          if (filters[key].length) {
            filters[key].forEach(criteria => {
              temp2 = temp2.concat(temp.filter(x => x[key] == criteria));
            });
            temp = [...temp2];
          }
      }
    })
    return temp;
  }

  findLicenseInfo(event) {
    event.preventDefault();
    let mst = this.formData.controls.mst.value;
    this.enterpriseService.GetLicenseByMst(mst).subscribe(response => {
      if (response.success) {
        if (response.data.length > 0) {
          
          let giayCndkkdList = response.data.filter(x => x.id_loai_giay_phep == 1);
          let giayAtvstpList = response.data.filter(x => x.id_loai_giay_phep == 4);
          
          if (giayAtvstpList.length == 0 || giayCndkkdList.length == 0 )
            this.logger.msgWaring("Không có dữ liệu về giấy phép, hãy thêm giấy phép cho doanh nghiệp này");
          else {
            this.isFound = true;
            this.giayCndkkdList = giayCndkkdList;
            this.giayAtvstpList = giayAtvstpList;
            this.logger.msgSuccess("Hãy tiếp tục nhập dữ liệu");
          }
        } else {
          this.logger.msgWaring("Không có dữ liệu về giấy phép, hãy thêm giấy phép cho doanh nghiệp này");
        }
      } else {
        this.isFound = false;
        this.logger.msgSuccess("Không tìm thấy dữ liệu");
      }
    }, error => {
        this.isFound = false;
        this.logger.msgError("Lỗi khi xử lý \n" + error);
    });
  }
}
