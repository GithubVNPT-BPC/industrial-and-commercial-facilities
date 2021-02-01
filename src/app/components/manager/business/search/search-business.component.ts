import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { MarketService } from '../../../../_services/APIService/market.service';
import { CompanyDetailModel, CareerModel, ProductModel, DistrictModel } from '../../../../_models/APIModel/domestic-market.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatTableFilter } from 'mat-table-filter';
import { Company_mock } from '../../../../_models/companyDetailModel_mock';

// Services
import { ExcelService } from 'src/app/_services/excelUtil.service';

@Component({
  selector: 'app-search-business',
  templateUrl: './search-business.component.html',
  styleUrls: ['../../manager_layout.scss'],
})

export class SearchBusinessComponent implements OnInit {

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

  loading = false;
  categories = [null];//['Tất cả', 'Hạt điều', 'Hạt tiêu', 'Hạt cà phê', 'Cao su'];

  selectedAdress;
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

  dataSource: MatTableDataSource<CompanyDetailModel> = new MatTableDataSource();

  public displayedColumns: string[] = ['index', 'ten_doanh_nghiep', 'ten_nganh_nghe', 'mst', 'dia_chi_day_du', 'nganh_nghe_kd',
    'nguoi_dai_dien', 'dien_thoai', 'so_giay_cndkkd', 'ngay_cap_gcndkkd', 'loai_hinh_doanh_nghiep', 'von_kinh_doanh', 'ngay_bat_dau_kd', 'email', 'so_lao_dong',
    'cong_suat_thiet_ke', 'san_luong', 'tieu_chuan_san_pham', 'doanh_thu', 'quy_mo_tai_san', 'loi_nhuan', 'nhu_cau_ban', 'nhu_cau_mua', 'nhu_cau_hop_tac',
    'email_sct', 'so_lao_dong_sct', 'cong_suat_thiet_ke_sct', 'san_luong_sct', 'chi_tiet_doanh_nghiep'];

  public displayedFields: string[] = ['ten_doanh_nghiep', 'ten_nganh_nghe', 'mst', 'dia_chi_day_du', 'nganh_nghe_kd',
    'nguoi_dai_dien', 'dien_thoai', 'so_giay_cndkkd', 'ngay_cap_gcndkkd', 'loai_hinh_doanh_nghiep', 'von_kinh_doanh', 'ngay_bat_dau_kd',
    'email', 'so_lao_dong', 'cong_suat_thiet_ke', 'san_luong', 'tieu_chuan_san_pham', 'doanh_thu', 'quy_mo_tai_san', 'loi_nhuan', 'nhu_cau_ban',
    'nhu_cau_mua', 'nhu_cau_hop_tac', 'email_sct', 'so_lao_dong_sct', 'cong_suat_thiet_ke_sct', 'san_luong_sct', 'chi_tiet_doanh_nghiep'];

  selected_field: string = 'ten_doanh_nghiep';
  countNumberCondition: any[] = [{ id: 1, filed_name: 'ten_doanh_nghiep', filed_value: '' }];
  count: number = 1;
  temDataSource: MatTableDataSource<CompanyDetailModel> = new MatTableDataSource();
  add_condition() {
    this.count++;
    let new_ob = { id: this.count, filed_name: 'ten_doanh_nghiep', filed_value: '' }
    this.countNumberCondition.push(new_ob);
    // console.log(this.countNumberCondition)
  }

  Xoa_dong() {
    if (this.countNumberCondition.length === 1) {
      return;
    } else {
      let cloneArray = [...this.countNumberCondition];
      this.countNumberCondition = cloneArray.filter(item => item.id !== parseInt(this.ele.nativeElement.id));
      // console.log(this.ele.nativeElement.id, this.countNumberCondition, this.ele);

    }

  }

  @ViewChild('new_element', { static: false }) ele: ElementRef;

  @ViewChild('TABLE', { static: false }) table: ElementRef;

  constructor(
    public _marketService: MarketService,
    public router: Router,
    public excelService: ExcelService
    ) {
  }

  ngOnInit(): void {
    this.filterEntity = new CompanyDetailModel();
    this.tempFilter = new CompanyDetailModel();
    this.filterType = MatTableFilter.ANYWHERE;
    this.GetAllCompany();
    this.GetAllNganhNghe();
    this.GetAllDistrict();
  }

  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  OpenDetailCompany(mst: string) {
    this.router.navigate(['manager/business/search/' + mst]);
  }

  GetAllCompany() {
    this._marketService.GetAllCompany().subscribe(
      allrecords => {
        // console.log(allrecords.data);
        this.dataSource = new MatTableDataSource<CompanyDetailModel>(allrecords.data);
        this.temDataSource = allrecords.data;
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
      });
  }

  GetAllDistrict() {
    console.log("+ Function: GetAllDistrict");
    this._marketService.GetAllDistrict().subscribe(
      allrecords => {
        //console.log(allrecords);
        this.districtList = allrecords.data as DistrictModel[];
        this.districtList.forEach(element => this.addresses.push(element.ten_quan_huyen));
      });
  }
  GetAllNganhNghe() {
    console.log("+ Function: GetAllNganhNghe");
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
    const filterValue = this._normalizeValue(value);
    return this.careerList.filter(career => this._normalizeValue(career.ten_kem_ma).includes(filterValue));
  }

  public _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  arrayDate = ['ngay_cap_gcndkkd', 'ngay_bat_dau_kd'];
  filter() {
    // this.filterEntity.ten_doanh_nghiep = this.selectedName? this.selectedName : null;
    // this.filterEntity.dia_chi_day_du = this.selectedAddress == 'Tất cả'? null : this.selectedAddress;
    // this.filterEntity.nganh_nghe_kd = this.selectedCategory == 'Tất cả'? null : this.selectedCategory;
    // this.tempFilter.ten_nganh_nghe = (document.getElementById('category_select') as HTMLInputElement).value.toString();
    // this.filterEntity = Object.assign({}, this.tempFilter);

    this.tempFilter = new CompanyDetailModel();
    let tem = [...this.countNumberCondition];
    for (let i = 0; i < tem.length; i++) {
      let element = tem[i];
      if (element.filed_name === 'ngay_cap_gcndkkd' || element.filed_name === 'ngay_bat_dau_kd') {
        this.tempFilter[element.filed_name] = this.formatDate(element.filed_value);
      } else {
        this.tempFilter[element.filed_name] = element.filed_value;
      }
    }
    console.log(this.tempFilter)
    this.filterEntity = Object.assign({}, this.tempFilter);
  }
  change() {

  }
  cancel() {
    this.tempFilter = new CompanyDetailModel();
    this.filterEntity = new CompanyDetailModel();
    console.log(this.filterEntity)
    this.dataSource.filter = '';
  }

  formatDate(value) {
    let dd = value.slice(0, 2);
    let MM = value.slice(2, 4);
    let yyyy = value.slice(4, 8);
    let date = yyyy + '-' + MM + '-' + dd + 'T' + '00' + ':' + '00' + ':' + '00';
    console.log(dd, MM, yyyy, date)
    return date
  }

  exportTableToExcel(tableID, filename = '') {
    let downloadLink;
    let dataType = 'application/vnd.ms-excel';
    let tableSelect = document.getElementById(tableID);
    let tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

    // Specify file name
    filename = filename ? filename + '.xls' : 'excel_data.xls';

    // Create download link element
    downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
      let blob = new Blob(['\ufeff', tableHTML], {
        type: dataType
      });
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      // Create a link to the file
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

      // Setting the file name
      downloadLink.download = filename;

      //triggering the function
      downloadLink.click();
    }
  }
}