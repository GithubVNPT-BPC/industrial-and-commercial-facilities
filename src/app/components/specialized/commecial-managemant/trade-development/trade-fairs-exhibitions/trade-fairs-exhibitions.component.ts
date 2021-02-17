import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatOption, MatSelect, MatTableDataSource } from '@angular/material';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { District } from 'src/app/_models/district.model';
import { TFEModel } from 'src/app/_models/APIModel/trade-development.model';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';

@Component({
  selector: 'app-trade-fairs-exhibitions',
  templateUrl: './trade-fairs-exhibitions.component.html',
  styleUrls: ['../../../special_layout.scss'],
})

export class TradeFairsExhibitionsComponent implements OnInit {
  displayedColumns: string[] = [
    'index', 'ten_doanh_nghiep', 'dia_chi_doanh_nghiep', 'mst', 'ten_hoi_cho', 'thoi_gian_bat_dau', 'thoi_gian_ket_thuc', 
    'dia_diem_to_chuc', 'so_luong_gian_hang', 'san_pham', 'so_van_ban', 
    'co_quan_ban_hanh', 'ngay_thang_nam_van_ban', 'id_trang_thai',];
  formData = this.formBuilder.group({
    ten_doanh_nghiep: '',
    dia_chi_doanh_nghiep: '',
    mst: '',
    ten_hoi_cho: '',
    thoi_gian_bat_dau: '',
    thoi_gian_ket_thuc: '',
    dia_diem_to_chuc: '',
    so_luong_gian_hang: '',
    san_pham: '',
    so_van_ban: '',
    co_quan_ban_hanh: '',
    ngay_thang_nam_van_ban: '',
  });
  dataSource: MatTableDataSource<TFEModel> = new MatTableDataSource<TFEModel>();
  filteredDataSource: MatTableDataSource<TFEModel> = new MatTableDataSource<TFEModel>();

  years: number[] = [];
  districts: District[] = [
    { id: 1, ten_quan_huyen: 'Thị xã Phước Long' },
    { id: 2, ten_quan_huyen: 'Thành phố Đồng Xoài' },
    { id: 3, ten_quan_huyen: 'Thị xã Bình Long' },
    { id: 4, ten_quan_huyen: 'Huyện Bù Gia Mập' },
    { id: 5, ten_quan_huyen: 'Huyện Lộc Ninh' },
    { id: 6, ten_quan_huyen: 'Huyện Bù Đốp' },
    { id: 7, ten_quan_huyen: 'Huyện Hớn Quản' },
    { id: 8, ten_quan_huyen: 'Huyện Đồng Phú' },
    { id: 9, ten_quan_huyen: 'Huyện Bù Đăng' },
    { id: 10, ten_quan_huyen: 'Huyện Chơn Thành' },
    { id: 11, ten_quan_huyen: 'Huyện Phú Riềng' }
  ];
  sanLuongBanRa: number;
  soLuongDoanhNghiep: number;
  isChecked: boolean;
  public errorMessage: any;
  private view = 'list';

  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  ExportTOExcel(filename: string, sheetname: string) {
      this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  constructor(
    public sctService: SCTService,
    private formBuilder: FormBuilder,
    public commerceManagementService : CommerceManagementService,
    public excelService: ExcelService, ) {
  }

  ngOnInit() {
    this.years = this.getYears();
    this.autoOpen();
    this.getTFEList();
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  applyFilterKeyInput(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // applyDistrictFilter(event) {
  //   let filteredData = [];

  //   event.value.forEach(element => {
  //     this.dataSource.data.filter(x => x.Id_quan_huyen == element).forEach(x => filteredData.push(x));
  //   });

  //   if (!filteredData.length) {
  //     if (event.value.length)
  //       this.filteredDataSource.data = [];
  //     else
  //       this.filteredDataSource.data = this.dataSource.data;
  //   }
  //   else {
  //     this.filteredDataSource.data = filteredData;
  //   }
  // }

  getTFEList(): void {
    this.commerceManagementService.getExpoData('202101').subscribe(
      allrecords => {
        if (allrecords.data && allrecords.data.length > 0) {
          this.dataSource = new MatTableDataSource<TFEModel>(allrecords.data);
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.itemsPerPageLabel = "Số hàng";
          this.paginator._intl.firstPageLabel = "Trang Đầu";
          this.paginator._intl.lastPageLabel = "Trang Cuối";
          this.paginator._intl.previousPageLabel = "Trang Trước";
          this.paginator._intl.nextPageLabel = "Trang Tiếp";
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  getYears() {
    return Array(5).fill(1).map((element, index) => new Date().getFullYear() - index);
  }

  countBusiness(): number {
    return [...new Set(this.filteredDataSource.data.map(x => x.mst))].length;
  }

  // countHappenedFair(): number {
  //   return this.filteredDataSource.data.filter(x => new Date(this.formatMMDDYYYY(x.thoi_gian_bat_dau.split(' ')[x.thoi_gian_bat_dau.split(' ').length - 1])) < new Date()).length;
  // }

  formatMMDDYYYY(date: string): string {
    var datearray = date.split("/");
    return datearray[1] + '/' + datearray[0] + '/' + datearray[2];
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

  private switchView() {
    this.view = this.view == 'list' ? 'form': 'list';
  }

  onSubmit(): void {
    // Process checkout data here
    console.warn('Your order has been submitted', this.formData.value);
    this.formData.reset();
  }
}
