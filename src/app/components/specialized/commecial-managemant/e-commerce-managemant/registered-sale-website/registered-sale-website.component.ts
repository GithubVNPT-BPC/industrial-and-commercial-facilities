import { Component, OnInit, ViewChild, ElementRef, Injector } from '@angular/core';
import { MatOption, MatSelect, MatTableDataSource } from '@angular/material';
import { SaleWebsiteFilterModel, regisWebsiteModel } from 'src/app/_models/APIModel/e-commerce.model';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { FormControl } from '@angular/forms';
import { BaseComponent } from '../../../base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
  selector: 'registered-sale-website',
  templateUrl: './registered-sale-website.component.html',
  styleUrls: ['../../../special_layout.scss'],
})
export class RegisteredSaleWebsiteComponent extends BaseComponent {
  displayedColumns: string[] =
    ['index', 'ten_tc_cn', 'mst', 'dia_chi', 'nguoi_dai_dien',
      'dien_thoai', 'ten_mien', 'loai_hang_hoa', 'email', 'so_gian_hang', 'ghi_chu'];
  dataSource: MatTableDataSource<regisWebsiteModel>;
  filteredDataSource: MatTableDataSource<regisWebsiteModel> = new MatTableDataSource<regisWebsiteModel>();
  filterModel: SaleWebsiteFilterModel = { id_quan_huyen: [] };
  constructor(
    private inject: Injector,
    public excelService: ExcelService,
    public commerceService: CommerceManagementService,
    public _login: LoginService) {
    super(inject)
  }

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.GetDanhSachWebsiteTMDT();

    if (this._login.userValue.user_role_id == 3  || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  @ViewChild('TABLE', { static: false }) table: ElementRef;

  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  GetDanhSachWebsiteTMDT() {
    this.commerceService.LayDanhSachDangKiWeb().subscribe(response => {
      this.filteredDataSource = new MatTableDataSource<regisWebsiteModel>(response.data);
      this.dataSource = new MatTableDataSource<regisWebsiteModel>(response.data);
    })
  }

  applyFilter() {
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

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
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

  @ViewChild('dSelect', { static: false }) dSelect: MatSelect;
  allSelected = false;
  toggleAllSelection() {
    this.allSelected = !this.allSelected;  // to control select-unselect

    if (this.allSelected) {
      this.dSelect.options.forEach((item: MatOption) => item.select());
    } else {
      this.dSelect.options.forEach((item: MatOption) => item.deselect());
    }
    this.dSelect.close();
  }

  getFormParams() {
    return {
      mst_quyet_dinh: new FormControl(),
      to_chu_ca_nhan: new FormControl(),
      dia_diem: new FormControl(),
      nguoi_dai_dien: new FormControl(),
      dien_thoai: new FormControl(),
      ten_mien: new FormControl(),
      san_pham_tren_website: new FormControl(),
      email: new FormControl(),
      so_gian_hang: new FormControl(),
      ghi_chu: new FormControl(),
      id_quan_huyen: new FormControl(),
    }
  }

  getLinkDefault() {
    //Constant
    this.LINK_DEFAULT = "/specialized/commecial-management/e-commerce/register-website";
    this.TITLE_DEFAULT = "Thương mại điện tử - Quản lý đăng ký website cung cấp dịch vụ TMĐT";
    this.TEXT_DEFAULT = "Thương mại điện tử - Quản lý đăng ký website cung cấp dịch vụ TMĐT";
  }

  prepareData(data) {
    return [data];
  }

  callService(data) {
    this.commerceService.CapNhatDanhSachDangKiWeb(data).subscribe(res => {
      this.successNotify(res);
    })
  }
}
