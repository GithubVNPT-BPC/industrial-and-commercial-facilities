//Import Library
import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';

//Import Model
import { FoodCommerceModel } from 'src/app/_models/APIModel/commecial-management.model';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';
import { EnterpriseService } from 'src/app/_services/APIService/enterprise.service';
import { element } from 'protractor';

@Component({
  selector: 'app-food-commecial',
  templateUrl: './food-commecial.component.html',
  styleUrls: ['../../../special_layout.scss'],
})

export class FoodManagementComponent extends BaseComponent {
  dataSource: MatTableDataSource<FoodCommerceModel> = new MatTableDataSource<FoodCommerceModel>();
  filteredDataSource: MatTableDataSource<FoodCommerceModel> = new MatTableDataSource<FoodCommerceModel>();

  isChecked: boolean;
  isFound: boolean = false;
  public tongDoanhNghiep: number;
  //
  filterModel = {
    id_spkd: [],
    id_quan_huyen: [],
  };

  businessProducts = [
    { id_spkd: 1, ten_san_pham: "Bán buôn thực phẩm" },
    { id_spkd: 2, ten_san_pham: "Bán buôn bán lẻ thực phẩm" },
    { id_spkd: 3, ten_san_pham: "Phân phối gạo" },
    { id_spkd: 4, ten_san_pham: "Bán buôn đồ uống" },
    { id_spkd: 5, ten_san_pham: "Đại lý gạo" },
    { id_spkd: 6, ten_san_pham: "Bán buôn thực phẩm" },
  ];

  displayedFields = {
    ten_cua_hang: "Tên cửa hàng",
    dia_chi_day_du: "Địa chỉ",
    mst: "Mã số thuế",
    ten_san_pham: "Sản phẩm kinh doanh",
    so_giay_phep: "Số chứng nhận ĐKKD",
    ngay_cap: "Ngày cấp",
    ngay_het_han: "Ngày hết hạn",
    nguoi_dai_dien: "Tên",
    so_dien_thoai: "Điện thoại",
  }
  giayCndkkdList = [];

  //Angular FUnction --------------------------------------------------------------------
  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
    public enterpriseService: EnterpriseService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getFoodCommerceData();
  }

  ngAfterViewInit() {
    this.paginatorAgain();
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/commecial-management/domestic";
    this.TITLE_DEFAULT = "Thương mại nội địa - Hạ tầng thương mại";
    this.TEXT_DEFAULT = "Thương mại nội địa - Hạ tầng thương mại";
  }

  getFoodCommerceData() {
    this.commerceManagementService.getFoodCommerceData().subscribe(
      allrecords => {
        if (allrecords.data && allrecords.data.length > 0) {
          this.dataSource = new MatTableDataSource<FoodCommerceModel>(allrecords.data);
          this.dataSource.data.forEach(element => {
            if (element.ngay_het_han) {
              let temp = this.Convertdate(element.ngay_het_han)
              element.is_het_han = Date.parse(temp) < Date.parse(this.getCurrentDate())
            }
            else {
              element.is_het_han = false
            }
            element.ngay_cap = element.ngay_cap ? this.Convertdate(element.ngay_cap) : null
            element.ngay_het_han = element.ngay_het_han ? this.Convertdate(element.ngay_het_han) : null
          })

          this.filteredDataSource.data = [...this.dataSource.data].filter(x=>x.is_het_han == false)
          this._prepareData(this.dataSource.data);
          this.paginatorAgain();
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  Convertdate(text: string): string {
    let date: string
    date = text.substring(6, 8) + "-" + text.substring(4, 6) + "-" + text.substring(0, 4)
    return date
  }

  public getCurrentDate() {
    let date = new Date;
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  getFormParams() {
    return {
      mst: new FormControl(),
      id_spkd: new FormControl(),
      id_giay_phep: new FormControl(),
    }
  }

  callService(data) {
    this.commerceManagementService.postFoodCommerce(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  resetAll() {
    this.isFound = false;
    super.resetAll();
  }

  private _prepareData(data: FoodCommerceModel[]) {
    this.tongDoanhNghiep = data.length;
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter() {
    let filteredData = this.filterArray(this.dataSource.data, this.filterModel);
    this._prepareData(filteredData);
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
  }

  filterArray(array, filters) {
    const filterKeys = Object.keys(filters);
    let temp = [...array];
    filterKeys.forEach(key => {
      let temp2 = [];
      if (filters[key].length) {
        filters[key].forEach(criteria => {
          temp2 = temp2.concat(temp.filter(x => x[key] == criteria));
        });
        temp = [...temp2];
      }
    })
    return temp;
  }

  applyExpireCheck(event) {
    this.filteredDataSource.data = this.dataSource.data.filter(x => x.is_het_han == event.checked)
  }

  findLicenseInfo(event) {
    event.preventDefault();
    let mst = this.formData.controls.mst.value;
    this.enterpriseService.GetLicenseByMst(mst).subscribe(response => {
      if (response.success) {
        if (response.data.length > 0) {
          let giayCndkkdList = response.data.filter(x => x.id_loai_giay_phep == 2);

          if (giayCndkkdList.length == 0)
            this.logger.msgWaring("Không có dữ liệu về giấy phép, hãy thêm giấy phép cho doanh nghiệp này!");
          else {
            this.isFound = true;
            this.giayCndkkdList = giayCndkkdList;
            this.logger.msgSuccess("Hãy tiếp tục nhập dữ liệu");
          }
        } else {
          this.logger.msgWaring("Không có dữ liệu về giấy phép, hãy thêm giấy phép cho doanh nghiệp này!");
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
