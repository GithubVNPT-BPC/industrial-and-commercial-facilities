import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { CompanyDetailModel, CareerModel, ProductModel, DistrictModel } from '../../../../_models/APIModel/domestic-market.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatTableFilter } from 'mat-table-filter';

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
  dataSource: MatTableDataSource<CompanyDetailModel> = new MatTableDataSource();
  isSearch_Advanced: boolean = true;
  control = new FormControl();
  filterEntity: CompanyDetailModel;
  tempFilter: CompanyDetailModel;
  filterType: MatTableFilter;

  careerList: Array<CareerModel> = new Array<CareerModel>();
  companyList: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  productList: Array<ProductModel> = new Array<ProductModel>();
  districtList: Array<DistrictModel> = new Array<DistrictModel>();

  filteredCareerList: Observable<CareerModel[]>;
  temDataSource: MatTableDataSource<CompanyDetailModel> = new MatTableDataSource();

  loading = false;
  categories = [null];//['Tất cả', 'Hạt điều', 'Hạt tiêu', 'Hạt cà phê', 'Cao su'];
  addresses = [null];//['Tất cả', 'Đồng Xoài', 'Bình Long', 'Bù Gia Mập', 'Bù Đốp', 'Bù Đăng', 'Phú Riềng', 'Hớn Quản', 'Chơn Thành','Đồng Phú', 'Lộc Ninh', 'Phước Long'];

  applyFilter(filterValue) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filterPredicate =
    //   (data: CompanyDetailModel, filter: string) => ;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(filterValue, this.dataSource)
  }

  handle_btn_search_adv() {
    this.isSearch_Advanced = !this.isSearch_Advanced;
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public displayedColumns: string[] = ['index', 'ten_doanh_nghiep', 'mst', 'mst_cha', 'so_dien_thoai', 'nguoi_dai_dien', 'ten_loai_hinh_hoat_dong', 'hoat_dong',
    'dia_chi_day_du'];

  public displayedFields: string[] = ['ten_doanh_nghiep', 'mst', 'mst_cha', 'so_dien_thoai', 'nguoi_dai_dien', 'ten_loai_hinh_hoat_dong', 'hoat_dong',
    'dia_chi_day_du'];

  selectedAdress;
  selected_field: string = 'ten_doanh_nghiep';
  filterConditions: any[] = [{ id: 1, field_name: 'ten_doanh_nghiep', field_value: '' }];
  filterCount: number = 1;
  arrayDate = ['ngay_cap_gcndkkd', 'ngay_bat_dau_kd'];

  public displayFields = [
    {alias: 'ten_doanh_nghiep', name: 'Tên Doanh Nghiệp'},
    {alias: 'ten_nganh_nghe', name: 'Tên Ngành Nghề'},
    {alias: 'mst', name: 'Mã số thuế'},
    {alias: 'dia_chi_day_du', name: 'Địa chỉ'},
    {alias: 'nganh_nghe_kd', name: 'Ngành nghề kinh doanh'},
    {alias: 'nguoi_dai_dien', name: 'Người đại diện'},
    {alias: 'dien_thoai', name: 'Điện thoại'},
    {alias: 'so_giay_cndkkd', name: 'Số giấy CNDKKD'},
    {alias: 'ngay_cap_gcndkkd', name: 'Ngày cấp GCNDKKD'},
    {alias: 'loai_hinh_doanh_nghiep', name: 'Loại hình doanh nghiệp'},
    {alias: 'von_kinh_doanh', name: 'Vốn kinh doanh'},
    {alias: 'email', name: 'Email'},
    {alias: 'so_lao_dong', name: 'Số lao động'},
    {alias: 'cong_suat_thiet_ke', name: 'Công suất'},
    {alias: 'san_luong', name: 'Sản lượng'},
    {alias: 'tieu_chuan_san_pham', name: 'Tiêu chuẩn sản phẩm	'},
    {alias: 'doanh_thu', name: 'Doanh thu'},
    {alias: 'quy_mo_tai_san', name: 'Quy mô tài sản'},
    {alias: 'loi_nhuan', name: 'Lợi nhuận'},
    {alias: 'nhu_cau_ban', name: 'Nhu cầu bán'},
    {alias: 'nhu_cau_mua', name: 'Nhu cầu mua'},
    {alias: 'email_sct', name: 'Email SCT'},
    {alias: 'so_lao_dong_sct', name: 'Số lao động SCT'},
    {alias: 'nhu_cau_hop_tac', name: 'Nhu cầu hợp tác'},
    {alias: 'cong_suat_thiet_ke_sct', name: 'Công suất SCT	'},
    {alias: 'san_luong_sct', name: 'Sản lượng SCT	'},
  ]; 

  //Viewchild
  @ViewChild('new_element', { static: false }) ele: ElementRef;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  constructor(
    public _marketService: MarketService,
    public router: Router,
    public excelService: ExcelService,
    public filterService: FilterService,
  ) {}

  ngOnInit(): void {
    this.filterEntity = new CompanyDetailModel();
    this.tempFilter = new CompanyDetailModel();
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
        this.dataSource = new MatTableDataSource<CompanyDetailModel>(allrecords.data[0]);
        console.log(this.dataSource)
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

  private addMoreFilter() {
    this.filterCount++;
    this.filterConditions.push({ id: this.filterCount, field_name: 'ten_doanh_nghiep', field_value: '' });
  }

  private removeFilter() {
    // TODO: Check error when remove the same filter immediately.
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
    // let value = event.target ? event.target.value : event.value;
    this.filterService.addFilter(filterCondition, filterValue);
    this.dataSource.filter = this.filterService.getFilters();
  }

  private clearFilter() { 
    this.filterConditions = [{ id: 1, field_name: 'ten_doanh_nghiep', field_value: '' }];
    this.filterService.setFilterVals({});
    this.dataSource.filter = this.filterService.getFilters();
  }

  formatDate(value) {
    let dd = value.slice(0, 2);
    let MM = value.slice(2, 4);
    let yyyy = value.slice(4, 8);
    let date = yyyy + '-' + MM + '-' + dd + 'T' + '00' + ':' + '00' + ':' + '00';
    return date
  }
}