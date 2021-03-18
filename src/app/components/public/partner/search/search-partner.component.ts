import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { CompanyDetailModel, filter } from '../../../../_models/APIModel/domestic-market.model';
import { MatTableFilter } from 'mat-table-filter';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { FilterService } from 'src/app/_services/filter.service';
import { MarketServicePublic } from 'src/app/_services/APIService/market.service public';

@Component({
  selector: 'app-search-business',
  templateUrl: './search-partner.component.html',
  styleUrls: ['../../public_layout.scss'],
})

export class SearchPartnerComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('new_element', { static: false }) ele: ElementRef;
  @ViewChild('TABLE', { static: false }) table: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public displayedColumns: string[] = ['index', 'ten_doanh_nghiep', 'mst', 'ten_loai_hinh_hoat_dong', 'nguoi_dai_dien', 'dia_chi_day_du',
    'ma_nganh_nghe', 'ten_nganh_nghe', 'nganh_nghe_kd_chinh', 'so_giay_phep', 'ngay_cap', 'ngay_het_han', 'noi_cap', 'co_quan_cap', 'ghi_chu',
    'so_dien_thoai', 'email', 'email_sct', 'ngay_bd_kd', 'von_dieu_le', 'quy_mo_tai_san', 'doanh_thu', 'loi_nhuan', 'cong_suat_thiet_ke', 'cong_suat_thiet_ke_sct',
    'so_lao_dong', 'so_lao_dong_sct', 'san_luong', 'san_luong_sct', 'nhu_cau_ban', 'nhu_cau_mua', 'nhu_cau_hop_tac', 'tieu_chuan_san_pham', 'hoat_dong',
  ];

  public filter1: filter[] = [
    { filed_name: 'ten_doanh_nghiep', detail_name: 'Tên doanh nghiệp' },
    { filed_name: 'mst', detail_name: 'Mã số thuế' },
    { filed_name: 'ten_loai_hinh_hoat_dong', detail_name: 'Tên loại hình hoạt động' },
    { filed_name: 'nguoi_dai_dien', detail_name: 'Người đại diện' },
    { filed_name: 'dia_chi_day_du', detail_name: 'Địa chỉ đầy đủ' },
    { filed_name: 'ma_nganh_nghe', detail_name: 'Mã ngành nghề' },
    { filed_name: 'ten_nganh_nghe', detail_name: 'Tên ngành nghề' },
    { filed_name: 'nganh_nghe_kd_chinh', detail_name: 'Ngành nghề kinh doanh chính' },
    { filed_name: 'so_giay_phep', detail_name: 'Số giấy phép' },
    { filed_name: 'ngay_cap', detail_name: 'Ngày cấp giấy phép' },
    { filed_name: 'ngay_het_han', detail_name: 'Ngày hết hạn giấy phép' },
    { filed_name: 'noi_cap', detail_name: 'Nơi cấp giấy phép' },
    { filed_name: 'co_quan_cap', detail_name: 'Cơ quan cấp' },
    { filed_name: 'ghi_chu', detail_name: 'Ghi chú giấy phép' },
    { filed_name: 'so_dien_thoai', detail_name: 'Số điện thoại' },
    { filed_name: 'email', detail_name: 'Email' },
    { filed_name: 'email_sct', detail_name: 'Email (Nguồn: SCT)' },
    { filed_name: 'ngay_bd_kd', detail_name: 'Ngày bắt đầu kinh doanh' },
    { filed_name: 'von_dieu_le', detail_name: 'Vốn điều lệ' },
    { filed_name: 'quy_mo_tai_san', detail_name: 'Quy mô tài sản' },
    { filed_name: 'doanh_thu', detail_name: 'Doanh thu' },
    { filed_name: 'loi_nhuan', detail_name: 'Lơi nhuận' },
    { filed_name: 'cong_suat_thiet_ke', detail_name: 'Công suất thiết kế' },
    { filed_name: 'cong_suat_thiet_ke_sct', detail_name: 'Công suất thiết kế (Nguồn: SCT)' },
    { filed_name: 'so_lao_dong', detail_name: 'Số lao động' },
    { filed_name: 'so_lao_dong_sct', detail_name: 'Số lao động (Nguồn: SCT)' },
    { filed_name: 'san_luong', detail_name: 'Sản lượng' },
    { filed_name: 'san_luong_sct', detail_name: 'Sản lượng (Nguồn: SCT)' },
    { filed_name: 'nhu_cau_ban', detail_name: 'Nhu cầu bán' },
    { filed_name: 'nhu_cau_mua', detail_name: 'Nhu cầu mua' },
    { filed_name: 'nhu_cau_hop_tac', detail_name: 'Nhu cầu hợp tác' },
    { filed_name: 'tieu_chuan_san_pham', detail_name: 'Tiêu chuẩn sản phẩm' },
    { filed_name: 'hoat_dong', detail_name: 'Hoạt động' },
  ];

  constructor(
    public _marketService: MarketServicePublic,
    public router: Router,
    public excelService: ExcelService,
    public filterService: FilterService,
  ) { }

  ngOnInit(): void {
    this.GetAllCompany();
    this.filterEntity = new CompanyDetailModel();
    this.tempFilter = new CompanyDetailModel();
    this.filterType = MatTableFilter.ANYWHERE;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement)
  }

  OpenDetailCompany(mst: string) {
    let url = this.router.serializeUrl(
      this.router.createUrlTree([encodeURI('#') + 'public/partner/search/' + mst]));
    window.open(url.replace('%23', '#'), "_blank");
  }

  temDataSource: MatTableDataSource<CompanyDetailModel> = new MatTableDataSource();
  selected_field: string = 'ten_doanh_nghiep';
  countNumberCondition: any[] = [{ id: 1, filed_name: 'ten_doanh_nghiep', filed_value: '' }];
  count: number = 1;

  isSearch_Advanced: boolean = true;
  filterEntity: CompanyDetailModel;
  tempFilter: CompanyDetailModel;
  filterType: MatTableFilter;

  filter() {
    this.tempFilter = new CompanyDetailModel();
    let temp = [...this.countNumberCondition];
    for (let i = 0; i < temp.length; i++) {
      let element = temp[i];
      this.tempFilter[element.filed_name] = element.filed_value;
    }
    this.filterEntity = Object.assign({}, this.tempFilter);
  }

  cancel() {
    this.tempFilter = new CompanyDetailModel();
    this.filterEntity = new CompanyDetailModel();
    this.dataSource.filter = '';
  }

  add_condition() {
    this.count++;
    let new_ob = { id: this.count, filed_name: 'ten_doanh_nghiep', filed_value: '' }
    this.countNumberCondition.push(new_ob);
  }

  Xoa_dong() {
    if (this.countNumberCondition.length === 1) {
      return;
    } else {
      let cloneArray = [...this.countNumberCondition];
      this.countNumberCondition = cloneArray.filter(item => item.id !== parseInt(this.ele.nativeElement.id));
    }
  }

  dataSource: MatTableDataSource<CompanyDetailModel> = new MatTableDataSource();
  companyList1: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList2: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList3: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList4: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList5: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();

  Convertdate(text: string) {
    let date: string
    date = text.substring(6, 8) + "-" + text.substring(4, 6) + "-" + text.substring(0, 4)
    return date
  }

  GetAllCompany() {
    this._marketService.GetAllCompany().subscribe(
      allrecords => {
        this.companyList1 = allrecords.data[0]
        this.companyList2 = allrecords.data[1]
        this.companyList3 = allrecords.data[2]

        this.companyList4 = this.companyList1.map(a => {
          let temp = this.companyList2.filter(b => b.mst === a.mst)
          let temp1 = temp.map(c => c.ma_nganh_nghe)
          if (temp1 == undefined || temp1 == null) {
            a.ma_nganh_nghe = null
          }
          else {
            a.ma_nganh_nghe = temp1.join('; ')
          }

          let temp2 = temp.map(c => c.ten_nganh_nghe)
          if (temp2 == undefined || temp2 == null) {
            a.ten_nganh_nghe = null
          }
          else {
            a.ten_nganh_nghe = temp2.join('; ')
          }

          let temp3 = temp.map(c => c.nganh_nghe_kd_chinh)
          if (temp3 == undefined || temp3 == null) {
            a.nganh_nghe_kd_chinh = null
          }
          else {
            a.nganh_nghe_kd_chinh = temp3.join('; ')
          }

          return a
        })

        this.companyList5 = this.companyList4.map(d => {
          let temp = this.companyList3.filter(e => e.mst === d.mst)
          let temp1 = temp.map(f => f.so_giay_phep)
          if (temp1[0] == undefined || temp1[0] == null) {
            d.so_giay_phep = null
          }
          else {
            d.so_giay_phep = temp1.join('; ')
          }

          let temp2 = temp.map(f => this.Convertdate(f.ngay_cap))
          if (temp2[0] == undefined || temp2[0] == null) {
            d.ngay_cap = null
          }
          else {
            d.ngay_cap = temp2.join('; ')
          }

          let temp3 = temp.map(f => this.Convertdate(f.ngay_het_han))
          if (temp3[0] == undefined || temp3[0] == null) {
            d.ngay_het_han = null
          }
          else {
            d.ngay_het_han = temp3.join('; ')
          }

          let temp4 = temp.map(f => f.noi_cap)
          if (temp4[0] == undefined || temp4[0] == null) {
            d.noi_cap = null
          }
          else {
            d.noi_cap = temp4.join('; ')
          }

          let temp5 = temp.map(f => f.co_quan_cap)
          if (temp5[0] == undefined || temp5[0] == null) {
            d.co_quan_cap = null
          }
          else {
            d.co_quan_cap = temp5.join('; ')
          }

          let temp6 = temp.map(f => f.ghi_chu)
          if (temp6[0] == undefined || temp6[0] == null) {
            d.ghi_chu == null
          }
          else {
            d.ghi_chu = temp6.join('; ')
          }

          return d
        })

        this.companyList5.forEach(x => {
          if (x.ngay_bd_kd) {
            x.ngay_bd_kd = this.Convertdate(x.ngay_bd_kd)
          }
          else {
            x.ngay_bd_kd = ''
          }
        })

        this.dataSource = new MatTableDataSource<CompanyDetailModel>(this.companyList5);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";

        // // Overrride default filter behaviour of Material Datatable
        // this.dataSource.filterPredicate = this.filterService.createFilter();
      });
  }

  // private DEFAULT_FIELD: string = 'ten_doanh_nghiep';
  // private filterConditions: any[] = [{ id: 1, field_name: this.DEFAULT_FIELD, field_value: '' }];
  // private filterCount: number = 1;

  // private addMoreFilter() {
  //   this.filterCount++;
  //   this.filterConditions.push({ id: this.filterCount, field_name: this.DEFAULT_FIELD, field_value: '' });
  // }

  // private removeFilter() {
  //   // TODO: Check error when remove the same filter immediately. Need to check!
  //   if (this.filterConditions.length != 1) {
  //     let cloneArray = [...this.filterConditions];
  //     this.filterConditions = cloneArray.filter(item => item.id !== parseInt(this.ele.nativeElement.id));
  //     this.filterService.removeCondition(this.ele.nativeElement.getAttribute('data-field-name'));
  //     this.dataSource.filter = this.filterService.getFilters();
  //   }
  // }

  // private changeFilter(event) {
  //   let filterCondition, filterValue;
  //   if (event.source) {
  //     // Change Select 
  //     filterCondition = event.value;
  //     filterValue = event.source._elementRef.nativeElement.closest(".filter-row").querySelector('.filter-value').value;
  //   } else {
  //     // Change input
  //     filterCondition = event.currentTarget.closest(".filter-row").querySelector('.selected-condition').getAttribute('ng-reflect-model');
  //     filterValue = event.target.value;
  //   }
  //   this.filterService.addFilter(filterCondition, filterValue);
  //   this.dataSource.filter = this.filterService.getFilters();
  // }

  // private clearFilter() {
  //   this.filterConditions = [{ id: 1, field_name: this.DEFAULT_FIELD, field_value: '' }];
  //   this.filterService.setFilterVals();
  //   this.dataSource.filter = this.filterService.getFilters();
  // }

}