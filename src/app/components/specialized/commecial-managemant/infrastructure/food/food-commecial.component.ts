//Import Library
import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

//Import Model
import { FoodCommerceModel } from 'src/app/_models/APIModel/commecial-management.model';

import { BaseComponent } from 'src/app/components/specialized/specialized-base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';

@Component({
  selector: 'app-food-commecial',
  templateUrl: './food-commecial.component.html',
  styleUrls: ['../../../special_layout.scss'],
})

export class FoodManagementComponent extends BaseComponent {  
  dataSource: MatTableDataSource<FoodCommerceModel> = new MatTableDataSource<FoodCommerceModel>();
  filteredDataSource: MatTableDataSource<FoodCommerceModel> = new MatTableDataSource<FoodCommerceModel>();

  isChecked: boolean;
  public tongDoanhNghiep: number;
  //
  filterModel = {
  };

  displayedFields = {
    ten_cua_hang: "Tên cửa hàng",
    dia_chi_day_du: "Địa chỉ",
    mst: "Mã số thuế",
    ten_san_pham: "Sản phẩm kinh doanh",
    so_giay_phep: "Số chứng nhận ĐKKD",
    ngay_cap: "Ngày cấp",
    noi_cap: "Nơi cấp",
    nguoi_dai_dien: "Tên",
    so_dien_thoai: "Điện thoại",

  }

  //Angular FUnction --------------------------------------------------------------------
  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
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

  getFoodCommerceData() {
    this.commerceManagementService.getFoodCommerceData().subscribe(
      allrecords => {
        if (allrecords.data && allrecords.data.length > 0) {
          this.dataSource = new MatTableDataSource<FoodCommerceModel>(allrecords.data);
          this.filteredDataSource.data = [...this.dataSource.data];
          this._prepareData(this.dataSource.data);
          this.paginatorAgain();
        }
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
      nguoi_dai_dien: new FormControl(),
      ten_san_pham: new FormControl(),
      so_giay_phep: new FormControl(),
      ngay_cap: new FormControl(),
      noi_cap: new FormControl(),
      id_phuong_xa: new FormControl(),
    }
  }

  callService(data) {
    this.commerceManagementService.postFoodCommerce([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  private _prepareData(data: FoodCommerceModel[]){
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

}
