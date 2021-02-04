import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { CompanyDetailModel, CareerModel, ProductModel, DistrictModel } from '../../../../_models/APIModel/domestic-market.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatTableFilter } from 'mat-table-filter';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

// Services
import { MarketService } from 'src/app/_services/APIService/market.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { FilterService } from 'src/app/_services/filter.service';
import { normalizeValue } from "src/app/_services/stringUtils.service";


@Component({
  selector: 'app-search-business',
  templateUrl: './search-business.component.html',
  styleUrls: ['../../manager_layout.scss'],
})

export class SearchBusinessComponent implements OnInit {
  public dataSource: MatTableDataSource<CompanyDetailModel> = new MatTableDataSource();
  public selection = new SelectionModel<CompanyDetailModel>(true, []);
  
  isSearch_Advanced: boolean = true;
  control = new FormControl();
  filterType: MatTableFilter;

  careerList: Array<CareerModel> = new Array<CareerModel>();
  productList: Array<ProductModel> = new Array<ProductModel>();
  districtList: Array<DistrictModel> = new Array<DistrictModel>();

  companyList1: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList2: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList3: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();

  filteredCareerList: Observable<CareerModel[]>;
  temDataSource: MatTableDataSource<CompanyDetailModel> = new MatTableDataSource();

  loading = false;
  categories = [null];//['Tất cả', 'Hạt điều', 'Hạt tiêu', 'Hạt cà phê', 'Cao su'];
  addresses = [null];//['Tất cả', 'Đồng Xoài', 'Bình Long', 'Bù Gia Mập', 'Bù Đốp', 'Bù Đăng', 'Phú Riềng', 'Hớn Quản', 'Chơn Thành','Đồng Phú', 'Lộc Ninh', 'Phước Long'];
  selectedAdress;
  arrayDate = ['ngay_cap_gcndkkd', 'ngay_bat_dau_kd'];

  public displayedColumns: string[] = ['select', 'index', 'ten_doanh_nghiep', 'mst', 'mst_cha', 'so_dien_thoai', 
  'nguoi_dai_dien', 'ma_nganh_nghe', 'ten_nganh_nghe', 'nganh_nghe_kd_chinh', 'ten_loai_hinh_hoat_dong', 'hoat_dong', 'dia_chi_day_du'];

  public displayFields = {
    ten_doanh_nghiep: 'Tên Doanh Nghiệp',
    mst: 'Mã số thuế',
    mst_cha: 'Mã số thuế cha',
    so_dien_thoai: 'Số điện thoại',
    nguoi_dai_dien: 'Người đại diện',
    ten_loai_hinh_hoat_dong: 'Loại hình hoạt động',
    hoat_dong: 'Hoạt động',
  }
  private DEFAULT_FIELD: string = 'ten_doanh_nghiep';
  private filterConditions: any[] = [{ id: 1, field_name: this.DEFAULT_FIELD, field_value: '' }];
  private filterCount: number = 1;

  //Viewchild
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('new_element', { static: false }) ele: ElementRef;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  constructor(
    public _marketService: MarketService,
    public router: Router,
    public excelService: ExcelService,
    public filterService: FilterService,
    public confirmationDialogService: ConfirmationDialogService,
  ) { }

  ngOnInit(): void {
    this.filterType = MatTableFilter.ANYWHERE;
    this.GetAllCompany();
    this.GetAllNganhNghe();
    this.GetAllDistrict();
  }

  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement)
  }

  OpenDetailCompany(mst: string) {
    let url = this.router.serializeUrl(
      this.router.createUrlTree([encodeURI('#') + 'manager/business/search/' + mst]));
    window.open(url.replace('%23', '#'), "_blank");
  }

  GetAllCompany() {
    this._marketService.GetAllCompany().subscribe(
      allrecords => {
        this.companyList1 = allrecords.data[0]
        this.companyList2 = allrecords.data[1]
        this.companyList3 = this.companyList1.map(x => {
          let temp = this.companyList2.find(y => y.mst === x.mst)
          if (temp) {
            x.ma_nganh_nghe = temp.ma_nganh_nghe
            x.ten_nganh_nghe = temp.ten_nganh_nghe
            x.nganh_nghe_kd_chinh = temp.nganh_nghe_kd_chinh
          } 
          return x
        })

        this.dataSource = new MatTableDataSource<CompanyDetailModel>(this.companyList1);
        this.temDataSource = allrecords.data;
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";

        // Overrride default filter behaviour of Material Datatable
        this.dataSource.filterPredicate = this.filterService.createFilter();
        
      });
  }

  GetAllDistrict() {
    this._marketService.GetAllDistrict().subscribe(
      allrecords => {
        this.districtList = allrecords.data as DistrictModel[];
        this.districtList.forEach(element => this.addresses.push(element.ten_quan_huyen));
      });
  }

  GetAllNganhNghe() {
    this._marketService.GetAllCareer().subscribe(
      allrecords => {
        this.careerList = allrecords.data as CareerModel[];
        //this.careerList.forEach(element => element.ma_nganh_nghe.length == 5 ? this.categorys.push(element.ten_kem_ma) : 0)
        this.careerList.forEach(element => element.ma_nganh_nghe.length > 3 ? this.categories.push(element.ten_kem_ma) : 0)

      });

    this.filteredCareerList = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  public _filter(value: string): CareerModel[] {
    const filterValue = normalizeValue(value);
    return this.careerList.filter(career => normalizeValue(career.ten_kem_ma).includes(filterValue));
  }

  public create() {

  }

  private remove() {
    let selectedOptions = this.selection.selected;
  }

  public openRemoveDialog() {
    this.confirmationDialogService.confirm('Xác nhận', 'Bạn chắc chắn muốn xóa?', 'Đồng ý','Đóng')
    .then(confirm => {
      if (confirm) {
        this.remove();
      }
    })
    .catch((err) => console.log('Hủy không thao tác: \n' + err));
  }

  private addMoreFilter() {
    this.filterCount++;
    this.filterConditions.push({ id: this.filterCount, field_name: this.DEFAULT_FIELD, field_value: '' });
  }

  private removeFilter() {
    // TODO: Check error when remove the same filter immediately. Need to check!
    if (this.filterConditions.length != 1) {
      let cloneArray = [...this.filterConditions];
      this.filterConditions = cloneArray.filter(item => item.id !== parseInt(this.ele.nativeElement.id));
      this.filterService.removeCondition(this.ele.nativeElement.getAttribute('data-field-name'));
      this.dataSource.filter = this.filterService.getFilters();
    }
  }

  private changeFilter(event) {
    let filterCondition, filterValue;
    if (event.source) {
      // Change Select 
      filterCondition = event.value;
      filterValue = event.source._elementRef.nativeElement.closest(".filter-row").querySelector('.filter-value').value;
    } else {
      // Change input
      filterCondition = event.currentTarget.closest(".filter-row").querySelector('.selected-condition').getAttribute('ng-reflect-model');
      filterValue = event.target.value;
    }
    this.filterService.addFilter(filterCondition, filterValue);
    this.dataSource.filter = this.filterService.getFilters();
  }

  private clearFilter() {
    this.filterConditions = [{ id: 1, field_name: this.DEFAULT_FIELD, field_value: '' }];
    this.filterService.setFilterVals();
    this.dataSource.filter = this.filterService.getFilters();
  }

  /* Events for toggle checkboxes */
  //Event selected all
  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  //Event check
  public masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
  }
  //Event check item
  public checkboxLabel(row?: CompanyDetailModel): string {
      if (!row) {
          return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  formatDate(value) {
    let dd = value.slice(0, 2);
    let MM = value.slice(2, 4);
    let yyyy = value.slice(4, 8);
    let date = yyyy + '-' + MM + '-' + dd + 'T' + '00' + ':' + '00' + ':' + '00';
    return date
  }
}